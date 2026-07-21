import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaTruck } from "react-icons/fa";

const Cart = () => {
  const { cart, updateQty, removeFromCart, getSubtotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = 0; // Free delivery
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  // Free shipping progress indicator (e.g. free shipping above 1499)
  const freeShippingThreshold = 1499;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="border-b border-border pb-5 mt-8 mb-10">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-1">
            Review your selections and proceed to checkout
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-secondary border border-border rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-6 shadow-soft">
            <div className="text-5xl">🛒</div>
            <h2 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Looks like you haven't added anything to your cart yet. Discover our premium summer collection.
            </p>
            <Link
              to="/listing"
              className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-sm"
            >
              Start Shopping <FaArrowRight size={10} className="text-zinc-300" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* Left Column: Cart items */}
            <div className="space-y-6">
              
              {/* Shipping progress indicator */}
              <div className="border border-border p-5 rounded-3xl bg-background space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground">
                  <FaTruck className="text-primary text-base" />
                  {remainingForFreeShipping > 0 ? (
                    <span>Add <strong className="text-foreground">₹{remainingForFreeShipping}</strong> more for free express shipping!</span>
                  ) : (
                    <span className="text-green-600 font-bold">🎉 You qualify for free express shipping!</span>
                  )}
                </div>
                <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-305" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cart.map((item) => {
                  const itemKey = item._id || item.id;
                  return (
                    <div
                      key={itemKey}
                      className="border border-border rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 bg-card transition-all hover:shadow-soft"
                    >
                      {/* Product details info link */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={getImageAsset(item.image)}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-secondary border border-border/40 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">{item.name}</h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{item.brand || item.category}</p>
                          <p className="text-foreground font-bold text-sm sm:text-base mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      {/* Controls (quantity adjustment & delete) */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-border rounded-full overflow-hidden h-9 bg-card">
                          <button
                            onClick={() => updateQty(itemKey, item.qty - 1)}
                            className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="px-3.5 font-bold text-xs sm:text-sm text-foreground">{item.qty}</span>
                          <button
                            onClick={() => updateQty(itemKey, item.qty + 1)}
                            className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right hidden sm:block min-w-[90px]">
                          <p className="font-bold text-foreground text-base">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="p-2.5 text-zinc-450 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          title="Remove item"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Pricing Summary Card */}
            <div className="border border-border rounded-3xl p-6 bg-card h-fit shadow-soft space-y-6">
              <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3">Order Summary</h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Shipping</span>
                  <span className="text-green-650 font-semibold uppercase tracking-wider text-xs">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Taxes (18% GST)</span>
                  <span className="font-semibold text-foreground">₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-border my-4 pt-4 flex justify-between font-bold text-sm sm:text-base text-foreground">
                  <span>Order Total</span>
                  <span className="text-lg">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow transition duration-200 text-xs sm:text-sm"
              >
                Proceed to Checkout <FaArrowRight size={10} className="text-zinc-300" />
              </button>

              <div className="text-center">
                <Link to="/listing" className="text-xs font-semibold text-muted-foreground hover:text-foreground underline transition-colors">
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