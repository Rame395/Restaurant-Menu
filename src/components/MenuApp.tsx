"use client";

import { useState } from 'react';
import { MenuData, Category } from './types';
import MenuGrid from './MenuGrid';

export default function MenuApp({ initialData }: { initialData: MenuData }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeCategoryData = initialData.categories.find(c => c.id === activeCategory);
  
  const filteredItems = initialData.items.filter(
    item => item.category_id === activeCategory
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Top Utility Bar */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
        <div className="flex items-center gap-1 text-[15px] font-medium text-gray-900 cursor-pointer">
          English 
          <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        <div className="text-gray-800">
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {activeCategory === null ? (
        // --- HOME VIEW (Category Grid) ---
        <div className="max-w-3xl mx-auto pb-12">
          {/* Restaurant Header block */}
          <div className="px-4 py-6 flex items-start gap-4">
            <div className="w-[88px] h-[88px] rounded-xl bg-[#A07A60] flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-[#906a50]">
               <div className="relative h-full w-full flex items-center justify-center">
                 <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40"></div>
                 <span className="text-white/90 font-serif tracking-widest text-sm relative z-10">ENLIST</span>
               </div>
            </div>
            <div className="pt-2">
              <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-2">Enlist</h1>
              <div className="flex items-center text-[15px] text-gray-700">
                <span className="text-gray-500 mr-1 text-sm">★</span>
                Customer Reviews 
                <svg className="w-4 h-4 ml-0.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </div>

          {/* 2-Column Category Grid */}
          <div className="px-4 grid grid-cols-2 gap-[14px] mt-2">
            {initialData.categories.map((cat: Category) => (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm cursor-pointer group active:scale-[0.98] transition-transform"
              >
                <img 
                  src={cat.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-3 left-0 w-full text-center px-2">
                  <span className="text-white font-bold text-[15px] drop-shadow-md">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // --- CATEGORY ITEMS VIEW ---
        <div className="max-w-3xl mx-auto bg-white min-h-screen">
          <div className="px-4 py-4 sticky top-[53px] bg-white/95 backdrop-blur-md z-40 border-b border-gray-100 flex items-center gap-3">
            <button 
              onClick={() => setActiveCategory(null)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {activeCategoryData?.name}
            </h2>
          </div>
          
          <div className="pt-2">
            <MenuGrid items={filteredItems} />
          </div>
        </div>
      )}
    </div>
  );
}
