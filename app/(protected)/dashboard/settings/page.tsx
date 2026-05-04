import { auth } from '@/lib/auth';
import { ProfileForm } from '@/components/dashboard/settings/ProfileForm';
import { PasswordForm } from '@/components/dashboard/settings/PasswordForm';
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-gray-400">
          Manage your profile, security, and account preferences.
        </p>
      </div>

      <div className="space-y-8">
        <ProfileForm initialName={session.user.name || ''} />
        <PasswordForm />
        <SecuritySettings />
      </div>
    </div>
  );
}
