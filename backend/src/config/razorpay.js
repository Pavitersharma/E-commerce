/**
 * Razorpay Configuration
 * ---------------------
 * Creates and exports a singleton Razorpay instance using
 * credentials from environment variables. This file is imported
 * by the payment controller to interact with the Razorpay API.
 *
 * SECURITY: The secret key is never exposed to the frontend.
 */

const Razorpay = require("razorpay");

// Validate that required env vars are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "⚠️  RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables. " +
      "Payment features will not work."
  );
}

// Create Razorpay instance with API credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
