import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VendorInsights from './VendorInsights';
import LiveTrackingMap from './LiveTrackingMap';

const LocateCustomer = ({ Users, onUpdateVendor }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  // Real coordinates from Vendor data
  const vendorCoords = Users?.location?.coordinates || [77.1025, 28.7041];
  const START_POS = { lat: vendorCoords[1], lng: vendorCoords[0] };
  
  const [vendorPos, setVendorPos] = useState(START_POS);
  const [customerPos, setCustomerPos] = useState({ lat: START_POS.lat + 0.01, lng: START_POS.lng + 0.01 });
  
  const [distance, setDistance] = useState(1200);
  const [isMoving, setIsMoving] = useState(false);

  // Sync vendor position if Users prop updates
  useEffect(() => {
    if (Users?.location?.coordinates) {
      setVendorPos({ 
        lat: Users.location.coordinates[1], 
        lng: Users.location.coordinates[0] 
      });
    }
  }, [Users]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setResult(null);
    setIsMoving(false);
    
    const toast = (await import('react-hot-toast')).default;
    const loadingToast = toast.loading("Scanning local sector demand...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate high demand zone based on real position
    const newCustomerPos = { 
      lat: vendorPos.lat + (Math.random() * 0.01 - 0.005), 
      lng: vendorPos.lng + (Math.random() * 0.01 - 0.005) 
    };
    setCustomerPos(newCustomerPos);

    setResult({
      probability: "94%",
      demandZone: "Local Trade Sector",
      activePings: Math.floor(Math.random() * 15) + 5,
      topProduct: "Seasonal Freshness"
    });
    
    setAnalyzing(false);
    toast.success("Nearby Demand Identified!", { id: loadingToast });
  };

  const acceptOrder = () => {
    setIsMoving(true);
  };

  // Simulate Vendor movement (Lat/Lng Interpolation)
  useEffect(() => {
    if (isMoving && result) {
      const interval = setInterval(() => {
        setVendorPos(prev => {
          const dLat = customerPos.lat - prev.lat;
          const dLng = customerPos.lng - prev.lng;
          const mag = Math.sqrt(dLat*dLat + dLng*dLng);
          
          if (mag < 0.0001) {
            clearInterval(interval);
            setIsMoving(false);
            return prev;
          }

          // Move vendor toward customer in Lat/Lng steps
          const moveLat = (dLat / mag) * 0.0002;
          const moveLng = (dLng / mag) * 0.0002;
          
          setDistance(d => Math.max(0, d - 25));
          return { lat: prev.lat + moveLat, lng: prev.lng + moveLng };
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isMoving, customerPos, result]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 p-6 bg-slate-50/50 min-h-screen font-sans">
      {/* Left: Enhanced Map & Controls */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">📍 Smart Order Routing</h2>
              <p className="text-[10px] text-[#fc6441] font-black uppercase tracking-widest mt-1">Geographical GPS Interaction</p>
            </div>
            
            <button 
              onClick={runAnalysis}
              disabled={analyzing}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-200 hover:scale-105 transition-all text-xs"
            >
              {analyzing ? "Syncing..." : "Sync Nearby Demand"}
            </button>
          </div>

          {/* Real World Map Integration */}
          <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner">
            <LiveTrackingMap 
              userType="vendor" 
              subscription="pro" 
              simulatedVendor={{ ...vendorPos, name: "YOU", category: "Fruits" }}
              simulatedCustomer={result ? customerPos : null}
            />
          </div>

          <div className="mt-8 flex gap-4">
             {result && !isMoving && (
               <button 
                 onClick={acceptOrder}
                 className="flex-1 bg-[#fc6441] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-orange-200 hover:scale-[1.02] transition-all"
               >
                 ACCEPT ORDER & START TRACKING
               </button>
             )}
             {isMoving && (
               <div className="flex-1 bg-slate-800 text-white py-4 px-8 rounded-3xl flex justify-between items-center shadow-xl">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                    <p className="font-black">NAVIGATING...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Distance</p>
                    <p className="font-black text-[#fc6441]">{distance}m</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Right: AI Strategy Board */}
      <div className="w-full lg:w-96 space-y-6">
        <VendorInsights />
        
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fc6441]/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-[10px] font-black text-[#fc6441] uppercase tracking-widest mb-2">Google Maps Integration</p>
          <h3 className="text-xl font-black mb-4">Real Terrain Guidance</h3>
          <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
            Unlike simple grids, we use real geographical tiles to ensure your thela route respects one-way streets and complex junctions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocateCustomer;
