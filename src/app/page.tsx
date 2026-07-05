import { supabase } from '@/lib/supabase';
import MenuApp from '@/components/MenuApp';

export const revalidate = 0; // Ensure data is always fresh

export default async function Home() {
  const [categoriesResponse, itemsResponse] = await Promise.all([
    supabase.from('categories').select('*').order('created_at'),
    supabase.from('menu_items').select('*').order('created_at')
  ]);

  const menuData = {
    categories: categoriesResponse.data || [],
    items: itemsResponse.data || []
  };

  return <MenuApp initialData={menuData} />;
}
