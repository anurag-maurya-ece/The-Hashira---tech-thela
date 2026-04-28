const mongoose = require("mongoose");

const PingSchema = new mongoose.Schema(
  {
    // Consumer who created the ping
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // What the consumer wants
    item: { type: String, required: true },       // e.g. "Onion"
    quantity: { type: String, required: true },    // e.g. "1 kg"
    notes: { type: String, default: "" },          // any extra details

    // Consumer's location at ping time
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // Ping lifecycle
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "expired", "cancelled"],
      default: "pending",
    },

    // Vendor who accepted the ping
    acceptedVendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },

    acceptedAt: { type: Date, default: null },

    // Search radius in meters (default 1km)
    radius: { type: Number, default: 1000 },

    // Auto-expire pending pings after 10 minutes
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: 0 }, // TTL index — MongoDB auto-deletes when expiresAt is reached
    },
  },
  { timestamps: true }
);

// 2dsphere index for proximity queries
PingSchema.index({ location: "2dsphere" });

mongoose.models = {};
export default mongoose.model("Ping", PingSchema);
