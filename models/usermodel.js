const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullname: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  contact: String,
  password: String,

  isVerified: {
    type: Boolean,
    default: false
  },

  isAdmin: {
    type: Boolean,
    default: false     // ✅ Important!
  },

  otp: {
    code: String,
    expiresAt: Date
  },

  otpExpiry: Date,

  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],

  profilepic: { type: String },

   address: [
  {
    fullName: String,
    mobile: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }
],

});

module.exports = mongoose.model("user", userSchema);
