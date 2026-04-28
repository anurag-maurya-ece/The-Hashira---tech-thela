import connectDb from "../../../middleware/mongoose";
import Vendor from "../../../models/Vendor";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, items } = req.body;

  if (!phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Phone and an array of items are required" });
  }

  try {
    const formattedItems = items.map(item => ({
      item: item.item,
      quantity: Number(item.quantity) || 1,
      unit: item.unit || "piece",
      price: Number(item.price) || 0
    }));

    // Update vendor inventory by pushing the new items
    const vendor = await Vendor.findOneAndUpdate(
      { phone: Number(phone) },
      { $push: { inventory: { $each: formattedItems } } },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `Successfully added ${formattedItems.length} items to inventory!`,
      inventory: vendor.inventory 
    });
  } catch (error) {
    console.error("Bulk Add Error:", error);
    res.status(500).json({ error: "Server error while adding items" });
  }
};

export default connectDb(handler);
