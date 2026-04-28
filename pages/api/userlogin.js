
import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { type, email , password } = req.body;

  if (type === "user") {
      // User login
      const user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      res.status(200).json({ success: "User login successful" });
    } else {
      res.status(400).json({ error: "Invalid login type" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
