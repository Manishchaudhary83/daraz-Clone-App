
import React, { useState, useRef } from 'react';
import { Language } from '../translations';
import { db } from '../database';
import { GoogleGenAI } from '@google/genai';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (view: string, topic?: string) => void;
  isLoggedIn: boolean;
  username?: string;
  onLogout: () => void;
  cartCount: number;
  onMenuToggle?: () => void;
  showBackButton?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  onNavigate, 
  isLoggedIn, 
  username, 
  onLogout, 
  cartCount,
  onMenuToggle,
  showBackButton,
  language,
  onLanguageChange,
  t
}) => {
  const [query, setQuery] = useState('');
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUser = db.getCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const triggerVisualSearch = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVisualSearching(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: "Identify this product for an e-commerce search. Respond with ONLY the most likely 2-3 word product name or category." }
            ]
          }
        });
        const identifiedQuery = result.text?.trim() || "";
        setQuery(identifiedQuery);
        onSearch(identifiedQuery);
      } catch (err) {
        console.error("Visual search error:", err);
      } finally {
        setIsVisualSearching(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {isVisualSearching && (
        <div className="absolute inset-0 bg-white/90 z-[60] flex items-center justify-center backdrop-blur-sm">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest animate-pulse">AI Visual Analysis Active...</p>
           </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-[#f7f7f7] py-1 hidden md:block text-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <div className="flex gap-4">
             <button 
               onClick={() => onLanguageChange(language === 'en' ? 'ne' : 'en')}
               className="hover:text-orange-500 flex items-center gap-1 border-r pr-4 border-gray-300"
             >
               <span className={language === 'en' ? 'text-orange-600' : ''}>EN</span>
               <span className="text-gray-300 opacity-30">|</span>
               <span className={language === 'ne' ? 'text-orange-600' : ''}>नेपाली</span>
             </button>
             <button onClick={() => onNavigate('seller')} className="hover:text-orange-500">{t.becomeSeller}</button>
          </div>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('info', 'help')} className="hover:text-orange-500">{t.helpSupport}</button>
            {isLoggedIn && (
               <button onClick={() => onNavigate('orders')} className="hover:text-orange-500 border-l pl-6 border-gray-300">{t.trackOrder}</button>
            )}
            {!isLoggedIn ? (
              <>
                <button onClick={() => onNavigate('auth')} className="hover:text-orange-500">{t.login}</button>
                <button onClick={() => onNavigate('auth')} className="hover:text-orange-500">{t.signup}</button>
              </>
            ) : (
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                  <span className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">{username?.charAt(0).toUpperCase()}</span>
                  <span className="text-orange-600 font-black">Hi, {username}</span>
                </div>
                <button onClick={onLogout} className="hover:text-red-500 transition-colors">{t.logout}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <button onClick={onMenuToggle} className="text-gray-700 hover:text-orange-500 p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {showBackButton && (
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-orange-500 p-1 transition-colors flex items-center gap-1 border-l pl-2 ml-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{t.back}</span>
            </button>
          )}
        </div>

        <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-[#F85606] flex items-center">
            daraz<span className="text-[#212121]">clone</span>
          </h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            className="w-full bg-[#eff0f5] border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-sm py-2 pl-3 pr-20 md:pl-4 text-sm outline-none text-gray-800 placeholder-gray-500 transition-all shadow-inner"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <button 
              type="button" 
              onClick={triggerVisualSearch}
              className="px-3 hover:text-orange-500 text-gray-400 transition-colors border-r"
              title="Visual Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <button 
              type="submit"
              className="bg-[#F85606] px-4 md:px-6 h-full flex items-center justify-center rounded-r-sm hover:bg-orange-600 transition-colors"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 md:gap-8 text-gray-700">
          <div onClick={() => onNavigate('cart')} className="cursor-pointer hover:text-orange-500 relative p-1 transition-transform hover:scale-110">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white">{cartCount}</span>}
          </div>
          <button onClick={() => onNavigate('seller')} className="hidden lg:block bg-[#002F6C] text-white text-[10px] px-6 py-2.5 rounded-sm font-black hover:bg-blue-900 transition-all uppercase tracking-[0.15em]">{t.sellerCenter}</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
