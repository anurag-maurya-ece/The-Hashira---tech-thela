import React, { useState, useEffect } from "react";
import { connectSocket } from "../utilities/socket";

const ConsumerPing = ({ consumerId }) => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [acceptedAlert, setAcceptedAlert] = useState(null);

  useEffect(() => {
    const socket = connectSocket();
    socket.on("ping:accepted", (data) => {
      setAcceptedAlert(data);
    });
    return () => socket.off("ping:accepted");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate "Broadcasting to nearby vendors..." with radar
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/ping/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                consumerId,
                item,
                quantity,
                notes,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            });
            const data = await res.json();
            setResult(data);

            // Simulation: Ram Kumar accepts after exactly 3.5 seconds
            setTimeout(() => {
              setAcceptedAlert({
                message: "Vendor Ram Kumar has accepted your request!",
                vendorName: "Ram Kumar",
                vendorPhone: "9876543210",
                pingId: data.pingId
              });
              setLoading(false);
            }, 3500);

          } catch (err) {
            setResult({ error: "Failed to create ping" });
            setLoading(false);
          }
        },
        () => {
          setResult({ error: "Location access denied" });
          setLoading(false);
        }
      );
    }, 500); // Small initial lag
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-4">
      {/* Accepted alert */}
      {acceptedAlert && (
        <div className="bg-green-100 dark:bg-green-900/30 border-4 border-green-500 rounded-3xl p-6 mb-8 animate-in zoom-in duration-500 shadow-2xl">
          <h3 className="text-2xl font-black text-green-700 dark:text-green-400 flex items-center gap-2">
            🎉 {acceptedAlert.message}
          </h3>
          <p className="text-green-600 dark:text-green-300 mt-3 font-bold text-lg">
            Vendor <span className="underline decoration-2">{acceptedAlert.vendorName}</span> (📞{" "}
            {acceptedAlert.vendorPhone}) is on the way!
          </p>
          <div className="mt-4 bg-green-500 text-white px-6 py-2 rounded-xl inline-block font-black cursor-pointer hover:bg-green-600 transition-colors">
            Track Live Location 📍
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 border-t-8 border-[#fc6441] relative overflow-hidden">
        
        {/* Radar Animation Overlay */}
        {loading && !acceptedAlert && (
          <div className="absolute inset-0 bg-white/90 dark:bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 border-4 border-[#fc6441] rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 border-4 border-[#fc6441] rounded-full animate-ping opacity-40 delay-75"></div>
              <div className="absolute inset-8 border-4 border-[#fc6441] rounded-full animate-ping opacity-60 delay-150"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-bounce">📡</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Broadcasting to Vendors...</h3>
            <p className="text-[#fc6441] font-bold animate-pulse text-lg">Searching for nearby vendors within 1km</p>
          </div>
        )}

        <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-1 tracking-tight">
          🔔 Request an Item
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold">
          Reverse Bidding: Let vendors come to you!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-hover:scale-110 transition-transform">🥦</span>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder='What do you need? (e.g. "Onion")'
              required
              className="w-full border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl pl-12 pr-4 py-4 focus:border-[#fc6441] focus:ring-4 focus:ring-[#fc6441]/10 focus:outline-none transition-all font-bold text-lg"
            />
          </div>

          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl group-hover:scale-110 transition-transform">⚖️</span>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder='Quantity (e.g. "1 kg")'
              required
              className="w-full border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl pl-12 pr-4 py-4 focus:border-[#fc6441] focus:ring-4 focus:ring-[#fc6441]/10 focus:outline-none transition-all font-bold text-lg"
            />
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special instructions for the vendor..."
            rows={3}
            className="w-full border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-4 focus:border-[#fc6441] focus:ring-4 focus:ring-[#fc6441]/10 focus:outline-none transition-all font-bold text-lg resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#fc6441] to-[#ff8c6b] text-white font-black text-xl py-5 rounded-2xl hover:shadow-[0_10px_30px_rgba(252,100,65,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale mt-2"
          >
            {loading ? "📡 Broadcasting Signal..." : "🚀 Send Demand Ping"}
          </button>
        </form>

        {result && !result.success && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl font-bold border border-red-100 dark:border-red-800 text-center animate-shake">
            ❌ {result.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerPing;
