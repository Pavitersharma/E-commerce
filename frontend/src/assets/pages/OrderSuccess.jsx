import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaUser } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId") || "ORD-XXXXXX";

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          {/* Animated checkmark icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-50 p-4">
              <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-zinc-900">Order Placed!</h1>
            <p className="text-zinc-500 text-sm">
              Thank you for shopping with us. Your order has been placed successfully and is being processed.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 inline-block font-mono text-zinc-700 text-sm">
            Order ID: <span className="font-bold text-zinc-900">{orderId}</span>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              to="/orders"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
            >
              <FaUser size={14} /> View My Orders
            </Link>
            <Link
              to="/listing"
              className="w-full border border-zinc-300 text-zinc-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-50 transition"
            >
              <FaShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
