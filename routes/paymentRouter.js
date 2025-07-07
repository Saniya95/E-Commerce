const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const { checkoutPage, createOrder } = require("../controllers/paymentController");

router.get("/checkout", verifyUser, checkoutPage);
router.post("/create-order", verifyUser, createOrder);

module.exports = router;
