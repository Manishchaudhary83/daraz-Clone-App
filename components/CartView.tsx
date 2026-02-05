
import React, { useState } from 'react';
import { Product } from '../types';
import { Language } from '../translations';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartViewProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onCheckout: (paymentMethod: any) => void;
  onProductClick: (product: Product) => void;
  onGoShopping: () => void;
  t: any;
  language: Language;
}

const CartView: React.FC<CartViewProps> = ({ items, onRemove, onUpdateQty, onCheckout, onProductClick, onGoShopping, t, language }) => {
  const [selectedPayment, setSelectedPayment] = useState<'COD' | 'eSewa' | 'Khalti' | 'IME Pay' | 'Moru' | 'Bank' | 'Debit Card'>('COD');
  
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = items.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const formatPrice = (price: number) => 
    new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price).replace('NPR', 'Rs.');

  const paymentOptions = [
    { id: 'COD', label: language === 'en' ? 'Cash on Delivery' : 'डेलिभरीमा नगद', icon: '💵' },
    { id: 'eSewa', label: 'eSewa', icon: '🟢' },
    { id: 'Khalti', label: 'Khalti', icon: '🟣' },
    { id: 'IME Pay', label: 'IME Pay', icon: '🔴' },
    { id: 'Moru', label: 'Moru', icon: '🔵' },
    { id: 'Bank', label: language === 'en' ? 'Bank Transfer' : 'बैंक ट्रान्सफर', icon: '🏦' },
    { id: 'Debit Card', label: language === 'en' ? 'Debit/Credit Card' : 'डेबिट/क्रेडिट कार्ड', icon: '💳' },
  ];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center bg-white rounded-sm shadow-sm mt-8 border">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your Cart is Empty!</h2>
        <p className="text-gray-500 mb-8 font-medium">Add items to it now to start shopping</p>
        <button 
          onClick={onGoShopping}
          className="bg-[#F85606] text-white px-12 py-4 rounded-sm font-black shadow-lg hover:bg-orange-700 transition-all uppercase tracking-widest text-sm"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tight">{t.addToCart} ({items.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-sm shadow-sm border hidden md:grid md:grid-cols-12 gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <div className="md:col-span-6">Product</div>
            <div className="md:col-span-2 text-center">Price</div>
            <div className="md:col-span-2 text-center">Quantity</div>
            <div className="md:col-span-2 text-center">Total</div>
          </div>
          
          {items.map((item) => (
            <div key={item.product.id} className="bg-white p-4 rounded-sm shadow-sm border grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-6 flex gap-4">
                <img 
                  src={item.product.image} 
                  className="w-24 h-24 object-cover rounded border-2 border-gray-100 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => onProductClick(item.product)}
                />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 
                      className="text-[15px] font-black text-gray-900 line-clamp-1 cursor-pointer hover:text-orange-500 transition-colors uppercase tracking-tight"
                      onClick={() => onProductClick(item.product)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">{item.product.category}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.product.id)}
                    className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:bg-red-50 px-2 py-1 border border-red-100 rounded-sm w-fit transition-colors"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-2 text-center text-sm font-black text-gray-900">
                {formatPrice(item.product.price)}
              </div>
              
              <div className="md:col-span-2 flex justify-center">
                <div className="flex items-center border-2 border-gray-100 rounded-sm bg-gray-50">
                  <button 
                    onClick={() => onUpdateQty(item.product.id, -1)}
                    className="px-4 py-2 hover:bg-gray-200 border-r-2 border-gray-100 transition-colors text-gray-900 font-black"
                  >
                    -
                  </button>
                  <span className="px-5 text-sm font-black min-w-[3rem] text-center text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQty(item.product.id, 1)}
                    className="px-4 py-2 hover:bg-gray-200 border-l-2 border-gray-100 transition-colors text-gray-900 font-black"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-2 text-center text-lg font-black text-orange-600">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Payment */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-sm shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-black text-gray-800 mb-8 border-b-2 border-gray-50 pb-4 uppercase tracking-tight">{t.orderSummary}</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                <span>{t.subtotal} ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                <span>{t.shipping}</span>
                <span className="text-gray-900">{formatPrice(shipping)}</span>
              </div>
              
              <div className="pt-6 border-t-2 border-gray-50 mt-6 flex justify-between text-2xl font-black text-gray-900 uppercase tracking-tighter">
                <span>{t.total}</span>
                <span className="text-orange-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Methods Selection */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Select Payment Method</h3>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <label 
                    key={opt.id} 
                    className={`flex items-center justify-between p-3 border-2 rounded-sm cursor-pointer transition-all ${selectedPayment === opt.id ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        className="w-4 h-4 accent-orange-500"
                        checked={selectedPayment === opt.id}
                        onChange={() => setSelectedPayment(opt.id as any)}
                      />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-wider">{opt.label}</span>
                    </div>
                    <span className="text-xl">{opt.icon}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => onCheckout(selectedPayment)}
              className="w-full bg-[#F85606] text-white font-black py-5 rounded-sm shadow-2xl hover:bg-orange-700 transition-all uppercase tracking-[0.25em] text-xs"
            >
              {t.checkout}
            </button>
            
            <div className="mt-8 pt-8 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 text-center uppercase font-black tracking-[0.3em] mb-4">Official Payment Partners</p>
              <div className="grid grid-cols-3 gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">ESEWA</div>
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">KHALTI</div>
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">IME PAY</div>
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">MORU</div>
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">BANK</div>
                 <div className="text-[9px] font-black text-center border p-1 rounded-sm bg-gray-50">CARD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
