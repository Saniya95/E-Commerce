const productModel = require('../models/product');

exports.createProduct = async (req, res) => {
    const {name, price, discount, image, bgcolour, tesxtcolour } = req.body;
    const product = await productModel.create({name, price, discount, image, bgcolour, tesxtcolour})
      res.status(201).json(product);
};

exports.getProducts = async (req,res) => {
    const product = await productModel.find();
    res.json(product);
}