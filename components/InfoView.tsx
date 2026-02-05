
import React from 'react';
import { Language } from '../translations';

interface InfoViewProps {
  topic: string;
  onNavigateHome: () => void;
  language: Language;
}

const InfoView: React.FC<InfoViewProps> = ({ topic, onNavigateHome, language }) => {
  const getContent = () => {
    switch (topic) {
      case 'help':
        return {
          title: 'Help Center',
          content: 'Welcome to the Daraz Clone Help Center. Here you can find answers to frequently asked questions about orders, payments, and account management. Our support team is available 24/7 to assist you with any queries regarding your shopping experience.'
        };
      case 'how-to-buy':
        return {
          title: 'How to Buy',
          content: 'Buying on Daraz Clone is easy! 1. Search for the product you want. 2. Add it to your cart. 3. Proceed to checkout. 4. Choose your payment method (eSewa, Khalti, IME Pay, Moru, Card or Bank). 5. Receive your order at your doorstep! We ensure high quality and fast delivery for all our customers.'
        };
      case 'returns':
        return {
          title: 'Returns & Refunds',
          content: 'We offer a 7-day return policy for most items. If you are not satisfied with your purchase or received a defective item, you can initiate a return request through your account dashboard. Once verified, we will process your refund within 3-5 business days.'
        };
      case 'about':
        return {
          title: 'About Us',
          content: 'Daraz Clone is the leading marketplace in the region, connecting millions of buyers and sellers. Our mission is to provide a seamless shopping experience with high-quality products and reliable delivery. We are committed to empowering local businesses and providing the best deals to our users.'
        };
      case 'payments':
        return {
          title: 'Digital Payments',
          content: 'We support a wide range of local and international digital payment options including eSewa, Khalti, IME Pay, and Moru. For standard transactions, we also support all major Debit/Credit cards and Direct Bank Transfers. Your transactions are secure and encrypted using industry-standard protocols. Enjoy special discounts and cashback offers when paying through our digital partners.'
        };
      default:
        return { title: 'Information', content: 'Page content is currently being updated. Please check back later.' };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[500px]">
      <div className="bg-white p-8 md:p-12 rounded shadow-sm border border-gray-100">
        <nav className="flex items-center gap-2 mb-8 text-[11px] text-gray-400 uppercase font-black tracking-widest">
          <button onClick={onNavigateHome} className="hover:text-orange-500 transition-colors">Home</button>
          <span>/</span>
          <span className="text-gray-900">{title}</span>
        </nav>
        
        <h1 className="text-3xl font-black text-gray-800 mb-8 border-b-4 border-orange-500 pb-4 inline-block uppercase tracking-tight">{title}</h1>
        
        <div className="text-gray-600 leading-relaxed space-y-8 text-lg">
          <p className="font-bold text-gray-900 leading-snug">{content}</p>
          
          <div className="bg-gray-50 p-8 rounded-sm border-l-8 border-orange-500 shadow-inner">
            <h3 className="font-black text-gray-800 mb-3 uppercase tracking-tight">Safe & Verified Transactions</h3>
            <p className="text-[15px] font-medium text-gray-600">Our platform uses advanced encryption and 2FA where applicable to ensure every payment is verified and your financial data stays private. We do not store sensitive card information on our servers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-white border border-gray-100 rounded-sm shadow-sm">
               <h4 className="font-black text-gray-800 mb-2 uppercase text-xs tracking-widest text-orange-600">Local Gateways</h4>
               <p className="text-sm font-medium text-gray-500">Fast checkout via eSewa, Khalti, IME Pay, and Moru mobile wallets.</p>
            </div>
            <div className="p-6 bg-white border border-gray-100 rounded-sm shadow-sm">
               <h4 className="font-black text-gray-800 mb-2 uppercase text-xs tracking-widest text-orange-600">Standard Methods</h4>
               <p className="text-sm font-medium text-gray-500">Supports VISA, Mastercard, UnionPay, and direct transfers from all major banks in Nepal.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-50">
          <button 
            onClick={onNavigateHome}
            className="bg-[#F85606] text-white px-10 py-4 rounded-sm font-black shadow-xl hover:bg-orange-700 transition-all uppercase tracking-[0.2em] text-xs"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoView;
