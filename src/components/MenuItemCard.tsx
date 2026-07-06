import { MenuItem } from './types';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-neutral-900 rounded-[20px] overflow-hidden shadow-lg border border-neutral-800/80 flex flex-col group transition-all duration-300 hover:border-neutral-700 relative">
      {/* Subtle hover glow on the card */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#c21820]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Image at the top */}
      <div className="w-full h-[200px] relative overflow-hidden bg-neutral-800">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
      </div>
      
      {/* Content below */}
      <div className="p-4 flex flex-col flex-grow relative z-10">
        <h3 className="text-[18px] font-bold text-white leading-tight mb-2 group-hover:text-[#ff333d] transition-colors">{item.name}</h3>
        
        {item.description && (
          <p className="text-[14px] text-neutral-400 mb-4 line-clamp-2 leading-snug">{item.description}</p>
        )}
        
        <div className="mt-auto flex justify-between items-center pt-1">
          <span className="text-[18px] font-bold text-[#fde047]">
            Rs. {item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
