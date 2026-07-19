/**
 * Payment Routes
 * ──────────────
 * Defines API routes for the Razorpay payment flow.
 * All routes are protected by JWT authentication middleware.
 *
 * Routes:
 *   POST /api/v1/payment/create-order   → Create a Razorpay order
 *   POST /api/v1/payment/verify-payment → Verify payment & save order
 */

const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Create a new Razorpay order (returns order ID for frontend checkout)
router.post("/create-order", protect, createOrder);

// Verify payment signature and save order to database
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
