const { validationResult } = require('express-validator');
const { success, error } = require('../utils/response');
const userModel = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebase/firebase-admin'); 


// 🔐 SIGNUP
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", "Validation failed");
    return res.redirect("/users/signup");
  }

  try {
    const { fullname, email, contact, location, password } = req.body;

    const existingUser = await userModel.findOne({ contact });
    if (existingUser) {
      req.flash("error", "Phone number already registered");
      return res.redirect("/users/signup");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullname,
      email,
      contact,
      location,
      password: hashed,
      isVerified: true
    });

    // ✅ Set JWT token after signup
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });

    console.log("✅ Signup successful, redirecting to /");
    req.flash("success", "User registered successfully.");
    return res.redirect("/");
    
  } catch (err) {
    console.error(err);
    req.flash("error", "Signup failed: " + err.message);
    return res.redirect("/users/signup");
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", "Validation failed");
    return res.redirect("/users/login");
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/users/login");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      req.flash("error", "Incorrect password");
      return res.redirect("/users/login");
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });
    req.flash("success", "Login successful");
    console.log("✅ Final redirect reached");
    return res.redirect("/");

  } catch (err) {
    console.error(err);
    req.flash("error", "Login failed: " + err.message);
    return res.redirect("/users/login");
  }
};

// 🔐 Firebase OTP Login
exports.firebaseLogin = async (req, res) => {
  const { firebaseToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;
    const user = await userModel.findOne({ contact: phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, { httpOnly: true });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: "Invalid Firebase token" });
  }
};

// 🔐 Forgot Password via Firebase OTP
exports.forgotPassword = async (req, res) => {
  res.render('users/forgot-password');
};

exports.resetPassword = async (req, res) => {
  const { firebaseToken, newPassword } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;
    const user = await userModel.findOne({ contact: phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: "Reset failed" });
  }
};
