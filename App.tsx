
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import FlashSale from './components/FlashSale';
import SellerDashboard from './components/SellerDashboard';
import ProductDetail from './components/ProductDetail';
import AuthView from './components/AuthView';
import CartView from './components/CartView';
import InfoView from './components/InfoView';
import CheckoutView from './components/CheckoutView';
import OrdersView from './components/OrdersView';
import Chatbot from './components/Chatbot';
import ContactUs from './components/ContactUs';
import { db, UserDB } from './database';
import { Product } from './types';
import { translations, Language } from './translations';

interface CartItem {
  product: Product;
  quantity: number;
}

const BANNER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200&h=600",
    title: "Midsummer Mega Sale",
    subtitle: "Up to 70% Off on Brands",
    tag: "Exclusive Offer"
  },
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=600",
    title: "New Fashion Arrivals",
    subtitle: "Upgrade your wardrobe today",
    tag: "Trendy Picks"
  },
  {
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200&h=600",
    title: "Premium Tech Gadgets",
    subtitle: "Latest tech at unbeatable prices",
    tag: "Gadget Week"
  },
  {
    url: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=1200&h=600",
    title: "Home & Grocery Sale",
    subtitle: "Stock up on essentials",
    tag: "Best Value"
  },
  {
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200&h=600",
    title: "Flash Beauty Deals",
    subtitle: "Skin care & Makeup must-haves",
    tag: "Limited Time"
  }
];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState('home');
  const [infoTopic, setInfoTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserDB | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const t = translations[language];

  useEffect(() => {
    const activeUser = db.getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
      setIsLoggedIn(true);
    }
    setAllProducts(db.getProducts());
  }, []);

  useEffect(() => {
    if (currentView === 'home') {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [currentView]);

  const refreshProducts = () => {
    setAllProducts(db.getProducts());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setCurrentView('search');
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (categoryName: string, isSubCategory = false) => {
    if (isSubCategory) {
      setSelectedSubCategory(categoryName);
    } else {
      setSelectedCategory(categoryName);
      setSelectedSubCategory(null);
    }
    setSearchQuery('');
    setCurrentView('search');
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleNavigate = (view: string, topic: string = '') => {
    setCurrentView(view);
    setInfoTopic(topic);
    setIsSidebarOpen(false);
    if (view === 'home') {
      setSelectedProduct(null);
      setSearchQuery('');
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setInfoTopic('');
    }
    window.scrollTo(0, 0);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsDesktopSidebarVisible(!isDesktopSidebarVisible);
    }
  };

  const handleAuthSuccess = (authenticatedUser: UserDB) => {
    setUser(authenticatedUser);
    setIsLoggedIn(true);
    setCurrentView('home');
    toast.success(language === 'en' ? `Welcome back, ${authenticatedUser.name}!` : `स्वागत छ, ${authenticatedUser.name}!`);
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('home');
    toast.info(language === 'en' ? 'Logged out successfully' : 'सफलतापूर्वक लग-आउट भयो');
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    
    toast.success(
      language === 'en' 
        ? `${quantity} item(s) added to cart!` 
        : `${quantity} सामग्री कार्टमा थपियो!`,
      { position: 'top-right', autoClose: 3000 }
    );
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    if (!isLoggedIn) {
      toast.info(language === 'en' ? "Please login to proceed with Buy Now!" : "किन्नको लागि कृपया लग-इन गर्नुहोस्!");
      setCurrentView('auth');
      return;
    }
    setCheckoutItems([{ product, quantity }]);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleCartToCheckout = () => {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      toast.info(language === 'en' ? "Please login to proceed to checkout!" : "चेकआउट गर्नका लागि कृपया लग-इन गर्नुहोस्!");
      setCurrentView('auth');
      return;
    }
    setCheckoutItems(cart);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = (paymentMethod: string, totalAmount: number) => {
    if (!user) return;

    db.saveOrder({
      customerName: user.name,
      products: checkoutItems.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
      totalAmount: totalAmount,
      status: 'Pending' as any,
      createdAt: new Date().toISOString(),
      paymentMethod: paymentMethod as any
    });

    const msg = language === 'en' 
      ? `Order placed successfully via ${paymentMethod}! Total: Rs. ${totalAmount}` 
      : `अर्डर सफलतापूर्वक गरियो (${paymentMethod} मार्फत)! कुल रकम: Rs. ${totalAmount}`;
    
    toast.success(msg, { position: 'top-center', autoClose: 5000 });
    
    if (checkoutItems === cart) {
      setCart([]);
    }
    
    setCheckoutItems([]);
    setCurrentView('orders');
    window.scrollTo(0, 0);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) => 
      prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
    toast.info(language === 'en' ? 'Item removed from cart' : 'कार्टबाट सामग्री हटाइयो');
  };

  const filteredProducts = allProducts.filter(p => {
    if (selectedSubCategory) {
      return p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase();
    }
    if (selectedCategory) {
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    }
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (currentView === 'seller') {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <div className="bg-[#002F6C] px-4 py-2 flex justify-between items-center text-white text-xs">
            <span>{language === 'en' ? `Welcome, ${user?.name || 'Seller'} (Authorized)` : `स्वागत छ, ${user?.name || 'बिक्रेता'}`}</span>
            <button 
              onClick={() => handleNavigate('home')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded font-bold"
            >
              {t.back.toUpperCase()}
            </button>
          </div>
        </div>
        <div className="pt-8">
          <SellerDashboard language={language} t={t} onProductAdded={refreshProducts} />
        </div>
        <ToastContainer theme="colored" />
      </>
    );
  }

  const resultTitle = selectedSubCategory || selectedCategory || (searchQuery ? `"${searchQuery}"` : "Products");

  return (
    <div className="min-h-screen flex flex-col relative">
      <Chatbot language={language} />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className={`fixed left-0 top-0 bottom-0 z-[101] w-72 bg-white transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center bg-[#F85606] text-white">
          <span className="font-bold uppercase tracking-wide">{t.categories}</span>
          <button onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-full">
           <Sidebar onCategoryClick={handleCategoryClick} isMobile t={t} />
        </div>
      </div>

      <Navbar 
        onSearch={handleSearch} 
        onNavigate={handleNavigate} 
        isLoggedIn={isLoggedIn}
        username={user?.name}
        onLogout={handleLogout}
        cartCount={cartCount}
        onMenuToggle={toggleSidebar}
        showBackButton={currentView !== 'home'}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {currentView === 'home' && (
        <main className="flex-1">
          <section className="bg-white pt-4 pb-8 border-b">
            <div className="container mx-auto px-4 flex gap-4">
              {isDesktopSidebarVisible && (
                <div className="hidden md:block">
                  <Sidebar onCategoryClick={handleCategoryClick} t={t} />
                </div>
              )}
              <div className="flex-1 relative group cursor-pointer overflow-hidden rounded-sm h-[250px] md:h-[384px]">
                {BANNER_IMAGES.map((banner, index) => (
                  <div 
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentBanner ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
                  >
                    <img 
                      src={banner.url} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-12 text-white">
                      <span className="text-orange-500 font-bold tracking-widest text-xs md:sm uppercase mb-1 md:mb-2 text-shadow">
                        {banner.tag}
                      </span>
                      <h2 className="text-2xl md:text-5xl font-black max-w-md leading-tight mb-2 md:mb-4 drop-shadow-lg uppercase text-shadow-lg">
                        {banner.title}
                      </h2>
                      <p className="text-sm md:text-lg font-medium mb-4 md:mb-6 drop-shadow-md">
                        {banner.subtitle}
                      </p>
                      <button className="bg-[#F85606] text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold w-fit hover:bg-orange-600 shadow-xl transition-all text-sm md:text-base">
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {BANNER_IMAGES.map((_, index) => (
                    <button 
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentBanner(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner ? 'bg-orange-500 w-6' : 'bg-white/50 w-2 hover:bg-white'}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            <FlashSale products={allProducts.slice(0, 6)} onProductClick={handleProductClick} t={t} />

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{t.justForYou}</h2>
                <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">{t.seeMore}</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={handleProductClick} language={language} />
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {currentView === 'product-detail' && selectedProduct && (
        <div className="flex-1 bg-gray-50">
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            t={t}
            language={language}
          />
        </div>
      )}

      {currentView === 'cart' && (
        <div className="flex-1 bg-gray-50">
          <CartView 
            items={cart} 
            onRemove={handleRemoveFromCart} 
            onUpdateQty={handleUpdateCartQty} 
            onCheckout={handleCartToCheckout}
            onProductClick={handleProductClick}
            onGoShopping={() => handleNavigate('home')}
            t={t}
            language={language}
          />
        </div>
      )}

      {currentView === 'checkout' && (
        <div className="flex-1 bg-gray-50">
          <CheckoutView 
            items={checkoutItems}
            onPlaceOrder={handlePlaceOrder}
            language={language}
            t={t}
          />
        </div>
      )}

      {currentView === 'orders' && user && (
        <div className="flex-1 bg-gray-50">
          <OrdersView 
            customerName={user.name}
            language={language}
            t={t}
          />
        </div>
      )}

      {currentView === 'auth' && (
        <AuthView 
          onAuthSuccess={handleAuthSuccess} 
          onNavigateHome={() => handleNavigate('home')} 
          language={language}
          t={t}
        />
      )}

      {currentView === 'info' && (
        <div className="flex-1 bg-gray-50">
          <InfoView topic={infoTopic} onNavigateHome={() => handleNavigate('home')} language={language} />
        </div>
      )}

      {currentView === 'contact' && (
        <div className="flex-1 bg-gray-50">
          <ContactUs 
            language={language} 
            t={t} 
            onNavigateHome={() => handleNavigate('home')} 
          />
        </div>
      )}

      {currentView === 'search' && (
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8 text-[11px] text-gray-400 font-black uppercase tracking-widest">
            <button className="cursor-pointer hover:text-orange-500 transition-colors" onClick={() => handleNavigate('home')}>{t.home}</button>
            <span>/</span>
            <span className="text-gray-900">{resultTitle}</span>
          </div>
          
          <div className="flex gap-8">
            {isDesktopSidebarVisible && (
              <div className="hidden lg:block">
                <Sidebar onCategoryClick={handleCategoryClick} t={t} />
              </div>
            )}
            <div className="flex-1">
              <div className="mb-6 pb-2 border-b-2 border-gray-50 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Results for {resultTitle}</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">{filteredProducts.length} items found</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={handleProductClick} language={language} />
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 mt-auto border-t-4 border-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-orange-500">{t.customerCare}</h4>
              <ul className="space-y-4 text-[13px] font-medium opacity-60">
                <li onClick={() => handleNavigate('info', 'help')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.helpSupport}</li>
                <li onClick={() => handleNavigate('info', 'how-to-buy')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.howToBuy}</li>
                <li onClick={() => handleNavigate('info', 'returns')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.returnsRefunds}</li>
                <li onClick={() => handleNavigate('contact')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.contactUs}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-orange-500">{t.darazClone}</h4>
              <ul className="space-y-4 text-[13px] font-medium opacity-60">
                <li onClick={() => handleNavigate('info', 'about')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.aboutUs}</li>
                <li onClick={() => handleNavigate('info', 'payments')} className="hover:opacity-100 hover:text-orange-400 cursor-pointer transition-all">{t.digitalPayments}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-orange-500">{t.sellOnDaraz}</h4>
              <button 
                onClick={() => handleNavigate('seller')}
                className="bg-[#F85606] text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase shadow-2xl hover:bg-orange-600 transition-all tracking-[0.2em]"
              >
                {language === 'en' ? 'Start Selling' : 'बेच्न सुरु गर्नुहोस्'}
              </button>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-orange-500">{t.downloadApp}</h4>
              <div className="flex gap-4">
                <div onClick={() => alert("App Store")} className="bg-white/5 p-3 rounded-sm cursor-pointer font-black text-[9px] border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest">APP STORE</div>
                <div onClick={() => alert("Play Store")} className="bg-white/5 p-3 rounded-sm cursor-pointer font-black text-[9px] border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest">PLAY STORE</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 text-center flex flex-col items-center gap-4">
            <p className="font-black text-[10px] uppercase tracking-[0.4em] opacity-30">© {new Date().getFullYear()} Daraz Clone Platform • Built for Enterprise Scale</p>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
               <span className="text-[9px] font-black uppercase tracking-widest opacity-60">System Architecture: Tier-1 Verified</span>
            </div>
          </div>
        </div>
      </footer>
      
      <ToastContainer theme="colored" />
    </div>
  );
};

export default App;
