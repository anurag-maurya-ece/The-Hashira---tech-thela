import User from "../../../models/User";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, latitude, longitude } = req.body;

    if (!email || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "email, latitude, and longitude are required" });
    }

    try {
      const user = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "User location updated",
        location: user.location,
      });
    } catch (error) {
      console.error("Error updating user location:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
