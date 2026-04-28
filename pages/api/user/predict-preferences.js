import User from "../../../models/User";
import connectDb from "../../../middleware/mongoose";

/**
 * ML Preference Prediction Engine
 * Rule-based prediction initially — maps family demographics to buying habits.
 * Can be replaced with a TF.js model once enough training data is collected.
 */
function predictPreferences(familySize, youngestAge, oldestAge) {
  const categories = [];
  let frequency = "2x/week";

  // Family size affects volume
  if (familySize >= 5) {
    frequency = "daily";
    categories.push("vegetables", "rice", "cooking oil");
  } else if (familySize >= 3) {
    frequency = "3x/week";
    categories.push("vegetables", "fruits");
  } else {
    frequency = "2x/week";
    categories.push("fruits", "snacks");
  }

  // Age-based preferences
  if (youngestAge && youngestAge < 10) {
    categories.push("milk", "snacks", "biscuits");
  }
  if (oldestAge && oldestAge > 50) {
    categories.push("medicines", "dry fruits");
  }
  if (youngestAge >= 15 && oldestAge <= 35) {
    categories.push("fast food", "beverages", "ice cream");
  }

  // Deduplicate
  const unique = [...new Set(categories)];

  return {
    predictedFrequency: frequency,
    preferredCategories: unique,
  };
}

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, familySize, youngestAge, oldestAge } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    try {
      const predictions = predictPreferences(
        Number(familySize) || 2,
        Number(youngestAge) || 20,
        Number(oldestAge) || 40
      );

      let user = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            preferences: {
              ...predictions,
              familySize: Number(familySize) || 2,
              youngestAge: Number(youngestAge) || 20,
              oldestAge: Number(oldestAge) || 40,
            },
          },
        },
        { new: true, upsert: true } // Use upsert: true to create if not exists
      );

      res.status(200).json({
        success: true,
        message: "Preferences predicted and saved!",
        preferences: user.preferences,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
