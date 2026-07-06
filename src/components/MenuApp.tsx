"use client";

import { useState } from 'react';
import { MenuData, Category } from './types';
import MenuGrid from './MenuGrid';

export default function MenuApp({ initialData }: { initialData: MenuData }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryData = initialData.categories.find(c => c.id === activeCategory);
  
  // Context-Aware Search Logic
  const filteredCategories = initialData.categories.filter(cat => 
    searchQuery.trim() === '' || (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = initialData.items.filter(item => 
    item.category_id === activeCategory &&
    (searchQuery.trim() === '' || 
     (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
     (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery(''); 
  };

  const handleBackClick = () => {
    setActiveCategory(null);
    setSearchQuery(''); 
  };

  return (
    <div className="min-h-screen bg-[#201409] text-neutral-200 font-sans selection:bg-[#c21820]/30">
      {/* Sleek Frosted Glass Top Navigation */}
      <div className="px-4 py-4 sticky top-0 z-50 bg-[#201409]/90 backdrop-blur-xl border-b border-neutral-800/80 shadow-md flex flex-col items-center">
        
        {/* Refined Centered Logo */}
        <div className="flex-shrink-0 cursor-pointer mb-4 transition-transform hover:scale-105" onClick={handleBackClick}>
          <div className="relative inline-flex flex-col items-center justify-center px-6 py-1.5">
            {/* Smooth oval background */}
            <div className="absolute inset-0 bg-[#d91616] rounded-[50%] shadow-[0_4px_12px_rgba(217,22,22,0.4)] border border-[#ff333d]/30"></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-white font-black text-[26px] tracking-wide leading-none" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.5)' }}>
                तुफानी
              </span>
              <span className="text-[#fde047] font-bold text-[13px] italic tracking-widest leading-none self-end -mt-1 -mr-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
                Pizza
              </span>
            </div>
          </div>
        </div>

        {/* Wide, Comfortable Search Bar */}
        <div className="w-full max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder={activeCategory === null ? "Search menu..." : `Search ${activeCategoryData?.name}...`} 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-700/80 hover:border-neutral-500 focus:bg-neutral-800 focus:border-[#d91616] focus:ring-1 focus:ring-[#d91616] rounded-2xl pl-11 pr-10 py-3 text-[16px] text-white placeholder-neutral-400 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          )}
        </div>
      </div>

      {activeCategory === null ? (
        // --- HOME VIEW (Category Grid) ---
        <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
          {/* Dynamic Hero Section */}
          {searchQuery.trim() === '' && (
            <div className="w-full relative overflow-hidden flex flex-col items-center justify-center py-16 mb-4">
              {/* Abstract blurred background shapes */}
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] bg-[#c21820] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-[#fde047] rounded-full blur-[100px] opacity-[0.12] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center px-4 animate-slide-up">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
                  Cravings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff333d] to-[#c21820]">Satisfied.</span>
                </h1>
                <p className="text-neutral-400 text-[15px] sm:text-[17px] font-medium max-w-[280px] sm:max-w-md leading-relaxed">
                  Explore our premium selection of wood-fired pizzas, appetizers, and more.
                </p>
              </div>
            </div>
          )}

          {searchQuery.trim() !== '' && (
            <div className="px-4 py-5 mb-2 border-b border-neutral-900">
              <h2 className="text-[17px] font-bold text-white">Category Results</h2>
              <p className="text-[14px] text-neutral-500 mt-0.5">Found {filteredCategories.length} categories for "{searchQuery}"</p>
            </div>
          )}

          {/* Premium Category Grid */}
          {filteredCategories.length > 0 ? (
            <div className="px-4 grid grid-cols-2 gap-x-5 gap-y-8 mt-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {filteredCategories.map((cat: Category) => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.id)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.4)] cursor-pointer group active:scale-[0.97] transition-all duration-300 border border-neutral-800/40 p-0 outline-none focus:ring-2 focus:ring-[#d91616]"
                >
                  <img 
                    src={cat.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle darkening for contrast, no heavy gradient */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-300">
                    <span 
                      className="text-[#fdf8f5] font-bold text-[20px] sm:text-[24px] tracking-wide"
                      style={{ 
                        fontFamily: 'var(--font-playfair), serif',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 12px rgba(217,119,6,0.6), 1px 1px 0 rgba(0,0,0,0.5)' 
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 px-4 animate-fade-in">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <p className="text-neutral-400 font-medium text-[15px]">No categories matched your search.</p>
            </div>
          )}
        </div>
      ) : (
        // --- CATEGORY ITEMS VIEW ---
        <div className="max-w-3xl mx-auto bg-transparent min-h-screen pb-12 animate-fade-in">
          <div className="px-4 py-4 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <button 
                onClick={handleBackClick}
                className="w-9 h-9 flex items-center justify-center -ml-1 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors cursor-pointer flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <h2 className="text-[20px] font-bold text-white truncate tracking-tight">
                {activeCategoryData?.name}
              </h2>
            </div>
          </div>
          
          {searchQuery.trim() !== '' && (
            <div className="px-4 py-4 border-b border-neutral-900 bg-neutral-950/50">
              <p className="text-[14px] font-medium text-neutral-400">Found {filteredItems.length} items for "{searchQuery}"</p>
            </div>
          )}

          <div className="pt-2 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <MenuGrid items={filteredItems} />
          </div>
        </div>
      )}
    </div>
  );
}
