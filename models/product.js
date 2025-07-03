const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String, // can be file or URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
