import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { connectSocket } from "../utilities/socket";
import { renderToString } from "react-dom/server";
import ThelaMarker from "./ThelaMarker";

// Single dynamic import for the entire Map component to ensure context sharing
const LeafletMapInner = dynamic(
  () => import("./LeafletMapInner"),
  { ssr: false }
);

const LiveTrackingMap = ({ userType = "consumer", subscription = "free", simulatedVendor = null, simulatedCustomer = null }) => {
  const [vendors, setVendors] = useState({});
  const [userPos, setUserPos] = useState(null);
  const [pingAlert, setPingAlert] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    
    // Get user position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        null,
        { enableHighAccuracy: true }
      );
    }

    // Connect socket
    const socket = connectSocket();
    socketRef.current = socket;

    if (userType === "consumer") {
      socket.emit("consumer:join", {});
      socket.on("vendor:all-active", (allVendors) => {
        const map = {};
        allVendors.forEach((v) => { map[v.phone] = v; });
        setVendors(map);
      });
      socket.on("vendor:location-update", (data) => {
        setVendors((prev) => ({ ...prev, [data.phone]: data }));
      });
      socket.on("vendor:went-offline", ({ phone }) => {
        setVendors((prev) => {
          const updated = { ...prev };
          delete updated[phone];
          return updated;
        });
      });
      socket.on("ping:accepted", (data) => {
        setPingAlert(data);
        setTimeout(() => setPingAlert(null), 10000);
      });
    }

    return () => {
      socket.off("vendor:all-active");
      socket.off("vendor:location-update");
      socket.off("vendor:went-offline");
      socket.off("ping:accepted");
    };
  }, [userType]);

  const createThelaIcon = (name, type, isUser = false) => {
    // We require leaflet here because this function is passed to the dynamic component
    // and will only be executed on the client.
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return L.divIcon({
      html: renderToString(<ThelaMarker name={name} type={type} isUser={isUser} />),
      className: "custom-thela-icon",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  };

  const vendorList = Object.values(vendors);
  const center = userPos || { lat: 28.7041, lng: 77.1025 }; // Default: Delhi

  return (
    <div className="w-full flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
      {/* Ping accepted alert */}
      {pingAlert && (
        <div className="bg-indigo-600 text-white p-4 m-4 rounded-2xl animate-bounce shadow-xl flex items-center justify-between">
          <div>
            <p className="font-black text-xs uppercase tracking-widest">🚀 Order Accepted</p>
            <p className="text-sm font-bold">{pingAlert.vendorName} is on the way!</p>
          </div>
          <span className="text-2xl">🚛</span>
        </div>
      )}

      <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            📍 Market <span className="text-indigo-600">Radar</span>
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Vendor Movements</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-xs font-black text-slate-600">{vendorList.length} ACTIVE</span>
        </div>
      </div>

      {/* Leaflet Map container */}
      <div style={{ height: "550px", width: "100%" }} className="relative bg-slate-100">
        {!isClient ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 font-bold animate-pulse">Initializing Map...</p>
          </div>
        ) : (
          <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <style>{`
              .custom-thela-icon { background: none !important; border: none !important; }
              .leaflet-container { font-family: 'Inter', sans-serif; z-index: 1; }
              .leaflet-popup-content-wrapper { border-radius: 1.5rem; padding: 0.5rem; border: 1px solid #f1f5f9; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
              .leaflet-popup-tip { box-shadow: none; }
            `}</style>
            <LeafletMapInner
              center={center}
              userPos={userPos}
              simulatedCustomer={simulatedCustomer}
              simulatedVendor={simulatedVendor}
              vendorList={vendorList}
              subscription={subscription}
              createThelaIcon={createThelaIcon}
            />
          </>
        )}
      </div>

      {/* Vendor list below map */}
      {subscription === "pro" && vendorList.length > 0 && (
        <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Active Sector Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vendorList.map((v) => (
              <div key={v.phone} className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-black text-slate-800">{v.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">📡 {v.category || 'Vendor'}</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mb-1"></span>
                   <p className="text-[8px] font-black text-emerald-600 uppercase">Live</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingMap;
