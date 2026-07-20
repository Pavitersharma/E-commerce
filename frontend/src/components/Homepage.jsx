import React, { useState, useEffect } from 'react';
import { FcRating } from 'react-icons/fc';
import { LuUsersRound } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { getImageAsset } from '../utils/imageHelper';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";

import shirt2 from '../assets/images/shirt2.png';
import tshirt from '../assets/images/tshirt.png';
import shoes from '../assets/images/shoes.png';
import jackets from '../assets/images/jacket.png';
import cap from '../assets/images/cap.png';
import watches from '../assets/images/watch.png';
import underwear from '../assets/images/underwear.png';
import Jeans from '../assets/images/jeans.png';
import shirt from '../assets/images/cloth.png';

const Homepage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/v1/products?isFeatured=true");
        if (res.data.success) {
          // Take first 6 products for display
          setFeaturedProducts(res.data.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAddCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
      toast.info("Removed from wishlist");
    } else {
      setWishlist([...wishlist, id]);
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-[#FCFBF8] pt-24 sm:pt-28 pb-16 sm:pb-24 border-b border-zinc-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Info */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-zinc-400">
                New Summer Collection '26
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-primary">
                Premium men's <br />
                fashion, <span className="italic font-normal">delivered.</span>
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Discover the latest trends in men's apparel. Impeccably tailored shirts, utility denim, and clean accessories designed for modern everyday style.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/listing"
                  className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full hover:bg-zinc-800 font-semibold text-sm transition-all duration-250 shadow-sm"
                >
                  Shop Collection
                </Link>
                <Link
                  to="/listing"
                  className="inline-flex items-center justify-center bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-800 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-250"
                >
                  Browse Catalog
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                  <FcRating className="text-sm" />
                  <span><strong className="text-primary font-bold">4.8</strong> Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuUsersRound className="text-sm text-zinc-400" />
                  <span><strong className="text-primary font-bold">12M+</strong> Happy Customers</span>
                </div>
              </div>
            </div>

            {/* Hero Category Widget */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-soft p-6 sm:p-8 space-y-6">
                <h3 className="font-display text-xl font-bold text-primary">Shop by Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link to="/listing?category=shirt" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={shirt} alt="Shirts" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Shirts</p>
                  </Link>
                  <Link to="/listing?category=tshirt" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={tshirt} alt="T-Shirts" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">T-Shirts</p>
                  </Link>
                  <Link to="/listing?category=jacket" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={jackets} alt="Jackets" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Jackets</p>
                  </Link>
                  <Link to="/listing?category=shoes" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={shoes} alt="Shoes" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Shoes</p>
                  </Link>
                  <Link to="/listing?category=underwear" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={underwear} alt="Underwear" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Underwear</p>
                  </Link>
                  <Link to="/listing?category=accessories" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={watches} alt="Watches" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Watches</p>
                  </Link>
                  <Link to="/listing?category=accessories" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={cap} alt="Caps" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Caps</p>
                  </Link>
                  <Link to="/listing?category=jeans,trousers" className="group border border-zinc-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:border-primary hover:shadow-soft transition-all duration-250 text-center bg-zinc-50/50">
                    <img src={Jeans} alt="Denim" className="w-10 h-10 object-contain mb-3 group-hover:scale-105 transition-transform duration-250" />
                    <p className="text-xs font-semibold text-zinc-700">Jeans</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BEST SELLERS SECTION ================= */}
      <section className="container mx-auto py-20 px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Customer Favorites
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-primary">
              Best Sellers
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-md md:text-right">
            Explore our curated items representing the absolute standard in premium quality, style, and longevity.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-zinc-100 rounded-2xl aspect-[4/5]" />
                <div className="h-4 bg-zinc-100 rounded w-2/3" />
                <div className="h-4 bg-zinc-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {featuredProducts.map((product) => {
              const discountPercent = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const isWishlisted = wishlist.includes(product._id);

              return (
                <div key={product._id} className="group relative flex flex-col justify-between transition-all duration-200">
                  <Link to={`/product/${product._id}`} className="block space-y-4">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl bg-[#F6F6F6] border border-zinc-100/50 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-soft">
                      <img
                        src={getImageAsset(product.image)}
                        alt={product.name}
                        className="max-h-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(product._id, e)}
                        className="absolute top-4 right-4 h-10 w-10 bg-white border border-zinc-100 hover:border-zinc-300 rounded-full flex items-center justify-center text-zinc-400 hover:text-primary transition-all duration-200 shadow-sm"
                      >
                        {isWishlisted ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-sm" />}
                      </button>

                      {/* Tag pill */}
                      {discountPercent > 0 ? (
                        <span className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                          {product.brand || product.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="font-semibold text-zinc-700">{product.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-display text-lg font-bold text-primary group-hover:text-zinc-600 transition truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </Link>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100/50">
                    <p className="text-base font-bold text-primary">
                      ₹{product.price.toLocaleString("en-IN")}{" "}
                      {product.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through font-normal ml-1.5">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handleAddCart(product)}
                      className="bg-primary hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All */}
        <div className="flex justify-center mt-16">
          <Link
            to="/listing"
            className="inline-flex items-center gap-2 border border-zinc-200 hover:border-zinc-800 bg-white text-zinc-800 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            Explore All Products <FaArrowRight size={12} className="text-zinc-400" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;