const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyUser = require('../middlewares/verifyUser');
const { signupValidator, loginValidator } = require('../middlewares/validators');
const User = require('../models/usermodel'); // ✅ correct path
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

// GET routes
router.get('/signup', (req, res) => res.render('signup'));
router.get('/login', (req, res) => res.render('login'));
router.get('/forgot-password', userController.forgotPassword);
router.get('/profile', verifyUser, userController.profilePage);
router.get('/edit-profile', verifyUser, userController.getEditProfile);

// POST routes
router.post('/signup', signupValidator, userController.signup);
router.post('/login', loginValidator, userController.login);
router.post('/firebase-login', userController.firebaseLogin);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logout);
router.post('/edit-profile', verifyUser, upload.single('profilepic'), userController.updateProfile);


// ✅ Login middleware (you can move it to a separate file later)
function ensureAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

// ✅ /users/profile route
router.get('/profile', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.render('users/profile', { user });
  } catch (err) {
    console.log("❌ Error fetching user:", err);
    res.redirect('/');
  }
});

module.exports = router;


module.exports = router;
