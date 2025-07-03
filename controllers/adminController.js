const Product = require("../models/product");

exports.getAddProductPage = (req, res) => {
  res.render("admin/add-product", { title: "Add Product" });
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    let imagePath = "";

    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    } else if (imageUrl) {
      imagePath = imageUrl;
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: imagePath,
    });

    await product.save();
    req.flash("success", "Product added successfully!");
    res.redirect("/admin/products/add");
  } catch (err) {
    console.error("❌ Error adding product:", err);
    req.flash("error", "Failed to add product");
    res.redirect("/admin/products/add");
  }
};
