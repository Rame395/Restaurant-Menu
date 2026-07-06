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
        <div className="flex flex-col gap-1 mb-2">
          <h3 className="text-[18px] font-bold text-white leading-tight group-hover:text-[#ff333d] transition-colors flex items-center gap-2">
            {item.name}
            {item.size && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#c21820] text-white">
                {item.size}
              </span>
            )}
          </h3>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {tag.toLowerCase() === 'veg' ? <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> : null}
                  {tag.toLowerCase() === 'non-veg' ? <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> : null}
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
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
