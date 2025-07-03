const Product = require("../models/product");

exports.categoryPage = async (req, res) => {
  const slug = req.params.slug;

  try {
    const products = await Product.find({ category: slug }); // Should return an array!

    res.render("products", {
      layout: "layout",
      title: `${slug} Products`,
      products: products || [], // Ensure fallback to empty array
    });

  } catch (err) {
    console.error("❌ Failed to fetch category products:", err);
    res.status(500).send("Server error while loading category products.");
  }
};
