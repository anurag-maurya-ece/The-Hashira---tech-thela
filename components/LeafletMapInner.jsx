import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import ThelaMarker from "./ThelaMarker";

const LeafletMapInner = ({ 
  center, 
  userPos, 
  simulatedCustomer, 
  simulatedVendor, 
  vendorList, 
  subscription,
  createThelaIcon 
}) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* User marker */}
      {userPos && (
        <Marker 
          position={[userPos.lat, userPos.lng]} 
          icon={createThelaIcon("You", "User", true)}
        >
          <Popup className="premium-popup">
            <p className="font-black text-indigo-600 uppercase text-[10px]">Your Location</p>
            <p className="font-bold text-slate-800">Ready to trade</p>
          </Popup>
        </Marker>
      )}

      {/* Simulated Customer */}
      {simulatedCustomer && (
        <Marker 
          position={[simulatedCustomer.lat, simulatedCustomer.lng]} 
          icon={L.divIcon({
            html: renderToString(<div className="w-8 h-8 bg-white rounded-full border-4 border-[#fc6441] shadow-2xl flex items-center justify-center">👤</div>),
            className: "custom-customer-icon",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>
            <p className="font-black text-[#fc6441] uppercase text-[10px]">Order Ping</p>
            <p className="font-bold">Customer awaiting delivery</p>
          </Popup>
        </Marker>
      )}

      {/* Simulated Vendor */}
      {simulatedVendor && (
        <Marker 
          position={[simulatedVendor.lat, simulatedVendor.lng]} 
          icon={createThelaIcon(simulatedVendor.name, simulatedVendor.category, true)}
        >
          <Popup>
            <p className="font-black text-indigo-600 uppercase text-[10px]">Your Thela</p>
            <p className="font-bold">En-route to customer</p>
          </Popup>
        </Marker>
      )}

      {vendorList.map((v) => (
        <Marker
          key={v.phone}
          position={[v.latitude, v.longitude]}
          icon={createThelaIcon(v.name, v.category || "Vegetables", false)}
        >
          <Popup>
            <div className="p-1">
              <p className="font-black text-[#fc6441] uppercase text-[10px] mb-1">{v.category || 'General'}</p>
              <h4 className="font-black text-slate-800 text-lg">{v.name}</h4>
              <p className="text-xs text-slate-500 font-bold mb-3">📞 {v.phone}</p>
              {subscription === "pro" ? (
                <div className="bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                   <p className="text-[10px] text-green-600 font-black uppercase">Pro Insight</p>
                   <p className="text-xs font-bold text-green-700">Moving at 4km/h • High Demand</p>
                </div>
              ) : (
                <button className="w-full bg-slate-900 text-white text-[10px] font-black py-2 rounded-lg uppercase tracking-wider">Upgrade for AI Insights</button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMapInner;
