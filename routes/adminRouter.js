const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require("../utils/multer");
const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/products/add", isAdmin, adminController.getAddProductPage);
router.post("/products/add", isAdmin, upload.single("imageFile"), adminController.addProduct);

module.exports = router;
