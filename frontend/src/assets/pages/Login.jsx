import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const notify = () => toast.success("Login successful! Welcome back.");
  const showErrorToast = () => toast.error("User not found or invalid credentials");

  // ✅ Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await API.post(
          "/api/v1/auth/login",
          values
        );

        console.log("Login data", res.data);

        if (res.data.success) {
          login(res.data.data, res.data.token);
          notify();
          resetForm();
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          showErrorToast();
        }
      } catch (error) {
        console.error(
          "Error",
          error.response ? error.response.data : error.message
        );
        toast.error(error.response?.data?.message || error.message || "Login failed");
      }
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFBF8] pt-20 px-4">
      <div className="bg-white border border-zinc-150 p-8 sm:p-10 rounded-3xl shadow-soft w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="font-display text-3xl font-bold text-primary tracking-tight hover:opacity-90 block"
          >
            BrandShut
          </Link>
          <p className="text-xs sm:text-sm text-zinc-550">Welcome back. Enter your credentials to access your account.</p>
        </div>

        {/* ✅ Formik Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              className={`w-full px-4 py-2.5 border ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-zinc-250 focus:border-primary"
                } rounded-xl focus:outline-none bg-zinc-50/10 text-sm transition-colors`}
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
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className={`w-full px-4 py-2.5 pr-10 border ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-zinc-250 focus:border-primary"
                  } rounded-xl focus:outline-none bg-zinc-50/10 text-sm transition-colors`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span
                onClick={togglePassword}
                className="absolute top-1/2 right-3.5 transform -translate-y-1/2 text-zinc-405 cursor-pointer hover:text-primary transition-colors text-sm"
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
              className="w-full py-3 bg-primary hover:bg-zinc-800 text-white font-semibold rounded-full text-sm transition shadow-sm"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Register link */}
        <p className="text-center text-xs sm:text-sm text-zinc-500 pt-2">
          New to BrandShut?{" "}
          <Link
            to="/register"
            className="text-primary font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
