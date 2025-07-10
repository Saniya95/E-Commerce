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

    res.render("checkout", { cart, subtotal, 
      delivery,
      total, 
      razorpayKey: process.env.rzp_test_b5DTwApoKioOxQ, addresses: user.address || [],
    });

     } catch (err) {
    console.error("❌ Checkout Error:", err);
    res.status(500).render("error", { message: "Failed to load checkout page" });
  }
};

exports.createOrder = (req, res) => {
  // TODO: Implement order creation logic
  res.json({ success: true, message: "Order created (placeholder)" });
};

exports.saveAddress = async (req, res) => {
  const userId = req.user._id;

  // ✅ Convert checkbox value to actual Boolean
  const isDefault = req.body.isDefault === "on";

  const newAddress = {
    fullName: req.body.fullName,
    mobile: req.body.mobile,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    isDefault, // ✅ fixed boolean
  };

  try {
    const user = await userModel.findById(userId);

    // ✅ If this is marked as default, remove existing default flags
    if (isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    user.address.push(newAddress);
    await user.save();

    res.redirect("/checkout");
  } catch (err) {
    console.error("❌ Error saving address:", err);
    res.status(500).send("Failed to save address");
  }
};
