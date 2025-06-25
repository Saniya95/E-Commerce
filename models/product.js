const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, 
  required: true },

  image: String,

  price: { type: Number, 
  required: true },

  discount: { type: Number,
  default: 0 },

  description: { type: String, 
  default: "No description provided." },

  category: { type: String,
  default: "Luxury Bag" },

  bgcolour: String,

  panelcolour: String,

  textcolour: String,
  
  gallery: [String],// Array of image URLs (can be Cloudinary or local)


  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Add this
});


module.exports = mongoose.model("product", productSchema);
