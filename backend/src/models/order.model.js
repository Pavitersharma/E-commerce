const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Card", "UPI", "COD", "Razorpay"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    // ─── Razorpay Payment Details (optional — only set for online payments) ──
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

exports.orderModel = Order;
