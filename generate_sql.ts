import * as fs from 'fs';

const categories = [
  { name: "Signature Pizza", image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
  { name: "Choice of Pizza", image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80" },
  { name: "Add Ons", image_url: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=500&q=80" },
  { name: "Buckets & Combos", image_url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80" },
  { name: "Wraps", image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80" },
  { name: "Burgers", image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
  { name: "Fried Chicken", image_url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80" },
  { name: "Extra Choices", image_url: "https://images.unsplash.com/photo-1576107222049-7e44a9584483?auto=format&fit=crop&w=500&q=80" },
  { name: "Salad Options", image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
  { name: "Bubble Tea", image_url: "https://images.unsplash.com/photo-1558855567-1a41c2c31c19?auto=format&fit=crop&w=500&q=80" },
  { name: "Hot Coffee", image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80" },
  { name: "Cold Coffee", image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80" },
  { name: "Blended Fusions", image_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=80" },
  { name: "Milk Shakes", image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80" },
  { name: "Tea Selection", image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80" },
  { name: "Iced Tea & Coolers", image_url: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80" },
  { name: "Lassi", image_url: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=500&q=80" },
  { name: "Other Options", image_url: "https://images.unsplash.com/photo-1527960471264-932f2fe4eca3?auto=format&fit=crop&w=500&q=80" },
  { name: "Ice-Cream", image_url: "https://images.unsplash.com/photo-1570197781417-0c7f7669d675?auto=format&fit=crop&w=500&q=80" }
];

const items = [
  // Signature Pizza
  { cat: "Signature Pizza", name: "Tufani Veg Pizza (S)", price: 380, desc: "Paneer and mushroom slice Tandoori Pizza with onion, tomato, and mozzarella cheese on a crispy base topped with yoghurt and herbs sauce." },
  { cat: "Signature Pizza", name: "Tufani Veg Pizza (M)", price: 650, desc: "Paneer and mushroom slice Tandoori Pizza with onion, tomato, and mozzarella cheese on a crispy base topped with yoghurt and herbs sauce." },
  { cat: "Signature Pizza", name: "Tufani Veg Pizza (L)", price: 780, desc: "Paneer and mushroom slice Tandoori Pizza with onion, tomato, and mozzarella cheese on a crispy base topped with yoghurt and herbs sauce." },
  { cat: "Signature Pizza", name: "Tufani Non-Veg Pizza (S)", price: 390, desc: "Grilled chicken strips on crispy flat base with mozzarella cheese, onion, yoghurt & red pepper spiced chicken sauce." },
  { cat: "Signature Pizza", name: "Tufani Non-Veg Pizza (M)", price: 680, desc: "Grilled chicken strips on crispy flat base with mozzarella cheese, onion, yoghurt & red pepper spiced chicken sauce." },
  { cat: "Signature Pizza", name: "Tufani Non-Veg Pizza (L)", price: 790, desc: "Grilled chicken strips on crispy flat base with mozzarella cheese, onion, yoghurt & red pepper spiced chicken sauce." },
  { cat: "Signature Pizza", name: "Super Tufani (M)", price: 750, desc: "Spicy grilled chicken sandwich on bread base topped with cheese, jalapenos, olives, and mozzarella finished with minty sauce." },
  { cat: "Signature Pizza", name: "Super Tufani (L)", price: 850, desc: "Spicy grilled chicken sandwich on bread base topped with cheese, jalapenos, olives, and mozzarella finished with minty sauce." },
  { cat: "Signature Pizza", name: "Tufani Creamy Non-Veg (M)", price: 750, desc: "A mouthwatering signature pizza made with our special Tandoori creamy sauce topped with grilled chicken chunks, mozzarella cheese, onion, bell peppers, tomatoes and fresh herbs." },
  { cat: "Signature Pizza", name: "Tufani Creamy Non-Veg (L)", price: 850, desc: "A mouthwatering signature pizza made with our special Tandoori creamy sauce topped with grilled chicken chunks, mozzarella cheese, onion, bell peppers, tomatoes and fresh herbs." },

  // Choice of Pizza
  { cat: "Choice of Pizza", name: "Chicken Supreme Pizza (S)", price: 320, desc: "Chicken tikka, mushrooms, chicken, onion, tomato and cheese." },
  { cat: "Choice of Pizza", name: "Chicken Supreme Pizza (M)", price: 600, desc: "Chicken tikka, mushrooms, chicken, onion, tomato and cheese." },
  { cat: "Choice of Pizza", name: "Chicken Supreme Pizza (L)", price: 700, desc: "Chicken tikka, mushrooms, chicken, onion, tomato and cheese." },
  { cat: "Choice of Pizza", name: "Chicken BBQ Pizza (S)", price: 350, desc: "BBQ chicken, barbeque sauce, onion, mushroom, and mozzarella." },
  { cat: "Choice of Pizza", name: "Chicken BBQ Pizza (M)", price: 600, desc: "BBQ chicken, barbeque sauce, onion, mushroom, and mozzarella." },
  { cat: "Choice of Pizza", name: "Chicken BBQ Pizza (L)", price: 725, desc: "BBQ chicken, barbeque sauce, onion, mushroom, and mozzarella." },
  { cat: "Choice of Pizza", name: "Himalayan Cheese Pizza (S)", price: 340, desc: "Green bell pepper, mozzarella and cheddar cheese with onion and jalapenos toppings." },
  { cat: "Choice of Pizza", name: "Himalayan Cheese Pizza (M)", price: 680, desc: "Green bell pepper, mozzarella and cheddar cheese with onion and jalapenos toppings." },
  { cat: "Choice of Pizza", name: "Himalayan Cheese Pizza (L)", price: 720, desc: "Green bell pepper, mozzarella and cheddar cheese with onion and jalapenos toppings." },
  { cat: "Choice of Pizza", name: "Chicken Peri Peri Pizza (S)", price: 350, desc: "Hot Peri Peri sauce with cheese, tomatoes, onion, and jalapenos." },
  { cat: "Choice of Pizza", name: "Chicken Peri Peri Pizza (M)", price: 680, desc: "Hot Peri Peri sauce with cheese, tomatoes, onion, and jalapenos." },
  { cat: "Choice of Pizza", name: "Chicken Peri Peri Pizza (L)", price: 760, desc: "Hot Peri Peri sauce with cheese, tomatoes, onion, and jalapenos." },
  { cat: "Choice of Pizza", name: "Veg Pizza (S)", price: 290, desc: "Fresh mozzarella, tomato sauce and mushroom or black olives." },
  { cat: "Choice of Pizza", name: "Veg Pizza (M)", price: 550, desc: "Fresh mozzarella, tomato sauce and mushroom or black olives." },
  { cat: "Choice of Pizza", name: "Veg Pizza (L)", price: 690, desc: "Fresh mozzarella, tomato sauce and mushroom or black olives." },
  { cat: "Choice of Pizza", name: "Chicken Hawaiian Pizza (S)", price: 370, desc: "A thin base topped with our signature sweet pineapple sauce with chicken and corn slices on top, bell pepper and sweet and sour sauce." },
  { cat: "Choice of Pizza", name: "Chicken Hawaiian Pizza (M)", price: 650, desc: "A thin base topped with our signature sweet pineapple sauce with chicken and corn slices on top, bell pepper and sweet and sour sauce." },
  { cat: "Choice of Pizza", name: "Chicken Hawaiian Pizza (L)", price: 740, desc: "A thin base topped with our signature sweet pineapple sauce with chicken and corn slices on top, bell pepper and sweet and sour sauce." },

  // Add Ons
  { cat: "Add Ons", name: "Cheese", price: 50, desc: "" },
  { cat: "Add Ons", name: "Olives", price: 50, desc: "" },
  { cat: "Add Ons", name: "Chicken", price: 80, desc: "" },
  { cat: "Add Ons", name: "Pineapple", price: 50, desc: "" },
  { cat: "Add Ons", name: "Chicken Salami slice", price: 80, desc: "" },
  { cat: "Add Ons", name: "Sausage", price: 60, desc: "" },

  // Buckets & Combos
  { cat: "Buckets & Combos", name: "Gire Bucket", price: 500, desc: "Boneless strip - 1 Pc, Wings - 1 Pc, Leg - 1 Pc, Fries, Cold Drink - 1 btl (Small)" },
  { cat: "Buckets & Combos", name: "10 pcs Fried Chicken Meal", price: 1200, desc: "Crispy fried chicken bucket meal." },
  { cat: "Buckets & Combos", name: "Friendship Bucket", price: 1690, desc: "Tufani Chicken wings - 4 Pcs, Strips - 4 Pcs, Fried Chicken Burger - 2, Fries, Cold drinks jumbo - 1 btl" },
  { cat: "Buckets & Combos", name: "Party Plain-Tufani Combo", price: 2699, desc: "Medium Pizza - 2, Tufani Fried Chicken - 4 Pcs, Fried Chicken Burger - 3 Pcs, French Fries, Chicken Pop Corn, Coke - 1 Jumbo" },

  // Wraps
  { cat: "Wraps", name: "Tufani Chicken Wrap", price: 225, desc: "Spicy Chicken fried veggies and creamy sauce." },
  { cat: "Wraps", name: "Tufani Mushroom Wrap", price: 225, desc: "Spicy Mushroom fried veggies and creamy sauce." },
  { cat: "Wraps", name: "Tufani Crunchy Fried Chicken Wrap", price: 310, desc: "with veggies and whole mozzarella bit wrap." },

  // Burgers
  { cat: "Burgers", name: "Veg Burger", price: 100, desc: "Crispy veg patty with fresh veggies and our signature sauce." },
  { cat: "Burgers", name: "Grilled Chicken Burger", price: 225, desc: "Juicy chicken patty with fresh lettuce and tomato served with french fries." },
  { cat: "Burgers", name: "Fried Chicken Burger", price: 210, desc: "Crispy fried chicken patty with lettuce, onion and our homemade secret sauce." },
  { cat: "Burgers", name: "Tufani Fried Chicken Burger", price: 325, desc: "Extra crispy Tufani fried chicken with off the hook ketchup and fresh bun." },

  // Fried Chicken
  { cat: "Fried Chicken", name: "Tufani Fried Chicken - 2 Pc", price: 250, desc: "Regular" },
  { cat: "Fried Chicken", name: "Tufani Fried Chicken - 4 Pc", price: 480, desc: "Regular" },
  { cat: "Fried Chicken", name: "Chicken Strips - 1 Pc", price: 90, desc: "" },
  { cat: "Fried Chicken", name: "Chicken Strips - 10 Pc", price: 800, desc: "" },

  // Extra Choices
  { cat: "Extra Choices", name: "Regular French Fries", price: 130, desc: "" },
  { cat: "Extra Choices", name: "Tufani French Fries", price: 190, desc: "" },
  { cat: "Extra Choices", name: "Tufani Wiper Chips", price: 150, desc: "" },
  { cat: "Extra Choices", name: "Hot Wings - 6 pcs", price: 380, desc: "" },
  { cat: "Extra Choices", name: "Tufani Potato", price: 150, desc: "" },
  { cat: "Extra Choices", name: "Sweet Gulali", price: 325, desc: "" },
  { cat: "Extra Choices", name: "Chicken Lolly - 2 pcs", price: 350, desc: "" },
  { cat: "Extra Choices", name: "Chicken Lolly - 4 pcs", price: 650, desc: "" },
  { cat: "Extra Choices", name: "Chicken Lolly - 8 pcs", price: 900, desc: "" },
  { cat: "Extra Choices", name: "Loaded Fried Potato", price: 200, desc: "" },
  { cat: "Extra Choices", name: "Tufani Fried Chicken Popcorn", price: 390, desc: "" },
  { cat: "Extra Choices", name: "Chicken Nuggets", price: 250, desc: "" },
  { cat: "Extra Choices", name: "Veg Rice Bowl", price: 160, desc: "" },
  { cat: "Extra Choices", name: "Tufani Grilled Chicken Rice Bowl", price: 200, desc: "" },
  { cat: "Extra Choices", name: "Egg Rice Bowl", price: 170, desc: "" },
  { cat: "Extra Choices", name: "Mix Rice Bowl", price: 230, desc: "" },
  { cat: "Extra Choices", name: "Sausage Rice Bowl", price: 180, desc: "" },
  { cat: "Extra Choices", name: "Chicken Popcorn Rice Bowl", price: 250, desc: "" },

  // Salad Options
  { cat: "Salad Options", name: "Caesar Salad", price: 250, desc: "" },
  { cat: "Salad Options", name: "Coleslaw Salad", price: 150, desc: "" },

  // Bubble Tea
  { cat: "Bubble Tea", name: "Bubble Tea (380 ml)", price: 200, desc: "Flavors: Strawberry, Chocolate, Vanilla, Mango, Kiwi, Honeydew, Peach, Taro, Coffee, Coconut" },

  // Hot Coffee
  { cat: "Hot Coffee", name: "Americano", price: 120, desc: "" },
  { cat: "Hot Coffee", name: "Espresso", price: 100, desc: "" },
  { cat: "Hot Coffee", name: "Cappuccino", price: 170, desc: "" },
  { cat: "Hot Coffee", name: "Cafe Latte", price: 180, desc: "" },
  { cat: "Hot Coffee", name: "Doppio", price: 130, desc: "" },
  { cat: "Hot Coffee", name: "Espresso Macchiato", price: 130, desc: "" },
  { cat: "Hot Coffee", name: "Espresso Affogato", price: 160, desc: "" },
  { cat: "Hot Coffee", name: "Flavored Americano (Single)", price: 160, desc: "" },
  { cat: "Hot Coffee", name: "Flavored Americano (Double)", price: 180, desc: "" },
  { cat: "Hot Coffee", name: "Flavored Cappuccino", price: 200, desc: "" },
  { cat: "Hot Coffee", name: "Flavored Latte", price: 200, desc: "" },
  { cat: "Hot Coffee", name: "Honey Latte", price: 230, desc: "" },
  { cat: "Hot Coffee", name: "Spanish Latte", price: 250, desc: "" },
  { cat: "Hot Coffee", name: "Cafe Mocha", price: 200, desc: "" },
  { cat: "Hot Coffee", name: "Mocha Macchiato", price: 220, desc: "" },

  // Cold Coffee
  { cat: "Cold Coffee", name: "Iced Americano", price: 170, desc: "" },
  { cat: "Cold Coffee", name: "Iced Cappuccino", price: 190, desc: "" },
  { cat: "Cold Coffee", name: "Iced Latte", price: 200, desc: "" },
  { cat: "Cold Coffee", name: "Iced Honey Latte", price: 230, desc: "" },
  { cat: "Cold Coffee", name: "Iced Flavored Latte", price: 250, desc: "" },
  { cat: "Cold Coffee", name: "Cold Coffee with Ice Cream", price: 250, desc: "" },
  { cat: "Cold Coffee", name: "Iced Mocha", price: 250, desc: "" },
  { cat: "Cold Coffee", name: "Iced Caramel Macchiato", price: 250, desc: "" },

  // Blended Fusions
  { cat: "Blended Fusions", name: "Frappe (Choice of Flavor)", price: 250, desc: "" },
  { cat: "Blended Fusions", name: "Blended Vanilla / Strawberry Mocha", price: 260, desc: "" },
  { cat: "Blended Fusions", name: "Fruit Smoothie", price: 280, desc: "" },

  // Milk Shakes
  { cat: "Milk Shakes", name: "Chocolate Shake", price: 150, desc: "" },
  { cat: "Milk Shakes", name: "Vanilla Shake", price: 150, desc: "" },
  { cat: "Milk Shakes", name: "Strawberry Shake", price: 150, desc: "" },
  { cat: "Milk Shakes", name: "Caramel Shake", price: 150, desc: "" },
  { cat: "Milk Shakes", name: "Oreo Shake", price: 160, desc: "" },

  // Tea Selection
  { cat: "Tea Selection", name: "Black Tea", price: 40, desc: "" },
  { cat: "Tea Selection", name: "Milk Tea", price: 60, desc: "" },
  { cat: "Tea Selection", name: "Lemon Tea", price: 80, desc: "" },
  { cat: "Tea Selection", name: "Hot Lemon", price: 80, desc: "" },
  { cat: "Tea Selection", name: "Green Tea", price: 120, desc: "" },
  { cat: "Tea Selection", name: "Hot Lemon with Honey", price: 100, desc: "" },
  { cat: "Tea Selection", name: "Hot Lemon Honey with Ginger", price: 110, desc: "" },

  // Iced Tea & Coolers
  { cat: "Iced Tea & Coolers", name: "Lemon Iced Tea", price: 150, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Peach Iced Tea", price: 170, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Apple Iced Tea", price: 150, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Lemonade", price: 130, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Mint Lemonade", price: 170, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Mint Lime Refresher", price: 110, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Kiwi Lime Refresher", price: 110, desc: "" },
  { cat: "Iced Tea & Coolers", name: "Mojito (Choice of Flavor)", price: 170, desc: "" },

  // Lassi
  { cat: "Lassi", name: "Plain Lassi", price: 120, desc: "" },
  { cat: "Lassi", name: "Sweet Lassi", price: 130, desc: "" },
  { cat: "Lassi", name: "Banana Lassi", price: 150, desc: "" },
  { cat: "Lassi", name: "Vanilla Lassi", price: 150, desc: "" },
  { cat: "Lassi", name: "Chocolate Lassi", price: 160, desc: "" },
  { cat: "Lassi", name: "Strawberry Lassi", price: 160, desc: "" },

  // Other Options
  { cat: "Other Options", name: "Mineral Water", price: 30, desc: "" },
  { cat: "Other Options", name: "Real Juice", price: 50, desc: "" },
  { cat: "Other Options", name: "Cold Drink", price: 60, desc: "" },
  { cat: "Other Options", name: "Hot Milk", price: 100, desc: "" },
  { cat: "Other Options", name: "Hot Chocolate", price: 120, desc: "" },
  { cat: "Other Options", name: "Fresh Lemon Soda", price: 100, desc: "" },
  { cat: "Other Options", name: "Fresh Juice", price: 175, desc: "" },

  // Ice-Cream
  { cat: "Ice-Cream", name: "Ice-Cream (Per Scoop)", price: 75, desc: "Any Flavor" }
];

let sql = `
-- Script to completely seed the database with the Tufani Pizza Menu
-- Run this in your Supabase SQL Editor

-- 1. Wipe existing data
DELETE FROM public.menu_items;
DELETE FROM public.categories;

-- 2. Insert Categories
`;

const getCategoryUUID = (index: number) => {
  return 'a0000000-0000-0000-0000-00000000' + index.toString().padStart(4, '0');
};

categories.forEach((cat, index) => {
  const id = getCategoryUUID(index);
  sql += "INSERT INTO public.categories (id, name, image_url) VALUES ('" + id + "', '" + cat.name.replace(/'/g, "''") + "', '" + cat.image_url + "');\n";
});

sql += "\n-- 3. Insert Menu Items\n";

items.forEach(item => {
  const catIndex = categories.findIndex(c => c.name === item.cat);
  const catId = getCategoryUUID(catIndex);
  sql += "INSERT INTO public.menu_items (category_id, name, description, price) VALUES ('" + catId + "', '" + item.name.replace(/'/g, "''") + "', '" + item.desc.replace(/'/g, "''") + "', " + item.price + ");\n";
});

fs.writeFileSync('seed_menu.sql', sql);
console.log("Created seed_menu.sql successfully!");
