import { auth } from '@/lib/auth';
import { getBalance } from '@/services/ledger.service';
import { getMockChartData } from '@/lib/mock-data';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RebateChart } from '@/components/dashboard/RebateChart';
import { MilestoneTrigger } from '@/components/dashboard/milestone-trigger';

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  // Fetch real balance from LedgerService
  const balance = await getBalance(userId || '');

  // Fetch mock chart data for visualization
  const chartData = getMockChartData();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <MilestoneTrigger totalEarned={balance.totalEarned} />
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-gray-400">
          Welcome back, {session?.user?.name}. Here's what's happening with your accounts.
        </p>
      </div>

      <StatsCards
        totalEarned={balance.totalEarned}
        available={balance.available}
        pending={balance.pending}
      />

      <div className="grid grid-cols-1 gap-8">
        <RebateChart data={chartData} />
      </div>
    </div>
  );
}
