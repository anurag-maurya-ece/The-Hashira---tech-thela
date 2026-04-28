import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success) {
          setLeaders(data.leaderboard);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        // Fallback demo data
        setLeaders([
          { rank: 1, name: "Ramesh Kumar", rating: 4.8, reviews: 52 },
          { rank: 2, name: "Suresh Patel", rating: 4.6, reviews: 47 },
          { rank: 3, name: "Anita Devi", rating: 4.5, reviews: 39 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="flex flex-col w-full p-3 sm:p-4 md:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#fc6441] mb-4 sm:mb-6">
        🏆 Vendor Leaderboard
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-5xl mb-3">🏆</p>
          <p>No vendors on the leaderboard yet. Reviews drive rankings!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3">
          {leaders.map((vendor) => (
            <div
              key={vendor.rank}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md transition-all hover:shadow-lg gap-2 sm:gap-0 ${
                vendor.rank <= 3
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-2xl sm:text-3xl w-10 sm:w-12 text-center">
                  {getMedal(vendor.rank)}
                </span>
                <div>
                  <p className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                    {vendor.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {vendor.reviews} reviews
                  </p>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <div className="flex items-center gap-1 justify-start sm:justify-end">
                  <span className="text-yellow-400 text-xs sm:text-base md:text-lg">
                    {"★".repeat(Math.round(vendor.rating))}
                    {"☆".repeat(5 - Math.round(vendor.rating))}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  {vendor.rating}/5
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
