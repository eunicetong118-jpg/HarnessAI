import prisma from '../lib/prisma';
import { Role, Status, EntryType, Category, TicketType, TicketStatus } from '../generated/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@harness.ai' },
    update: {},
    create: {
      email: 'admin@harness.ai',
      name: 'System Admin',
      password: passwordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'John Doe',
      password: passwordHash,
      role: Role.USER,
      isEmailVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'Jane Smith',
      password: passwordHash,
      role: Role.USER,
      isEmailVerified: true,
    },
  });

  console.log('Users created.');

  // 2. Create Broker Accounts
  const accounts = [
    { userId: user1.id, mt5: '10001' },
    { userId: user1.id, mt5: '10002' },
    { userId: user2.id, mt5: '20001' },
  ];

  for (const acc of accounts) {
    await prisma.brokerAccount.upsert({
      where: { mt5AccountNo: acc.mt5 },
      update: {},
      create: {
        userId: acc.userId,
        mt5AccountNo: acc.mt5,
        status: Status.VERIFIED,
        isActive: true,
        verifiedAt: new Date(),
      },
    });
  }

  console.log('Broker accounts created.');

  // 3. Create Ledger Entries
  const ledgerData = [
    { userId: user1.id, amount: 50000n, type: EntryType.CREDIT, category: Category.REBATE, ref: 'INIT-1' },
    { userId: user1.id, amount: 10000n, type: EntryType.DEBIT, category: Category.WITHDRAWAL, ref: 'WITH-1' },
    { userId: user2.id, amount: 75000n, type: EntryType.CREDIT, category: Category.REBATE, ref: 'INIT-2' },
  ];

  for (const entry of ledgerData) {
    await prisma.ledger.upsert({
      where: { referenceId: entry.ref },
      update: {},
      create: {
        userId: entry.userId,
        amount: entry.amount,
        type: entry.type,
        category: entry.category,
        referenceId: entry.ref,
      },
    });
  }

  console.log('Ledger entries created.');

  // 4. Create Tickets
  await prisma.ticket.createMany({
    data: [
      {
        userId: user1.id,
        type: TicketType.WITHDRAWAL,
        status: TicketStatus.PENDING,
        content: 'Requesting withdrawal of $100',
      },
      {
        userId: user2.id,
        type: TicketType.VERIFICATION,
        status: TicketStatus.DONE,
        content: 'Identity verification docs',
        closedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log('Tickets created.');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
