import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageAsset } from "../../utils/imageHelper";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaBoxOpen, FaTruck, FaClock, FaCheckCircle, FaUndo, FaArrowRight } from "react-icons/fa";

const Orders = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/v1/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
        toast.error("Failed to load your order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl max-w-md w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-zinc-800 mb-2">Login Required</h2>
          <p className="text-zinc-500 mb-6">
            Please log in to view your orders and track delivery status.
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaClock size={10} /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaTruck size={10} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaCheckCircle size={10} /> Delivered
          </span>
        );
      default:
        return (
          <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <ToastContainer />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
          <FaBoxOpen className="text-blue-600" /> My Orders
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-zinc-800 mb-2">No orders yet</h2>
            <p className="text-zinc-500 text-sm mb-6">
              You haven't placed any orders yet. Let's find your first fashion item!
            </p>
            <Link
              to="/listing"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-md"
            >
              Start Shopping <FaArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Order Header */}
                <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      Order ID
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 font-mono">
                      {order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      Placed On
                    </p>
                    <p className="text-sm font-semibold text-zinc-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-base font-bold text-blue-600">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 divide-y divide-zinc-100">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageAsset(item.image)}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-zinc-50 border border-zinc-100 rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-zinc-800 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            Qty: {item.qty} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-zinc-700">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details footer summary */}
                <div className="bg-zinc-50/50 px-6 py-3 border-t border-zinc-100 flex flex-col sm:flex-row justify-between text-xs text-zinc-500 gap-2">
                  <p>
                    <span className="font-bold text-zinc-600">Shipping to:</span>{" "}
                    {order.shippingAddress.name}, {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                  <p>
                    <span className="font-bold text-zinc-600">Payment:</span>{" "}
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
