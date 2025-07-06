const Product = require('../models/product');
const Category = require('../models/category');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.render("index", { products });
  } catch (err) {
    res.status(500).render("error", { message: "Failed to load products" });
  }
};


exports.adminProductPage = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    const categories = await Category.find(); // 👈 You need this to populate category dropdown

    res.render("admin/products", { products, categories });
  } catch (err) {
    console.error("Admin Product Page Error:", err);
    res.status(500).render("error", { message: "Failed to load admin product page" });
  }
};

