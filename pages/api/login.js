import Vendor from "../../models/Vendor";

import connectDb from "../../middleware/mongoose";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { type, phone, password } = req.body;

    if (type === "vendor") {
      // Vendor login
      var vendor = await Vendor.findOne({ phone });

      if (!vendor) {
        const hashedPassword = await bcrypt.hash(password, 12);
        vendor = new Vendor({
          phone,
          password: hashedPassword,  // Assuming you hash the password before saving it
        });
  
        await vendor.save();
  
        res.status(200).json({ message: "New vendor added successfully" });
        // res.status(400).json({ error: "Vendor not found" });

        return vendor;
      }

      const isPasswordValid = await bcrypt.compare(password, vendor.password);

      if (!isPasswordValid) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      res.status(200).json({ success: "Vendor login successful" });
    } 
}; }

export default connectDb(handler);

