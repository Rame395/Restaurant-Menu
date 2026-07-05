import { MenuItem } from './types';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex justify-between items-center bg-white border-b border-gray-100 py-4 group cursor-pointer active:bg-gray-50 transition-colors">
      <div className="flex-1 pr-4">
        <h3 className="text-[16px] font-semibold text-gray-900 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-gray-500 text-[13.5px] leading-snug line-clamp-2 mb-2">
            {item.description}
          </p>
        )}
        <span className="text-[15px] font-medium text-gray-800">
          ${item.price.toFixed(2)}
        </span>
      </div>
      
      {item.image_url && (
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shadow-sm relative">
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
