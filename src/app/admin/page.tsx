"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Category, MenuItem } from '@/components/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'categories'|'items'>('categories');

  // Forms state
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemCat, setItemCat] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
    } else {
      fetchData();
    }
  }

  async function fetchData() {
    const [catRes, itemRes] = await Promise.all([
      supabase.from('categories').select('*').order('created_at'),
      supabase.from('menu_items').select('*').order('created_at')
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (itemRes.data) setItems(itemRes.data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = catImage;
    if (catImageFile) {
      const uploadedUrl = await uploadImage(catImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const { data, error } = await supabase.from('categories').insert([{ name: catName, image_url: finalImageUrl }]).select();
    if (data) setCategories([...categories, data[0]]);
    if (error) alert('Error: ' + error.message);
    setCatName(''); setCatImage(''); setCatImageFile(null);
    setIsUploading(false);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = itemImage;
    if (itemImageFile) {
      const uploadedUrl = await uploadImage(itemImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const { data, error } = await supabase.from('menu_items').insert([{ 
      name: itemName, description: itemDesc, price: parseFloat(itemPrice), image_url: finalImageUrl, category_id: itemCat 
    }]).select();
    if (data) setItems([...items, data[0]]);
    if (error) alert('Error: ' + error.message);
    setItemName(''); setItemDesc(''); setItemPrice(''); setItemImage(''); setItemImageFile(null); setItemCat('');
    setIsUploading(false);
  }

  async function deleteCategory(id: string) {
    await supabase.from('categories').delete().eq('id', id);
    setCategories(categories.filter(c => c.id !== id));
  }

  async function deleteItem(id: string) {
    await supabase.from('menu_items').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-zinc-900/50 p-4 md:p-6 rounded-2xl border border-zinc-800">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-500">Menu Dashboard</h1>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-white bg-zinc-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Logout</button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4">
          <button onClick={() => setActiveTab('categories')} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${activeTab === 'categories' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>Categories</button>
          <button onClick={() => setActiveTab('items')} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${activeTab === 'items' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'}`}>Menu Items</button>
        </div>

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-4">Add Category</h2>
              <form onSubmit={addCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Name</label>
                  <input required placeholder="e.g. Momo" value={catName} onChange={e=>setCatName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Upload Image</label>
                  <input type="file" accept="image/*" onChange={e=>setCatImageFile(e.target.files?.[0] || null)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-600" />
                </div>
                <div className="text-center text-xs text-zinc-500">- OR -</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Image URL</label>
                  <input placeholder="https://..." value={catImage} onChange={e=>setCatImage(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm" />
                </div>
                <button disabled={isUploading} type="submit" className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold py-2.5 rounded-lg mt-2 disabled:opacity-50">
                  {isUploading ? 'Uploading...' : 'Create Category'}
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {categories.length === 0 && <p className="text-zinc-500">No categories found.</p>}
              {categories.map(c => (
                <div key={c.id} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    {c.image_url && <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-full object-cover border border-zinc-800" />}
                    <span className="font-bold text-lg">{c.name}</span>
                  </div>
                  <button onClick={() => deleteCategory(c.id)} className="text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-4">Add Item</h2>
              <form onSubmit={addItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Category</label>
                  <select required value={itemCat} onChange={e=>setItemCat(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm">
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Name</label>
                  <input required placeholder="e.g. Chicken Steamed Momo" value={itemName} onChange={e=>setItemName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Description</label>
                  <textarea placeholder="Delicious description..." value={itemDesc} onChange={e=>setItemDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm h-24 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Price ($)</label>
                  <input required type="number" step="0.01" placeholder="8.99" value={itemPrice} onChange={e=>setItemPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Upload Image</label>
                  <input type="file" accept="image/*" onChange={e=>setItemImageFile(e.target.files?.[0] || null)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-600" />
                </div>
                <div className="text-center text-xs text-zinc-500">- OR -</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Image URL</label>
                  <input placeholder="https://..." value={itemImage} onChange={e=>setItemImage(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm" />
                </div>
                <button disabled={isUploading} type="submit" className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold py-2.5 rounded-lg mt-2 disabled:opacity-50">
                  {isUploading ? 'Uploading...' : 'Create Item'}
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 && <p className="text-zinc-500">No items found.</p>}
              {items.map(i => (
                <div key={i.id} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    {i.image_url && <img src={i.image_url} alt={i.name} className="w-16 h-16 rounded-lg object-cover border border-zinc-800" />}
                    <div>
                      <span className="font-bold block text-lg">{i.name}</span>
                      <span className="text-amber-500 font-medium">${i.price}</span>
                      <span className="text-zinc-500 text-xs ml-3 bg-zinc-800 px-2 py-1 rounded">{categories.find(c => c.id === i.category_id)?.name}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(i.id)} className="text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
