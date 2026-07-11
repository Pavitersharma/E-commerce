const express = require("express");
const { orderModel } = require("../models/order.model");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

// Helper to generate a unique readable order ID
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
};

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty",
      });
    }

    const order = await orderModel.create({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderId: generateOrderId(),
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get logged-in user's orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
