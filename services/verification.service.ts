import prisma from '@/lib/prisma';
import { Readable } from 'stream';

/**
 * Parses a CSV stream and returns an array of MT5 account numbers.
 * Assumes the first line is a header if it contains non-numeric characters.
 */
export async function parseCsv(stream: Readable): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let content = '';
    stream.on('data', (chunk) => {
      content += chunk.toString();
    });
    stream.on('end', () => {
      const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      if (lines.length === 0) return resolve([]);

      // Simple heuristic: if first cell is "mt5AccountNo" or similar, skip it
      const header = lines[0].toLowerCase();
      if (header.includes('mt5') || header.includes('account') || isNaN(Number(lines[0]))) {
        resolve(lines.slice(1));
      } else {
        resolve(lines);
      }
    });
    stream.on('error', reject);
  });
}

/**
 * Bulk verifies MT5 accounts.
 * - Flips BrokerAccount status to VERIFIED
 * - Closes associated Tickets
 * - Returns summary of results
 */
export async function bulkVerify(mt5Numbers: string[]) {
  const summary = {
    verified: 0,
    alreadyVerified: 0,
    notFound: 0,
  };

  for (const mt5No of mt5Numbers) {
    const account = await prisma.brokerAccount.findUnique({
      where: { mt5AccountNo: mt5No },
    });

    if (!account) {
      summary.notFound++;
      continue;
    }

    if (account.status === 'VERIFIED') {
      summary.alreadyVerified++;
      continue;
    }

    // Verify account and close tickets in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.brokerAccount.update({
        where: { id: account.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });

      // Find and close any pending verification tickets for this MT5 account
      // metadata is stored as Json in Prisma
      // We use a raw-ish query or filter in memory if prisma client version doesn't support json filtering well
      const tickets = await tx.ticket.findMany({
        where: {
          type: 'VERIFICATION',
          status: 'PENDING',
        },
      });

      for (const ticket of tickets) {
        const metadata = ticket.metadata as any;
        if (metadata?.mt5AccountNo === mt5No) {
          await tx.ticket.update({
            where: { id: ticket.id },
            data: {
              status: 'DONE',
              closedAt: new Date(),
            },
          });
        }
      }
    });

    summary.verified++;
  }

  return summary;
}
