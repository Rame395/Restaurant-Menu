-- Run this script in the Supabase SQL Editor to create your database tables and policies.

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anyone can read)
CREATE POLICY "Allow public read access on categories" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access on menu_items" 
ON public.menu_items FOR SELECT USING (true);

-- Create policies for admin access (authenticated users can insert/update/delete)
CREATE POLICY "Allow authenticated users to manage categories" 
ON public.categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage menu_items" 
ON public.menu_items FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial dummy data (optional)
INSERT INTO public.categories (id, name, image_url) VALUES 
('c1000000-0000-0000-0000-000000000000', 'Momo', 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=200&q=80'),
('c2000000-0000-0000-0000-000000000000', 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=80');

INSERT INTO public.menu_items (category_id, name, description, price, image_url) VALUES 
('c1000000-0000-0000-0000-000000000000', 'Chicken Steamed Momo', 'Authentic Himalayan dumplings.', 8.99, 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=500&q=80'),
('c2000000-0000-0000-0000-000000000000', 'Margherita Pizza', 'Classic delight with 100% real mozzarella cheese.', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80');
