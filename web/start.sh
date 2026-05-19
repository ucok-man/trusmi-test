#!/bin/sh
set -e

echo "Menyiapkan Database Production..."
# Push schema tanpa interaksi (otomatis membuat tabel jika belum ada)
bunx prisma db push --accept-data-loss

echo "Menjalankan Seeding & Setup Role..."
# Menjalankan script seed.ts langsung menggunakan bun (tanpa package.json)
bun prisma/seed.ts

echo "Memulai Server Aplikasi..."
# Jalankan Next.js server hasil build standalone
exec bun run server.js
