import Vendor from "../../models/Vendor";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Fetch top 20 vendors by rating (data-driven leaderboard)
      const vendors = await Vendor.find({ totalReviews: { $gt: 0 } })
        .sort({ rating: -1, totalReviews: -1 })
        .limit(20)
        .select("firstName phone rating totalReviews pincode");

      res.status(200).json({
        success: true,
        leaderboard: vendors.map((v, i) => ({
          rank: i + 1,
          name: v.firstName || `Vendor ${v.phone}`,
          phone: v.phone,
          rating: v.rating,
          reviews: v.totalReviews,
          pincode: v.pincode,
        })),
      });
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
