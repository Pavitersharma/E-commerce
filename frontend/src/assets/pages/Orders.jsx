import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageAsset } from "../../utils/imageHelper";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FaBoxOpen, FaTruck, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

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
        const res = await API.get("/api/v1/orders/my", {
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
      <div className="bg-white min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white border border-zinc-150 p-8 rounded-3xl max-w-md w-full text-center shadow-soft space-y-6">
          <div className="text-5xl">🔐</div>
          <h2 className="font-display text-2xl font-bold text-primary">Login Required</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Please log in to view your orders and track delivery status.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-full text-sm transition"
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
          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-750 border border-yellow-150 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaClock size={9} /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="flex items-center gap-1 bg-purple-50 text-purple-750 border border-purple-150 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaTruck size={9} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-150 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaCheckCircle size={9} /> Delivered
          </span>
        );
      default:
        return (
          <span className="bg-zinc-100 text-zinc-650 border border-zinc-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        
        {/* Header */}
        <div className="border-b border-zinc-100 pb-5 mt-8 mb-10">
          <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
            <FaBoxOpen className="text-primary text-2xl sm:text-3xl" /> My Orders
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Track shipping status and view invoice details of your purchases
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FCFBF8] rounded-3xl border border-zinc-150 p-8 sm:p-12 text-center max-w-md mx-auto shadow-soft space-y-6">
            <div className="text-5xl">📦</div>
            <h2 className="font-display text-2xl font-bold text-primary">No orders yet</h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
              You haven't placed any orders yet. Let's find your first fashion item!
            </p>
            <Link
              to="/listing"
              className="inline-flex items-center gap-2 bg-primary hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition shadow-sm"
            >
              Start Shopping <FaArrowRight size={10} className="text-zinc-300" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-soft transition-all hover:border-zinc-250"
              >
                {/* Order Header Grid */}
                <div className="bg-[#FCFBF8] border-b border-zinc-150 px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Order ID
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-primary font-mono mt-0.5 truncate">
                      {order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Placed On
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-700 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-sm sm:text-base font-bold text-primary mt-0.5">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex justify-start md:justify-end">{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 divide-y divide-zinc-100">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 first:pt-1 last:pb-1 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageAsset(item.image)}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-[#F6F6F6] border border-zinc-150/40 rounded-xl"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-primary line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-zinc-400 font-semibold">
                            Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details footer summary */}
                <div className="bg-[#FCFBF8]/40 px-6 py-3.5 border-t border-zinc-100 flex flex-col sm:flex-row justify-between text-xs text-zinc-500 gap-2 font-medium">
                  <p>
                    <span className="font-bold text-zinc-450 uppercase text-[10px] tracking-wider mr-1">Shipping:</span>{" "}
                    {order.shippingAddress.name}, {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                  <p className="shrink-0">
                    <span className="font-bold text-zinc-455 uppercase text-[10px] tracking-wider mr-1">Method:</span>{" "}
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
