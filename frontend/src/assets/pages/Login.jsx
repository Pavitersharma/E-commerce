import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const notify = () => toast("Login successful!");
  const showErrorToast = () => toast("User not found or invalid credentials");

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
        const res = await axios.post(
          "http://localhost:5000/api/v2/auth/login",
          values
        );

        console.log("Login data", res.data);
        
        if (res.data.success) {
          login(res.data.data, res.data.token);
          notify();
          resetForm();
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          showErrorToast();
        }
      } catch (error) {
        console.error(
          "Error",
          error.response ? error.response.data : error.message
        );
        toast.error(error.response?.data || error.message || "Login failed");
      }
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-300 p-10 rounded-md shadow-md w-full max-w-md">
        <Link
          to="/"
          className="text-3xl font-bold text-center mb-6 flex items-center justify-center"
        >
          LOGO
        </Link>

        {/* ✅ Formik Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-cyan-400`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className={`mt-1 w-full px-4 py-2 pr-10 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span
                onClick={togglePassword}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
         <div className="">
           <button
            type="submit"
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded"
          >
            Login
          </button> <ToastContainer />
         </div>
        </form>

        {/* Register link */}
        <p className="text-center text-sm mt-4">
          Don't Have An Account?{" "}
          <Link
            to="/register"
            className="text-cyan-600 font-medium cursor-pointer"
          >
            Register
          </Link>
        </p>

        {/* Google Login */}
        <div className="text-center text-sm text-gray-500 mt-4">
          OR CONTINUE WITH
        </div>
        <button className="w-full mt-3 border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100">
          <FaGoogle />
          <span className="text-sm font-medium">Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
