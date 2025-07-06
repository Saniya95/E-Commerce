const { validationResult } = require('express-validator');
const userModel = require('../models/usermodel');
const Product = require('../models/product');
const orderModel = require('../models/ordermodel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../firebase/firebase-admin');
const path = require('path');
const fs = require('fs');

// 🔐 SIGNUP
exports.signup = async (req, res) => {
    errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("users/signup", { error: "Validation failed" });
  }

  try {
    const { fullname, email, contact, location, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render("users/signup", { error: "Email is already registered" });
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

    const products = await Product.find();
    return res.render("index", { products, success: "User registered successfully." });

  } catch (err) {
    console.error(err);
    return res.render("users/signup", { error: "Signup failed: " + err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password); // ✅ Step 1: Log input

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.render("users/login", { error: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      console.log("Password mismatch");
      return res.render("users/login", { error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { httpOnly: true });

    console.log("Login successful, redirecting to /");
    req.flash("success", "Login successful");
    return res.redirect("/");

  } catch (err) {
    console.error("❌ Login Error: ", err);
    return res.render("users/login", { error: "Login failed" });
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


// 🔐 Profile Page
exports.profilePage = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    // 👇 log for debug (optional)
    console.log("Is Admin:", user.isAdmin);

    res.render("users/profile", {
      user: user, // ✅ pass full user object
      orders: user.orders || [],
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    req.flash("error", "Profile load failed");
    return res.redirect("/");
  }
};






// 🔓 LOGOUT
  exports.logout = (req, res) => {
  res.clearCookie('token'); // remove JWT token cookie
  req.flash('success', 'You have been logged out.');
  res.redirect('/login');
};

exports.getEditProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.render('users/edit-profile', { user });
  } catch (err) {
    console.error("❌ Error loading edit profile page:", err);
    res.redirect('/users/profile');
  }
};

// Handle Profile Update
exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const { fullname, contact, location } = req.body;

    // Check for new image
    if (req.file) {
      // Optional: Delete old image
      if (user.profilepic && user.profilepic !== 'default-user.png') {
        const oldPath = path.join(__dirname, '../public/uploads', user.profilepic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilepic = req.file.filename;
    }

    user.fullname = fullname;
    user.contact = contact;
    user.location = location;

    await user.save();
    req.flash('success', 'Profile updated successfully.');
    res.redirect('/users/profile');
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    req.flash('error', 'Failed to update profile.');
    res.redirect('/users/edit-profile');
  }
};