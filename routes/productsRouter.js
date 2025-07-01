const express = require('express');
const router = express.Router();

const upload = require('../utils/multer');
const { createProduct, getProducts } = require('../controllers/productController');
const { verifyUser, verifyAdmin } = require('../middlewares/auth');
const Category = require('../models/category');

// 🛍️ Show All Products on Home or Product Page
router.get('/', getProducts);

// ➕ Add Product Form Page (GET)
router.get('/add', verifyAdmin, async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('products/add', { categories }); // ✅ Ensure you have views/products/add.ejs
  } catch (err) {
    res.status(500).render('error', { message: 'Error loading form' });
  }
});

// ➕ Handle Product Submission (POST)
router.post('/add', verifyAdmin, upload.single('image'), createProduct);

module.exports = router;
