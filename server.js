const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Add CORS headers for API routes to allow cross-domain linking
    if (req.url.startsWith("/api/")) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      
      if (req.method === "OPTIONS") {
        res.statusCode = 200;
        res.end();
        return;
      }
    }

    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // --- Store active vendor sockets ---
  const activeVendors = new Map(); // phone -> { socketId, lat, lng, name }

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // --- VENDOR: Go online & broadcast location ---
    socket.on("vendor:go-online", (data) => {
      const { phone, name, latitude, longitude } = data;
      activeVendors.set(phone, {
        socketId: socket.id,
        name: name || "Vendor",
        lat: latitude,
        lng: longitude,
      });
      socket.join("vendors"); // join vendors room
      console.log(`[Vendor Online] ${phone} at (${latitude}, ${longitude})`);

      // Broadcast to all consumers
      io.to("consumers").emit("vendor:location-update", {
        phone,
        name: name || "Vendor",
        latitude,
        longitude,
      });
    });

    // --- VENDOR: Update location (periodic) ---
    socket.on("vendor:location-update", (data) => {
      const { phone, latitude, longitude, name } = data;
      if (activeVendors.has(phone)) {
        activeVendors.get(phone).lat = latitude;
        activeVendors.get(phone).lng = longitude;
      }

      io.to("consumers").emit("vendor:location-update", {
        phone,
        name: name || "Vendor",
        latitude,
        longitude,
      });
    });

    // --- VENDOR: Go offline ---
    socket.on("vendor:go-offline", (data) => {
      const { phone } = data;
      activeVendors.delete(phone);
      socket.leave("vendors");
      io.to("consumers").emit("vendor:went-offline", { phone });
      console.log(`[Vendor Offline] ${phone}`);
    });

    // --- CONSUMER: Join the consumers room ---
    socket.on("consumer:join", (data) => {
      socket.join("consumers");
      // Send all currently active vendors to this consumer
      const allVendors = [];
      activeVendors.forEach((v, phone) => {
        allVendors.push({
          phone,
          name: v.name,
          latitude: v.lat,
          longitude: v.lng,
        });
      });
      socket.emit("vendor:all-active", allVendors);
    });

    // --- PING: New demand (reverse bidding) ---
    socket.on("ping:new-demand", (data) => {
      // Broadcast to all vendors in range (simplified: all vendors)
      io.to("vendors").emit("ping:new-demand", data);
      console.log(`[Ping] New demand: ${data.item} from consumer ${data.consumerId}`);
    });

    // --- PING: Vendor accepts ---
    socket.on("ping:accept", (data) => {
      const { pingId, vendorPhone, vendorName, consumerSocketId } = data;
      // Notify the specific consumer
      io.to(consumerSocketId).emit("ping:accepted", {
        pingId,
        vendorPhone,
        vendorName,
        message: `${vendorName} is on the way!`,
      });
      console.log(`[Ping Accepted] Vendor ${vendorPhone} accepted ping ${pingId}`);
    });

    // --- CHAT: Direct message (Pro users) ---
    socket.on("chat:message", (data) => {
      const { to, from, message, timestamp } = data;
      io.to(to).emit("chat:message", { from, message, timestamp });
    });

    // --- Disconnect ---
    socket.on("disconnect", () => {
      // Remove vendor from active list
      activeVendors.forEach((v, phone) => {
        if (v.socketId === socket.id) {
          activeVendors.delete(phone);
          io.to("consumers").emit("vendor:went-offline", { phone });
        }
      });
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  // Make io accessible in API routes via global
  global.io = io;
  global.activeVendors = activeVendors;

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`> Tech Thela AI server ready on http://localhost:${PORT}`);
    console.log(`> Socket.io server attached`);
  });
});
