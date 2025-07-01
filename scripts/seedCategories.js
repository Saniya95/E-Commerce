// scripts/seedCategories.js
const mongoose = require("mongoose");
const Category = require("../models/category");
mongoose.connect("mongodb://localhost:27017/yourDB");

Category.insertMany([
  { name: "Electronics", slug: "electronics", description: "Gadgets & devices" },
  { name: "Clothing", slug: "clothing", description: "Men & Women fashion" },
  { name: "Home Appliances", slug: "home-appliances", description: "Home essentials" }
]).then(() => {
  console.log("Categories inserted");
  mongoose.disconnect();
});
