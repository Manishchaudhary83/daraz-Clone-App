
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Language } from '../translations';

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

  // SIMULATED REAL-TIME AVAILABILITY CHECK
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

  const openInMaps = () => {
    const url = coords 
      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
      : `https://www.google.com/maps/search/${encodeURIComponent(locationStr)}`;
    window.open(url, '_blank');
  };

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="bg-white rounded-sm shadow-sm border overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery */}
          <div className="lg:w-[450px] p-4 flex flex-col gap-4 border-r border-gray-100">
            <div className="aspect-square bg-gray-50 rounded-sm overflow-hidden border group relative">
              <img 
                src={productImages[activeImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 cursor-zoom-in"
              />
              {product.isDarazMall && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">
                  DarazMall
                </div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {productImages.map((img, i) => (
                 <div 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-sm overflow-hidden cursor-pointer transition-all ${activeImageIndex === i ? 'border-orange-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                 >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 flex flex-col">
            <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
               <span>Home</span>
               <span>/</span>
               <span>{product.category}</span>
               <span>/</span>
               <span className="text-gray-900">{product.subCategory}</span>
            </nav>

            <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-blue-500 font-bold">{product.reviewsCount} Ratings</span>
              </div>
              <div className="h-4 w-[1px] bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest">Live Check:</span>
                {availabilityStatus === 'checking' ? (
                  <span className="text-xs text-gray-400 animate-pulse font-bold">Querying API...</span>
                ) : availabilityStatus === 'low' ? (
                  <span className="text-xs text-red-500 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                    LOW STOCK (Only {product.stock} left)
                  </span>
                ) : (
                  <span className="text-xs text-green-600 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    IN STOCK
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm mb-8 border-l-4 border-orange-500">
              <div className="text-4xl font-black text-[#F85606] mb-1">
                {formattedPrice}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 line-through font-bold">{formattedOriginal}</span>
                <span className="text-sm text-gray-900 font-black bg-white px-2 py-0.5 rounded shadow-sm">-{product.discountPercentage}% OFF</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <span className="text-xs text-gray-400 font-black uppercase tracking-widest w-20">Quantity</span>
                <div className="flex items-center border-2 border-gray-100 rounded bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-2 hover:bg-gray-50 border-r-2 text-gray-600 font-black">-</button>
                  <span className="px-8 py-2 text-sm font-black text-gray-900">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-5 py-2 hover:bg-gray-50 border-l-2 text-gray-600 font-black">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button 
                  onClick={() => onBuyNow(product, qty)}
                  className="flex-1 bg-[#2ABBE8] text-white py-4 px-8 rounded-sm font-black hover:bg-blue-500 transition-all uppercase tracking-[0.2em] text-xs shadow-lg"
                >
                  Buy Now
                </button>
                <button 
                  onClick={() => onAddToCart(product, qty)}
                  className="flex-1 bg-[#F85606] text-white py-4 px-8 rounded-sm font-black hover:bg-orange-600 transition-all uppercase tracking-[0.2em] text-xs shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Panel */}
          <div className="lg:w-[320px] bg-gray-50 p-6 flex flex-col gap-6 border-l border-gray-100">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Delivery</span>
                <button onClick={handleDetectLocation} disabled={isDetecting} className="text-[10px] text-blue-600 font-black hover:underline flex items-center gap-1 uppercase tracking-widest">
                  {isDetecting ? 'Locating...' : 'Auto-Detect'}
                </button>
              </div>
              
              <div className="flex items-start gap-3 mb-6 bg-white p-3 rounded border border-gray-100 shadow-sm">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <div className="flex-1">
                  <p className="text-xs text-gray-800 font-bold leading-tight mb-1">{locationStr}</p>
                  <button onClick={openInMaps} className="text-[10px] text-orange-600 font-black hover:underline uppercase tracking-tighter">View Address on Map</button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Standard Delivery</p>
                    <p className="text-[10px] text-gray-500 font-bold">Arrives in 2-4 days</p>
                  </div>
                  <span className={`ml-auto text-xs font-black ${product.freeShipping ? 'text-green-600' : 'text-gray-900'}`}>
                    {product.freeShipping ? 'FREE' : 'Rs. 150'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-500 font-bold">Verified for this product</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-4 block">Store Service</span>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">7 Days Returns</p>
                    <p className="text-[10px] text-gray-500 font-bold">Money back guarantee</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-tighter">Authorized Seller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 bg-white p-8 rounded-sm shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 mb-6 border-b-2 border-gray-50 pb-4 uppercase tracking-tight">Full Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-gray-600">
          <div className="space-y-4 font-medium leading-relaxed">
            <p>The {product.name} represents the pinnacle of {product.category} engineering, offering unparalleled performance and reliability. Sourced directly from authorized distributors to ensure authenticity.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Category-leading power efficiency</li>
              <li>Sleek, ergonomic industrial design</li>
              <li>12-month manufacturer warranty included</li>
              <li>DarazMall verified genuine product</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded border border-dashed border-gray-200">
            <h4 className="font-black text-gray-800 text-xs uppercase tracking-[0.2em] mb-4">Logistics Information</h4>
            <p className="text-[12px] font-bold leading-tight text-gray-500 mb-4">Packaged with reinforced materials to prevent transit damage. Tracking ID will be provided immediately upon warehouse departure.</p>
            <p className="text-[12px] font-bold leading-tight text-gray-500">Weight: 1.2kg (Est.)<br/>Dimensions: 20cm x 15cm x 10cm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
