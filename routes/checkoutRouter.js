const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/auth');

router.get('/checkout', verifyUser, require('../controllers/checkoutController').renderCheckoutPage);

module.exports = router;
