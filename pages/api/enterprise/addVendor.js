import Enterprise from '../../../models/Enterprise.js';
import Vendor from '../../../models/Vendor';
import connectDb from './../../../middleware/mongoose';

const handler = async (req, res) => {
  if (req.method === "POST") {
    const vendorPhone = req.body.phone;
    const enterprisePhone = req.body.enterprise_phone;

    try {
      const vendor = await Vendor.findOne({ phone: vendorPhone });

      if (!vendor) {
        return res.status(400).json({ err: "Vendor does not exist" });
      }

      const enterprise = await Enterprise.findOne({ phone: enterprisePhone });

      if (!enterprise) {
        return res.status(400).json({ err: "Enterprise does not exist" });
      }

      const isVendorAlreadyAdded = enterprise.employee.includes(vendor._id);

      if (isVendorAlreadyAdded) {
        return res.status(200).json({ err: "Vendor already added" });
      }

      enterprise.employee.push(vendor._id);
      await enterprise.save();

      return res.status(200).json({ success: "Vendor added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ err: "Internal server error" });
    }
  } else {
    return res.status(400).json({ err: "This method is not allowed" });
  }
};

export default connectDb(handler);
