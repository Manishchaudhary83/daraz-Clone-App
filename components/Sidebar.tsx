
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

interface SidebarProps {
  onCategoryClick?: (categoryName: string, isSubCategory?: boolean) => void;
  isMobile?: boolean;
  t: any;
}

const Sidebar: React.FC<SidebarProps> = ({ onCategoryClick, isMobile, t }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleExpand = (catId: string) => {
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  return (
    <div className={`bg-white rounded-sm ${isMobile ? 'w-full shadow-none' : 'w-64 border border-gray-100 shadow-sm hidden md:block'}`}>
      <ul className={`${isMobile ? 'divide-y divide-gray-100' : 'py-2'}`}>
        {CATEGORIES.map((cat) => (
          <li key={cat.id} className="group relative">
            <div 
              className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isMobile ? 'px-6 py-4' : 'px-4 py-1.5'}`}
              onClick={() => {
                if (isMobile) {
                  toggleExpand(cat.id);
                } else {
                  onCategoryClick?.(cat.name, false);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm md:text-base">{cat.icon}</span>
                <span className={`${isMobile ? 'text-sm font-semibold' : 'text-[13px] font-medium'} text-gray-700 group-hover:text-orange-500`}>
                  {cat.name}
                </span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 text-gray-400 transition-transform ${isMobile && expandedCategory === cat.id ? 'rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Mobile Subcategories List */}
            {isMobile && expandedCategory === cat.id && (
              <ul className="bg-gray-50 border-b">
                <li 
                  className="px-12 py-3 text-sm text-orange-500 font-bold hover:bg-gray-100 cursor-pointer"
                  onClick={() => onCategoryClick?.(cat.name, false)}
                >
                  {t.allIn} {cat.name}
                </li>
                {cat.subCategories.map((sub, i) => (
                  <li 
                    key={i} 
                    className="px-12 py-3 text-sm text-gray-600 hover:text-orange-500 cursor-pointer"
                    onClick={() => onCategoryClick?.(sub, true)}
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Mega Menu - Desktop Hover */}
            {!isMobile && (
              <div className="invisible group-hover:visible absolute left-full top-0 w-64 bg-white border border-gray-100 shadow-lg z-[100] min-h-full py-4 transition-all opacity-0 group-hover:opacity-100">
                <h4 
                  className="px-6 mb-2 text-sm font-bold text-gray-900 underline decoration-orange-500 underline-offset-4 cursor-pointer hover:text-orange-500"
                  onClick={() => onCategoryClick?.(cat.name, false)}
                >
                  {cat.name}
                </h4>
                <ul className="px-2">
                  {cat.subCategories.map((sub, i) => (
                    <li 
                      key={i} 
                      className="px-4 py-1.5 text-xs text-gray-600 hover:text-orange-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryClick?.(sub, true);
                      }}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
