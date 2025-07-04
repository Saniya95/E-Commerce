// controllers/cartController.js
const userModel = require('../models/usermodel');
const product =  require('../models/product'); // ✅ registers the Product model if not already

// controllers/cartController.js

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

  // ✅ IMPORTANT: Respond with JSON (so Toastify can show message)
  res.status(200).json({ success: true, message: "Item added to cart" });
};

// ✅ Updated getCart for EJS rendering
exports.getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('cart.product');
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    const cartItems = user.cart;
    res.render('cart', {
      title: "Your Cart",          // ✅ TITLE IS PASSED HERE
      cartItems                    // ✅ YOUR CART DATA
    });
  } catch (err) {
    console.error("Cart Error:", err);
    res.status(500).render('error', { message: 'Something went wrong while loading the cart.' });
  }
};


exports.removeFromCart = async (req, res) => {
  const { productId } = req.params; // ✅ use req.params instead of req.body
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();

  // 🔁 Redirect or send success response
  res.redirect('/cart'); // ✅ or send JSON if it's an API
};


exports.updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params; // ✅ get from route param

  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const item = user.cart.find(i => i.product.toString() === productId);
  if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

  item.quantity = Number(quantity);
  await user.save();

  res.redirect('/cart'); // or res.status(200).json({ success: true });
};
