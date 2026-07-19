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
  const notify = () => toast("Registration successful! Redirecting to login...");

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

        console.log(" Server response:", res.data);
        notify();
        resetForm(); // clear input fields
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error(
          " Error:",
          error.response ? error.response.data : error.message
        );
        toast.error(error.response?.data || error.message || "Registration failed");
      }
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
      <div className="bg-white border border-gray-300 p-6 sm:p-10 rounded-md shadow-md w-full max-w-md">
        {/* Logo / Home Link */}
        <Link
          to="/"
          className="text-3xl font-bold text-center mb-6 flex items-center justify-center"
        >
          BrandShut
        </Link>

        <p className="text-center text-gray-500 mt-1">Create an account</p>

        {/* ✅ Formik Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className={`mt-1 w-full px-4 py-2 border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-cyan-400`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

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
              Register
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-5">
          Already Have An Account?{" "}
          <Link
            to="/login"
            className="text-cyan-600 font-medium cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
