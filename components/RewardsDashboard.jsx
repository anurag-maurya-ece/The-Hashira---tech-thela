import React, { useState, useEffect } from "react";

const RewardsDashboard = ({ userEmail }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);

  const fetchCredits = async () => {
    try {
      const res = await fetch(`/api/user/redeem-credits?email=${userEmail}`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchCredits();
  }, [userEmail]);

  const handleRedeem = async () => {
    setRedeeming(true);
    setRedeemResult(null);
    try {
      const res = await fetch("/api/user/redeem-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const json = await res.json();
      setRedeemResult(json);
      if (json.success) fetchCredits(); // refresh
    } catch (err) {
      setRedeemResult({ error: "Network error" });
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-400">Loading rewards...</div>;
  if (!data) return <div className="p-4 text-gray-400">No rewards data</div>;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Credit balance */}
      <div className="bg-gradient-to-r from-[#fc6441] to-[#ff8a65] rounded-2xl p-6 text-white mb-6 shadow-xl">
        <p className="text-sm font-semibold opacity-80">Your Credits</p>
        <p className="text-5xl font-black mt-1">{data.credits}</p>
        <p className="text-sm mt-2 opacity-70">100 credits = ₹20 coupon</p>
      </div>

      {/* Redeem button */}
      <button
        onClick={handleRedeem}
        disabled={redeeming || data.credits < 100}
        className={`w-full py-3 rounded-xl font-bold text-lg transition mb-4 ${
          data.credits >= 100
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {redeeming
          ? "Generating coupon..."
          : data.credits >= 100
          ? "🎁 Redeem ₹20 Coupon"
          : `Need ${100 - data.credits} more credits`}
      </button>

      {redeemResult && (
        <div
          className={`p-4 rounded-xl mb-4 ${
            redeemResult.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {redeemResult.success ? (
            <>
              <p className="font-bold">🎉 {redeemResult.message}</p>
              <p className="mt-1">
                Code:{" "}
                <code className="bg-green-100 px-2 py-1 rounded font-bold">
                  {redeemResult.coupon?.code}
                </code>
              </p>
              <p className="text-sm mt-1">{redeemResult.coupon?.discount}</p>
            </>
          ) : (
            <p>❌ {redeemResult.error}</p>
          )}
        </div>
      )}

      {/* Active coupons */}
      {data.coupons?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">🎟️ Your Coupons</h3>
          {data.coupons.map((c) => (
            <div
              key={c._id}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-2 flex justify-between items-center"
            >
              <div>
                <code className="font-bold text-yellow-800">{c.code}</code>
                <p className="text-xs text-gray-500">
                  ₹{c.discount} off · Min ₹{c.minSpend}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  c.usedBy
                    ? "bg-gray-100 text-gray-400"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {c.usedBy ? "Used" : "Active"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Credit history */}
      {data.history?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-700 mb-2">📊 Credit History</h3>
          <div className="max-h-48 overflow-y-auto">
            {data.history
              .slice()
              .reverse()
              .map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-gray-100 text-sm"
                >
                  <span className="text-gray-600 capitalize">{h.reason}</span>
                  <span
                    className={`font-bold ${
                      h.amount > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {h.amount > 0 ? "+" : ""}
                    {h.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsDashboard;
