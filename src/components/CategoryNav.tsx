import { Category } from './types';

interface Props {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelectCategory }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800/50 py-4 mb-8 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-6 pb-4 pt-2 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="flex flex-col items-center gap-3 snap-start group outline-none min-w-max"
            >
              <div className={`
                w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 relative
                ${activeCategory === category.id 
                  ? 'ring-4 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] transform scale-110' 
                  : 'ring-2 ring-zinc-800 group-hover:ring-zinc-600 opacity-70 group-hover:opacity-100'}
              `}>
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${activeCategory === category.id ? 'opacity-0' : 'opacity-100 group-hover:opacity-50'}`}></div>
              </div>
              <span className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${activeCategory === category.id ? 'text-amber-500' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
