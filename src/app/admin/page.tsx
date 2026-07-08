"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Category, MenuItem } from '@/components/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard'|'categories'|'items'>('dashboard');

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
  const [itemSize, setItemSize] = useState('');
  const [itemTags, setItemTags] = useState('');

  const [isUploading, setIsUploading] = useState(false);

  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    checkUser();
    
    // Theme init
    const storedTheme = localStorage.getItem('admin-theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin-theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('admin-theme', 'light');
    }
  }

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
      showToast('Error uploading image: ' + uploadError.message, 'error');
      return null;
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // --- Category Actions ---
  function resetCategoryForm() {
    setCatName(''); setCatImage(''); setCatImageFile(null); setEditingCategoryId(null);
  }

  function handleEditCategory(c: Category) {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatImage(c.image_url || '');
    setCatImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = catImage;
    if (catImageFile) {
      const uploadedUrl = await uploadImage(catImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    if (editingCategoryId) {
      const { data, error } = await supabase.from('categories').update({ name: catName, image_url: finalImageUrl }).eq('id', editingCategoryId).select();
      if (data) {
        setCategories(categories.map(c => c.id === editingCategoryId ? data[0] : c));
        showToast('Category updated successfully!');
        resetCategoryForm();
      }
      if (error) showToast('Error: ' + error.message, 'error');
    } else {
      const { data, error } = await supabase.from('categories').insert([{ name: catName, image_url: finalImageUrl }]).select();
      if (data) {
        setCategories([...categories, data[0]]);
        showToast('Category added successfully!');
        resetCategoryForm();
      }
      if (error) showToast('Error: ' + error.message, 'error');
    }
    setIsUploading(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category? This will also delete all items in it.')) return;
    await supabase.from('categories').delete().eq('id', id);
    setCategories(categories.filter(c => c.id !== id));
    setItems(items.filter(i => i.category_id !== id));
    showToast('Category deleted', 'success');
  }

  // --- Item Actions ---
  function resetItemForm() {
    setItemName(''); setItemDesc(''); setItemPrice(''); setItemImage(''); setItemImageFile(null); setItemCat(''); setItemSize(''); setItemTags(''); setEditingItemId(null);
  }

  function handleEditItem(i: MenuItem) {
    setEditingItemId(i.id);
    setItemName(i.name);
    setItemDesc(i.description || '');
    setItemPrice(i.price.toString());
    setItemImage(i.image_url || '');
    setItemImageFile(null);
    setItemCat(i.category_id);
    setItemSize(i.size || '');
    setItemTags(i.tags ? i.tags.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    let finalImageUrl = itemImage;
    if (itemImageFile) {
      const uploadedUrl = await uploadImage(itemImageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const payload = { 
      name: itemName, 
      description: itemDesc, 
      price: parseFloat(itemPrice), 
      image_url: finalImageUrl, 
      category_id: itemCat,
      size: itemSize || null,
      tags: itemTags ? itemTags.split(',').map(t => t.trim()).filter(Boolean) : null
    };

    if (editingItemId) {
      const { data, error } = await supabase.from('menu_items').update(payload).eq('id', editingItemId).select();
      if (data) {
        setItems(items.map(i => i.id === editingItemId ? data[0] : i));
        showToast('Item updated successfully!');
        resetItemForm();
      }
      if (error) showToast('Error: ' + error.message, 'error');
    } else {
      const { data, error } = await supabase.from('menu_items').insert([payload]).select();
      if (data) {
        setItems([...items, data[0]]);
        showToast('Item added successfully!');
        resetItemForm();
      }
      if (error) showToast('Error: ' + error.message, 'error');
    }
    setIsUploading(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    setItems(items.filter(i => i.id !== id));
    showToast('Item deleted', 'success');
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300">
       <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col md:flex-row font-sans text-gray-900 dark:text-white transition-colors duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-sm font-bold flex items-center gap-2 animate-bounce-in ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.type === 'error' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex-shrink-0 md:h-screen sticky top-0 overflow-y-auto z-10 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between md:justify-start">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-[#A07A60] flex items-center justify-center text-white font-serif font-bold text-xs shadow-sm border border-[#906a50]">EN</div>
             <span className="font-bold text-lg tracking-tight dark:text-white">Admin Console</span>
          </div>
          <button onClick={handleLogout} className="md:hidden text-sm text-gray-500 dark:text-neutral-400 font-medium hover:text-gray-900 dark:hover:text-white cursor-pointer">Logout</button>
        </div>
        <nav className="p-4 space-y-1 overflow-x-auto md:overflow-visible flex md:block whitespace-nowrap scrollbar-hide">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full text-left ${activeTab === 'dashboard' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full text-left ${activeTab === 'categories' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            Categories
          </button>
          <button onClick={() => setActiveTab('items')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full text-left ${activeTab === 'items' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Menu Items
          </button>
        </nav>
        
        {/* Bottom Actions */}
        <div className="hidden md:block absolute bottom-0 w-64 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-300">
           
           <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
             <button onClick={toggleTheme} className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer w-full text-left">
               <span className="flex items-center gap-3">
                 {theme === 'light' ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                 ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                 )}
                 {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
               </span>
             </button>
           </div>
           
           <div className="p-4">
             <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer w-full text-left">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
               Log Out
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
           
           {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm flex items-center gap-5 transition-colors duration-300">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-0.5">Total Categories</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{categories.length}</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm flex items-center gap-5 transition-colors duration-300">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-0.5">Total Menu Items</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{items.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Categories</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm md:sticky md:top-6 transition-colors duration-300">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
                    <form onSubmit={saveCategory} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Name</label>
                        <input required placeholder="e.g. Salads" value={catName} onChange={e=>setCatName(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Upload Image</label>
                        <input type="file" accept="image/*" onChange={e=>setCatImageFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-neutral-800 file:text-blue-700 dark:file:text-white hover:file:bg-blue-100 cursor-pointer" />
                      </div>
                      <div className="text-center text-xs text-gray-400 dark:text-neutral-500 font-medium">- OR -</div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Image URL</label>
                        <input placeholder="https://..." value={catImage} onChange={e=>setCatImage(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button disabled={isUploading} type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 transition-colors cursor-pointer shadow-sm">
                          {isUploading ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Create Category')}
                        </button>
                        {editingCategoryId && (
                          <button type="button" onClick={resetCategoryForm} className="px-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer border border-gray-300 dark:border-neutral-700">
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                      <thead className="bg-gray-50 dark:bg-neutral-950">
                        <tr>
                          <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                        {categories.length === 0 && <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400 text-sm">No categories found. Create one to get started.</td></tr>}
                        {categories.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-11 w-11">
                                  {c.image_url ? <img className="h-11 w-11 rounded-lg object-cover border border-gray-200 dark:border-neutral-700 shadow-sm" src={c.image_url} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <div className="h-11 w-11 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"></div>}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEditCategory(c)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer border border-transparent mr-2">Edit</button>
                              <button onClick={() => deleteCategory(c.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer border border-transparent">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Menu Items</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm md:sticky md:top-6 transition-colors duration-300">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingItemId ? 'Edit Item' : 'Add New Item'}</h2>
                    <form onSubmit={saveItem} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Category</label>
                        <select required value={itemCat} onChange={e=>setItemCat(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                          <option value="">Select a category...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Name</label>
                        <input required placeholder="e.g. Margherita Pizza" value={itemName} onChange={e=>setItemName(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea placeholder="Brief description..." value={itemDesc} onChange={e=>setItemDesc(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Price (Rs.)</label>
                        <input required type="number" step="0.01" placeholder="0.00" value={itemPrice} onChange={e=>setItemPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Size (Optional)</label>
                          <select value={itemSize} onChange={e=>setItemSize(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                            <option value="">None</option>
                            <option value="S">Small (S)</option>
                            <option value="M">Medium (M)</option>
                            <option value="L">Large (L)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Tags (Optional)</label>
                          <input placeholder="e.g. Veg, Spicy" value={itemTags} onChange={e=>setItemTags(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Upload Image</label>
                        <input type="file" accept="image/*" onChange={e=>setItemImageFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-neutral-800 file:text-blue-700 dark:file:text-white hover:file:bg-blue-100 cursor-pointer" />
                      </div>
                      <div className="text-center text-xs text-gray-400 dark:text-neutral-500 font-medium">- OR -</div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Image URL</label>
                        <input placeholder="https://..." value={itemImage} onChange={e=>setItemImage(e.target.value)} className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white border border-gray-300 dark:border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button disabled={isUploading} type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 transition-colors cursor-pointer shadow-sm">
                          {isUploading ? 'Saving...' : (editingItemId ? 'Update Item' : 'Create Item')}
                        </button>
                        {editingItemId && (
                          <button type="button" onClick={resetItemForm} className="px-4 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-700 dark:text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer border border-gray-300 dark:border-neutral-700">
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
                      <thead className="bg-gray-50 dark:bg-neutral-950">
                        <tr>
                          <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                        {items.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400 text-sm">No items found. Create one to get started.</td></tr>}
                        {items.map(i => (
                          <tr key={i.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-11 w-11">
                                  {i.image_url ? <img className="h-11 w-11 rounded-lg object-cover border border-gray-200 dark:border-neutral-700 shadow-sm" src={i.image_url} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <div className="h-11 w-11 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"></div>}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {i.name}
                                    {i.size && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200">{i.size}</span>}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 max-w-[160px] truncate">{categories.find(c => c.id === i.category_id)?.name}</div>
                                  {i.tags && i.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {i.tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Rs. {i.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEditItem(i)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer border border-transparent mr-2">Edit</button>
                              <button onClick={() => deleteItem(i.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer border border-transparent">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
