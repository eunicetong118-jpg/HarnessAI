import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: "50,000+", label: "Traders" },
    { value: "$2.5M+", label: "Saved" },
    { value: "4.9/5", label: "Rating" },
    { value: "< 24h", label: "Payout" },
    { value: "100%", label: "Safe" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
      {stats.map((s, i) => (
        <div key={i} className="bg-design-surface p-6 rounded-xl text-center border border-white/5 shadow-lg">
          <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
