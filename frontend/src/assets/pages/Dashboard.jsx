import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaBox, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";

const Dashboard = () => {
  const { user, token, logout, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch recent orders
  useEffect(() => {
    if (!token) return;

    const fetchRecentOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await API.get("/api/v1/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          // Take top 3 orders
          setRecentOrders(res.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching recent orders", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchRecentOrders();
  }, [token]);

  const profileSchema = Yup.object({
    name: Yup.string().required("Name is required").min(2, "Name too short"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number").nullable(),
    address: Yup.string().min(5, "Address too short").nullable(),
  });

  const profileForm = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        const res = await API.put("/api/v1/auth/me", values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          updateUser(res.data.data);
          toast.success("Profile updated successfully!");
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Profile update failed", error);
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="border-b border-border pb-5 mb-8 sm:mb-10">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">My Account</h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-1">
            Manage your personal profile and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-10">
          
          {/* Left Column: Sidebar Profile Details */}
          <div className="space-y-6">
            <div className="border border-border rounded-3xl p-6 text-center bg-card shadow-soft">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-lg font-bold text-foreground mt-4">{user.name}</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">Account Member</p>
              
              <div className="border-t border-border mt-6 pt-6 flex flex-col gap-3.5 text-left text-xs sm:text-sm text-foreground/80 font-medium">
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaPhone className="text-muted-foreground flex-shrink-0" />
                  <span>{user.phone || "No phone added"}</span>
                </p>
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{user.address || "No shipping address added"}</span>
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-card border border-border hover:border-foreground text-foreground font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition text-xs sm:text-sm shadow-sm cursor-pointer"
                >
                  <FaEdit size={12} className="text-muted-foreground" /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full border border-transparent hover:border-rose-200 text-rose-600 hover:bg-rose-50/50 font-semibold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition text-xs sm:text-sm cursor-pointer"
                >
                  <FaSignOutAlt size={12} className="text-rose-400" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="space-y-8">
            
            {/* Edit Profile Form Panel */}
            {isEditing && (
              <div className="border border-border rounded-3xl p-6 sm:p-7 bg-card shadow-soft">
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground border-b border-border pb-3 mb-5">Update Profile Details</h3>
                <form onSubmit={profileForm.handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full border border-border focus:border-foreground/30 bg-background rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                      value={profileForm.values.name}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.name && profileForm.errors.name && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{profileForm.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Number (10 digits)</label>
                    <input
                      type="text"
                      name="phone"
                      maxLength={10}
                      className="w-full border border-border focus:border-foreground/30 bg-background rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                      placeholder="e.g. 9876543210"
                      value={profileForm.values.phone}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.phone && profileForm.errors.phone && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{profileForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full border border-border focus:border-foreground/30 bg-background rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none transition-colors"
                      placeholder="e.g. Apartment, Building, Area, Pincode"
                      value={profileForm.values.address}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.address && profileForm.errors.address && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{profileForm.errors.address}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-primary hover:opacity-90 text-primary-foreground font-semibold py-2.5 px-6 rounded-full text-xs sm:text-sm transition shadow-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-border text-foreground/80 hover:border-foreground font-semibold py-2.5 px-6 rounded-full text-xs sm:text-sm transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recent Orders Panel */}
            <div className="border border-border rounded-3xl p-6 sm:p-7 bg-card shadow-soft">
              <div className="flex justify-between items-center border-b border-border pb-3 mb-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <FaBox className="text-foreground text-sm" /> Recent Orders
                </h3>
                <Link to="/orders" className="text-xs sm:text-sm font-semibold text-foreground underline hover:opacity-80 transition-opacity">
                  View All Orders
                </Link>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-4 bg-secondary/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground text-xs sm:text-sm">You haven't placed any orders yet.</p>
                  <Link
                    to="/listing"
                    className="inline-flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold py-2.5 px-6 rounded-full transition shadow-sm text-xs cursor-pointer"
                  >
                    <FaShoppingBag size={10} className="text-primary-foreground/60" /> Explore Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-border rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-foreground/30 transition bg-background"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase font-mono">
                          {order.orderId}
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-base font-bold text-foreground">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                            order.status === "Processing"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : order.status === "Shipped"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;