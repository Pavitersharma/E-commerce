import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";

const Footer = () => {
  return (
    <>
      <hr  className="text-zinc-400 mt-5"/>
      <div className="container mx-auto p-10">
        <div className="flex items-center justify-between ">
          <div className="">
            <h2 className="font-bold text-2xl ">LOGO</h2>
            <p className="text-zinc-500 mt-5">
              Your trusted partner for all home services. <br /> Professional,
              reliable, and convenient.
            </p>
            <div className="flex items-center gap-5 mt-5">
              <FaFacebook />
              <FaTwitter />
              <FaInstagram />
              <FaYoutube />
            </div>
          </div>
          <div className="">
            <h4 className="font-semibold text-xl">Fashion</h4>
            <ul className="text-zinc-500">
              <li>Jeans</li>
              <li>Tshirt</li>
              <li>Shirts</li>
              <li>Caps</li>
              <li>Shoes</li>
            </ul>
          </div>

          <div class="text-left space-y-2">
            <h4 class="font-semibold text-black">Support</h4>
            <ul class="space-y-1 text-sm text-gray-600">
              <li>
                <a href="#" class="hover:text-black">
                  Order Help
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-black">
                  Size & Fit Guide
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-black">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-black">
                  Return & Exchange Policy
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-black">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-black">
                  Contact Fashion Support
                </a>
              </li>
            </ul>
          </div>

          <div class="max-w-xs space-y-4 text-sm text-gray-700">
            <div>
              <h3 class="font-semibold text-black">Contact Us</h3>
              <div class="flex items-center gap-2 mt-2 text-gray-500">
                <span>
                  <CiLocationOn />
                </span>
                <span>Delhi NCR, India</span>
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <span>
                  <FaPhoneAlt />
                </span>
                <span>+91 8278010252</span>
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <span> </span>
                <span>support@fashionhub.com</span>
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-black">Stay Updated</h4>
              <div class="flex mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button class="px-4 py-2 bg-blue-500 text-white font-medium rounded-r-md hover:bg-blue-600">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
