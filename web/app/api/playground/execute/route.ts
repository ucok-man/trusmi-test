import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Simple in-memory rate limiter untuk demo
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (Mencegah DDoS Koneksi)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip) || { count: 0, resetAt: now + 60000 };
    
    if (now > rateLimit.resetAt) {
      rateLimit.count = 1;
      rateLimit.resetAt = now + 60000;
    } else {
      rateLimit.count++;
      if (rateLimit.count > 30) { // Max 30 queries per minute per IP
        return NextResponse.json({ error: 'Terlalu banyak request. Silakan tunggu 1 menit.' }, { status: 429 });
      }
    }
    rateLimitMap.set(ip, rateLimit);

    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query tidak valid.' }, { status: 400 });
    }

    // Hapus semua komentar SQL agar tidak dianggap sebagai statement terpisah
    const noSingleLineComments = query.replace(/--.*$/gm, '');
    const cleanQuery = noSingleLineComments.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split queries by semicolon to execute them sequentially
    const statements = cleanQuery.split(';').filter((s: string) => s.trim().length > 0);
    
    if (statements.length === 0) {
      return NextResponse.json({ success: true, data: [], rowCount: 0, fields: [] });
    }
    
    let lastData: any[] = [];
    let fields: string[] = [];

    // Gunakan Interactive Transaction Prisma dengan admin pool, namun DOWNGRADE rolenya
    await db.$transaction(async (tx) => {
      // SET LOCAL ROLE hanya berlaku selama transaksi ini berlangsung! Sangat aman!
      await tx.$executeRawUnsafe(`SET LOCAL ROLE playground_user;`);
      // SET ROLE tidak otomatis mengubah search_path, jadi kita harus memindahkannya manual ke schema terisolasi
      await tx.$executeRawUnsafe(`SET LOCAL search_path TO sandbox_db;`);
      await tx.$executeRawUnsafe("SET LOCAL statement_timeout = '3000';");
      
      for (const stmt of statements) {
        const isSelect = /^\s*(SELECT|WITH|SHOW|DESCRIBE)\b/i.test(stmt);
        if (isSelect) {
          // Proteksi OOM dengan membatasi result set
          const safeQuery = `SELECT * FROM (\n${stmt}\n) AS user_query LIMIT 500`;
          lastData = await tx.$queryRawUnsafe(safeQuery) as any[];
          if (lastData.length > 0) {
            fields = Object.keys(lastData[0]);
          }
        } else {
          await tx.$executeRawUnsafe(stmt);
          lastData = [];
          fields = [];
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: lastData,
      rowCount: lastData.length,
      fields: fields
    });
    
  } catch (error: any) {
    // Mengembalikan pesan error asli dari PostgreSQL agar reviewer bisa debug
    return NextResponse.json({ 
      error: error.message || 'Terjadi kesalahan eksekusi pada database.'
    }, { status: 400 });
  }
}
