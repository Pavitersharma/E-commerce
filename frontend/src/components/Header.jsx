import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserAlt, FaBars, FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartCount = getCartCount();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/listing?search=${e.target.value}`);
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="text-2xl sm:text-3xl text-black font-bold flex-shrink-0">
              LOGO
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm">
              <Link to="/listing?category=shirt" className="hover:text-blue-600 transition">Shirts</Link>
              <Link to="/listing?category=jeans,trousers" className="hover:text-blue-600 transition">Jeans & Trousers</Link>
              <Link to="/listing?category=shoes" className="hover:text-blue-600 transition">Shoes</Link>
              <Link to="/listing?category=accessories" className="hover:text-blue-600 transition">Accessories</Link>
            </nav>
            
            {/* Desktop Search */}
            <div className="hidden md:flex border border-gray-300 items-center rounded px-2 py-0.5">
              <CiSearch />
              <input
                type="text"
                placeholder='Search for "Shirts"'
                onKeyDown={handleSearchKeyPress}
                className="font-semibold rounded-xl outline-none px-3 py-2 text-sm bg-transparent w-40 lg:w-52"
              />
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center gap-4 sm:gap-6 text-xl">
              <Link to="/cart" className="relative p-1 text-zinc-700 hover:text-blue-600 transition">
                <FaCartShopping />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-blue-600 transition">
                  <FaUserAlt className="text-base" />
                  <span className="max-w-[80px] truncate hidden sm:inline">{user.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="text-zinc-700 hover:text-blue-600 transition">
                  <FaUserAlt />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-zinc-700 hover:text-blue-600 transition p-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-zinc-200 pb-4 px-2 space-y-3">
              {/* Mobile Search */}
              <div className="md:hidden flex border border-gray-300 items-center rounded px-2 py-0.5 mt-3">
                <CiSearch />
                <input
                  type="text"
                  placeholder='Search for "Shirts"'
                  onKeyDown={handleSearchKeyPress}
                  className="font-semibold rounded-xl outline-none px-3 py-2 text-sm bg-transparent w-full"
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1 text-sm font-semibold">
                <Link to="/listing?category=shirt" onClick={closeMobileMenu} className="py-2 px-3 rounded-lg hover:bg-zinc-50 hover:text-blue-600 transition">Shirts</Link>
                <Link to="/listing?category=jeans,trousers" onClick={closeMobileMenu} className="py-2 px-3 rounded-lg hover:bg-zinc-50 hover:text-blue-600 transition">Jeans & Trousers</Link>
                <Link to="/listing?category=shoes" onClick={closeMobileMenu} className="py-2 px-3 rounded-lg hover:bg-zinc-50 hover:text-blue-600 transition">Shoes</Link>
                <Link to="/listing?category=accessories" onClick={closeMobileMenu} className="py-2 px-3 rounded-lg hover:bg-zinc-50 hover:text-blue-600 transition">Accessories</Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
