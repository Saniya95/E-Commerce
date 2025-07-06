const Product = require("../models/product");
const Category = require('../models/category');

// 👇 Get Add Product Page
const getAddProductPage = (req, res) => {
  res.render("admin/add-product", { title: "Add Product" });
};

// 👇 Create Product Handler (used in POST form)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, imageUrl } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      imagePath = imageUrl;
    }

    const categoryDoc = await Category.findOne({ slug: category.toLowerCase() });
    if (!categoryDoc) {
      return res.render("error", { message: "❌ Category not found" });
    }

    const newProduct = new Product({
      name,
      price,
      image: imagePath,
      description,
      category: categoryDoc._id,
      createdBy: req.user._id,
    });

    await newProduct.save();
    res.redirect('/'); // or res.redirect('/admin/products')
  } catch (err) {
    console.error("❌ Product Create Error:", err);
    res.status(500).render("error", { message: "Product creation failed" });
  }
};

module.exports = {
  createProduct,
  getAddProductPage
};
