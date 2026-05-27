const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, message: "Products fetched successfully", data: products.map((p) => p.toJSON()) });
  } catch (err) {
    console.error("getProducts error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, message: "Product fetched successfully", data: product.toJSON() });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, status } = req.body;

    if (!name || price === undefined || !category || !status) {
      return res.status(400).json({ success: false, message: "Name, price, category, and status are required" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: "Price must be a non-negative number" });
    }

    const newProduct = await Product.create({
      id: uuidv4(),
      name: name.trim(),
      price: parsedPrice,
      category,
      status,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true, message: "Product created successfully", data: newProduct.toJSON() });
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, status } = req.body;

    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, message: "Price must be a non-negative number" });
      }
      product.price = parsedPrice;
    }

    if (name) product.name = name.trim();
    if (category) product.category = category;
    if (status) product.status = status;
    product.updatedAt = new Date().toISOString();

    await product.save();
    return res.json({ success: true, message: "Product updated successfully", data: product.toJSON() });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, message: "Product deleted successfully", data: null });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
