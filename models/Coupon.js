const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },     // percentage off or flat amount
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "flat",
    },
    minSpend: { type: Number, default: 0 },          // minimum order value to apply
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    // Who generated/owns this coupon
    generatedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Track usage
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Coupon", CouponSchema);
