const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pincode: { type: Number, required: true },
    password: { type: String, required: true },
    isuser: { type: Boolean, required: true, default: true },
    credit: { type: Number, default: 0 },

    // --- NEW: Geolocation (GeoJSON Point) ---
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    // --- NEW: Subscription tier ---
    subscription: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    // --- NEW: ML preferences (populated after onboarding form) ---
    preferences: {
      predictedFrequency: { type: String, default: null }, // e.g. "3x/week"
      preferredCategories: [String], // e.g. ["vegetables", "fruits"]
      familySize: { type: Number, default: null },
      youngestAge: { type: Number, default: null },
      oldestAge: { type: Number, default: null },
    },

    // --- NEW: Credit history for the reward system ---
    creditHistory: [
      {
        amount: { type: Number, required: true },
        reason: { type: String, required: true }, // "review", "referral", "redemption"
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// 2dsphere index for consumer location queries
UserSchema.index({ location: "2dsphere" });

mongoose.models = {};
export default mongoose.model("User", UserSchema);
