import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "admin@harness.ai";
  const password = "adminpassword123";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
    create: {
      email,
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  console.log(`Admin user ensured: ${admin.email}`);
  console.log(`Password is: ${password}`);

  await pool.end();
}

main().catch(console.error);
