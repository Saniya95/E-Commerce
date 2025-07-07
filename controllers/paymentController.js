const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.checkoutPage = async (req, res) => {
  const user = await userModel.findById(req.user.id).populate("cart.product");

  const cart = user.cart;
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = 50;
  const total = subtotal + delivery;

  res.render("checkout", { cart, subtotal, delivery, total });
};

exports.createOrder = async (req, res) => {
  const totalAmount = req.body.total; // should be sent from frontend

  const options = {
    amount: totalAmount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: "order_rcptid_" + new Date().getTime(),
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
