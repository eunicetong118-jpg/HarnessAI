import React from 'react';
import LiveFeed from './LiveFeed';
import StoriesSection from './StoriesSection';

const SocialProofSection = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <div className="h-full glass-card rounded-3xl p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Community Activity</h3>
          <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-[10px] text-gray-500 font-bold">LIVE</span>
          </div>
        </div>
        <LiveFeed />
      </div>
    );
  }

  return (
    <div className="mt-24">
      <div className="mb-24">
        <h3 className="mb-4 text-4xl font-bold text-center text-white">The Community Edge</h3>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Join thousands of smart traders sharing their success and saving more every day.</p>

        <StoriesSection />

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-design-purple to-design-pink p-8 rounded-3xl shadow-xl flex flex-col justify-between items-start h-64 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white leading-tight mb-2">"Just saved $412.50 in commissions this week! Rebatengine is a game changer. 🚀"</p>
                  <p className="text-white/70 text-sm font-medium">@TraderPro_99</p>
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                  Share Your Story
                </button>
              </div>

              <div className="bg-design-card border border-white/5 p-8 rounded-3xl flex flex-col justify-between items-start h-64 hover:border-design-pink/50 transition-colors">
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-xl font-bold text-white leading-tight">Verified 4.9/5 Rating</p>
                  <p className="text-gray-400 mt-2 text-sm">Based on 12,000+ real trader reviews from Trustpilot and independent auditors.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-design-surface flex items-center justify-center border border-white/10">
                    <span className="text-design-pink font-bold">T</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Trustpilot Verified</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full">
            <LiveFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;
