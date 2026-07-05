import { Category } from './types';

interface Props {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelectCategory }: Props) {
  return (
    <div className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-4 py-4 pt-5 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="flex flex-col items-center gap-2 snap-start group outline-none min-w-max"
              >
                <div className={`
                  w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden transition-all duration-200 relative
                  ${isActive 
                    ? 'ring-2 ring-white ring-offset-4 ring-offset-black scale-105' 
                    : 'ring-1 ring-zinc-800 opacity-80 group-hover:opacity-100 group-hover:ring-zinc-600'}
                `}>
                  <img 
                    src={category.image_url} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {!isActive && <div className="absolute inset-0 bg-black/30"></div>}
                </div>
                <span className={`text-[13px] font-medium transition-colors duration-200 mt-1 ${isActive ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
