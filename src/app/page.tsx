import MenuApp from '@/components/MenuApp';
import menuData from '@/data/menu.json';

export default function Home() {
  return <MenuApp initialData={menuData} />;
}
