
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface FlashSaleProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  t: any;
}

const FlashSale: React.FC<FlashSaleProps> = ({ products, onProductClick, t }) => {
  const [timeLeft, setTimeLeft] = useState(12400); // Mock seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="my-6">
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-t-sm border-b">
        <div className="flex items-center gap-8">
          <h2 className="text-[#F85606] font-bold text-lg">{t.flashSale}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-800">{t.onSaleNow}</span>
            <div className="flex gap-2">
              {[h, m, s].map((unit, idx) => (
                <span key={idx} className="bg-[#f85606] text-white px-2 py-1 rounded-sm text-sm font-bold w-10 text-center">
                  {unit.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="border border-orange-500 text-orange-500 px-4 py-1.5 text-xs font-bold rounded-sm hover:bg-orange-50 transition-colors uppercase">
          {t.shopAll}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-0 border-l border-b border-r bg-white">
        {products.map((product) => (
          <div key={product.id} className="border-r border-gray-100 p-2 last:border-r-0">
             <ProductCard product={product} onClick={onProductClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
