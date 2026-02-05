
import React from 'react';
import { Product } from '../types';
import { Language } from '../translations';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  language?: Language;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, language = 'en' }) => {
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

  return (
    <div 
      onClick={() => onClick?.(product)}
      className="group bg-white rounded-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-transparent hover:border-gray-100 h-full flex flex-col"
    >
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isDarazMall && (
          <div className="absolute top-2 left-2 bg-[#F85606] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-md">
            Mall
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight mb-2 group-hover:text-orange-500 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="text-lg font-bold text-[#F85606]">
            {formattedPrice}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 line-through">{formattedOriginal}</span>
            <span className="text-xs text-gray-800">-{product.discountPercentage}%</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
