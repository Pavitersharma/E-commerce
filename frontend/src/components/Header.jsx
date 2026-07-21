import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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

  const navLinks = [
    { label: "Shop All", to: "/listing" },
    { label: "Shirts", to: "/listing?category=shirt" },
    { label: "Jeans & Trousers", to: "/listing?category=jeans,trousers" },
    { label: "Shoes", to: "/listing?category=shoes" },
    { label: "Accessories", to: "/listing?category=accessories" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6 max-w-7xl">
          {/* Logo */}
          <Link to="/" className="font-display text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
            Brand<span className="text-foreground">Shut</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-initial max-w-sm">
            {/* Search */}
            <label className="group hidden sm:flex h-11 w-full items-center gap-2 rounded-full border border-border bg-card/70 px-4 text-sm text-muted-foreground transition-all focus-within:border-foreground/30 focus-within:bg-card focus-within:shadow-soft">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 opacity-50">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                aria-label="Search products"
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                placeholder='Search for "shirts"'
                onKeyDown={handleSearchKeyPress}
              />
            </label>

            {/* Wishlist */}
            <Link to="/listing" className="hidden sm:grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </Link>

            {/* Account */}
            {user ? (
              <Link to="/dashboard" className="hidden sm:grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:bg-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" aria-label="Cart" className="relative grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 px-4 space-y-4">
            {/* Mobile Search */}
            <label className="sm:hidden flex h-11 w-full items-center gap-2 rounded-full border border-border bg-card/70 px-4 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 opacity-50">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                aria-label="Search products"
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                placeholder='Search for "shirts"'
                onKeyDown={handleSearchKeyPress}
              />
            </label>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link to="/dashboard" onClick={closeMobileMenu} className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground">
                  My Account
                </Link>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
