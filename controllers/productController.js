const Product = require('../models/product');
const Category = require('../models/category');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, discount, categorySlug } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const categoryDoc = await Category.findOne({ slug: categorySlug });
    if (!categoryDoc) {
      return res.status(400).render("error", { message: "Category not found" });
    }

    const newProduct = new Product({
      name,
      price,
      image,
      description,
      discount,
      category: categoryDoc._id,
      createdBy: req.user._id,
    });

    await newProduct.save();
    res.redirect('/');
  } catch (err) {
    console.error("Product Create Error:", err);
    res.status(500).render("error", { message: "Product creation failed" });
  }
};



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.render("index", { products });
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).render("error", { message: "Error loading products" });
  }
};
