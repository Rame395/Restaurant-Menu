import { MenuItem } from './types';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:bg-zinc-800/80 transition-all duration-300 shadow-xl backdrop-blur-md flex flex-col h-full group">
      {item.image_url && (
        <div className="relative w-full h-48 overflow-hidden bg-zinc-950">
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-400 transition-colors duration-300">{item.name}</h3>
          <span className="text-amber-500 font-bold whitespace-nowrap bg-amber-500/10 px-3 py-1 rounded-full text-sm">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
          {item.description}
        </p>
      </div>
    </div>
  );
}
