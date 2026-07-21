import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { FcRating } from "react-icons/fc";
import { FaCartPlus, FaArrowLeft, FaShieldAlt, FaTruck, FaUndo, FaMinus, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import API from "../../utils/api";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQty } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Find product by database ID
        const res = await API.get(`/api/v1/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
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
    if (activeAccordion === name) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(name);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center p-8 bg-secondary border border-border rounded-3xl max-w-sm shadow-soft">
          <h2 className="font-display text-xl font-bold text-foreground">Product Not Found</h2>
          <p className="text-muted-foreground my-4 text-sm leading-relaxed">The product you are looking for does not exist or has been removed.</p>
          <Link to="/listing" className="inline-block bg-primary hover:opacity-90 text-primary-foreground font-semibold px-6 py-2.5 rounded-full text-sm transition">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if item is already in cart to show qty update
  const cartItem = cart.find((item) => (item._id || item.id) === product._id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  return (
    <div className="bg-background min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold mb-8 transition-colors"
        >
          <FaArrowLeft size={10} /> Back to Catalog
        </button>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="w-full aspect-[4/5] rounded-3xl bg-secondary border border-border/40 flex items-center justify-center overflow-hidden">
              <img
                src={getImageAsset(product.image)}
                alt={product.name}
                className="max-h-[85%] object-contain hover:scale-102 transition duration-300"
              />
            </div>
            {/* Visual placeholder thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-[4/5] rounded-xl bg-secondary border border-foreground/20 flex items-center justify-center p-2 cursor-pointer overflow-hidden">
                <img src={getImageAsset(product.image)} alt={product.name} className="max-h-full object-contain" />
              </div>
              <div className="aspect-[4/5] rounded-xl bg-secondary border border-transparent hover:border-border flex items-center justify-center p-2 cursor-pointer transition overflow-hidden opacity-60 hover:opacity-100">
                <img src={getImageAsset(product.image)} alt={product.name} className="max-h-full object-contain filter grayscale" />
              </div>
              <div className="aspect-[4/5] rounded-xl bg-secondary border border-transparent hover:border-border flex items-center justify-center p-2 cursor-pointer transition overflow-hidden opacity-60 hover:opacity-100">
                <img src={getImageAsset(product.image)} alt={product.name} className="max-h-full object-contain filter sepia" />
              </div>
              <div className="aspect-[4/5] rounded-xl bg-secondary border border-transparent hover:border-border flex items-center justify-center p-2 cursor-pointer transition overflow-hidden opacity-60 hover:opacity-100">
                <img src={getImageAsset(product.image)} alt={product.name} className="max-h-full object-contain filter brightness-75" />
              </div>
            </div>
          </div>

          {/* Right Column: Info & Purchase Details */}
          <div className="md:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <span className="inline-block bg-secondary text-foreground/70 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {product.brand || "BrandShut"}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
              
              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1 font-bold text-foreground">
                  <span className="text-amber-500">★</span>
                  <span>{product.rating || "4.5"}</span>
                </div>
                <span className="text-border">|</span>
                <span className="underline cursor-pointer hover:text-foreground">({product.reviewCount || 120} Reviews)</span>
                <span className="text-border">|</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
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
                  <span className="text-[10px] sm:text-xs text-red-500 font-bold bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
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
                  <a href="#" className="text-muted-foreground underline hover:text-foreground transition-colors">Size Guide</a>
                </div>
                <div className="flex gap-2.5">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 border rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-primary border-primary text-primary-foreground"
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
              <div className="flex items-center border border-border rounded-xl overflow-hidden w-28 bg-card h-10 shadow-sm">
                <button
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-xs sm:text-sm text-foreground">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 hover:bg-secondary text-muted-foreground font-bold h-full transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="pt-4 space-y-3">
              {cartItem ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/cart"
                    className="flex-1 bg-secondary hover:bg-border text-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm"
                  >
                    View in Cart (Qty: {cartItem.qty})
                  </Link>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50"
                  >
                    Add More
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 border border-border hover:border-foreground text-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy It Now
                  </button>
                </div>
              )}
            </div>

            {/* Policy & Features Accordions */}
            <div className="border-t border-border pt-6 space-y-3.5">
              {/* Materials & Care */}
              <div className="border border-border rounded-2xl overflow-hidden bg-background">
                <button
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex justify-between items-center px-5 py-3 text-xs sm:text-sm font-bold text-foreground transition hover:bg-secondary"
                >
                  <span>Materials & Care</span>
                  {activeAccordion === "materials" ? <FaChevronUp size={10} className="text-muted-foreground" /> : <FaChevronDown size={10} className="text-muted-foreground" />}
                </button>
                {activeAccordion === "materials" && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 animate-slideDown">
                    100% Premium Cotton. Machine wash cold with like colors. Tumble dry low. Warm iron if needed. Avoid bleach and direct sunlight during drying.
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="border border-border rounded-2xl overflow-hidden bg-background">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex justify-between items-center px-5 py-3 text-xs sm:text-sm font-bold text-foreground transition hover:bg-secondary"
                >
                  <span>Shipping & Returns</span>
                  {activeAccordion === "shipping" ? <FaChevronUp size={10} className="text-muted-foreground" /> : <FaChevronDown size={10} className="text-muted-foreground" />}
                </button>
                {activeAccordion === "shipping" && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 animate-slideDown">
                    Free express shipping on all orders over ₹1,499. Flat shipping fee of ₹99 applies below. Easy, hassle-free returns on unused items within 15 days of delivery.
                  </div>
                )}
              </div>
            </div>

            {/* Security Guarantee indicators */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground pt-2 border-t border-border">
              <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-xl">
                <FaTruck className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-xl">
                <FaUndo className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">15-Day Return</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-xl">
                <FaShieldAlt className="text-foreground text-sm" />
                <span className="font-semibold text-foreground/80">Secured Checkout</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="border border-border rounded-3xl p-6 sm:p-8 bg-card shadow-soft mt-12 space-y-6 max-w-7xl">
          <h2 className="font-display text-xl font-bold text-foreground border-b border-border pb-3">Customer Reviews</h2>
          <div className="space-y-6">
            {[
              { name: "Aarav Sharma", rating: 5, date: "May 12, 2026", comment: "Excellent fit and premium fabric quality. Exactly as described, and the delivery was fast!" },
              { name: "Rahul Gupta", rating: 4, date: "April 28, 2026", comment: "Super comfortable for daily office wear. The stitch is really good. Fits nicely." },
              { name: "Vikram Singh", rating: 5, date: "April 15, 2026", comment: "Value for money! Buying shirts online can be tricky, but this one is absolute perfection." }
            ].map((rev, index) => (
              <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-foreground">{rev.name}</span>
                  <span className="text-muted-foreground text-xs font-medium">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rev.rating ? "text-amber-500" : "text-border"}>★</span>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
