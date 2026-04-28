import Vendor from "../../../models/Vendor";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { phone, latitude, longitude, isActive } = req.body;

    if (!phone || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "phone, latitude, and longitude are required" });
    }

    try {
      const updateData = {
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)], // GeoJSON: [lng, lat]
        },
      };

      // Optionally update active status
      if (isActive !== undefined) {
        updateData.isActive = Boolean(isActive);
      }

      const vendor = await Vendor.findOneAndUpdate(
        { phone: Number(phone) },
        { $set: updateData },
        { new: true }
      );

      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      res.status(200).json({
        success: true,
        message: "Vendor location updated",
        location: vendor.location,
        isActive: vendor.isActive,
      });
    } catch (error) {
      console.error("Error updating vendor location:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
