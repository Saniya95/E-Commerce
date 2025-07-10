const userModel = require('../models/usermodel');
const product = require('../models/product');

// ✅ Add to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const existingItem = user.cart.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity: Number(quantity) });
  }

  await user.save();
  res.status(200).json({ success: true, message: "Item added to cart" });
};

// ✅ Get cart page with populated products
exports.getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("cart.product");

    // calculate total
    const cartItems = user.cart || [];
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
    const delivery = 50;
    const total = subtotal + delivery;

    res.render("cart", {
      cartItems,
      subtotal,
      delivery,
      total,
      razorpayKeyId: process.env.rzp_test_b5DTwApoKioOxQ, // ✅ Pass it here
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error("❌ Error loading cart:", err);
    res.status(500).render("error", { message: "Failed to load cart" });
  }
};


// ✅ Remove from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();

  res.redirect('/cart');
};

// ✅ Update cart quantity
exports.updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const item = user.cart.find(i => i.product.toString() === productId);
  if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

  item.quantity = Number(quantity);
  await user.save();

  res.redirect('/cart');
};
