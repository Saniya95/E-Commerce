// 📁 routes/cartRouter.js
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

// POST /cart - Add to cart with validator and error check
router.post('/cart', verifyUser, addToCartValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: errors.array().map(e => e.msg)
    });
  }
  await addToCart(req, res); // ✅ Correctly calls controller
});

// GET /cart - View cart
router.get('/cart', verifyUser, getCart);

// POST /cart/remove - Remove from cart
router.post('/cart/remove', verifyUser, removeFromCart);


router.post('/cart/update', verifyUser,updateCartQuantity );


module.exports = router;
