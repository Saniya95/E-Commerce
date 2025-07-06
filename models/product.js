const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: String,          // for URL input
  imageFile: String,         // for Multer upload
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
