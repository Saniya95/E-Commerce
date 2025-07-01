const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  description: { type: String, default: "No description provided." },

  // ✅ Category reference
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  bgcolour: String,
  panelcolour: String,
  textcolour: String,
  gallery: [String],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("product", productSchema);
