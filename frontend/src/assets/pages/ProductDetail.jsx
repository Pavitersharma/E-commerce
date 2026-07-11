import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getImageAsset } from "../../utils/imageHelper";
import { FcRating } from "react-icons/fc";
import { FaCartPlus, FaArrowLeft, FaChevronRight, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 pt-20">
        <div className="text-center p-8 bg-white border border-zinc-200 rounded-2xl max-w-sm shadow-sm">
          <h2 className="text-xl font-bold text-zinc-800">Product Not Found</h2>
          <p className="text-zinc-500 my-4">The product you are looking for does not exist or has been removed.</p>
          <Link to="/listing" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition">
            Back to Shop
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

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 text-sm font-semibold mb-6 transition"
        >
          <FaArrowLeft size={12} /> Back to Products
        </button>

        {/* Product Details Section */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-2xl p-4 sm:p-6 min-h-[250px] sm:min-h-[350px] lg:min-h-[450px]">
            <img
              src={getImageAsset(product.image)}
              alt={product.name}
              className="max-h-[350px] lg:max-h-[450px] object-contain hover:scale-105 transition duration-300"
            />
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {product.brand || "Fashion Hub"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <div className="flex items-center gap-1 font-semibold">
                  <FcRating />
                  <span>{product.rating || "4.5"}</span>
                </div>
                <span className="text-zinc-300">|</span>
                <span className="underline cursor-pointer hover:text-blue-600">{product.reviewCount || 120} Reviews</span>
                <span className="text-zinc-300">|</span>
                <span className="text-green-600 font-medium">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-4 border-y border-zinc-100 py-3">
                <span className="text-3xl font-black text-zinc-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-zinc-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                      {discountPercent || product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-zinc-600 text-sm leading-relaxed">{product.description}</p>

              {/* Size Selector */}
              {product.category !== "accessories" && product.category !== "shoes" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-zinc-800">Select Size</h4>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 border rounded-xl font-bold text-xs flex items-center justify-center transition ${
                          selectedSize === size
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-zinc-300 hover:border-zinc-400 text-zinc-700 bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-zinc-800">Quantity</h4>
                <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden w-28 bg-white">
                  <button
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-zinc-800">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCartPlus size={18} /> Add to Cart
              </button>

              {/* Guarantee badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-500 pt-2">
                <div className="flex flex-col items-center gap-1 border border-zinc-100 rounded-xl p-2 bg-zinc-50/50">
                  <FaTruck className="text-blue-500 text-base" />
                  <span className="font-semibold text-zinc-700">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-zinc-100 rounded-xl p-2 bg-zinc-50/50">
                  <FaUndo className="text-blue-500 text-base" />
                  <span className="font-semibold text-zinc-700">7-Day Return</span>
                </div>
                <div className="flex flex-col items-center gap-1 border border-zinc-100 rounded-xl p-2 bg-zinc-50/50">
                  <FaShieldAlt className="text-blue-500 text-base" />
                  <span className="font-semibold text-zinc-700">Secured Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm mt-8 space-y-6">
          <h2 className="text-lg font-bold text-zinc-800 border-b border-zinc-100 pb-3">Customer Reviews</h2>
          <div className="space-y-4">
            {[
              { name: "Aarav Sharma", rating: 5, date: "May 12, 2026", comment: "Excellent fit and premium fabric quality. Exactly as described, and the delivery was fast!" },
              { name: "Rahul Gupta", rating: 4, date: "April 28, 2026", comment: "Super comfortable for daily office wear. The stitch is really good. Fits nicely." },
              { name: "Vikram Singh", rating: 5, date: "April 15, 2026", comment: "Value for money! Buying shirts online can be tricky, but this one is absolute perfection." }
            ].map((rev, index) => (
              <div key={index} className="border-b border-zinc-100 last:border-0 pb-4 last:pb-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-zinc-800">{rev.name}</span>
                  <span className="text-zinc-400 text-xs">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rev.rating ? "text-yellow-400" : "text-zinc-200"}>★</span>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
