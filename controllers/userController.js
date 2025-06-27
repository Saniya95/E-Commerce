const { validationResult } = require('express-validator');
const userModel = require('../models/usermodel');
const Product = require('../models/product'); // ✅ Corrected path and name
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebase/firebase-admin'); 


// 🔐 SIGNUP
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("users/signup", { error: "Validation failed" });
  }

  try {
    const { fullname, email, contact, location, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render("users/signup", { error: "email is  already registered" });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true });

    console.log("✅ Signup successful, redirecting to /");
    return res.render("/index", { success: "User registered successfully." });

  } catch (err) {
    console.error(err);
    return res.render("users/signup", { error: "Signup failed: " + err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("users/login", { error: "Validation failed" });
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.render("users/login", { error: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.render("users/login", { error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { httpOnly: true });

    // ✅ Fetch products before rendering index
    const products = await Product.find();

    console.log("✅ Login successful. Rendering home page.");
    return res.render("index", {
      success: "Login successful",
      products
    });

  } catch (err) {
    console.error(err);
    return res.render("users/login", {
      error: "Login failed: " + err.message
    });
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

// 🔐 Reset Password
exports.resetPassword = async (req, res) => {
  const { firebaseToken, newPassword, confirmPassword, email } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phone = decodedToken.phone_number;

    const user = await userModel.findOne({ contact: phone, email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this phone and email"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: "Reset failed: " + err.message });
  }
};
