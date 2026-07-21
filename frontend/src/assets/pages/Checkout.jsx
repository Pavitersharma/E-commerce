import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getImageAsset } from "../../utils/imageHelper";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FaCheckCircle, FaChevronRight, FaMapMarkerAlt, FaCreditCard, FaClipboardCheck } from "react-icons/fa";

const Checkout = () => {
  const { cart, getSubtotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Define ALL state and formik hooks at the top of the component
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address Validation Schema
  const addressSchema = Yup.object({
    name: Yup.string().required("Full Name is required").min(2, "Name too short"),
    address: Yup.string().required("Street Address is required").min(5, "Address too short"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Must be a valid 6-digit pincode"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number"),
  });

  const addressForm = useFormik({
    initialValues: {
      name: user?.name || "",
      address: user?.address || "",
      city: "",
      state: "",
      pincode: "",
      phone: user?.phone || "",
    },
    enableReinitialize: true,
    validationSchema: addressSchema,
    onSubmit: () => {
      setStep(2);
    },
  });

  // Totals calculations
  const subtotal = getSubtotal();
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  // ─── Helper: Dynamically load Razorpay Checkout script ──────────────────
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      // If already loaded, resolve immediately
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  // ─── Build order data payload (reused by both COD and Razorpay flows) ───
  const buildOrderData = () => ({
    items: cart.map((item) => ({
      productId: item._id || item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
    })),
    shippingAddress: addressForm.values,
    paymentMethod,
    totalAmount: total,
  });

  // ─── Handle Place Order (Card/UPI → Razorpay, COD → Direct) ─────────────
  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // ── COD Flow: Use existing order creation endpoint directly ──
      if (paymentMethod === "COD") {
        const orderData = buildOrderData();
        const res = await API.post("/api/v1/orders", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setOrderPlaced(true);
          clearCart();
          toast.success("Order Placed Successfully!");
          setTimeout(() => {
            navigate(`/order-success?orderId=${res.data.data.orderId}`);
          }, 1500);
        }
        return;
      }

      // ── Razorpay Flow (Card / UPI) ──────────────────────────────

      // Step 1: Load Razorpay Checkout script
      await loadRazorpayScript();

      // Step 2: Create Razorpay order on the backend
      const { data: orderRes } = await API.post(
        "/api/v1/payment/create-order",
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderRes.success) {
        toast.error("Failed to create payment order. Please try again.");
        return;
      }

      const { razorpayOrderId, keyId } = orderRes.data;

      // Step 3: Open Razorpay Checkout modal
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "BrandShut",
        description: "Order Payment",
        order_id: razorpayOrderId,
        prefill: {
          name: addressForm.values.name,
          contact: addressForm.values.phone,
          email: user?.email || "",
        },
        theme: { color: "#18181b" },

        // ── Payment Success Handler ──────────────────────────────
        handler: async (response) => {
          try {
            // Step 4: Verify payment on the backend
            const orderData = buildOrderData();
            const verifyRes = await API.post(
              "/api/v1/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...orderData,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setOrderPlaced(true);
              clearCart();
              toast.success("Payment Successful! Order Placed.");
              setTimeout(() => {
                navigate(`/order-success?orderId=${verifyRes.data.data.orderId}`);
              }, 1500);
            } else {
              toast.error("Payment verification failed. Contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error(
              err.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setIsProcessing(false);
          }
        },

        // ── Modal Dismissed / Payment Failed ─────────────────────
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled. You can retry anytime.");
          },
        },
      };

      const razorpayCheckout = new window.Razorpay(options);

      // Handle payment failure event
      razorpayCheckout.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
        setIsProcessing(false);
      });

      razorpayCheckout.open();
      return; // Don't reset isProcessing — the modal handlers will do it
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to place order. Try again."
      );
    } finally {
      // Only reset for COD flow (Razorpay resets in its own handlers)
      if (paymentMethod === "COD") {
        setIsProcessing(false);
      }
    }
  };

  // Protect Checkout Route - Conditional returns placed AFTER all hooks are defined
  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
        <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full text-center shadow-soft space-y-6">
          <div className="text-5xl">🔐</div>
          <h2 className="font-display text-2xl font-bold text-foreground">Login Required</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You must be logged in to proceed to checkout and place an order.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-full text-sm transition"
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
        <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full text-center shadow-soft space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <h2 className="font-display text-xl font-bold text-foreground">Processing Your Order...</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">Please wait while we confirm your payment and secure your order.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
        <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full text-center shadow-soft space-y-6">
          <div className="text-5xl">🛒</div>
          <h2 className="font-display text-2xl font-bold text-foreground">Your Cart is Empty</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/listing")}
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-full text-sm transition"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Step Stepper Header */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-10 max-w-lg mx-auto border border-border p-3 rounded-full bg-card shadow-soft">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold ${
              step >= 1 ? "text-foreground font-bold" : "text-muted-foreground"
            }`}
          >
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border text-xs transition-all duration-205 ${
                step > 1 ? "bg-primary border-primary text-primary-foreground" : "border-primary text-foreground"
              }`}
            >
              {step > 1 ? <FaCheckCircle size={12} /> : "1"}
            </span>
            Shipping
          </div>
          <FaChevronRight size={10} className="text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold ${
              step >= 2 ? "text-foreground font-bold" : "text-muted-foreground"
            }`}
          >
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border text-xs transition-all duration-205 ${
                step > 2 ? "bg-primary border-primary text-primary-foreground" : step === 2 ? "border-primary text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {step > 2 ? <FaCheckCircle size={12} /> : "2"}
            </span>
            Payment
          </div>
          <FaChevronRight size={10} className="text-muted-foreground" />
          <div
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold ${
              step >= 3 ? "text-foreground font-bold" : "text-muted-foreground"
            }`}
          >
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border text-xs border-border transition-all duration-205 ${
                step === 3 ? "border-primary text-foreground" : "text-muted-foreground"
              }`}
            >
              3
            </span>
            Review
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Main Checkout Area */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft">
            {/* STEP 1: Shipping Address Form */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <FaMapMarkerAlt className="text-foreground text-base" /> Shipping Details
                </h2>
                <form onSubmit={addressForm.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1.5 w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-foreground/30 bg-background transition-colors"
                      placeholder="e.g. John Doe"
                      value={addressForm.values.name}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.name && addressForm.errors.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.name}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      className="mt-1.5 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-zinc-50/10 transition-colors"
                      placeholder="e.g. Flat/House no, building, street, area"
                      value={addressForm.values.address}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.address && addressForm.errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">City</label>
                    <input
                      type="text"
                      name="city"
                      className="mt-1.5 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-zinc-50/10 transition-colors"
                      placeholder="e.g. New Delhi"
                      value={addressForm.values.city}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.city && addressForm.errors.city && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">State</label>
                    <input
                      type="text"
                      name="state"
                      className="mt-1.5 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-zinc-50/10 transition-colors"
                      placeholder="e.g. Delhi"
                      value={addressForm.values.state}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.state && addressForm.errors.state && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Pincode (6 digits)</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      className="mt-1.5 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-zinc-50/10 transition-colors"
                      placeholder="e.g. 110001"
                      value={addressForm.values.pincode}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.pincode && addressForm.errors.pincode && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Mobile Number</label>
                    <input
                      type="text"
                      name="phone"
                      maxLength={10}
                      className="mt-1.5 w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-zinc-50/10 transition-colors"
                      placeholder="e.g. 9876543210"
                      value={addressForm.values.phone}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.phone && addressForm.errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{addressForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-zinc-800 text-white font-semibold py-3.5 px-4 rounded-full transition-all duration-200 shadow-sm text-sm"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Payment Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <FaCreditCard className="text-primary text-base" /> Payment Method
                </h2>

                <div className="space-y-3.5">
                  {/* Card Option */}
                  <label
                    className={`flex items-center justify-between border p-4.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "Card" ? "border-primary bg-[#FCFBF8]" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Card"}
                        onChange={() => setPaymentMethod("Card")}
                        className="text-primary accent-primary"
                      />
                      <span className="font-semibold text-xs sm:text-sm text-primary">Credit / Debit Card</span>
                    </span>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Visa, Mastercard, RuPay</span>
                  </label>

                  {/* UPI Option */}
                  <label
                    className={`flex items-center justify-between border p-4.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "UPI" ? "border-primary bg-[#FCFBF8]" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="text-primary accent-primary"
                      />
                      <span className="font-semibold text-xs sm:text-sm text-primary">Google Pay / PhonePe / BHIM UPI</span>
                    </span>
                    <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">UPI Apps</span>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`flex items-center justify-between border p-4.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "COD" ? "border-primary bg-[#FCFBF8]" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-foreground accent-primary"
                      />
                      <span className="font-semibold text-xs sm:text-sm text-foreground">Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Cash at Door</span>
                  </label>
                </div>

                {/* Sub Forms for payment details */}
                {paymentMethod === "Card" && (
                  <div className="bg-secondary border border-border rounded-2xl p-4.5 text-xs sm:text-sm text-muted-foreground">
                    💳 You will enter your card details securely via Razorpay's payment gateway in the next step.
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="bg-secondary border border-border rounded-2xl p-4.5 text-xs sm:text-sm text-muted-foreground">
                    📱 You will enter your UPI ID securely via Razorpay's payment gateway in the next step.
                  </div>
                )}

                {paymentMethod === "COD" && (
                  <div className="bg-secondary border border-border rounded-2xl p-4.5 text-xs sm:text-sm text-muted-foreground">
                    🤝 No payment details required. Simply place your order and pay when it arrives at your doorstep.
                  </div>
                )}

                <div className="flex gap-3.5 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 border border-border text-foreground font-semibold py-3 px-4 rounded-full hover:border-foreground transition text-xs sm:text-sm shadow-sm bg-card"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-1/2 bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-full transition shadow-sm text-xs sm:text-sm"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review Order & Place */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <FaClipboardCheck className="text-foreground text-base" /> Review and Confirm
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Address Summary */}
                  <div className="border border-border rounded-2xl p-5 bg-card">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                      Deliver To:
                    </h3>
                    <p className="font-bold text-foreground text-sm">{addressForm.values.name}</p>
                    <p className="text-muted-foreground mt-1">{addressForm.values.address}</p>
                    <p className="text-muted-foreground">
                      {addressForm.values.city}, {addressForm.values.state} - {addressForm.values.pincode}
                    </p>
                    <p className="text-muted-foreground mt-3 font-semibold text-xs">📞 {addressForm.values.phone}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-border rounded-2xl p-5 bg-card">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                      Payment Method:
                    </h3>
                    <p className="font-bold text-foreground text-sm">{paymentMethod}</p>
                    {paymentMethod === "Card" && (
                      <p className="text-muted-foreground mt-1 text-xs">💳 Pay via Razorpay (Credit/Debit Card)</p>
                    )}
                    {paymentMethod === "UPI" && <p className="text-muted-foreground mt-1 text-xs">📱 Pay via Razorpay (UPI)</p>}
                  </div>
                </div>

                <div className="flex gap-3.5 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/2 border border-border text-foreground font-semibold py-3 px-4 rounded-full hover:border-foreground transition text-xs sm:text-sm shadow-sm bg-card"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`w-1/2 font-bold py-3 px-4 rounded-full transition text-xs sm:text-sm shadow-sm ${
                      isProcessing
                        ? "bg-secondary cursor-not-allowed text-muted-foreground"
                        : "bg-primary hover:opacity-90 text-primary-foreground"
                    }`}
                  >
                    {isProcessing ? "Processing..." : `Place Order (₹${total.toLocaleString("en-IN")})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Preview */}
          <div className="border border-border rounded-3xl p-6 bg-card h-fit shadow-soft space-y-6">
            <h3 className="font-display text-sm font-bold text-foreground border-b border-border pb-3">Items Summary</h3>
            <div className="max-h-60 overflow-y-auto space-y-3.5 pr-2 scrollbar-thin">
              {cart.map((item) => {
                const itemKey = item._id || item.id;
                return (
                  <div key={itemKey} className="flex gap-3.5 items-center justify-between text-xs sm:text-sm pb-2.5 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex gap-3 items-center">
                      <img
                        src={getImageAsset(item.image)}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-secondary border border-border/40 rounded-xl"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground line-clamp-1">{item.name}</h4>
                        <p className="text-muted-foreground text-xs font-semibold">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-xs uppercase tracking-wider">Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>Taxes (18% GST)</span>
                <span className="font-semibold text-foreground">₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-sm sm:text-base text-foreground">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
