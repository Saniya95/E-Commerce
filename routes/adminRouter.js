const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require("../utils/multer");
const { verifyUser } = require("../middlewares/auth");

// Show Add Product Form
router.get("/products/add", verifyUser, adminController.getAddProductPage);

// Handle Form Submission
router.post(
  "/add-product",
  verifyUser,
  upload.single("image"),
  adminController.createProduct
);

module.exports = router;
