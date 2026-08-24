import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BsFillGridFill } from "react-icons/bs";
import { FaGripLines, FaHeart, FaRegHeart } from "react-icons/fa";
import { CiSearch, CiFilter } from "react-icons/ci";
import { FcRating } from "react-icons/fc";
import API from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { toast } from "react-toastify";

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
        const res = await API.get("/api/v1/products");
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
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-5 mb-6 gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Catalog</h1>
            <p className="text-muted-foreground text-xs sm:text-sm font-medium mt-1">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sorting Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-border rounded-full px-4 py-2 bg-card text-xs font-semibold focus:outline-none focus:border-foreground/30 text-foreground cursor-pointer shadow-xs"
            >
              <option value="">Sort by: Default</option>
              <option value="lowtohigh">Price: Low to High</option>
              <option value="hightolow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ================= SEARCH INPUT ================= */}
        <div className="relative mb-8">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 border border-border focus:border-foreground/30 bg-card rounded-full outline-none text-sm font-normal text-foreground placeholder-muted-foreground transition-all shadow-xs"
            placeholder="Search catalog for shirts, jeans, accessories, footwear..."
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

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-10">
          {/* ================= SIDEBAR FILTERS ================= */}
          <div className="space-y-6">
            <div className="border border-border p-6 rounded-3xl bg-card shadow-soft h-fit">
              <div className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3.5 mb-5">
                <CiFilter className="text-base font-bold" />
                <span>Filters</span>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Categories</h4>
                <div className="flex flex-col gap-3 text-xs sm:text-sm text-foreground/80 font-medium">
                  {["shirt", "jeans", "trousers", "shoes", "tshirt", "accessories"].map(
                    (cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:text-foreground transition-colors">
                        <input
                          type="checkbox"
                          value={cat}
                          checked={selectedCategories.includes(cat)}
                          onChange={handleCategoryChange}
                          className="rounded text-primary accent-primary focus:ring-primary border-border w-4 h-4 cursor-pointer"
                        />
                        <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategories.length > 0 || search) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 w-full py-2.5 bg-secondary border border-border hover:border-foreground/40 rounded-full text-xs font-semibold transition-all text-foreground/80 shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* 🛒 Cart Summary widget inside sidebar */}
            <div className="border border-border p-6 rounded-3xl bg-card shadow-soft">
              <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <span>🛒</span> Cart Preview
              </h3>
              {cart.length === 0 ? (
                <p className="text-xs text-muted-foreground">Your cart is currently empty.</p>
              ) : (
                <div className="space-y-4">
                  <ul className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                    {cart.map((item) => {
                      const itemKey = item._id || item.id;
                      return (
                        <li key={itemKey} className="flex justify-between font-semibold border-b border-border/50 pb-2 last:border-0 last:pb-0">
                          <span className="truncate max-w-[150px] text-foreground">{item.name}</span>
                          <span className="text-muted-foreground">x{item.qty}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/cart"
                    className="block text-center bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs py-2.5 rounded-full transition shadow-sm"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-secondary rounded-2xl aspect-[4/5]" />
                    <div className="h-4 bg-secondary rounded w-2/3" />
                    <div className="h-4 bg-secondary rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const productKey = product._id || product.id;
                  const cartItem = cart.find((item) => (item._id || item.id) === productKey);
                  const discountPercent = product.originalPrice 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;

                  return (
                    <div key={productKey} className="group flex flex-col justify-between transition-all duration-200">
                      {/* Image + Info container */}
                      <div className="space-y-3.5">
                        <div className="relative aspect-[4/5] w-full rounded-2xl bg-secondary border border-border/40 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-soft">
                          <Link to={`/product/${productKey}`} className="w-full h-full flex items-center justify-center p-4">
                            <img
                              src={getImageAsset(product.image)}
                              alt={product.name}
                              className="max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>

                          {/* Wishlist Icon */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(productKey)}
                            className="absolute top-3 right-3 h-9 w-9 bg-card/90 hover:bg-card border border-border/40 rounded-full flex items-center justify-center text-foreground shadow-soft backdrop-blur transition cursor-pointer"
                            aria-label="Toggle wishlist"
                          >
                            {wishlist.includes(productKey) ? (
                              <FaHeart className="text-rose-500 text-xs" />
                            ) : (
                              <FaRegHeart className="text-xs" />
                            )}
                          </button>

                          {/* Discount tag pill */}
                          {discountPercent > 0 && (
                            <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Product Meta */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                              {product.brand || product.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-foreground font-medium">
                              <span className="text-amber-500">★</span>
                              <span>{product.rating || "4.8"}</span>
                              <span className="text-muted-foreground font-normal">({product.reviewCount || 45})</span>
                            </div>
                          </div>
                          <Link to={`/product/${productKey}`}>
                            <h3 className="text-[15px] font-semibold text-foreground group-hover:text-foreground/70 transition truncate">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      {/* Pricing & Cart Controls */}
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-foreground text-sm">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-xs">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Quantity adjust or Add CTA */}
                        {cartItem ? (
                          <div className="mt-3 flex items-center justify-between border border-border rounded-full overflow-hidden bg-secondary h-9">
                            <button
                              type="button"
                              className="text-muted-foreground px-3.5 hover:bg-border/50 hover:text-foreground transition font-bold h-full cursor-pointer"
                              onClick={() => updateQty(productKey, cartItem.qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="font-bold text-xs text-foreground">
                              {cartItem.qty}
                            </span>
                            <button
                              type="button"
                              className="text-muted-foreground px-3.5 hover:bg-border/50 hover:text-foreground transition font-bold h-full cursor-pointer"
                              onClick={() => updateQty(productKey, cartItem.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddCart(product)}
                            className="mt-3 w-full bg-primary hover:opacity-90 text-primary-foreground py-2.5 rounded-full text-xs font-semibold transition shadow-sm cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-card border border-border rounded-3xl max-w-xl mx-auto space-y-4 shadow-soft">
                <span className="text-4xl block">🔍</span>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-foreground">No Products Found</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto">
                    We couldn't find matches for your selected search and filters.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-block bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm transition shadow-sm cursor-pointer"
                  >
                    Clear Filters & Show All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
