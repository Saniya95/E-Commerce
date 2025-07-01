// routes/paymentRouter.js
const express = require('express');
const router = express.Router();

// Show payment selection page
router.get('/payment', (req, res) => {
  res.render('payment', { title: "Payment Method" });
});

// Handle form submission (confirm page)
router.post('/payment/confirm', (req, res) => {
  const { method } = req.body;
  // Optional: Save payment method to DB or session if needed
  res.render('payment-success', { title: "Order Success", method });
});

module.exports = router;
