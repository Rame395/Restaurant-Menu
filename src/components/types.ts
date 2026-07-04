export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}

export interface MenuData {
  categories: Category[];
  items: MenuItem[];
}
