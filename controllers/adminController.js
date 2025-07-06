const Product = require("../models/product");
const Category = require('../models/category');

// 👇 Get Add Product Page with categories
const getAddProductPage = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from DB
    res.render("admin/add-product", {
      title: "Add Product",
      categories, // Pass categories to EJS
    });
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).render("error", { message: "Error loading add product page" });
  }
};

// 👇 Create Product Handler (used in POST form)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, categorySlug, imageUrl } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      imagePath = imageUrl;
    }

    const categoryDoc = await Category.findOne({ slug: categorySlug.toLowerCase() });
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
    res.redirect('/');
  } catch (err) {
    console.error("❌ Product Create Error:", err);
    res.status(500).render("error", { message: "Product creation failed" });
  }
};

module.exports = {
  getAddProductPage,
  createProduct
};
