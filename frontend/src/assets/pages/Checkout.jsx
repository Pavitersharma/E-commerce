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
        theme: { color: "#2563eb" },

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
      <div className="bg-zinc-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl max-w-md w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-zinc-800 mb-2">Login Required</h2>
          <p className="text-zinc-500 mb-6">
            You must be logged in to proceed to checkout and place an order.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-zinc-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl max-w-md w-full text-center shadow-sm space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-xl font-bold text-zinc-800">Processing Your Order...</h2>
          <p className="text-zinc-500 text-sm">Please wait while we confirm your payment and secure your order.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-zinc-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl max-w-md w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-zinc-800 mb-2">Your Cart is Empty</h2>
          <p className="text-zinc-500 mb-6">
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/listing")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Step Stepper Header */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 max-w-lg mx-auto">
          <div
            className={`flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
              step >= 1 ? "text-blue-600" : "text-zinc-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs ${
                step > 1 ? "bg-blue-600 border-blue-600 text-white" : "border-blue-600"
              }`}
            >
              {step > 1 ? <FaCheckCircle size={14} /> : "1"}
            </span>
            Shipping
          </div>
          <FaChevronRight size={12} className="text-zinc-300" />
          <div
            className={`flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
              step >= 2 ? "text-blue-600" : "text-zinc-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs ${
                step > 2 ? "bg-blue-600 border-blue-600 text-white" : step === 2 ? "border-blue-600" : "border-zinc-300"
              }`}
            >
              {step > 2 ? <FaCheckCircle size={14} /> : "2"}
            </span>
            Payment
          </div>
          <FaChevronRight size={12} className="text-zinc-300" />
          <div
            className={`flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
              step >= 3 ? "text-blue-600" : "text-zinc-400"
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs border-zinc-300 ${
                step === 3 ? "border-blue-600" : ""
              }`}
            >
              3
            </span>
            Review
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Checkout Area */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* STEP 1: Shipping Address Form */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" /> Shipping Address
                </h2>
                <form onSubmit={addressForm.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. John Doe"
                      value={addressForm.values.name}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.name && addressForm.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.name}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Flat/House no, building, street, area"
                      value={addressForm.values.address}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.address && addressForm.errors.address && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">City</label>
                    <input
                      type="text"
                      name="city"
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. New Delhi"
                      value={addressForm.values.city}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.city && addressForm.errors.city && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">State</label>
                    <input
                      type="text"
                      name="state"
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Delhi"
                      value={addressForm.values.state}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.state && addressForm.errors.state && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Pincode (6 digits)</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 110001"
                      value={addressForm.values.pincode}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.pincode && addressForm.errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Mobile Number (10 digits)</label>
                    <input
                      type="text"
                      name="phone"
                      maxLength={10}
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 9876543210"
                      value={addressForm.values.phone}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.phone && addressForm.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{addressForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2 mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Payment Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" /> Choose Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Card Option */}
                  <label
                    className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition ${
                      paymentMethod === "Card" ? "border-blue-500 bg-blue-50/30" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Card"}
                        onChange={() => setPaymentMethod("Card")}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-sm text-zinc-800">Credit / Debit Card</span>
                    </span>
                    <span className="text-zinc-400 text-xs uppercase font-medium">Visa, MC, RuPay</span>
                  </label>

                  {/* UPI Option */}
                  <label
                    className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition ${
                      paymentMethod === "UPI" ? "border-blue-500 bg-blue-50/30" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-sm text-zinc-800">Google Pay / PhonePe / BHIM UPI</span>
                    </span>
                    <span className="text-zinc-400 text-xs uppercase font-medium">UPI Apps</span>
                  </label>

                  {/* COD Option */}
                  <label
                    className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition ${
                      paymentMethod === "COD" ? "border-blue-500 bg-blue-50/30" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-sm text-zinc-800">Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-zinc-400 text-xs uppercase font-medium">Cash/Card at door</span>
                  </label>
                </div>

                {/* Sub Forms for payment details */}
                {paymentMethod === "Card" && (
                  <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-6">
                    💳 You'll enter your card details securely via Razorpay's payment gateway in the next step.
                  </div>
                )}

                {paymentMethod === "UPI" && (
                  <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-6">
                    📱 You'll enter your UPI ID securely via Razorpay's payment gateway in the next step.
                  </div>
                )}

                {paymentMethod === "COD" && (
                  <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-6">
                    🤝 No payment details required. Simply place your order and pay when it arrives at your doorstep.
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 border border-zinc-300 text-zinc-700 font-semibold py-3 px-4 rounded-xl hover:bg-zinc-50 transition"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review Order & Place */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-zinc-800 mb-6 flex items-center gap-2">
                  <FaClipboardCheck className="text-blue-600" /> Review and Confirm
                </h2>

                <div className="space-y-6 text-sm mb-8">
                  {/* Address Summary */}
                  <div className="border border-zinc-200 rounded-xl p-4">
                    <h3 className="font-bold text-zinc-800 mb-2 uppercase text-xs tracking-wider text-zinc-400">
                      Deliver To:
                    </h3>
                    <p className="font-semibold text-zinc-800">{addressForm.values.name}</p>
                    <p className="text-zinc-600 mt-1">{addressForm.values.address}</p>
                    <p className="text-zinc-600">
                      {addressForm.values.city}, {addressForm.values.state} - {addressForm.values.pincode}
                    </p>
                    <p className="text-zinc-500 mt-2 font-medium">📞 {addressForm.values.phone}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-zinc-200 rounded-xl p-4">
                    <h3 className="font-bold text-zinc-800 mb-2 uppercase text-xs tracking-wider text-zinc-400">
                      Payment Method:
                    </h3>
                    <p className="font-semibold text-zinc-800">{paymentMethod}</p>
                    {paymentMethod === "Card" && (
                      <p className="text-zinc-500 mt-1">💳 Pay via Razorpay (Card)</p>
                    )}
                    {paymentMethod === "UPI" && <p className="text-zinc-500 mt-1">📱 Pay via Razorpay (UPI)</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/2 border border-zinc-300 text-zinc-700 font-semibold py-3 px-4 rounded-xl hover:bg-zinc-50 transition"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`w-1/2 font-bold py-3 px-4 rounded-xl transition shadow-md hover:shadow-lg ${
                      isProcessing
                        ? "bg-blue-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isProcessing ? "Processing..." : `Place Order (₹${total})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Preview */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 h-fit shadow-sm space-y-6">
            <h3 className="font-bold text-zinc-800 text-lg border-b border-zinc-100 pb-3">Items Summary</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cart.map((item) => {
                const itemKey = item._id || item.id;
                return (
                  <div key={itemKey} className="flex gap-3 items-center justify-between text-sm">
                    <div className="flex gap-3 items-center">
                      <img
                        src={getImageAsset(item.image)}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-zinc-50 border border-zinc-100 rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-zinc-800 line-clamp-1">{item.name}</h4>
                        <p className="text-zinc-400 text-xs font-medium">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-800">₹{item.price * item.qty}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
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
              <div className="border-t border-zinc-100 pt-3 flex justify-between font-bold text-base text-zinc-800">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
