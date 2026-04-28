const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    pincode: { type: Number, required: false },
    phone: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    isuser: { type: Boolean, default: false },
    credit: { type: Number, default: 0 },
    cart: { type: Array, default: null },

    // --- NEW: Geolocation (GeoJSON Point for $nearSphere queries) ---
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

    // --- NEW: Live status ---
    isActive: { type: Boolean, default: false },
    socketId: { type: String, default: null },

    // --- NEW: Structured inventory (populated by AI cart scan) ---
    inventory: [
      {
        item: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        unit: { type: String, default: "kg" },
        price: { type: Number, default: 0 },
      },
    ],

    // --- NEW: Aggregated rating (computed from reviews) ---
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    // --- Vendor subscription plan ---
    subscriptionPlan: {
      type: String,
      enum: ["daily", "monthly", "yearly", null],
      default: null,
    },
    subscriptionLabel: { type: String, default: "" },
    subscriptionAmount: { type: Number, default: 0 },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "expired"],
      default: "inactive",
    },
    subscriptionStartedAt: { type: Date, default: null },
    subscriptionExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// 2dsphere index for geofencing / proximity queries
VendorSchema.index({ location: "2dsphere" });

mongoose.models = {};
export default mongoose.model("Vendor", VendorSchema);
