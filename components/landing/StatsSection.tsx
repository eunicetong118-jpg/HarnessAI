import React from 'react';

const StatsSection = ({ compact = false }: { compact?: boolean }) => {
  const stats = [
    { value: "50,000+", label: "Traders" },
    { value: "$2.5M+", label: "Saved" },
    { value: "4.9/5", label: "Rating" },
    { value: "< 24h", label: "Payout" },
    { value: "100%", label: "Safe" },
  ];

  return (
    <div className={`grid grid-cols-2 ${compact ? 'md:grid-cols-5 gap-2 mt-0' : 'md:grid-cols-5 gap-4 mt-10'}`}>
      {stats.map((s, i) => (
        <div key={i} className={`glass-card ${compact ? 'p-3' : 'p-6'} rounded-2xl text-center hover:border-design-pink/30 transition-colors`}>
          <p className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white mb-0`}>{s.value}</p>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
