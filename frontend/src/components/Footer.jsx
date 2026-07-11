import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const Footer = () => {
  return (
    <>
      <hr className="text-zinc-400 mt-5" />
      <div className="container mx-auto px-4 py-8 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h2 className="font-bold text-2xl">LOGO</h2>
            <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
              Your trusted partner for all home services. Professional,
              reliable, and convenient.
            </p>
            <div className="flex items-center gap-5 mt-5 text-zinc-600">
              <FaFacebook className="hover:text-blue-600 cursor-pointer transition" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer transition" />
              <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
              <FaYoutube className="hover:text-red-600 cursor-pointer transition" />
            </div>
          </div>

          {/* Fashion Column */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Fashion</h4>
            <ul className="text-zinc-500 space-y-2 text-sm">
              <li className="hover:text-zinc-800 cursor-pointer transition">Jeans</li>
              <li className="hover:text-zinc-800 cursor-pointer transition">Tshirt</li>
              <li className="hover:text-zinc-800 cursor-pointer transition">Shirts</li>
              <li className="hover:text-zinc-800 cursor-pointer transition">Caps</li>
              <li className="hover:text-zinc-800 cursor-pointer transition">Shoes</li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-left space-y-2">
            <h4 className="font-semibold text-black text-lg mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition">
                  Order Help
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Size & Fit Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Return & Exchange Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition">
                  Contact Fashion Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-black text-lg mb-3">Contact Us</h3>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <span>
                  <CiLocationOn />
                </span>
                <span>Delhi NCR, India</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <span>
                  <FaPhoneAlt />
                </span>
                <span>+91 8278010252</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <span>✉</span>
                <span>support@fashionhub.com</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black">Stay Updated</h4>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
                <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600 whitespace-nowrap text-sm flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-200 mt-8 pt-6 text-center text-xs text-zinc-400">
          © 2026 FashionHub. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Footer;
