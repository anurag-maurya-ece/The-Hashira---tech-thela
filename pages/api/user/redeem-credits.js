import User from "../../../models/User";
import Coupon from "../../../models/Coupon";
import connectDb from "../../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      // Need 100 credits to redeem
      if (user.credit < 100) {
        return res.status(400).json({
          error: `Need 100 credits to redeem. You have ${user.credit}.`,
          currentCredits: user.credit,
        });
      }

      // Generate unique coupon code
      const code = `WEK-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      // Create coupon: ₹20 off
      const coupon = new Coupon({
        code,
        discount: 20,
        discountType: "flat",
        minSpend: 50,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        generatedFor: user._id,
      });
      await coupon.save();

      // Deduct credits
      user.credit -= 100;
      user.creditHistory.push({
        amount: -100,
        reason: "redemption",
        date: new Date(),
      });
      await user.save();

      res.status(200).json({
        success: true,
        message: "Coupon generated! 🎉",
        coupon: {
          code: coupon.code,
          discount: "₹20 off",
          minSpend: "₹50 minimum",
          expiresAt: coupon.expiresAt,
        },
        remainingCredits: user.credit,
      });
    } catch (error) {
      console.error("Redemption error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    // Get user's credit balance + history
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "email is required" });

    try {
      const user = await User.findOne({ email }).select("credit creditHistory");
      if (!user) return res.status(404).json({ error: "User not found" });

      const coupons = await Coupon.find({ generatedFor: user._id })
        .sort({ createdAt: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        credits: user.credit,
        history: user.creditHistory?.slice(-20) || [],
        coupons,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
