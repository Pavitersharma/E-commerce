/**
 * Payment Controller
 * ------------------
 * Handles Razorpay payment flow:
 *   1. createOrder  — Creates a Razorpay order and returns the order ID + key
 *   2. verifyPayment — Verifies the payment signature, saves the order, decrements stock
 *
 * SECURITY:
 *   - Signature verification uses crypto.createHmac (HMAC SHA256)
 *   - Secret key is never sent to the client
 *   - All routes require authentication (JWT via auth.middleware)
 */

const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const { orderModel } = require("../models/order.model");
const { productModel } = require("../models/product.model");

// ─── Helper: Generate a unique readable order ID ────────────────────────────
const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
};

// ─── 1. Create Razorpay Order ───────────────────────────────────────────────
/**
 * POST /api/v1/payment/create-order
 * Body: { amount: Number (in INR) }
 *
 * Creates a Razorpay order and returns the order ID so the frontend
 * can open the Razorpay Checkout modal.
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // --- Validate amount ---
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be a positive number.",
      });
    }

    // --- Create Razorpay order ---
    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // --- Return order details to frontend ---
    res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID, // Public key only — safe to send
      },
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order. Please try again.",
    });
  }
};

// ─── 2. Verify Payment & Save Order ─────────────────────────────────────────
/**
 * POST /api/v1/payment/verify-payment
 * Body: {
 *   razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *   items, shippingAddress, paymentMethod, totalAmount
 * }
 *
 * Steps:
 *   1. Verify Razorpay signature using HMAC SHA256
 *   2. Save the order to MongoDB with payment details
 *   3. Decrement product stock for each ordered item
 *   4. Return the saved order
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    // --- Validate required fields ---
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details.",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty.",
      });
    }

    if (!shippingAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Shipping address and total amount are required.",
      });
    }

    // --- Step 1: Verify Razorpay Signature ---
    // The expected signature is HMAC SHA256 of "razorpay_order_id|razorpay_payment_id"
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — possible tampering
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // --- Step 2: Save order to MongoDB ---
    const order = await orderModel.create({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "Razorpay",
      totalAmount,
      orderId: generateOrderId(),
      paymentStatus: "Completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    // --- Step 3: Decrement product stock ---
    // Uses bulkWrite for atomic, efficient stock updates
    const stockUpdates = items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -(item.qty || 1) } },
      },
    }));

    await productModel.bulkWrite(stockUpdates);

    // --- Step 4: Return success response ---
    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed. Please contact support.",
    });
  }
};
