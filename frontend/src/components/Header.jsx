import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const cartCount = getCartCount();
  const navigate = useNavigate();

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/listing?search=${e.target.value}`);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between p-2">
            <div>
              <Link to="/" className="text-3xl text-black font-bold">LOGO</Link>
            </div>
            
            <div className="flex items-center gap-8">
              <nav className="flex items-center gap-8 font-semibold">
                <Link to="/listing?category=shirt" className="hover:text-blue-600 transition">Shirts</Link>
                <Link to="/listing?category=jeans,trousers" className="hover:text-blue-600 transition">Jeans & Trousers</Link>
                <Link to="/listing?category=shoes" className="hover:text-blue-600 transition">Shoes</Link>
                <Link to="/listing?category=accessories" className="hover:text-blue-600 transition">Accessories</Link>
              </nav>
            </div>
            
            <div className="border border-gray-300 flex items-center rounded px-2 py-0.5">
              <CiSearch />
              <input
                type="text"
                placeholder='Search for "Shirts"'
                onKeyDown={handleSearchKeyPress}
                className="font-semibold rounded-xl outline-none px-4 py-2 text-sm bg-transparent"
              />
            </div>
            
            <div className="flex items-center gap-8 text-xl">
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
                  <span className="max-w-[100px] truncate hidden md:inline">{user.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="text-zinc-700 hover:text-blue-600 transition">
                  <FaUserAlt />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
