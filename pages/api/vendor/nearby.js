import Vendor from "../../../models/Vendor";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "latitude and longitude query params are required" });
    }

    const searchRadius = parseInt(radius) || 1000; // default 1km

    try {
      const nearbyVendors = await Vendor.find({
        isActive: true,
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: searchRadius, // meters
          },
        },
      }).select("firstName phone location inventory rating totalReviews isActive");

      res.status(200).json({
        success: true,
        count: nearbyVendors.length,
        radius: searchRadius,
        vendors: nearbyVendors,
      });
    } catch (error) {
      console.error("Error finding nearby vendors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
