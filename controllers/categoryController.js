const Product = require("../models/product");
const Category = require("../models/category");

exports.categoryPage = async (req, res) => {
  const slug = req.params.slug;

  try {
    // 1. Find category by slug
    const categoryDoc = await Category.findOne({ slug });

    if (!categoryDoc) {
      return res.status(404).render("error", { message: "❌ Category not found" });
    }

    // 2. Find products with matching category ID
    const products = await Product.find({ category: categoryDoc._id });

    // 3. Render category page
    res.render("products/category-products", {
      layout: "layout",
      title: `${categoryDoc.name}`,
      products: products || [],
    });

  } catch (err) {
    console.error("❌ Failed to fetch category products:", err);
    res.status(500).render("error", { message: "Server error while loading category products." });
  }
};
