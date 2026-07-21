import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../utils/api";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const notify = () => toast.success("Registration successful! Welcome, redirecting to sign in...");

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await API.post(
          "/api/v1/auth/register",
          values
        );

        console.log("Server response:", res.data);
        notify();
        resetForm(); // clear input fields
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        toast.error(error.response?.data?.message || error.message || "Registration failed");
      }
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20 px-4">
      <div className="bg-card border border-border p-8 sm:p-10 rounded-3xl shadow-soft w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="font-display text-3xl font-extrabold text-foreground tracking-tight hover:opacity-90 block"
          >
            BrandShut
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground">Create an account to start shopping premium collections.</p>
        </div>

        {/* ✅ Formik Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-2.5 border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-border focus:border-foreground/30"
              } rounded-xl focus:outline-none bg-background text-sm transition-colors`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              className={`w-full px-4 py-2.5 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-border focus:border-foreground/30"
              } rounded-xl focus:outline-none bg-background text-sm transition-colors`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                className={`w-full px-4 py-2.5 pr-10 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-zinc-250 focus:border-primary"
                } rounded-xl focus:outline-none bg-zinc-50/10 text-sm transition-colors`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span
                onClick={togglePassword}
                className="absolute top-1/2 right-3.5 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full text-sm transition shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-foreground font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
