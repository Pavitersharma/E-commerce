import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImageAsset } from "../../utils/imageHelper";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FaBoxOpen, FaTruck, FaClock, FaCheckCircle, FaArrowRight, FaLock, FaShoppingBag } from "react-icons/fa";

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
      <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-card border border-border p-8 sm:p-10 rounded-3xl max-w-md w-full text-center shadow-soft space-y-6">
          <div className="w-16 h-16 bg-secondary text-foreground rounded-full flex items-center justify-center text-2xl mx-auto border border-border/60">
            <FaLock />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Sign In to View Orders</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Please sign in with your account to view your past orders, invoices, and real-time delivery status.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-primary hover:opacity-90 text-primary-foreground font-semibold py-3 px-4 rounded-full text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              Sign In to Your Account
            </button>
            <Link
              to="/listing"
              className="block w-full border border-border hover:border-foreground/40 text-foreground font-semibold py-3 px-4 rounded-full text-xs sm:text-sm transition bg-card"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaClock size={9} /> Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaTruck size={9} /> Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FaCheckCircle size={9} /> Delivered
          </span>
        );
      default:
        return (
          <span className="bg-secondary text-foreground/80 border border-border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        
        {/* Header */}
        <div className="border-b border-border pb-5 mb-8 sm:mb-10">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FaBoxOpen className="text-foreground text-xl sm:text-2xl" /> My Orders
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-1">
            Track shipping status and view invoice details of your purchases
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border p-8 sm:p-12 text-center max-w-md mx-auto shadow-soft space-y-6 my-6">
            <div className="w-16 h-16 bg-secondary text-foreground rounded-full flex items-center justify-center text-2xl mx-auto border border-border/60">
              <FaShoppingBag />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">No Orders Yet</h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                You haven't placed any orders yet. Discover our latest collections and start shopping!
              </p>
            </div>
            <div>
              <Link
                to="/listing"
                className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs sm:text-sm px-7 py-3 rounded-full transition shadow-sm cursor-pointer"
              >
                Start Shopping <FaArrowRight size={10} className="text-primary-foreground/70" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft transition-all hover:border-foreground/30"
              >
                {/* Order Header Grid */}
                <div className="bg-secondary/40 border-b border-border px-6 py-4.5 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Order ID
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-foreground font-mono mt-0.5 truncate">
                      {order.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Placed On
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground/80 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex justify-start md:justify-end">{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 divide-y divide-border/60">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageAsset(item.image)}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-secondary border border-border/40 rounded-xl p-1"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-foreground line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground font-semibold">
                            Qty: {item.qty} × ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-foreground">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details footer summary */}
                <div className="bg-secondary/20 px-6 py-3.5 border-t border-border flex flex-col sm:flex-row justify-between text-xs text-muted-foreground gap-2 font-medium">
                  <p>
                    <span className="font-bold text-muted-foreground/80 uppercase text-[10px] tracking-wider mr-1">Shipping:</span>{" "}
                    {order.shippingAddress.name}, {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </p>
                  <p className="shrink-0">
                    <span className="font-bold text-muted-foreground/80 uppercase text-[10px] tracking-wider mr-1">Method:</span>{" "}
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
