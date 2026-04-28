import Ping from "../../../models/Ping";
import Vendor from "../../../models/Vendor";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { pingId, vendorPhone } = req.body;

    if (!pingId || !vendorPhone) {
      return res.status(400).json({ error: "pingId and vendorPhone are required" });
    }

    try {
      const ping = await Ping.findById(pingId);

      if (!ping) return res.status(404).json({ error: "Ping not found" });
      if (ping.status !== "pending") {
        return res.status(400).json({ error: `Ping already ${ping.status}` });
      }

      const vendor = await Vendor.findOne({ phone: Number(vendorPhone) });
      if (!vendor) return res.status(404).json({ error: "Vendor not found" });

      // Accept the ping
      ping.status = "accepted";
      ping.acceptedVendor = vendor._id;
      ping.acceptedAt = new Date();
      await ping.save();

      // Notify consumer via Socket.io
      if (global.io) {
        global.io.emit("ping:accepted", {
          pingId: ping._id,
          vendorPhone,
          vendorName: vendor.firstName || "Vendor",
          message: `${vendor.firstName || "Vendor"} is on the way!`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Ping accepted! Consumer has been notified.",
        ping,
      });
    } catch (error) {
      console.error("Error accepting ping:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
