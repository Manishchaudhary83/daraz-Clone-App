
import React, { useState, useEffect } from 'react';
import { Language } from '../translations';
import { db } from '../database';

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
  const activeUser = db.getCurrentUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
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
                  {activeUser?.avatar ? (
                    <img src={activeUser.avatar} alt="Avatar" className="w-4 h-4 rounded-full border border-orange-200" />
                  ) : (
                    <span className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white">👤</span>
                  )}
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
          {/* Hamburger Menu */}
          <button 
            onClick={onMenuToggle}
            className="text-gray-700 hover:text-orange-500 p-1 transition-colors flex items-center gap-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Contextual Back Button */}
          {showBackButton && (
            <button 
              onClick={() => onNavigate('home')}
              className="text-gray-700 hover:text-orange-500 p-1 transition-colors flex items-center gap-1 border-l pl-2 ml-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">{t.back}</span>
            </button>
          )}
        </div>

        {/* Logo */}
        <div 
          className="flex-shrink-0 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-[#F85606] flex items-center">
            daraz<span className="text-[#212121]">clone</span>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full ml-0.5 animate-pulse"></div>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
          <input
            type="text"
            className="w-full bg-[#eff0f5] border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-sm py-2 px-3 md:px-4 text-sm outline-none text-gray-800 placeholder-gray-500 transition-all shadow-inner"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-0 top-0 bottom-0 bg-[#F85606] px-3 md:px-6 flex items-center justify-center rounded-r-sm hover:bg-orange-600 transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-8 text-gray-700">
          <div 
            onClick={() => onNavigate('cart')}
            className="cursor-pointer hover:text-orange-500 relative p-1 transition-transform hover:scale-110 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <button 
            onClick={() => onNavigate('seller')}
            className="hidden lg:block bg-[#002F6C] text-white text-[10px] px-6 py-2.5 rounded-sm font-black hover:bg-blue-900 transition-all uppercase tracking-[0.15em] shadow-sm hover:shadow-md"
          >
            {t.sellerCenter}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
