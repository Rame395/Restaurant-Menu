import { MenuItem } from './types';
import MenuItemCard from './MenuItemCard';

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500 bg-zinc-900/20 rounded-3xl mx-4 sm:mx-auto max-w-7xl border border-zinc-900 border-dashed">
        <p className="text-lg">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {items.map(item => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
