"use client";

import { useState } from 'react';
import { MenuData } from './types';
import CategoryNav from './CategoryNav';
import MenuGrid from './MenuGrid';

export default function MenuApp({ initialData }: { initialData: MenuData }) {
  const [activeCategory, setActiveCategory] = useState(initialData.categories[0]?.id || '');

  const filteredItems = initialData.items.filter(
    item => item.category_id === activeCategory
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <header className="pt-16 pb-8 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center space-x-2 mb-4">
          <span className="h-px w-8 bg-amber-500/50"></span>
          <span className="text-amber-500 uppercase tracking-[0.2em] text-xs font-bold">Premium Taste</span>
          <span className="h-px w-8 bg-amber-500/50"></span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Our Menu
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
          Explore our carefully curated selection of exquisite dishes, crafted with the finest ingredients.
        </p>
      </header>

      <CategoryNav 
        categories={initialData.categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <main className="pb-12">
        <MenuGrid items={filteredItems} />
      </main>
    </div>
  );
}
