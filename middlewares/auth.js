const jwt = require('jsonwebtoken');
const SECRET = "yourSecretKey";
const { validationResult } = require('express-validator');
const { registerValidator, loginValidator } = require('../middlewares/validators');
const { success, error } = require('../utils/response');
const userModel = require('../models/usermodel');

exports.verifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ attach user to request
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// middlewares/auth.js
exports.verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    req.flash('error', '⛔ Admin access only');
    return res.redirect('/');
  }
  next();
};

