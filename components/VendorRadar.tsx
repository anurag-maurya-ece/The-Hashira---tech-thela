import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveTrackingMap from './LiveTrackingMap';

interface Vendor {
  id: number;
  name: string;
  x: number;
  y: number;
  type: string;
  inventory: string[];
}

const VendorRadar = () => {
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  return (
    <div className="relative w-full h-[600px] bg-slate-50/50 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">

      <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-inner">
        <LiveTrackingMap userType="consumer" subscription="pro" />
        
        {/* Radar Text Overlay */}
        <div className="absolute top-10 left-10 z-[1000] pointer-events-none">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl border border-indigo-50 shadow-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-indigo-900 font-black tracking-wider text-xs uppercase">Live Thela Radar</span>
          </div>
        </div>
      </div>

      {/* Inventory Panel (Bottom Drawer) */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-8 left-8 right-8 z-40 bg-white/95 backdrop-blur-lg rounded-[2.5rem] p-8 shadow-2xl border border-white"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-indigo-900">{selectedVendor.name}</h3>
                <p className="text-[#fc6441] font-black uppercase text-[10px] tracking-widest">Active Street Vendor • Verified</p>
              </div>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="bg-slate-100 hover:bg-slate-200 p-3 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {selectedVendor.inventory.map((item: string, i: number) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-indigo-900 font-black text-[12px]">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                ORDER VIA PING
              </button>
              <button className="flex-1 border-2 border-slate-200 text-indigo-900 py-5 rounded-2xl font-black hover:bg-slate-50 transition-colors">
                VIEW ROUTE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorRadar;
