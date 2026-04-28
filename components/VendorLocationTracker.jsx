import { connectSocket } from "../utilities/socket";
import toast from "react-hot-toast";

const VendorLocationTracker = ({ vendorPhone }) => {
  const [isOnline, setIsOnline] = useState(false);

  const identifier = useMemo(
    () => ({ phone: vendorPhone, isActive: isOnline }),
    [vendorPhone, isOnline]
  );

  const { position, error, watching, startWatching, stopWatching } =
    useGeolocation({
      apiEndpoint: "/api/vendor/update-location",
      identifier,
      autoStart: false,
      intervalMs: 10000,
      onPositionChange: (pos) => {
        if (isOnline) {
          const socket = connectSocket();
          socket.emit("vendor:location-update", {
            phone: vendorPhone,
            latitude: pos.latitude,
            longitude: pos.longitude,
          });
        }
      }
    });

  const handleToggle = () => {
    const socket = connectSocket();
    if (isOnline) {
      setIsOnline(false);
      stopWatching();
      socket.emit("vendor:go-offline", { phone: vendorPhone });
      toast.success("Location tracking stopped");
    } else {
      setIsOnline(true);
      startWatching();
      socket.emit("vendor:go-online", { 
        phone: vendorPhone,
        latitude: position?.latitude || 28.7041,
        longitude: position?.longitude || 77.1025 
      });
      toast.success("Broadcast started!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-5 w-full">
      <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">
        📍 Live Location
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleToggle}
          className={`px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-semibold text-white transition-all duration-300 ${
            isOnline
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isOnline ? "Go Offline" : "Go Online"}
        </button>
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            isOnline ? "bg-green-400 animate-pulse" : "bg-gray-300"
          }`}
        />
        <span className="text-sm text-gray-500">
          {isOnline ? "Broadcasting live" : "Offline"}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-2">
          ⚠️ {error}
        </p>
      )}

      {position && (
        <div className="text-xs md:text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p>
            <strong>Lat:</strong> {position.latitude.toFixed(6)}
          </p>
          <p>
            <strong>Lng:</strong> {position.longitude.toFixed(6)}
          </p>
          <p>
            <strong>Accuracy:</strong> ±{Math.round(position.accuracy)}m
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorLocationTracker;
