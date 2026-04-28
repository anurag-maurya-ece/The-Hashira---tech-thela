const mongoose = require("mongoose");
const Vendor = require("./Vendor");


const EnterpriseSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false},
    phone: {type:Number, required: true, unique:true},
    password: { type: String, required: true },
    // isuser: {type:Boolean, default:false},
    employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  },{timestamps: true});

  mongoose.models = {};
  export default mongoose.model("Enterprise", EnterpriseSchema);



// //   
// const mongoose = require("mongoose");

// // Define the schema
// const enterpriseSchema = new mongoose.Schema({
//   firstName: { type: String, required: false },
//   phone: { type: Number, required: true, unique: true },
//   password: { type: String, required: true },
//   isuser: { type: Boolean, default: false },
//   employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
// }, { timestamps: true });

// // Create the model
// const Enterprise = mongoose.model("Enterprise", enterpriseSchema);

// // Export the model
// module.exports = Enterprise;
