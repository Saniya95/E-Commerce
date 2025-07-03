const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  req.flash('success', 'Message sent successfully!');
  res.redirect('/contact');
});


module.exports = router;
