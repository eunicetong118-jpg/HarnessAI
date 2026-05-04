import React from 'react';
import Link from 'next/link';

const CTASection = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-design-pink/20 bg-gradient-to-br from-design-pink/5 to-design-purple/5">
        <h2 className="text-xl font-bold text-white mb-2">
          Ready to save?
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Join 50k+ traders. Reduce costs.
        </p>

        <Link
          href="/signup"
          className="block text-center bg-gradient-to-r from-design-pink to-design-purple text-white px-4 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all"
        >
          Create Free Account
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center mt-24 mb-12 bg-gradient-to-b from-transparent to-design-surface/50 p-12 rounded-3xl border border-white/5">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Ready to trade for less?
      </h2>
      <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
        Join thousands of traders who are already reducing their costs and maximizing their edge.
      </p>

      <Link
        href="/signup"
        className="inline-block bg-gradient-to-r from-design-pink to-design-purple text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-design-pink/20 hover:shadow-2xl transition-all transform hover:-translate-y-1"
      >
        Create Free Account
      </Link>

      <p className="mt-6 text-gray-500 text-sm">
        Free forever. No hidden fees. Instant setup.
      </p>
    </div>
  );
};

export default CTASection;
