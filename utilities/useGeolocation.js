import { useState, useEffect, useCallback } from "react";

/**
 * useGeolocation — a React hook to capture and broadcast the user's GPS position.
 *
 * @param {Object}  options
 * @param {string}  options.apiEndpoint   - API route to POST location updates (e.g. "/api/vendor/update-location")
 * @param {Object}  options.identifier    - Identifying object sent with each POST (e.g. { phone: 1234567890 } or { email: "x@y.com" })
 * @param {boolean} options.autoStart     - Start watching immediately (default: false)
 * @param {number}  options.intervalMs    - How often to POST location (default: 10000 = 10s)
 */
export default function useGeolocation({
  apiEndpoint,
  identifier = {},
  autoStart = false,
  intervalMs = 10000,
  onPositionChange = null,
} = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(autoStart);

  // Get current position once
  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setPosition(newPos);
        if (onPositionChange) onPositionChange(newPos);
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Broadcast location to the API
  const broadcastLocation = useCallback(async () => {
    if (!position || !apiEndpoint) return;

    try {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...identifier,
          latitude: position.latitude,
          longitude: position.longitude,
        }),
      });
    } catch (err) {
      console.error("Failed to broadcast location:", err);
    }
  }, [position, apiEndpoint, identifier]);

  // Auto-broadcast on interval when watching
  useEffect(() => {
    if (!watching) return;

    getPosition(); // initial capture

    const geoInterval = setInterval(() => {
      getPosition();
    }, intervalMs);

    return () => clearInterval(geoInterval);
  }, [watching, intervalMs, getPosition]);

  // Broadcast whenever position changes
  useEffect(() => {
    if (watching && position) {
      broadcastLocation();
    }
  }, [position, watching, broadcastLocation]);

  return {
    position,
    error,
    watching,
    startWatching: () => setWatching(true),
    stopWatching: () => setWatching(false),
    getPosition,
  };
}
