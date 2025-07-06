const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require("../utils/multer");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");

// Show the Add Product form
router.get("/products/add", verifyUser, verifyAdmin, adminController.getAddProductPage);

// Handle form submission
router.post(
 "/add-product",
  verifyUser,
  verifyAdmin,
  upload.single("imageFile"),
  adminController.createProduct
);

module.exports = router;
