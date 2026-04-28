import React from 'react';
import { motion } from 'framer-motion';

const VendorInsights = () => {
  const suggestions = [
    { product: 'Tomatoes', probability: '92%', trend: 'High', location: 'Ambika Vihar', advice: 'Move 200m North for 15% better sales.' },
    { product: 'Potatoes', probability: '85%', trend: 'Stable', location: 'Paschim Vihar', advice: 'Stock up, early morning demand is spiking.' },
    { product: 'Onions', probability: '78%', trend: 'Rising', location: 'Nearby Park', advice: 'Evening crowds expected near the community gate.' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">✨ AI Market Insights</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Real-time Sales Predictions</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black animate-pulse">
          LIVE ANALYSIS
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:bg-white hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-indigo-900">{item.product}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">{item.probability} Prob.</span>
                <span className={`text-[10px] font-black uppercase ${item.trend === 'High' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {item.trend} Trend
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic font-medium">&quot;{item.advice}&quot;</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.location}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
        <h4 className="font-black text-sm mb-1">💡 Smart Movement Suggestion</h4>
        <p className="text-[11px] opacity-90 leading-relaxed font-medium">
          Vendors near Sector 7 report 2x faster stock clearance. Recommendation: Reposition within the next 30 minutes.
        </p>
      </div>
    </div>
  );
};

export default VendorInsights;
