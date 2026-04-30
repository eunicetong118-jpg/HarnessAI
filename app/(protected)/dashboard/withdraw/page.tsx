import { auth } from '@/lib/auth';
import { getBalance } from '@/services/ledger.service';
import { getWithdrawalHistory } from '@/services/withdrawal.service';
import { WithdrawalForm } from '@/components/dashboard/WithdrawalForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function WithdrawPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return null;
  }

  // Fetch balance
  const balance = await getBalance(userId);
  const availableUSD = Number(balance.available) / 100;

  // Fetch history
  const history = await getWithdrawalHistory(userId);

  // Check 2FA status (mocked for now as we don't have the user object here easily without extra fetch)
  // In a real app, session.user would have this or we'd fetch user from DB
  const is2faEnabled = (session?.user as any)?.totpEnabled || false;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Withdrawals</h2>
        <p className="text-sm text-gray-500">
          Request funds from your earnings and view your history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <WithdrawalForm
            availableBalance={availableUSD}
            is2faEnabled={is2faEnabled}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No withdrawal requests found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {history.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-4 py-3">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            ${(Number((ticket.metadata as any)?.amount || 0) / 100).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                              ticket.status === 'DONE' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {ticket.content}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
