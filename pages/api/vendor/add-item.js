import connectDb from "../../../middleware/mongoose";
import Vendor from "../../../models/Vendor";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, item, quantity, unit, price } = req.body;

  if (!phone || !item || !quantity) {
    return res.status(400).json({ error: "Phone, item name, and quantity are required" });
  }

  try {
    const newItem = {
      item,
      quantity: Number(quantity),
      unit: unit || "kg",
      price: Number(price) || 0
    };

    const vendor = await Vendor.findOneAndUpdate(
      { phone: Number(phone) },
      { $push: { inventory: newItem } },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `${item} added successfully!`,
      inventory: vendor.inventory 
    });
  } catch (error) {
    console.error("Manual Add Error:", error);
    res.status(500).json({ error: "Server error while adding item" });
  }
};

export default connectDb(handler);
