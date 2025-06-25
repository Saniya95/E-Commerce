const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();


const session = require('express-session');
const flash = require('connect-flash');


// Routers
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const cartRouter = require('./routes/cartRouter');

require('./config/mongoose');

// View engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

// ✅ Session + Flash — must be ABOVE routes
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// ✅ Make flash messages available in EJS views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ✅ Routes
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use(cartRouter);

// Pages
const Product = require('./models/product'); // make sure this path is correct

app.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // fetch from DB
    res.render('products', { products });  // ✅ pass to EJS
  } catch (err) {
    console.error("❌ Failed to load products:", err);
    res.render('products', { products: [] }); // fallback to empty list
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/forgot-password', (req, res) => {
  res.render('users/forgot-password'); // ejs file you'll create
});


app.get('/reset-password', (req, res) => {
  const { email } = req.query;
  res.render('users/reset-password', { email });
});


// Start server
app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
