const express = require('express');
const router = express.Router();

// 🛡️ Middlewares
const { verifyUser } = require('../middlewares/auth');
const { addToCartValidator } = require('../middlewares/validators');
const { validationResult } = require('express-validator');

// 📦 Controllers
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity
} = require('../controllers/cartController');

const {
  checkoutPage,
  createOrder
} = require('../controllers/checkoutController');

// ✅ 1. Add to Cart with validation
router.post('/cart', verifyUser, addToCartValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: errors.array().map(e => e.msg)
    });
  }
  await addToCart(req, res);
});

// ✅ 2. Get Cart
router.get('/cart', verifyUser, getCart);

// ✅ 3. Remove item from cart
router.post('/cart/remove/:productId', verifyUser, removeFromCart);

// ✅ 4. Update cart item quantity
router.post('/cart/update/:productId', verifyUser, updateCartQuantity);

// ✅ 5. Proceed to Checkout Page
router.get('/checkout', verifyUser, checkoutPage);

// ✅ 6. Create Razorpay order
router.post('/create-order', verifyUser, createOrder);

module.exports = router;
