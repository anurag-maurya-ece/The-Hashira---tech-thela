import Reviews from "../../models/Reviews";
import Vendor from "../../models/Vendor";
import connectDb from "../../middleware/mongoose";

// --- Lightweight NLP using compromise ---
let nlp;
try {
  nlp = require("compromise");
} catch (e) {
  nlp = null;
}

/**
 * Simple sentiment analyzer using keyword matching + compromise NLP.
 * Returns { score: -1 to 1, label: 'positive'|'negative'|'neutral' }
 */
function analyzeSentiment(text) {
  const lower = text.toLowerCase();

  const positiveWords = [
    "good", "great", "excellent", "amazing", "wonderful", "best", "love",
    "fantastic", "awesome", "fresh", "clean", "friendly", "nice", "perfect",
    "quality", "recommend", "happy", "satisfied", "superb", "tasty", "delicious",
  ];
  const negativeWords = [
    "bad", "worst", "terrible", "awful", "hate", "dirty", "rude", "poor",
    "expensive", "stale", "rotten", "disgusting", "horrible", "slow",
    "unhygienic", "cheated", "overpriced", "unhappy", "disappointed",
  ];

  let posCount = 0;
  let negCount = 0;
  positiveWords.forEach((w) => { if (lower.includes(w)) posCount++; });
  negativeWords.forEach((w) => { if (lower.includes(w)) negCount++; });

  const total = posCount + negCount;
  if (total === 0) return { score: 0, label: "neutral" };

  const score = (posCount - negCount) / total;
  const label = score > 0.2 ? "positive" : score < -0.2 ? "negative" : "neutral";
  return { score: Math.round(score * 100) / 100, label };
}

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { vendornumber, email, name, msg, rating } = req.body;

    if (!vendornumber || !email || !name || !msg) {
      return res.status(400).json({
        error: "vendornumber, email, name, and msg are required",
      });
    }

    try {
      // Run sentiment analysis on the review text
      const sentiment = analyzeSentiment(msg);

      const review = new Reviews({
        vendornumber,
        email,
        name,
        msg,
        rating: rating || 3,
        sentiment,
      });
      await review.save();

      // Update vendor's aggregate rating
      const allReviews = await Reviews.find({ vendornumber });
      const avgRating =
        allReviews.reduce((sum, r) => sum + (r.rating || 3), 0) /
        allReviews.length;

      await Vendor.findOneAndUpdate(
        { phone: Number(vendornumber) },
        {
          $set: {
            rating: Math.round(avgRating * 10) / 10,
            totalReviews: allReviews.length,
          },
        }
      );

      // --- REWARD: Award 10 credits for submitting a review ---
      const User = require("../../models/User").default;
      await User.findOneAndUpdate(
        { email },
        {
          $inc: { credit: 10 },
          $push: {
            creditHistory: {
              amount: 10,
              reason: "review",
              date: new Date(),
            },
          },
        }
      );

      res.status(200).json({
        success: true,
        message: "Review submitted! +10 credits earned 🎉",
        sentiment,
        vendorRating: Math.round(avgRating * 10) / 10,
        creditsEarned: 10,
      });
    } catch (error) {
      console.error("Review submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { vendornumber } = req.query;
    try {
      const filter = vendornumber ? { vendornumber } : {};
      const reviews = await Reviews.find(filter).sort({ createdAt: -1 }).limit(50);
      res.status(200).json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
