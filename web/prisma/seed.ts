import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('Start seeding...');

  // Kita gunakan upsert agar aman dijalankan berkali-kali tanpa error duplikat (id)
  const data = [
    { id: 1, tasklist: 'Tasklist 1', kpi: 'Sales', karyawan: 'Budi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-09') },
    { id: 2, tasklist: 'Tasklist 2', kpi: 'Sales', karyawan: 'Budi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-08') },
    { id: 3, tasklist: 'Tasklist 3', kpi: 'Report', karyawan: 'Budi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-07') },
    { id: 4, tasklist: 'Tasklist 4', kpi: 'Report', karyawan: 'Budi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-12') },
    { id: 5, tasklist: 'Tasklist 5', kpi: 'Sales', karyawan: 'Adi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-09') },
    { id: 6, tasklist: 'Tasklist 6', kpi: 'Sales', karyawan: 'Adi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-12') },
    { id: 7, tasklist: 'Tasklist 7', kpi: 'Report', karyawan: 'Adi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-07') },
    { id: 8, tasklist: 'Tasklist 8', kpi: 'Report', karyawan: 'Adi', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-07') },
    { id: 9, tasklist: 'Tasklist 9', kpi: 'Sales', karyawan: 'Rara', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-12') },
    { id: 10, tasklist: 'Tasklist 10', kpi: 'Sales', karyawan: 'Rara', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-09') },
    { id: 11, tasklist: 'Tasklist 11', kpi: 'Report', karyawan: 'Rara', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-12') },
    { id: 12, tasklist: 'Tasklist 12', kpi: 'Report', karyawan: 'Doni', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-09') },
    { id: 13, tasklist: 'Tasklist 13', kpi: 'Sales', karyawan: 'Doni', deadline: new Date('2022-01-10'), aktual: new Date('2022-01-12') }
  ];

  for (const item of data) {
    const res = await prisma.table_kpi_marketing.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
    console.log(`Inserted id: ${res.id}`);
  }
  
  console.log('Setting up Playground Database Environment...');
  try {
    // 1. Create Role
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'playground_user') THEN
          CREATE ROLE playground_user WITH LOGIN PASSWORD 'playground_pass';
        END IF;
      END $$;
    `);

    // 2. Create isolated schema
    await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS sandbox_db;`);
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA sandbox_db TO playground_user;`);

    // 3. Grant full access to sandbox_db
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA sandbox_db TO playground_user;`);
    await prisma.$executeRawUnsafe(`ALTER ROLE playground_user SET search_path TO sandbox_db;`);

    // 4. Strictly revoke all access to public schema and its tables
    await prisma.$executeRawUnsafe(`REVOKE ALL ON SCHEMA public FROM playground_user;`);
    await prisma.$executeRawUnsafe(`REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM playground_user;`);

    console.log('Playground Environment Ready.');
  } catch (error) {
    console.error('Failed to setup playground environment:', error);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
