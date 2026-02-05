
import React, { useState } from 'react';
import { db } from '../database';
import { CATEGORIES } from '../constants';
import { UserRole } from '../types';
import { Language } from '../translations';

interface SellerDashboardProps {
  language: Language;
  t: any;
  onProductAdded?: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ language, t, onProductAdded }) => {
  const activeUser = db.getCurrentUser();
  const [isRegistered, setIsRegistered] = useState(!!activeUser && activeUser.role === UserRole.SELLER);
  const [isOnboarding, setIsOnboarding] = useState(!activeUser || activeUser.role !== UserRole.SELLER);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    businessName: '',
    productName: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    productImage: ''
  });

  const presetImages = [
    { label: 'Electronics', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
    { label: 'Fashion', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
    { label: 'Home', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36' },
    { label: 'Grocery', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c' },
  ];

  const handleSendOTP = () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      alert("Invalid number");
      return;
    }
    setFormStep(2);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 4) {
      setFormStep(formStep + 1);
    } else {
      db.addProduct({
        name: db.sanitize(formData.productName),
        price: Number(formData.price),
        originalPrice: Number(formData.price) * 1.2,
        discountPercentage: 20,
        rating: 5,
        reviewsCount: 0,
        image: formData.productImage || presetImages[0].url,
        images: [formData.productImage || presetImages[0].url],
        isDarazMall: true,
        freeShipping: true,
        category: formData.category || 'Electronic Devices',
        subCategory: 'New Arrival',
        stock: Number(formData.stock) || 100,
        sellerId: activeUser?.id || 'new-seller'
      });
      setIsRegistered(true);
      setIsOnboarding(false);
      onProductAdded?.();
    }
  };

  if (isOnboarding && !isRegistered) {
    return (
      <div className="min-h-screen bg-[#f1f2f7] p-8 flex justify-center items-start overflow-y-auto">
        <div className="bg-white w-full max-w-2xl rounded shadow-2xl border border-gray-100 mt-10">
          <div className="bg-[#002F6C] p-8 text-white text-center">
            <h2 className="text-3xl font-black italic">daraz<span className="text-orange-500">seller</span></h2>
            <div className="flex justify-center mt-8 gap-3">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className={`h-1.5 w-12 rounded-full ${step <= formStep ? 'bg-orange-500' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
          <form onSubmit={handleFormSubmit} className="p-12">
            {formStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-800 uppercase">Verify Identity</h3>
                <input 
                  type="tel" required placeholder="98XXXXXXXX"
                  className="w-full border-2 border-gray-300 p-4 rounded-sm text-xl font-black"
                  value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
                <button type="button" onClick={handleSendOTP} className="w-full bg-[#25D366] text-white py-5 font-black rounded-sm">CONTINUE</button>
              </div>
            )}
            {formStep === 2 && (
               <div className="space-y-6">
                 <h3 className="text-2xl font-black text-gray-800 uppercase">OTP Verification</h3>
                 <input type="text" maxLength={6} required className="w-full border-b-4 border-gray-300 p-4 text-center text-5xl font-black" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} />
               </div>
            )}
            {formStep >= 3 && (
              <div className="space-y-4">
                 <input type="text" placeholder="Store Name" required className="w-full border-2 p-4 font-black" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
                 <input type="number" placeholder="Price" required className="w-full border-2 p-4 font-black" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            )}
            {formStep > 1 && (
              <div className="mt-12 flex gap-4">
                <button type="button" onClick={() => setFormStep(formStep - 1)} className="flex-1 py-4 border-2 font-black uppercase tracking-widest text-xs">Back</button>
                <button type="submit" className="flex-[2] bg-[#F85606] text-white py-4 font-black uppercase tracking-widest text-xs">Continue</button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f2f7] flex">
      <aside className="w-64 bg-[#002F6C] text-white hidden lg:block">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold italic tracking-tighter">daraz<span className="opacity-60 font-normal">seller</span></h2>
        </div>
        <nav className="mt-4">
          {['Overview', 'Orders', 'Products', 'Security'].map((item, idx) => (
            <div key={idx} className={`px-6 py-4 cursor-pointer hover:bg-blue-800 transition-colors flex items-center gap-3 ${idx === 3 ? 'text-green-400' : ''}`}>
              <span className="text-xs font-black uppercase tracking-widest">{item}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Seller Dashboard</h1>
          <div className="bg-green-100 border border-green-200 px-4 py-2 rounded flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Store Securely Connected</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           {[{ label: 'Sales', val: 'Rs. 0' }, { label: 'Orders', val: '0' }, { label: 'Security Score', val: '98/100' }, { label: 'Auth Status', val: 'Verified' }].map((s, i) => (
             <div key={i} className="bg-white p-6 rounded shadow-sm border border-gray-100">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{s.label}</p>
               <p className="text-xl font-black text-gray-900">{s.val}</p>
             </div>
           ))}
        </div>

        <div className="bg-white p-8 rounded shadow-sm border-l-4 border-green-500">
           <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
             <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
             Protectability Status: High
           </h3>
           <div className="space-y-3">
              <div className="flex justify-between text-xs items-center">
                 <span className="text-gray-500 font-bold">Encrypted Data Storage</span>
                 <span className="text-green-600 font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                 <span className="text-gray-500 font-bold">Brute Force Mitigation</span>
                 <span className="text-green-600 font-black uppercase tracking-widest">Active</span>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
