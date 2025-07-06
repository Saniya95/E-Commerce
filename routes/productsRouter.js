const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");
const upload = require("../utils/multer"); // ✅ required

// GET Add Product Page
router.get("/add-product", verifyUser, verifyAdmin, adminController.getAddProductPage);

// POST Add Product Form
router.post(
  "/add-product",
  verifyUser,
  verifyAdmin,
  upload.single("imageFile"),
  adminController.createProduct
);

module.exports = router;
