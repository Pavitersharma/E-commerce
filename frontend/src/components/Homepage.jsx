import React, { useState, useEffect } from 'react';
import { FcRating } from 'react-icons/fc';
import { LuUsersRound } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { getImageAsset } from '../utils/imageHelper';
import { toast } from 'react-toastify';

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

  return (
    <>
      <div className="bg-zinc-100 min-h-50 mt-16 pt-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-8 sm:py-10 gap-8 lg:gap-10">
          <div className="text-center lg:text-left">
            <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Premium men's <br className="hidden sm:block" /> fashion{" "}
              <span className="text-blue-600">delivered</span>
            </h1>
            <p className="text-zinc-500 mt-4 sm:mt-5 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
              Discover the latest trends in men's clothing and{" "}
              accessories. Style, comfort, and quality in every piece.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start">
              <Link
                to="/listing"
                className="bg-blue-600 text-white px-6 sm:px-9 py-2.5 rounded-xl hover:bg-blue-700 font-semibold shadow transition text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/listing"
                className="bg-white border border-zinc-400 text-zinc-700 px-6 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold transition text-center"
              >
                Browse Collection
              </Link>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 justify-center lg:justify-start">
              <p className="flex items-center gap-2 text-sm"><FcRating /> 4.8<span className="text-zinc-400"> Service Rating* </span></p>
              <p className="flex items-center gap-2 text-sm"><LuUsersRound /> 12M+<span className="text-zinc-400"> Customer Globally* </span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm w-full lg:w-[600px] p-4 sm:p-6">
            <h2 className="font-bold text-lg mb-4 text-zinc-800">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/listing?category=shirt" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={shirt} alt="Shirts" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Shirts</p>
              </Link>
              <Link to="/listing?category=tshirt" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={tshirt} alt="T-Shirts" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">T-Shirts</p>
              </Link>
              <Link to="/listing?category=jacket" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={jackets} alt="Jackets" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Jackets</p>
              </Link>
              <Link to="/listing?category=shoes" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={shoes} alt="Shoes" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Shoes</p>
              </Link>
              <Link to="/listing?category=underwear" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={underwear} alt="Underwear" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Underwear</p>
              </Link>
              <Link to="/listing?category=accessories" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={watches} alt="Watches" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Watches</p>
              </Link>
              <Link to="/listing?category=accessories" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={cap} alt="Caps" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Caps</p>
              </Link>
              <Link to="/listing?category=jeans,trousers" className="border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 transition text-center hover:shadow-sm">
                <img src={Jeans} alt="Denim" className="w-10 h-10 object-contain mb-2" />
                <p className="text-sm font-semibold text-zinc-700">Jeans</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-16 px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-800'>Featured Products</h1>
          <p className='text-zinc-500 mt-2 max-w-xl mx-auto'>
            Discover our best-selling men's fashion items, loved by thousands of customers
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const discountPercent = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div key={product._id} className="rounded-2xl overflow-hidden shadow hover:shadow-lg border border-zinc-200 bg-white p-4 space-y-4 flex flex-col justify-between transition duration-200 group">
                  <Link to={`/product/${product._id}`} className="block space-y-4">
                    {/* Product Image */}
                    <div className="w-full h-56 object-contain rounded-xl bg-zinc-50 flex items-center justify-center overflow-hidden border border-zinc-100 relative">
                      <img
                        src={getImageAsset(product.image)}
                        alt={product.name}
                        className="max-h-48 object-contain group-hover:scale-105 transition duration-300"
                      />
                      {discountPercent > 0 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-zinc-800 group-hover:text-blue-600 transition truncate">{product.name}</h4>
                      <p className="text-xs text-zinc-400 font-medium uppercase">{product.brand || product.category}</p>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1 min-h-[40px]">{product.description}</p>
                    </div>
                  </Link>

                  {/* Rating & Delivery */}
                  <div className="flex items-center justify-between text-xs text-zinc-700 pt-2 border-t border-zinc-50">
                    <p className="flex items-center gap-1 font-semibold">
                      <FcRating className="text-base" /> {product.rating}
                      <span className="text-zinc-400 font-normal">({product.reviewCount || 10})</span>
                    </p>
                    <p className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Free Delivery</p>
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-base font-black text-zinc-800">
                      ₹{product.price}{" "}
                      {product.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through font-normal ml-1">₹{product.originalPrice}</span>
                      )}
                    </p>
                    <button
                      onClick={() => handleAddCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-12 mb-16">
          <Link
            to="/listing"
            className='border border-zinc-300 hover:bg-zinc-50 font-bold text-zinc-700 px-6 py-2.5 rounded-xl text-sm transition shadow-sm'
          >
            View All Products
          </Link>
        </div>
      </div>
    </>
  );
};

export default Homepage;