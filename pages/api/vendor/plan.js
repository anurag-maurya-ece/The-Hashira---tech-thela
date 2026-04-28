import connectDb from "../../../middleware/mongoose";
import Vendor from "../../../models/Vendor";

function getExpiryDate(planId) {
  const now = new Date();

  if (planId === "daily") {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  if (planId === "monthly") {
    const next = new Date(now);
    next.setMonth(next.getMonth() + 1);
    return next;
  }

  if (planId === "yearly") {
    const next = new Date(now);
    next.setFullYear(next.getFullYear() + 1);
    return next;
  }

  return null;
}

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { phone, planId, planLabel, amount } = req.body || {};

  if (!phone || !planId || !amount) {
    return res.status(400).json({ success: false, error: "Missing plan details" });
  }

  const vendor = await Vendor.findOne({ phone: Number(phone) || phone });
  if (!vendor) {
    return res.status(404).json({ success: false, error: "Vendor not found" });
  }

  const startedAt = new Date();
  const expiresAt = getExpiryDate(planId);

  vendor.subscriptionPlan = planId;
  vendor.subscriptionLabel = planLabel || "";
  vendor.subscriptionAmount = Number(amount) || 0;
  vendor.subscriptionStatus = "active";
  vendor.subscriptionStartedAt = startedAt;
  vendor.subscriptionExpiresAt = expiresAt;

  await vendor.save();

  return res.status(200).json({
    success: true,
    plan: {
      id: vendor.subscriptionPlan,
      label: vendor.subscriptionLabel,
      amount: vendor.subscriptionAmount,
      status: vendor.subscriptionStatus,
      startedAt: vendor.subscriptionStartedAt,
      expiresAt: vendor.subscriptionExpiresAt,
    },
  });
};

export default connectDb(handler);
