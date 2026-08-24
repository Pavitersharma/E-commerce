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
    if (e.key === "Enter" && e.target.value.trim()) {
      navigate(`/listing?search=${encodeURIComponent(e.target.value.trim())}`);
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
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 max-w-7xl">
          {/* Logo */}
          <Link to="/" className="font-display text-xl font-extrabold tracking-tight text-foreground md:text-2xl hover:opacity-90 transition-opacity">
            Brand<span className="text-foreground">Shut</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = (location.pathname + location.search) === link.to || (link.to === "/listing" && location.pathname === "/listing" && !location.search);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-secondary text-foreground font-bold shadow-xs"
                      : "text-foreground/75 hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 md:flex-initial max-w-sm justify-end">
            {/* Search */}
            <label className="group hidden sm:flex h-10 w-full items-center gap-2 rounded-full border border-border bg-card px-3.5 text-xs text-muted-foreground transition-all focus-within:border-foreground/40 focus-within:shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                aria-label="Search products"
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-xs"
                placeholder='Search products...'
                onKeyDown={handleSearchKeyPress}
              />
            </label>

            {/* Account */}
            {user ? (
              <Link 
                to="/dashboard" 
                title="My Account"
                aria-label="My Account"
                className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary border border-transparent hover:border-border/60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            ) : (
              <Link 
                to="/login" 
                title="Sign In"
                aria-label="Sign In"
                className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary border border-transparent hover:border-border/60"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link 
              to="/cart" 
              aria-label="Cart" 
              title="Shopping Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary border border-transparent hover:border-border/60"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 px-4 space-y-4 bg-background/95 backdrop-blur-md animate-slideDown">
            {/* Mobile Search */}
            <label className="sm:hidden flex h-11 w-full items-center gap-2 rounded-full border border-border bg-card px-4 text-xs text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                aria-label="Search products"
                className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-xs"
                placeholder='Search products...'
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
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/85 transition hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link to="/dashboard" onClick={closeMobileMenu} className="rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/85 transition hover:bg-secondary hover:text-foreground">
                  My Account
                </Link>
              ) : (
                <Link to="/login" onClick={closeMobileMenu} className="rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/85 transition hover:bg-secondary hover:text-foreground">
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
