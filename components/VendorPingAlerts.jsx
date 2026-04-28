import React, { useState, useEffect } from "react";
import { connectSocket } from "../utilities/socket";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, CheckCircle, Package, Clock, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const VendorPingAlerts = ({ vendorPhone }) => {
  const [pings, setPings] = useState([]);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    const socket = connectSocket();
    socket.emit("vendor:go-online", { phone: vendorPhone });

    socket.on("ping:new-demand", (data) => {
      setPings((prev) => [data, ...prev].slice(0, 10));
      toast.success(`New Demand: ${data.item}!`, {
        icon: '🔔',
        style: {
          borderRadius: '12px',
          background: '#10b981',
          color: '#fff',
        },
      });
      // Optional: Play a subtle notification sound
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {}); // Browser might block auto-play
    });

    return () => {
      socket.off("ping:new-demand");
    };
  }, [vendorPhone]);

  const handleAccept = async (ping) => {
    setAccepting(ping.pingId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/ping/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pingId: ping.pingId,
          vendorPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPings((prev) =>
          prev.map((p) =>
            p.pingId === ping.pingId ? { ...p, accepted: true } : p
          )
        );
        toast.success("Demand Accepted!");
      }
    } catch (err) {
      console.error("Error accepting ping:", err);
      toast.error("Failed to accept demand.");
    } finally {
      setAccepting(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BellRing className="w-6 h-6 text-emerald-500 animate-bounce" />
          Live Demand Alerts
        </h3>
        {pings.filter(p => !p.accepted).length > 0 && (
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20">
            {pings.filter((p) => !p.accepted).length} NEW
          </span>
        )}
      </div>

      {pings.length === 0 ? (
        <div className="text-center py-12 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="bg-slate-100 dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No demands in your area yet.</p>
          <p className="text-xs text-slate-400 mt-1">Stay active to receive real-time pings!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {pings.map((ping, i) => (
              <motion.div
                key={ping.pingId || i}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 ${
                  ping.accepted
                    ? "bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${ping.accepted ? "bg-emerald-500/20" : "bg-slate-100 dark:bg-white/10"}`}>
                        <Package className={`w-4 h-4 ${ping.accepted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-300"}`} />
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Customer Demand
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {ping.item} <span className="text-slate-400 dark:text-slate-500 mx-1">•</span> {ping.quantity}
                    </h4>
                    
                    {ping.notes && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1.5 line-clamp-2">
                        <span className="mt-1">📝</span> {ping.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Within {ping.radius || 1000}m
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!ping.accepted ? (
                      <button
                        onClick={() => handleAccept(ping)}
                        disabled={accepting === ping.pingId}
                        className="relative group/btn bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 overflow-hidden"
                      >
                        <span className="z-10 flex items-center gap-2">
                          {accepting === ping.pingId ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {accepting === ping.pingId ? "Accepting..." : "ACCEPT"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 py-2 px-4 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-sm border border-emerald-500/30">
                        <CheckCircle className="w-4 h-4" />
                        ACCEPTED
                      </div>
                    )}
                  </div>
                </div>
                
                {!ping.accepted && (
                  <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/30 w-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 10, ease: "linear" }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VendorPingAlerts;
