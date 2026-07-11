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
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          
          {/* Left Column: Sidebar Profile Details */}
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-zinc-800 mt-4">{user.name}</h2>
              <p className="text-sm text-zinc-400 font-medium">Customer</p>
              
              <div className="border-t border-zinc-100 mt-6 pt-6 flex flex-col gap-3 text-left text-sm text-zinc-600">
                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaPhone className="text-zinc-400 flex-shrink-0" />
                  <span>{user.phone || "Add Phone Number"}</span>
                </p>
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{user.address || "Add Shipping Address"}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaEdit size={14} /> Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="space-y-6">
            
            {/* Edit Profile Form Panel */}
            {isEditing && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-800 border-b border-zinc-100 pb-3 mb-4">Update Profile Details</h3>
                <form onSubmit={profileForm.handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-600">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profileForm.values.name}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.name && profileForm.errors.name && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-600">Mobile Number (10 digits)</label>
                    <input
                      type="text"
                      name="phone"
                      maxLength={10}
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 9876543210"
                      value={profileForm.values.phone}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.phone && profileForm.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-600">Default Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      className="mt-1 w-full border border-zinc-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="e.g. Apartment, Building, Area, Pincode"
                      value={profileForm.values.address}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                    />
                    {profileForm.touched.address && profileForm.errors.address && (
                      <p className="text-red-500 text-xs mt-1">{profileForm.errors.address}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-md"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-zinc-300 text-zinc-600 font-semibold py-2.5 px-6 rounded-xl hover:bg-zinc-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Recent Orders Panel */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                  <FaBox className="text-blue-600" /> Recent Orders
                </h3>
                <Link to="/orders" className="text-sm font-semibold text-blue-600 hover:underline">
                  View All Orders
                </Link>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-500 text-sm mb-4">You haven't ordered anything yet.</p>
                  <Link
                    to="/listing"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition shadow-md text-sm"
                  >
                    <FaShoppingBag size={12} /> Explore Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-zinc-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-200 transition"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400 font-semibold uppercase font-mono">
                          {order.orderId}
                        </p>
                        <p className="text-sm font-bold text-zinc-800">
                          {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-base font-bold text-blue-600">
                          ₹{order.totalAmount}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                            order.status === "Processing"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : order.status === "Shipped"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-green-50 text-green-700 border-green-200"
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