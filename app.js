const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require("express-ejs-layouts");

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


app.use('/categories', categoryRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use(cartRouter);
app.use('/', paymentRouter);



// ✅ Pages
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products }); // ✅ Only render here
  } catch (err) {
    console.error("❌ Failed to load products:", err);
    res.render('index', { products: [] });
  }
});

app.get('/signup', (req, res) => res.render('users/signup'));
app.get('/login', (req, res) => res.render('users/login'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/forgot-password', (req, res) => res.render('users/forgot-password'));
app.get('/reset-password', (req, res) => {
  const { email } = req.query;
  res.render('users/reset-password', { email });
});

// ✅ Categories page
app.get('/categories', async (req, res) => {
  try {
    const categories = await category.find();
    res.render('categories', {
      categories,
      user: req.user || null
    });
  } catch (err) {
    console.error("❌ Failed to load categories:", err);
    res.render('categories', { categories: [], user: null });
  }
});

app.get('/testplain', (req, res) => {
  res.send('Plain text test');
});

// ✅ Start Server
app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
