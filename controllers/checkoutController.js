// controllers/checkoutController.js
const userModel = require('../models/usermodel');

exports.checkoutPage = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).render('error', { message: "User not found" });
    }

    const cart = user.cart;

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const delivery = 50;
    const total = subtotal + delivery;

    res.render("checkout", {
      title: "Checkout",
      cart,
      subtotal,
      delivery,
      total
    });

  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).render("error", { message: "Error loading checkout page." });
  }
};
