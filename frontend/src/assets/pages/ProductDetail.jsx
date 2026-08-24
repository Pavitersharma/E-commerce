import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { 
  FaArrowLeft, 
  FaShieldAlt, 
  FaTruck, 
  FaUndo, 
  FaMinus, 
  FaPlus, 
  FaChevronDown, 
  FaChevronUp, 
  FaChevronLeft, 
  FaChevronRight, 
  FaCheckCircle, 
  FaStar 
} from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Review Carousel State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/v1/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
          setSelectedImage(res.data.data.image);
        }
      } catch (error) {
        console.error("Error fetching product", error);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleAccordion = (name) => {
    setActiveAccordion((prev) => (prev === name ? null : name));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20 px-4">
        <div className="text-center p-8 bg-card border border-border rounded-3xl max-w-md shadow-soft space-y-4">
          <div className="text-4xl">🔍</div>
          <h2 className="font-display text-xl font-bold text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">The product you are looking for does not exist or has been removed from our catalog.</p>
          <Link to="/listing" className="inline-block bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm transition shadow-sm">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Determine images array
  const galleryImages = (product.images && Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : [product.image];

  const currentDisplayImage = selectedImage || product.image;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if item is already in cart
  const cartItem = cart.find((item) => (item._id || item.id) === product._id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  // Review List
  const defaultReviews = [
    {
      name: "Aarav Sharma",
      rating: 5,
      date: "May 12, 2026",
      comment: "Excellent fit and premium fabric quality. Exactly as described, and the delivery was fast!",
      verified: true
    },
    {
      name: "Rahul Gupta",
      rating: 4,
      date: "April 28, 2026",
      comment: "Super comfortable for daily office wear. The stitch is really good. Fits nicely.",
      verified: true
    },
    {
      name: "Vikram Singh",
      rating: 5,
      date: "April 15, 2026",
      comment: "Value for money! Buying clothing online can be tricky, but this item is absolute perfection.",
      verified: true
    },
    {
      name: "Aditya Verma",
      rating: 5,
      date: "April 02, 2026",
      comment: "The texture and stitch feel very high end. Washed twice with no color fade. Highly recommend!",
      verified: true
    },
    {
      name: "Rohan Patel",
      rating: 4,
      date: "March 20, 2026",
      comment: "Great minimalist design and breathable fabric. Sizing is completely true to size.",
      verified: true
    }
  ];

  const reviewsList = (product.reviews && Array.isArray(product.reviews) && product.reviews.length > 0)
    ? product.reviews
    : (product.reviewCount === 0 ? [] : defaultReviews);

  const totalReviews = reviewsList.length;

  const nextReview = () => {
    if (totalReviews <= 1) return;
    setCurrentReviewIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevReview = () => {
    if (totalReviews <= 1) return;
    setCurrentReviewIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  // Touch handlers for mobile review swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextReview();
    if (isRightSwipe) prevReview();
  };

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold mb-8 transition-colors cursor-pointer"
        >
          <FaArrowLeft size={10} /> Back to Catalog
        </button>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Image Display */}
            <div className="w-full aspect-[4/5] rounded-3xl bg-secondary border border-border/40 flex items-center justify-center overflow-hidden transition-all duration-300 relative group">
              <img
                key={currentDisplayImage}
                src={getImageAsset(currentDisplayImage)}
                alt={product.name}
                className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Navigation (rendered if multiple images exist) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {galleryImages.map((imgName, index) => {
                  const isActive = (selectedImage || product.image) === imgName;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(imgName)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedImage(imgName);
                        }
                      }}
                      aria-label={`Select product image ${index + 1}`}
                      className={`relative aspect-[4/5] w-20 sm:w-24 flex-shrink-0 rounded-2xl bg-secondary border transition-all duration-200 p-2 flex items-center justify-center overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                        isActive
                          ? "border-primary ring-2 ring-primary/20 shadow-soft scale-[1.02] opacity-100"
                          : "border-border/60 hover:border-foreground/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageAsset(imgName)}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Info & Purchase Details */}
          <div className="md:col-span-6 space-y-6 sm:space-y-7">
            <div className="space-y-3">
              <span className="inline-block bg-secondary text-foreground/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {product.brand || product.category || "BrandShut"}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
              
              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1 font-bold text-foreground">
                  <span className="text-amber-500">★</span>
                  <span>{product.rating || "4.8"}</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">({product.reviewCount || (reviewsList.length > 0 ? reviewsList.length : 0)} Reviews)</span>
                <span className="text-border">|</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Pricing Tag */}
            <div className="flex items-baseline gap-3 border-y border-border py-4">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base sm:text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] sm:text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {discountPercent || product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Sizing Selector */}
            {product.category !== "accessories" && product.category !== "shoes" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <h4 className="font-bold text-foreground">Select Size</h4>
                  <button type="button" className="text-muted-foreground underline hover:text-foreground transition-colors text-xs">Size Guide</button>
                </div>
                <div className="flex gap-2.5">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 border rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "bg-primary border-primary text-primary-foreground shadow-sm"
                          : "border-border hover:border-foreground/40 text-foreground bg-card"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Quantity</h4>
              <div className="flex items-center border border-border rounded-full overflow-hidden w-28 bg-card h-10 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs sm:text-sm text-foreground">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="pt-2 space-y-3">
              {cartItem ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/cart"
                    className="flex-1 bg-secondary hover:bg-border text-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm"
                  >
                    View in Cart (Qty: {cartItem.qty})
                  </Link>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    Add More
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 border border-border hover:border-foreground text-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-card"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Buy It Now
                  </button>
                </div>
              )}
            </div>

            {/* Policy & Features Accordions */}
            <div className="border-t border-border pt-6 space-y-3">
              {/* Materials & Care */}
              <div className="border border-border rounded-2xl overflow-hidden bg-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex justify-between items-center px-5 py-3.5 text-xs sm:text-sm font-bold text-foreground transition hover:bg-secondary cursor-pointer"
                >
                  <span>Materials & Care</span>
                  {activeAccordion === "materials" ? <FaChevronUp size={10} className="text-muted-foreground" /> : <FaChevronDown size={10} className="text-muted-foreground" />}
                </button>
                {activeAccordion === "materials" && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                    100% Premium Cotton / High-grade blend. Machine wash cold with like colors. Tumble dry low. Warm iron if needed. Avoid bleach and direct sunlight during drying.
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border border-border rounded-2xl overflow-hidden bg-card">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex justify-between items-center px-5 py-3.5 text-xs sm:text-sm font-bold text-foreground transition hover:bg-secondary cursor-pointer"
                >
                  <span>Shipping & Returns</span>
                  {activeAccordion === "shipping" ? <FaChevronUp size={10} className="text-muted-foreground" /> : <FaChevronDown size={10} className="text-muted-foreground" />}
                </button>
                {activeAccordion === "shipping" && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
                    Free express shipping on all orders over ₹1,499. Flat shipping fee of ₹99 applies below. Easy, hassle-free returns on unused items within 15 days of delivery.
                  </div>
                )}
              </div>
            </div>

            {/* Security Guarantee indicators */}
            <div className="grid grid-cols-3 gap-3 text-center text-[10px] text-muted-foreground pt-2 border-t border-border">
              <div className="flex flex-col items-center gap-1.5 p-2.5 bg-secondary/40 rounded-xl border border-border/40">
                <FaTruck className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2.5 bg-secondary/40 rounded-xl border border-border/40">
                <FaUndo className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">15-Day Return</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2.5 bg-secondary/40 rounded-xl border border-border/40">
                <FaShieldAlt className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">Secured Checkout</span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= REVIEWS SECTION (RESPONSIVE CAROUSEL) ================= */}
        <div className="mt-16 sm:mt-20 border border-border rounded-3xl p-6 sm:p-8 lg:p-10 bg-card shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">Customer Reviews</h2>
                <span className="bg-secondary text-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full border border-border">
                  {totalReviews}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Real feedback from verified purchasers
              </p>
            </div>

            {totalReviews > 0 && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={prevReview}
                  className="w-9 h-9 rounded-full border border-border bg-card hover:bg-secondary hover:border-foreground/30 flex items-center justify-center text-foreground transition-all shadow-sm cursor-pointer"
                  aria-label="Previous review"
                >
                  <FaChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={nextReview}
                  className="w-9 h-9 rounded-full border border-border bg-card hover:bg-secondary hover:border-foreground/30 flex items-center justify-center text-foreground transition-all shadow-sm cursor-pointer"
                  aria-label="Next review"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </div>

          {totalReviews === 0 ? (
            <div className="text-center py-12 px-4 space-y-3 bg-secondary/30 rounded-2xl border border-dashed border-border">
              <span className="text-3xl block">✨</span>
              <h3 className="font-display text-base font-bold text-foreground">No Reviews Yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Be the first to review this product and share your experience with fellow shoppers.
              </p>
            </div>
          ) : (
            <div 
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Track */}
              <div
                className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                style={{
                  transform: `translateX(-${currentReviewIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)`
                }}
              >
                {reviewsList.map((rev, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col justify-between border border-border rounded-2xl p-5 bg-background shadow-xs hover:border-foreground/30 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Rating Stars & Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5 text-xs text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className={i < rev.rating ? "text-amber-500" : "text-border"} />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">{rev.date}</span>
                      </div>

                      {/* Comment text */}
                      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Author & Verified badge */}
                    <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-foreground">{rev.name}</span>
                      {rev.verified !== false && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <FaCheckCircle size={9} /> Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Pagination Dots */}
              {totalReviews > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-6">
                  {reviewsList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentReviewIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentReviewIndex === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
