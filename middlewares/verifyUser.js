const jwt = require('jsonwebtoken');

module.exports = function verifyUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    // ✨ Flash + redirect to homepage
    req.flash('error', '🔒 Login required to view cart.');
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user object
    next();
  } catch (err) {
    req.flash('error', '⚠️ Session expired. Please log in again.');
    return res.redirect('/');
  }
};
