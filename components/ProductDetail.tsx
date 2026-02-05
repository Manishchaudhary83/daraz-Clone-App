
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Language } from '../translations';
import { GoogleGenAI } from '@google/genai';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  t: any;
  language: Language;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBuyNow, t, language }) => {
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [locationStr, setLocationStr] = useState("Bagmati, Kathmandu, New Baneshwor");
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'low'>('checking');
  
  // AI Review Summarizer State
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    setAvailabilityStatus('checking');
    const timer = setTimeout(() => {
      setAvailabilityStatus(product.stock < 10 ? 'low' : 'available');
    }, 1200);
    return () => clearTimeout(timer);
  }, [product.id]);

  const formattedPrice = new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(product.price).replace('NPR', 'Rs.');

  const formattedOriginal = new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(product.originalPrice).replace('NPR', 'Rs.');

  const handleSummarizeReviews = async () => {
    setIsSummarizing(true);
    setReviewSummary(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze simulated customer sentiment for this product: "${product.name}". The overall rating is ${product.rating}/5 with ${product.reviewsCount} reviews. Generate a professional executive summary with a bulleted "Pros" and "Cons" list. Focus on quality, delivery speed, and value for money in the context of the Nepal market.`,
      });
      setReviewSummary(response.text || "No summary could be generated at this time.");
    } catch (err) {
      console.error("Summarizer error:", err);
      setReviewSummary("Unable to analyze reviews. Please ensure your search capability is active.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationStr(`Detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-sm shadow-sm border overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-[450px] p-4 flex flex-col gap-4 border-r border-gray-100">
            <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden border group relative">
              <img src={productImages[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 cursor-zoom-in" />
              {product.isDarazMall && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">DarazMall</div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {productImages.map((img, i) => (
                 <div key={i} onClick={() => setActiveImageIndex(i)} className={`flex-shrink-0 w-16 h-16 border-2 rounded-sm overflow-hidden cursor-pointer transition-all ${activeImageIndex === i ? 'border-orange-500' : 'border-transparent opacity-60'}`}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
               <span>Home</span><span>/</span><span>{product.category}</span><span>/</span><span className="text-gray-900">{product.subCategory}</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <span className="text-sm text-blue-500 font-bold">{product.reviewsCount} Ratings</span>
              </div>
              <div className="h-4 w-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2 text-xs">
                {availabilityStatus === 'checking' ? 'Querying API...' : availabilityStatus === 'low' ? <span className="text-red-500 font-black uppercase">Low Stock</span> : <span className="text-green-600 font-black uppercase">In Stock</span>}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm mb-8 border-l-4 border-orange-500">
              <div className="text-4xl font-black text-[#F85606] mb-1">{formattedPrice}</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 line-through font-bold">{formattedOriginal}</span>
                <span className="text-gray-900 font-black bg-white px-2 py-0.5 rounded shadow-sm">-{product.discountPercentage}% OFF</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest w-20">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 rounded bg-white overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-2 hover:bg-gray-50 border-r-2">-</button>
                  <span className="px-8 py-2 text-sm font-black">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-5 py-2 hover:bg-gray-50 border-l-2">+</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button onClick={() => onBuyNow(product, qty)} className="flex-1 bg-[#2ABBE8] text-white py-4 px-8 rounded-sm font-black hover:bg-blue-500 transition-all uppercase tracking-[0.2em] text-xs">Buy Now</button>
                <button onClick={() => onAddToCart(product, qty)} className="flex-1 bg-[#F85606] text-white py-4 px-8 rounded-sm font-black hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-xs">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="lg:w-[320px] bg-gray-50 p-6 flex flex-col gap-6 border-l border-gray-100">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Delivery</span>
                <button onClick={handleDetectLocation} disabled={isDetecting} className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{isDetecting ? 'Locating...' : 'Auto-Detect'}</button>
              </div>
              <div className="flex items-start gap-3 mb-6 bg-white p-3 rounded border border-gray-100 shadow-sm">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div className="flex-1 text-xs font-bold leading-tight">{locationStr}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <div className="flex-1"><p className="text-xs font-black uppercase tracking-tighter">Standard Delivery</p></div>
                  <span className="text-xs font-black">{product.freeShipping ? 'FREE' : 'Rs. 150'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">AI Review Summary</h2>
            {!reviewSummary && !isSummarizing && (
              <button 
                onClick={handleSummarizeReviews} 
                className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-200 transition-colors"
              >
                ✨ Summarize Reviews
              </button>
            )}
          </div>
          
          {isSummarizing ? (
            <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-gray-100 rounded w-3/4"></div>
               <div className="h-4 bg-gray-100 rounded w-1/2"></div>
               <div className="h-4 bg-gray-100 rounded w-5/6"></div>
               <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest text-center mt-4">Gemini is synthesizing feedback...</p>
            </div>
          ) : reviewSummary ? (
            <div className="text-sm text-gray-600 font-medium leading-relaxed prose-sm">
              <div className="bg-orange-50/50 p-6 rounded border border-orange-100 whitespace-pre-line relative">
                <div className="absolute top-2 right-4 opacity-10 text-4xl">✨</div>
                {reviewSummary}
              </div>
              <button onClick={() => setReviewSummary(null)} className="mt-4 text-[10px] text-gray-400 font-black uppercase hover:text-orange-500 underline tracking-widest">Refresh Analysis</button>
            </div>
          ) : (
            <div className="text-center py-10 opacity-30">
              <div className="text-4xl mb-4">🔮</div>
              <p className="text-xs text-gray-500 font-bold italic">Deep insight available. Click to generate AI summary.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Full Specifications</h2>
          <div className="text-sm text-gray-600 font-medium leading-relaxed space-y-4">
            <p>The {product.name} is a high-performance {product.category} item designed for reliability and efficiency. Standardized for the Nepal region with full local warranty support.</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="p-3 bg-gray-50 border rounded text-[10px] font-black uppercase tracking-widest text-gray-400">
                  SKU: DZ-{product.id.split('-')[1]}
               </div>
               <div className="p-3 bg-gray-50 border rounded text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Seller: Verified Tier 1
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
