const express = require("express");
const { productModel } = require("../models/product.model");
const router = express.Router();

// Get all products with filtering, search, and sorting
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, isFeatured } = req.query;
    let query = {};

    // Filter by featured
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Filter by categories (comma-separated or single)
    if (category) {
      const categories = category.split(",");
      query.category = { $in: categories };
    }

    // Search query
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let queryBuilder = productModel.find(query);

    // Sorting
    if (sort === "lowtohigh") {
      queryBuilder = queryBuilder.sort({ price: 1 });
    } else if (sort === "hightolow") {
      queryBuilder = queryBuilder.sort({ price: -1 });
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const products = await queryBuilder;

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID or bad request",
    });
  }
});

module.exports = router;
