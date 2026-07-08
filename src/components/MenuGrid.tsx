import { MenuItem } from './types';
import MenuItemCard from './MenuItemCard';

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p className="text-sm">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
