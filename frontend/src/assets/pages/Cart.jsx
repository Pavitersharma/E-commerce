import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from "react-icons/fa";

const Cart = () => {
  const { cart, updateQty, removeFromCart, getSubtotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = 0; // Free delivery
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 sm:mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 mb-6">
              Looks like you haven't added anything to your cart yet. Let's find some amazing deals!
            </p>
            <Link
              to="/listing"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md"
            >
              Start Shopping <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.map((item) => {
                const itemKey = item._id || item.id;
                return (
                  <div
                    key={itemKey}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={getImageAsset(item.image)}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-xl bg-zinc-50 border border-zinc-100 flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-semibold text-zinc-800 text-base line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-zinc-400 font-medium uppercase mt-0.5">{item.brand || item.category}</p>
                        <p className="text-blue-600 font-bold text-base mt-1">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Qty Controls & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(itemKey, item.qty - 1)}
                          className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-4 font-semibold text-sm text-zinc-800">{item.qty}</span>
                        <button
                          onClick={() => updateQty(itemKey, item.qty + 1)}
                          className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <div className="text-right hidden sm:block min-w-[80px]">
                        <p className="font-bold text-zinc-800 text-base">₹{item.price * item.qty}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(itemKey)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Remove item"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 h-fit shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-zinc-800 border-b border-zinc-100 pb-3">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Taxes (18% GST)</span>
                  <span className="font-medium text-zinc-800">₹{tax}</span>
                </div>
                <div className="border-t border-zinc-100 my-4 pt-4 flex justify-between font-bold text-base text-zinc-800">
                  <span>Order Total</span>
                  <span className="text-blue-600 text-lg">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition duration-200"
              >
                Proceed to Checkout <FaArrowRight size={14} />
              </button>

              <div className="text-center">
                <Link to="/listing" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;