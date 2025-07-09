// routes/checkoutRouter.js
const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/auth');
const { checkoutPage } = require('../controllers/checkoutController');

// GET /checkout
router.get('/checkout', verifyUser, checkoutPage);

module.exports = router;
