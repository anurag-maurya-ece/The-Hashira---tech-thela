const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema(
  {
    vendornumber: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    msg: { type: String, required: true },

    // --- NEW: Star rating (1-5) ---
    rating: { type: Number, min: 1, max: 5, default: 3 },

    // --- NEW: NLP sentiment analysis result ---
    sentiment: {
      score: { type: Number, default: 0 },    // -1 (negative) to +1 (positive)
      label: {
        type: String,
        enum: ["positive", "negative", "neutral"],
        default: "neutral",
      },
    },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Reviews", ReviewsSchema);