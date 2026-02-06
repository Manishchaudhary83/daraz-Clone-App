
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
        contents: `Analyze market trends and simulated customer satisfaction for this specific product: "${product.name}". 
        Stats: ${product.rating}/5 stars, ${product.reviewsCount} reviews.
        Task: Provide a professional "AI Executive Summary" in 3-4 bullet points focusing on Pros and Cons. 
        Tone: Authoritative, helpful marketplace agent. Context: E-commerce in Nepal.`,
      });
      setReviewSummary(response.text || "Insight engine returned empty response.");
    } catch (err) {
      console.error("AI Insight Error:", err);
      setReviewSummary("Failed to synthesize product insights. Please check your network connection.");
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
                 <div key={i} onClick={() => setActiveImageIndex(i)} className={`flex-shrink-0 w-16 h-16 border-2 rounded-sm overflow-hidden cursor-pointer transition-all ${activeImageIndex === i ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
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
                {availabilityStatus === 'checking' ? <span className="animate-pulse text-gray-400">Verifying Inventory...</span> : availabilityStatus === 'low' ? <span className="text-red-500 font-black uppercase">Critical Stock</span> : <span className="text-green-600 font-black uppercase">Optimized Stock</span>}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm mb-8 border-l-4 border-orange-500 shadow-sm">
              <div className="text-4xl font-black text-[#F85606] mb-1">{formattedPrice}</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 line-through font-bold">{formattedOriginal}</span>
                <span className="text-gray-900 font-black bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">-{product.discountPercentage}% SECURED DEAL</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest w-20">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 rounded bg-white overflow-hidden shadow-sm">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-2 hover:bg-gray-50 border-r-2 transition-colors">-</button>
                  <span className="px-8 py-2 text-sm font-black min-w-[60px] text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-5 py-2 hover:bg-gray-50 border-l-2 transition-colors">+</button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button onClick={() => onBuyNow(product, qty)} className="flex-1 bg-[#2ABBE8] text-white py-4 px-8 rounded-sm font-black hover:bg-blue-500 transition-all uppercase tracking-[0.2em] text-xs shadow-md">Buy Now</button>
                <button onClick={() => onAddToCart(product, qty)} className="flex-1 bg-[#F85606] text-white py-4 px-8 rounded-sm font-black hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-xs shadow-md">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="lg:w-[320px] bg-gray-50 p-6 flex flex-col gap-6 border-l border-gray-100">
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Global Logistics</span>
                <button onClick={handleDetectLocation} disabled={isDetecting} className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline transition-all">
                  {isDetecting ? 'Querying...' : 'Auto-Sync Location'}
                </button>
              </div>
              <div className="flex items-start gap-3 mb-6 bg-gray-50 p-3 rounded border border-gray-100 italic">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div className="flex-1 text-[11px] font-bold leading-tight text-gray-600">{locationStr}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <div className="flex-1"><p className="text-[10px] font-black uppercase tracking-tighter">Verified Standard Shipping</p></div>
                  <span className="text-[10px] font-black">{product.freeShipping ? 'COMPLIMENTARY' : 'Rs. 150'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 neural-scan">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <span className="bg-orange-500 text-white p-1 rounded text-xs">AI</span>
              Insight Engine
            </h2>
            {!reviewSummary && !isSummarizing && (
              <button 
                onClick={handleSummarizeReviews} 
                className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-200 transition-all shadow-sm"
              >
                ✨ Synthesize Feedback
              </button>
            )}
          </div>
          
          {isSummarizing ? (
            <div className="space-y-4">
               <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
               <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
               <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
               <div className="mt-6 flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] text-center">Processing Multi-Source Sentiment...</p>
               </div>
            </div>
          ) : reviewSummary ? (
            <div className="text-sm text-gray-600 font-medium leading-relaxed">
              <div className="bg-orange-50/30 p-6 rounded-lg border border-orange-100 whitespace-pre-line relative shadow-inner">
                <div className="absolute top-2 right-4 opacity-5 text-6xl">🤖</div>
                {reviewSummary}
              </div>
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => setReviewSummary(null)} className="text-[10px] text-gray-400 font-black uppercase hover:text-orange-500 underline tracking-widest transition-colors">Invalidate Cache</button>
                <span className="text-[9px] text-gray-300 font-bold italic">Generated by Gemini 3 Flash</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-4 opacity-10">🧠</div>
              <p className="text-xs text-gray-400 font-bold italic mb-4">Click to aggregate customer insights using AI Decision Support.</p>
              <button onClick={handleSummarizeReviews} className="text-[10px] font-black text-orange-500 uppercase tracking-widest border border-orange-500/20 px-6 py-2 rounded-full hover:bg-orange-50 transition-all">Start Analysis</button>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tight">Enterprise Specifications</h2>
          <div className="text-sm text-gray-600 font-medium leading-relaxed space-y-4">
            <p>The {product.name} is verified for high-traffic marketplace standards. Optimized for reliability within the Nepal regional infrastructure.</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="p-4 bg-gray-50 border border-gray-100 rounded text-[10px] font-black uppercase tracking-widest text-gray-500 flex flex-col gap-1">
                  <span className="opacity-40">System SKU</span>
                  DZ-{product.id.split('-')[1]}
               </div>
               <div className="p-4 bg-gray-50 border border-gray-100 rounded text-[10px] font-black uppercase tracking-widest text-gray-500 flex flex-col gap-1">
                  <span className="opacity-40">Verification</span>
                  Verified Tier 1
               </div>
            </div>
            <div className="mt-4 p-4 border border-green-100 bg-green-50/50 rounded flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Quality Assurance Pass: 2024.12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
