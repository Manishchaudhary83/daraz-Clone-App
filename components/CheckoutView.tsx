
import React, { useState } from 'react';
import { Product } from '../types';
import { Language } from '../translations';

interface CheckoutItem {
  product: Product;
  quantity: number;
}

interface CheckoutViewProps {
  items: CheckoutItem[];
  onPlaceOrder: (paymentMethod: string, total: number) => void;
  language: Language;
  t: any;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ items, onPlaceOrder, language, t }) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('COD');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Logic: If any item in the order has freeShipping, apply a discount on shipping or make it 0
  const hasFreeShipping = items.every(item => item.product.freeShipping);
  const standardDeliveryFee = 150;
  const deliveryFee = hasFreeShipping ? 0 : standardDeliveryFee;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => 
    new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price).replace('NPR', 'Rs.');

  const paymentOptions = [
    { id: 'COD', label: language === 'en' ? 'Cash on Delivery' : 'डेलिभरीमा नगद', icon: '💵', desc: 'Pay when you receive' },
    { id: 'eSewa', label: 'eSewa', icon: '🟢', desc: 'Secure Instant Payment' },
    { id: 'Khalti', label: 'Khalti', icon: '🟣', desc: 'Pay via Khalti Wallet' },
    { id: 'IME Pay', label: 'IME Pay', icon: '🔴', desc: 'Reliable Local Payment' },
    { id: 'Moru', label: 'Moru', icon: '🔵', desc: 'Digital Wallet' },
    { id: 'Bank', label: language === 'en' ? 'Bank Transfer' : 'बैंक ट्रान्सफर', icon: '🏦', desc: 'Direct Transfer' },
    { id: 'Debit Card', label: language === 'en' ? 'Debit/Credit Card' : 'डेबिट/क्रेडिट कार्ड', icon: '💳', desc: 'All Major Cards' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black">1</div>
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Mock */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Shipping Address
            </h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-black text-gray-800">John Doe</p>
                <p className="text-sm text-gray-600 mt-1">Kathmandu, New Baneshwor, House #123</p>
                <p className="text-sm text-gray-600">Bagmati, Nepal | +977 9801234567</p>
              </div>
              <button className="text-orange-500 text-xs font-black uppercase tracking-widest hover:underline">Edit</button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Select Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => setSelectedPayment(opt.id)}
                  className={`p-4 border-2 rounded-sm cursor-pointer transition-all flex items-center justify-between group ${selectedPayment === opt.id ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === opt.id ? 'border-orange-500' : 'border-gray-300'}`}>
                      {selectedPayment === opt.id && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{opt.label}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{opt.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Package ({items.length} Items)</h3>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img src={item.product.image} className="w-16 h-16 object-cover border rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-gray-800">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                <span>Items Subtotal</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                <span>Shipping Fee</span>
                <span className={`text-gray-900 ${hasFreeShipping ? 'line-through opacity-40' : ''}`}>
                  {formatPrice(standardDeliveryFee)}
                </span>
              </div>
              {hasFreeShipping && (
                <div className="flex justify-between text-[13px] font-black text-green-600 uppercase tracking-wide bg-green-50 p-2 rounded-sm">
                  <span>Shipping Discount</span>
                  <span>- {formatPrice(standardDeliveryFee)}</span>
                </div>
              )}
              
              <div className="pt-6 border-t-2 border-gray-50 mt-6 flex justify-between text-2xl font-black text-gray-900 uppercase tracking-tighter">
                <span>Total</span>
                <span className="text-orange-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              onClick={() => onPlaceOrder(selectedPayment, total)}
              className="w-full bg-[#F85606] text-white font-black py-5 rounded-sm shadow-xl hover:bg-orange-700 transition-all uppercase tracking-[0.2em] text-xs flex flex-col items-center gap-1"
            >
              <span>Place Order</span>
              <span className="text-[10px] opacity-70">Secured with 256-bit encryption</span>
            </button>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
              <div className="flex gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-lg">🛡️</span>
                <span className="text-lg">🔒</span>
                <span className="text-lg">✅</span>
              </div>
              <p className="text-[9px] text-gray-400 text-center font-black uppercase tracking-[0.2em]">Daraz Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
