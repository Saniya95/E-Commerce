const mongoose = require('mongoose');
const config = require("config");

const dbgr = require("debug")("development:mongoose");

mongoose.connect("mongodb://localhost:27017/E-Commerce", {
  // remove deprecated options if using MongoDB 4+
});

module.exports = mongoose.connection;
