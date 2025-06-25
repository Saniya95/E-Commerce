const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');
const { verifyUser, verifyAdmin } = require('../middlewares/auth');
const Product = require('../models/product');

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('index', { products }); // sending products to EJS
});

module.exports = router;
