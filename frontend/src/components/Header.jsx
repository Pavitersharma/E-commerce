import React, { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserAlt, FaBars, FaTimes } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartCount = getCartCount();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/listing?search=${e.target.value}`);
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Helper to determine if a route is active
  const isActive = (path) => location.pathname + location.search === path;

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-zinc-100 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-2xl sm:text-3xl text-primary font-bold tracking-tight hover:opacity-90 transition-opacity">
              BrandShut
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
              <Link 
                to="/listing?category=shirt" 
                className={`hover:text-primary transition-colors relative py-1 ${isActive("/listing?category=shirt") ? "text-primary font-semibold" : ""}`}
              >
                Shirts
                {isActive("/listing?category=shirt") && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />}
              </Link>
              <Link 
                to="/listing?category=jeans,trousers" 
                className={`hover:text-primary transition-colors relative py-1 ${isActive("/listing?category=jeans,trousers") ? "text-primary font-semibold" : ""}`}
              >
                Jeans & Trousers
                {isActive("/listing?category=jeans,trousers") && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />}
              </Link>
              <Link 
                to="/listing?category=shoes" 
                className={`hover:text-primary transition-colors relative py-1 ${isActive("/listing?category=shoes") ? "text-primary font-semibold" : ""}`}
              >
                Shoes
                {isActive("/listing?category=shoes") && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />}
              </Link>
              <Link 
                to="/listing?category=accessories" 
                className={`hover:text-primary transition-colors relative py-1 ${isActive("/listing?category=accessories") ? "text-primary font-semibold" : ""}`}
              >
                Accessories
                {isActive("/listing?category=accessories") && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />}
              </Link>
            </nav>
            
            {/* Desktop Search */}
            <div className="hidden md:flex border border-zinc-200 hover:border-zinc-300 focus-within:border-primary items-center rounded-full bg-zinc-50/50 px-4 py-1.5 transition-all duration-200">
              <CiSearch className="text-zinc-400 text-lg" />
              <input
                type="text"
                placeholder='Search Collection'
                onKeyDown={handleSearchKeyPress}
                className="outline-none px-2 py-0.5 text-xs sm:text-sm font-normal text-zinc-800 placeholder-zinc-400 bg-transparent w-40 lg:w-56 focus:w-48 lg:focus:w-64 transition-all duration-300"
              />
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-zinc-50 text-zinc-700 hover:text-primary transition-all duration-200">
                <FaCartShopping className="text-lg sm:text-xl" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-primary text-zinc-700 hover:text-primary transition-all duration-200">
                  <FaUserAlt className="text-xs sm:text-sm" />
                  <span className="max-w-[100px] truncate hidden sm:inline text-xs font-semibold">{user.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="p-2.5 rounded-full hover:bg-zinc-50 text-zinc-700 hover:text-primary transition-all duration-200">
                  <FaUserAlt className="text-lg" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-zinc-50 text-zinc-700 hover:text-primary transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-zinc-100 py-4 px-2 space-y-4 animate-fadeIn">
              {/* Mobile Search */}
              <div className="md:hidden flex border border-zinc-200 items-center rounded-full bg-zinc-50 px-4 py-2">
                <CiSearch className="text-zinc-400 text-lg" />
                <input
                  type="text"
                  placeholder='Search Collection'
                  onKeyDown={handleSearchKeyPress}
                  className="outline-none px-2 py-0.5 text-sm font-normal text-zinc-800 bg-transparent w-full"
                />
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-600">
                <Link to="/listing?category=shirt" onClick={closeMobileMenu} className="py-2.5 px-4 rounded-xl hover:bg-zinc-50 hover:text-primary transition-colors">Shirts</Link>
                <Link to="/listing?category=jeans,trousers" onClick={closeMobileMenu} className="py-2.5 px-4 rounded-xl hover:bg-zinc-50 hover:text-primary transition-colors">Jeans & Trousers</Link>
                <Link to="/listing?category=shoes" onClick={closeMobileMenu} className="py-2.5 px-4 rounded-xl hover:bg-zinc-50 hover:text-primary transition-colors">Shoes</Link>
                <Link to="/listing?category=accessories" onClick={closeMobileMenu} className="py-2.5 px-4 rounded-xl hover:bg-zinc-50 hover:text-primary transition-colors">Accessories</Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
