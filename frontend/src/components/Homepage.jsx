import React, { useState, useEffect } from 'react';
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

  const categories = [
    { name: "Shirts", image: shirt, to: "/listing?category=shirt" },
    { name: "T-Shirts", image: tshirt, to: "/listing?category=tshirt" },
    { name: "Jeans", image: Jeans, to: "/listing?category=jeans,trousers" },
    { name: "Shoes", image: shoes, to: "/listing?category=shoes" },
    { name: "Jackets", image: jackets, to: "/listing?category=jacket" },
    { name: "Accessories", image: watches, to: "/listing?category=accessories" },
  ];

  return (
    <div className="bg-background">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Hero Content */}
            <div className="flex flex-col items-start text-left max-w-xl space-y-6">
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground/80 tracking-wide uppercase">
                ✨ New winter edit · 2026
              </span>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
                Premium men's fashion,<br />
                <span className="text-accent">delivered</span>.
              </h1>

              <p className="text-base text-muted-foreground sm:text-lg max-w-lg">
                Discover the latest trends in men's clothing and accessories. Style, comfort, and quality — considered in every piece.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/listing"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lift transition hover:opacity-95"
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link
                  to="/listing"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition hover:border-foreground"
                >
                  Browse Collection
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 w-full">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</p>
                  <p className="text-2xl font-bold text-foreground mt-1">★ 4.8 <span className="text-sm font-normal text-muted-foreground">/ Service</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Customers</p>
                  <p className="text-2xl font-bold text-foreground mt-1">12M+ <span className="text-sm font-normal text-muted-foreground">Globally</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivery</p>
                  <p className="text-2xl font-bold text-foreground mt-1">48h <span className="text-sm font-normal text-muted-foreground">Metro</span></p>
                </div>
              </div>
            </div>

            {/* Right — Hero Image Card */}
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto rounded-3xl overflow-hidden shadow-soft group">
              <img
                src={shirt2}
                alt="Premium Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Trusted badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-sm px-3 py-1.5 shadow-soft border border-border/40">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs">✓</span>
                <span className="text-xs font-semibold text-foreground">
                  Trusted by<br /><strong>12M+ shoppers</strong>
                </span>
              </div>

              {/* Bottom overlay card */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-4 rounded-2xl bg-card/90 backdrop-blur-sm shadow-lift border border-border/40">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Featured</span>
                  <h3 className="font-semibold text-foreground text-sm mt-0.5">Cotton Linen Series</h3>
                </div>
                <Link
                  to="/listing?category=shirt"
                  aria-label="View product"
                  className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Curated</span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl mt-1">Shop by category</h2>
          </div>
          <Link className="hidden text-sm font-medium text-foreground underline-offset-4 hover:underline md:inline" to="/listing">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                <img src={cat.image} alt={cat.name} className="w-2/3 h-2/3 object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="relative p-4 md:p-6 text-white z-10">
                <p className="font-semibold text-sm md:text-base leading-tight">{cat.name}</p>
                <p className="text-[10px] md:text-xs font-medium text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Shop now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section className="container mx-auto py-16 md:py-24 px-4 md:px-6 max-w-7xl">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Favorites</span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl mt-1">Best Sellers</h2>
          </div>
          <Link className="hidden text-sm font-medium text-foreground underline-offset-4 hover:underline md:inline" to="/listing">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-secondary rounded-2xl aspect-[4/5]" />
                <div className="h-4 bg-secondary rounded w-2/3" />
                <div className="h-4 bg-secondary rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const isWishlisted = wishlist.includes(product._id);

              return (
                <div key={product._id} className="group relative flex flex-col gap-3">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/40 bg-secondary">
                    <Link to={`/product/${product._id}`} className="relative block h-full w-full overflow-hidden bg-secondary">
                      <img
                        src={getImageAsset(product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Discount/Premium Tag */}
                    {discountPercent > 0 ? (
                      <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                        {discountPercent}% OFF
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                        PREMIUM
                      </span>
                    )}

                    {/* Wishlist + Quick View on hover */}
                    <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button
                        onClick={(e) => toggleWishlist(product._id, e)}
                        aria-label="Wishlist"
                        className="grid h-10 w-10 place-items-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur transition hover:bg-card"
                      >
                        {isWishlisted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <div className="flex flex-col gap-1.5 px-1">
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {product.brand || product.category}
                    </span>
                    <h3 className="line-clamp-1 font-medium">
                      <Link to={`/product/${product._id}`} className="text-[15px] font-semibold text-foreground transition hover:text-foreground/70">
                        {product.name}
                      </Link>
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex items-center text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </div>
                      <span className="font-medium text-foreground">{product.rating || "4.8"}</span>
                      <span className="text-muted-foreground">({product.numReviews || "142"})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-sm font-semibold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <div className="flex justify-center mt-16">
          <Link
            to="/listing"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground transition hover:border-foreground"
          >
            Explore All Products
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;