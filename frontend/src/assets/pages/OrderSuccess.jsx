import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaUser } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId") || "ORD-XXXXXX";

  return (
    <div className="bg-white min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 sm:p-12 shadow-soft space-y-6">
          {/* Animated checkmark icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-zinc-50 p-4 border border-zinc-100">
              <FaCheckCircle className="text-primary text-5xl sm:text-6xl animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-primary">Order Confirmed</h1>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
              Thank you for shopping with BrandShut. Your order has been placed successfully and is currently being processed.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-2.5 inline-block font-mono text-zinc-650 text-xs sm:text-sm">
            Order Reference: <span className="font-bold text-primary">{orderId}</span>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              to="/orders"
              className="w-full bg-primary hover:bg-zinc-800 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-200 text-xs sm:text-sm shadow-sm"
            >
              <FaUser size={12} className="text-zinc-300" /> View My Orders
            </Link>
            <Link
              to="/listing"
              className="w-full border border-zinc-200 text-zinc-700 font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:border-primary transition-all duration-200 text-xs sm:text-sm bg-white"
            >
              <FaShoppingBag size={12} className="text-zinc-400" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
