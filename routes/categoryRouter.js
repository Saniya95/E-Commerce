const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const categoryController = require("../controllers/categoryController");

router.get("/:slug", categoryController.categoryPage);

// ✅ Show your hardcoded category page
router.get('/', (req, res) => {
  res.render('categories'); // keep your hardcoded EJS
});

// ✅ Show products under the clicked category (based on slug)
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    // optional: check if category exists in DB (or just skip this)
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).render('error', { message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id });
    res.render('categories/products-by-category', {
      title: `${category.name} - Products`,
      category,
      products
    });
  } catch (err) {
    console.error("❌ Error loading category page:", err);
    res.status(500).render('error', { message: 'Failed to load category products' });
  }
});

module.exports = router;
