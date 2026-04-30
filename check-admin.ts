import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

async function main() {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (admin) {
    console.log('Admin details:', JSON.stringify({
      email: admin.email,
      role: admin.role,
      isDisabled: admin.isDisabled,
      isEmailVerified: admin.isEmailVerified,
      totpEnabled: admin.totpEnabled
    }, null, 2));
  } else {
    console.log('No admin found');
  }

  await pool.end();
}

main().catch(console.error);
