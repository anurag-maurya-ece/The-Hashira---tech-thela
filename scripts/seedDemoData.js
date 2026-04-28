const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Since models use 'export default', we define simplified schemas here for seeding via plain Node
const VendorSchema = new mongoose.Schema({
  firstName: String,
  phone: { type: Number, unique: true },
  password: { type: String, required: true },
  isuser: { type: Boolean, default: false },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [lng, lat]
  },
  isActive: { type: Boolean, default: false },
  inventory: [{ item: String, quantity: Number, unit: String, price: Number }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });
VendorSchema.index({ location: "2dsphere" });

const UserSchema = new mongoose.Schema({
  firstName: String,
  address: String,
  email: { type: String, unique: true },
  pincode: Number,
  password: { type: String, required: true },
  isuser: { type: Boolean, default: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
}, { timestamps: true });
UserSchema.index({ location: "2dsphere" });

const PingSchema = new mongoose.Schema({
  consumer: mongoose.Schema.Types.ObjectId,
  item: String,
  quantity: String,
  location: { type: { type: String, default: "Point" }, coordinates: [Number] },
  status: { type: String, default: "pending" },
}, { timestamps: true });

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Ping = mongoose.models.Ping || mongoose.model("Ping", PingSchema);

async function seed() {
  // Use environment variable for MongoDB connection. Do NOT hardcode credentials.
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tech-thela-dev';

  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB...");

    // Clear existing data
    await Vendor.deleteMany({});
    await User.deleteMany({});
    await Ping.deleteMany({});
    console.log("Cleared existing data.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // CP, Delhi coordinates
    const cpLng = 77.2197;
    const cpLat = 28.6328;

    // 1. Create Vendors
    const vendors = [
      {
        firstName: "Ram Kumar",
        phone: 9876543210,
        password: hashedPassword,
        isActive: true,
        location: { type: "Point", coordinates: [cpLng + 0.001, cpLat + 0.001] },
        inventory: [
          { item: "Onion", quantity: 20, unit: "kg", price: 40 },
          { item: "Tomato", quantity: 15, unit: "kg", price: 60 },
          { item: "Potato", quantity: 30, unit: "kg", price: 30 },
          { item: "Ginger", quantity: 5, unit: "kg", price: 120 },
        ],
        rating: 4.8,
        totalReviews: 24,
      },
      {
        firstName: "Suresh Cart",
        phone: 9876543211,
        password: hashedPassword,
        isActive: true,
        location: { type: "Point", coordinates: [cpLng - 0.002, cpLat + 0.001] },
        inventory: [
          { item: "Apple", quantity: 10, unit: "kg", price: 180 },
          { item: "Banana", quantity: 12, unit: "dozen", price: 60 },
          { item: "Orange", quantity: 8, unit: "kg", price: 100 },
        ],
        rating: 4.5,
        totalReviews: 12,
      },
      {
        firstName: "Anita Veggies",
        phone: 9876543212,
        password: hashedPassword,
        isActive: true,
        location: { type: "Point", coordinates: [cpLng + 0.002, cpLat - 0.001] },
        inventory: [
          { item: "Spinach", quantity: 10, unit: "bundle", price: 20 },
          { item: "Carrot", quantity: 15, unit: "kg", price: 50 },
          { item: "Broccoli", quantity: 5, unit: "kg", price: 150 },
        ],
        rating: 4.9,
        totalReviews: 30,
      },
      {
        firstName: "Rahul Fruit Stall",
        phone: 9876543213,
        password: hashedPassword,
        isActive: true,
        location: { type: "Point", coordinates: [cpLng - 0.001, cpLat - 0.002] },
        inventory: [
          { item: "Grapes", quantity: 10, unit: "kg", price: 120 },
          { item: "Mango", quantity: 20, unit: "kg", price: 200 },
        ],
        rating: 4.2,
        totalReviews: 8,
      },
      {
        firstName: "Mohit General Store",
        phone: 9876543214,
        password: hashedPassword,
        isActive: true,
        location: { type: "Point", coordinates: [cpLng + 0.003, cpLat + 0.002] },
        inventory: [
          { item: "Milk", quantity: 20, unit: "liters", price: 60 },
          { item: "Bread", quantity: 15, unit: "packets", price: 40 },
        ],
        rating: 4.6,
        totalReviews: 18,
      }
    ];

    await Vendor.insertMany(vendors);
    console.log(`Inserted ${vendors.length} vendors.`);

    // 2. Create Consumers
    const consumers = [
      {
        firstName: "Demo Consumer",
        email: "consumer@demo.com",
        address: "Connaught Place, Delhi",
        pincode: 110001,
        password: hashedPassword,
        location: { type: "Point", coordinates: [cpLng, cpLat] },
      },
      {
        firstName: "Guest User",
        email: "guest@techthela.ai",
        address: "Janpath, Delhi",
        pincode: 110001,
        password: hashedPassword,
        location: { type: "Point", coordinates: [cpLng + 0.0005, cpLat - 0.0005] },
      },
      {
        firstName: "Test Consumer",
        email: "testconsumer@example.com",
        address: "Barakhamba Road, Delhi",
        pincode: 110001,
        password: hashedPassword,
        location: { type: "Point", coordinates: [cpLng - 0.0005, cpLat + 0.0005] },
      }
    ];

    await User.insertMany(consumers);
    console.log(`Inserted ${consumers.length} consumers.`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
