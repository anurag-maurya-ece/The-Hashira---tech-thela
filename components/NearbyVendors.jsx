import React, { useState, useEffect, useCallback } from "react";

const NearbyVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [radius, setRadius] = useState(1000); // 1km default

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch nearby vendors
  const fetchNearbyVendors = useCallback(async () => {
    if (!userPosition) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/vendor/nearby?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${radius}`
      );
      const data = await res.json();

      if (data.success && data.vendors && data.vendors.length > 0) {
        setVendors(data.vendors);
      } else {
        // Fallback for Demo
        setVendors([
          { _id: "v1", firstName: "Ram Kumar", phone: "9876543210", inventory: [{ item: "Tomato", quantity: 5, unit: "kg" }, { item: "Potato", quantity: 10, unit: "kg" }] },
          { _id: "v2", firstName: "Suresh Cart", phone: "9123456780", inventory: [{ item: "Onion", quantity: 8, unit: "kg" }] }
        ]);
        if (!data.success) setError("Demo Mode: Using fallback vendor data");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [userPosition, radius]);

  // Get location on mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Fetch vendors when position is available
  useEffect(() => {
    if (userPosition) {
      fetchNearbyVendors();

      // Auto-refresh every 15 seconds
      const interval = setInterval(fetchNearbyVendors, 15000);
      return () => clearInterval(interval);
    }
  }, [userPosition, fetchNearbyVendors]);

  // Calculate approximate distance
  const getDistance = (vendorCoords) => {
    if (!userPosition || !vendorCoords) return "N/A";
    const [lng, lat] = vendorCoords;
    const R = 6371000;
    const dLat = ((lat - userPosition.latitude) * Math.PI) / 180;
    const dLon = ((lng - userPosition.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userPosition.latitude * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1000 ? `${Math.round(d)}m` : `${(d / 1000).toFixed(1)}km`;
  };

  return (
    <div className="flex flex-col w-[70vw] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#fc6441]">
          🛒 Vendors Near You
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">Radius:</label>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value={500}>500m</option>
            <option value={1000}>1 km</option>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
          </select>
          <button
            onClick={() => {
              getUserLocation();
              fetchNearbyVendors();
            }}
            className="bg-[#fc6441] text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-[#e5532f] transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-400 text-lg">
          Scanning for nearby vendors...
        </div>
      )}

      {!loading && vendors.length === 0 && userPosition && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg">No active vendors within {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}</p>
          <p className="text-sm mt-2">Try increasing the search radius</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-[#fc6441] hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {vendor.firstName || "Vendor"}
                </h3>
                <p className="text-sm text-gray-500">📞 {vendor.phone}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  🟢 Active
                </span>
                <p className="text-lg font-bold text-[#fc6441] mt-1">
                  {getDistance(vendor.location?.coordinates)}
                </p>
              </div>
            </div>

            {vendor.rating > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(vendor.rating))}
                  {"☆".repeat(5 - Math.round(vendor.rating))}
                </span>
                <span className="text-sm text-gray-500">
                  ({vendor.totalReviews} reviews)
                </span>
              </div>
            )}

            {vendor.inventory && vendor.inventory.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {vendor.inventory.slice(0, 5).map((item, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  >
                    {item.item}
                  </span>
                ))}
                {vendor.inventory.length > 5 && (
                  <span className="text-xs text-gray-400">
                    +{vendor.inventory.length - 5} more
                  </span>
                )}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Verified Cart</span>
              <a 
                href={`/payment?vendor=${vendor.firstName}`}
                className="bg-[#16A34A] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-green-100 hover:bg-[#15803d] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Scan & Pay</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyVendors;
