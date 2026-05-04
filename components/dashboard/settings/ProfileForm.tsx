'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  initialName: string;
}

export function ProfileForm({ initialName }: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-design-card rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-design-surface border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-design-pink/50"
            placeholder="Your Name"
            required
          />
        </div>

        {message.text && (
          <div className={`text-sm p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="bg-design-pink hover:bg-design-pink/90 text-white"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </Button>
      </form>
    </div>
  );
}
