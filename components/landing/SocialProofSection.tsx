import React from 'react';

const SocialProofSection = () => {
  const socialCards = [
    { text: "I saved $184.20 this month 🚀", bgColor: "from-design-purple to-design-pink" },
    { text: "Zero cost trading is real 💰", bgColor: "from-blue-600 to-design-purple" },
    { text: "Smart traders save more ❤️", bgColor: "from-design-pink to-orange-500" },
  ];

  const liveFeed = [
    { name: "Rahul", amount: "$1.20" },
    { name: "Sneha", amount: "$0.80" },
    { name: "Amit", amount: "$0.50" },
    { name: "Jessica", amount: "$2.10" },
  ];

  return (
    <div className="mt-16">
      <div className="mb-16">
        <h3 className="mb-8 text-3xl font-bold text-center text-white">Show Off Your Savings</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {socialCards.map((card, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${card.bgColor} p-8 rounded-2xl shadow-xl flex flex-col justify-between items-start h-48`}
            >
              <p className="text-xl font-bold text-white leading-tight">{card.text}</p>
              <button className="bg-white text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                Share Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Live Savings Feed</h3>
          <span className="flex items-center text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            LIVE
          </span>
        </div>

        <div className="space-y-3">
          {liveFeed.map((f, i) => (
            <div
              key={i}
              className="bg-design-surface p-4 rounded-xl border border-white/5 flex justify-between items-center"
            >
              <span className="text-gray-300 font-medium">{f.name} just saved</span>
              <span className="text-design-pink font-bold">{f.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
