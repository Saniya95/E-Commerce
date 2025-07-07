const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require("express-ejs-layouts");
const userModel = require('./models/usermodel'); 
const bcrypt = require('bcryptjs');

// Connect DB
const connectDB = require("./config/mongoose");
connectDB();

// Models
const Product = require('./models/product');
const category = require('./models/category');

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layout'); // this refers to layout.ejs


// ✅ Middleware — Order Matters!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser()); // ✅ Must be above any route that accesses cookies

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// ✅ Make flash & user available globally in EJS views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded; // 👈 available in all views
    } catch (err) {
      req.user = null;
      res.locals.user = null;
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
});

// ✅ Routers — only once, and after cookieParser
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const cartRouter = require('./routes/cartRouter');
const paymentRouter = require('./routes/paymentRouter');
const categoryRouter = require('./routes/categoryRouter');
const adminRouter = require("./routes/adminRouter");
const staticRouter = require('./routes/staticRouter')
const checkoutRouter = require('./routes/checkoutRouter');


app.use('/categories', categoryRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use(cartRouter);
app.use('/', paymentRouter);
app.use("/admin", adminRouter);
app.use('/', staticRouter);
app.use('/', checkoutRouter);


// ✅ Home Page
app.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("index", { products });
  } catch (err) {
    console.error("Error loading homepage:", err);
    res.render("error", { message: "Homepage failed" });
  }
});




app.get('/signup', (req, res) => res.render('users/signup', { title: 'Signup' }));
app.get('/login', (req, res) => res.render('users/login', { title: 'Login' }));
app.get('/cart', (req, res) => res.render('cart', { title: 'Cart' }));
app.get('/forgot-password', (req, res) => res.render('users/forgot-password', { title: 'Forgot Password' }));
app.get('/reset-password', (req, res) => {
  const { email } = req.query;
  res.render('users/reset-password', { email, title: 'Reset Password' });
});

// ✅ Categories page
app.get('/categories', async (req, res) => {
  try {
    const categories = await category.find();
    res.render('categories', {
      categories,
      user: req.user || null,
      title: 'Categories'
    });
  } catch (err) {
    console.error("❌ Failed to load categories:", err);
    res.render('categories', { categories: [], user: null, title: 'Categories' });
  }
});

app.get('/create-test-user', async (req, res) => {
  try {
    const existing = await userModel.findOne({ email: "test@example.com" });
    if (existing) return res.send("✅ Test user already exists");

    const hashed = await bcrypt.hash("password123", 10);
    const user = await userModel.create({
      fullname: "Test User",
      email: "test@example.com",
      contact: "9999999999",
      password: hashed,
      location: "DemoCity",
      isVerified: true
    });

    res.send("✅ Test user created: " + user.email);
  } catch (err) {
    console.error("❌ Error creating user:", err.message);
    res.status(500).send("Error creating test user.");
  }
});

// ✅ Start Server
app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
