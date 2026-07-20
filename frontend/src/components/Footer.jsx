import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="bg-zinc-50 border-t border-zinc-100 mt-20">
        <div className="container mx-auto px-4 py-16 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="font-display text-2xl text-primary font-bold tracking-tight">
                BrandShut
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                BrandShut is a modern e-commerce platform offering premium shopping experiences with secure payments and fast delivery.
              </p>
              <div className="flex items-center gap-4 text-zinc-400">
                <a href="#" className="hover:text-primary transition-colors duration-200">
                  <FaFacebook size={18} />
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-200">
                  <FaTwitter size={18} />
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-200">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-200">
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>

            {/* Collection Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Shop Collections</h4>
              <ul className="space-y-2.5 text-zinc-500 text-sm">
                <li>
                  <Link to="/listing?category=shirt" className="hover:text-primary transition-colors">Shirts</Link>
                </li>
                <li>
                  <Link to="/listing?category=jeans,trousers" className="hover:text-primary transition-colors">Jeans & Trousers</Link>
                </li>
                <li>
                  <Link to="/listing?category=shoes" className="hover:text-primary transition-colors">Shoes</Link>
                </li>
                <li>
                  <Link to="/listing?category=accessories" className="hover:text-primary transition-colors">Accessories</Link>
                </li>
              </ul>
            </div>

            {/* Customer Support Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Customer Care</h4>
              <div className="space-y-3 text-zinc-500 text-sm">
                <div className="flex items-start gap-2.5">
                  <CiLocationOn className="text-lg text-zinc-400 mt-0.5 shrink-0" />
                  <span>Delhi NCR, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FaPhoneAlt className="text-zinc-400 shrink-0" />
                  <span>+91 8278010252</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-400 shrink-0 text-base">✉</span>
                  <span>support@brandshut.com</span>
                </div>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Stay Updated</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Subscribe to receive special offers, new launches, and styling tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-full focus:outline-none focus:border-primary text-sm bg-white"
                />
                <button className="px-6 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-zinc-800 transition-colors whitespace-nowrap text-sm flex-shrink-0 shadow-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-zinc-200/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
            <p>© 2026 BrandShut. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
