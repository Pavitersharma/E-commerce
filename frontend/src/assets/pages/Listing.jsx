import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BsFillGridFill } from "react-icons/bs";
import { FaGripLines, FaHeart, FaRegHeart } from "react-icons/fa";
import { CiSearch, CiFilter } from "react-icons/ci";
import { FcRating } from "react-icons/fc";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { toast, ToastContainer } from "react-toastify";

const Listing = () => {
  const { cart, addToCart, updateQty } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/v1/products");
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Error loading products", error);
        toast.error("Failed to load products from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setSelectedCategories(urlCategory.split(","));
    } else {
      setSelectedCategories([]);
    }

    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Update URL params when categories change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    let newCategories;

    if (selectedCategories.includes(value)) {
      newCategories = selectedCategories.filter((c) => c !== value);
    } else {
      newCategories = [...selectedCategories, value];
    }

    setSelectedCategories(newCategories);

    if (newCategories.length > 0) {
      searchParams.set("category", newCategories.join(","));
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearch("");
    searchParams.delete("category");
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
      toast.info("Removed from wishlist");
    } else {
      setWishlist([...wishlist, id]);
      toast.success("Added to wishlist ❤️");
    }
  };

  // Add to cart helper
  const handleAddCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  // Filter + Sorting Logic (applied locally to fetched products)
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "lowtohigh") return a.price - b.price;
      if (sortOrder === "hightolow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 pb-12 pt-16">
      <ToastContainer />
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mt-8">
        <div>
          <h2 className="text-2xl font-bold">Men's Fashion</h2>
          <p className="text-zinc-400 text-sm">
            Showing {filteredProducts.length} Products
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="border border-zinc-300 rounded-xl p-2 bg-white hover:bg-zinc-50 transition">
            <BsFillGridFill />
          </button>
          <button className="border border-zinc-300 rounded-xl p-2 bg-white hover:bg-zinc-50 transition">
            <FaGripLines />
          </button>

          {/* Sorting Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-zinc-300 rounded-xl p-2 bg-white text-sm font-semibold focus:outline-none"
          >
            <option value="">Sort by</option>
            <option value="lowtohigh">Price: Low to High</option>
            <option value="hightolow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex items-center border border-zinc-200 p-2.5 rounded-xl mt-6 gap-2 bg-white hover:border-zinc-400 transition">
        <CiSearch size={20} className="text-zinc-400" />
        <input
          type="text"
          className="w-full outline-none text-sm font-medium"
          placeholder="Search Products.."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value) {
              searchParams.set("search", e.target.value);
            } else {
              searchParams.delete("search");
            }
            setSearchParams(searchParams);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 mt-10">
        {/* ================= FILTERS ================= */}
        <div className="border border-zinc-200 p-5 rounded-2xl bg-white h-fit shadow-sm">
          <div className="text-lg flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
            <CiFilter size={18} />
            <h4 className="font-bold text-zinc-800">Filters</h4>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-sm text-zinc-800 mb-3 uppercase tracking-wider text-zinc-400">Categories</h3>
            <div className="flex flex-col gap-2.5 text-sm text-zinc-600">
              {["shirt", "jeans", "trousers", "shoes", "tshirt", "accessories"].map(
                (cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer font-medium hover:text-zinc-900">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={handleCategoryChange}
                      className="rounded text-blue-600 accent-blue-600 focus:ring-blue-500"
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="border border-zinc-300 hover:bg-zinc-50 mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition text-zinc-700 shadow-sm"
          >
            Clear All Filters
          </button>

          {/* 🛒 Cart Summary (Short) */}
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-800 mb-3 flex items-center gap-2">
              <span>🛒</span> Cart Preview
            </h3>
            {cart.length === 0 ? (
              <p className="text-xs text-zinc-400">Cart is empty</p>
            ) : (
              <div className="space-y-2">
                <ul className="space-y-1.5 text-xs text-zinc-600 max-h-40 overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const itemKey = item._id || item.id;
                    return (
                      <li key={itemKey} className="flex justify-between font-medium">
                        <span className="truncate max-w-[140px]">{item.name}</span>
                        <span>x{item.qty}</span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  to="/cart"
                  className="block text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs py-2 rounded-lg mt-3 transition"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const productKey = product._id || product.id;
                const cartItem = cart.find((item) => (item._id || item.id) === productKey);

                return (
                  <div
                    key={productKey}
                    className="rounded-2xl shadow hover:shadow-md overflow-hidden border border-zinc-200 bg-white p-4 flex flex-col justify-between transition duration-200 group"
                  >
                    {/* Image + Discount + Wishlist */}
                    <div className="relative">
                      <Link to={`/product/${productKey}`}>
                        <div className="w-full h-48 object-contain rounded-xl bg-zinc-50 flex items-center justify-center overflow-hidden border border-zinc-100">
                          <img
                            src={getImageAsset(product.image)}
                            alt={product.name}
                            className="max-h-40 object-contain group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      </Link>
                      
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          {product.discount}% OFF
                        </span>
                      )}

                      <button
                        onClick={() => toggleWishlist(productKey)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-zinc-400 hover:text-red-500 shadow-sm transition"
                      >
                        {wishlist.includes(productKey) ? (
                          <FaHeart className="text-red-500 text-sm" />
                        ) : (
                          <FaRegHeart className="text-sm" />
                        )}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="pt-4 flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/product/${productKey}`}>
                          <h3 className="font-bold text-zinc-800 text-sm group-hover:text-blue-600 transition line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-400 uppercase font-medium mt-0.5">
                          {product.brand}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mt-2 text-xs font-semibold gap-1 text-zinc-500">
                          <FcRating />
                          <span>{product.rating}</span>
                          <span className="text-zinc-300 font-normal">
                            ({product.reviewCount || 45})
                          </span>
                        </div>
                      </div>

                      {/* Price & Add to Cart Controls */}
                      <div className="mt-4 pt-3 border-t border-zinc-50">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-base text-zinc-800">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-zinc-400 line-through text-xs">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls if already in cart */}
                        {cartItem ? (
                          <div className="mt-3 flex items-center justify-between border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50">
                            <button
                              className="bg-zinc-200/60 text-zinc-700 px-3.5 py-1.5 hover:bg-zinc-200 transition font-bold"
                              onClick={() => updateQty(productKey, cartItem.qty - 1)}
                            >
                              -
                            </button>
                            <span className="px-4 font-bold text-xs text-zinc-800">
                              {cartItem.qty}
                            </span>
                            <button
                              className="bg-zinc-200/60 text-zinc-700 px-3.5 py-1.5 hover:bg-zinc-200 transition font-bold"
                              onClick={() => updateQty(productKey, cartItem.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddCart(product)}
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <span className="text-4xl">🔍</span>
              <p className="mt-4 text-zinc-500 font-medium">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
