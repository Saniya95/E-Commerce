const express = require('express');
const router = express.Router();
const { signup, login, firebaseLogin, forgotPassword, resetPassword } = require('../controllers/userController');
const { signupValidator, loginValidator } = require('../middlewares/validators');

router.get('/signup', (req, res) => res.render('signup'));
router.get('/login', (req, res) => res.render('login'));
router.get('/forgot-password', forgotPassword);

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/firebase-login', firebaseLogin);
router.post('/reset-password', resetPassword);

module.exports = router;
