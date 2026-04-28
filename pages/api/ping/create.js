import Ping from "../../../models/Ping";
import Vendor from "../../../models/Vendor";
import connectDb from "../../../middleware/mongoose";
import { sendWhatsAppMessage } from "../../../utilities/whatsapp";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { consumerId, item, quantity, latitude, longitude, radius, notes } = req.body;

    if (!consumerId || !item || !quantity || !latitude || !longitude) {
      return res.status(400).json({ error: "consumerId, item, quantity, latitude, longitude are required" });
    }

    try {
      // 1. Create the ping
      const ping = new Ping({
        consumer: consumerId,
        item,
        quantity,
        notes: notes || "",
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        radius: radius || 1000,
      });
      await ping.save();

      // 2. Find nearby active vendors via geofencing
      const nearbyVendors = await Vendor.find({
        isActive: true,
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: radius || 1000,
          },
        },
      }).select("phone firstName socketId");

      // 3. Emit to vendors via Socket.io (if available)
      if (global.io) {
        global.io.to("vendors").emit("ping:new-demand", {
          pingId: ping._id,
          item,
          quantity,
          notes,
          latitude,
          longitude,
          consumerId,
        });
      }

      // 4. Send WhatsApp alerts to nearby vendors
      const whatsappResults = await Promise.all(
        nearbyVendors.map(async (vendor) => {
          if (vendor.phone) {
            const messageBody = `🔔 *New Demand Alert!*\n\nSomeone nearby needs *${item}* (${quantity}).\n${notes ? `📝 Note: ${notes}\n` : ""}\n🚀 Open your Tech Thela AI dashboard to accept this demand and get directions!`;
            return sendWhatsAppMessage(vendor.phone, messageBody);
          }
          return null;
        })
      );

      res.status(200).json({
        success: true,
        pingId: ping._id,
        vendorsNotified: nearbyVendors.length,
        whatsappSent: whatsappResults.filter(r => r?.success).length,
        message: `Ping created! ${nearbyVendors.length} vendor(s) notified via Dashboard & WhatsApp.`,
      });
    } catch (error) {
      console.error("Error creating ping:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
