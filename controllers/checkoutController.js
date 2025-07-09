// controllers/checkoutController.js
const userModel = require('../models/usermodel');

exports.checkoutPage = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).render('error', { message: "User not found" });

    const cart = user.cart;

    const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const delivery = 50;
    const total = subtotal + delivery;

    res.render("checkout", { cart, subtotal, delivery, total,  razorpayKeyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("❌ Checkout Error:", err);
    res.status(500).render("error", { message: "Failed to load checkout page" });
  }
};

exports.createOrder = (req, res) => {
  // TODO: Implement order creation logic
  res.json({ success: true, message: "Order created (placeholder)" });
};

