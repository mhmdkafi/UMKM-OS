"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Settings2, Edit3, Trash2, Tag, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = 'http://localhost:5000/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductRecipes, setNewProductRecipes] = useState<{ingredient_id: string, qty: string}[]>([]);

  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeIngredientId, setRecipeIngredientId] = useState("");
  const [recipeQty, setRecipeQty] = useState("");

  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProductName, setEditProductName] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductImage, setEditProductImage] = useState("");
  const [editProductRecipes, setEditProductRecipes] = useState<{ingredient_id: string, qty: string}[]>([]);

  const fetchProducts = () => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(console.error);
  };

  const fetchCategories = () => {
    fetch(`${API}/categories`).then(res => res.json()).then(data => {
      setCategories(data);
      if(data.length > 0) setNewProductCategory(data[0].id);
    }).catch(console.error);
  };

  const fetchInventory = () => {
    fetch(`${API}/inventory`).then(res => res.json()).then(data => {
      setInventory(data);
      if(data.length > 0) setRecipeIngredientId(data[0].id);
    }).catch(console.error);
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
    fetchInventory();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    try {
      const biz = products.length > 0 ? products[0].business_id : null;
      await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: biz,
          name: newProductName,
          category_id: newProductCategory,
          price: parseInt(newProductPrice),
          image_url: newProductImage,
          recipes: newProductRecipes.filter(r => r.ingredient_id && r.qty).map(r => ({
            ingredient_id: r.ingredient_id,
            quantity_used: parseFloat(r.qty)
          }))
        }),
      });
      setShowAddProductModal(false);
      setNewProductName(""); setNewProductPrice(""); setNewProductImage(""); setNewProductRecipes([]);
      if(categories.length > 0) setNewProductCategory(categories[0].id);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !recipeIngredientId || !recipeQty) return;
    
    const newRecipe = {
      ingredient_id: recipeIngredientId,
      quantity_used: parseFloat(recipeQty)
    };
    
    const updatedRecipes = [
      ...selectedProduct.recipe.map((r: any) => ({ ingredient_id: r.ingredient_id, quantity_used: parseFloat(r.qty) })),
      newRecipe
    ];

    try {
      await fetch(`${API}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedProduct.name,
          price: selectedProduct.price,
          category_id: selectedProduct.category_id,
          recipes: updatedRecipes
        }),
      });
      setShowAddRecipeModal(false);
      setRecipeQty("");
      fetchProducts();
      setSelectedProduct(null);
    } catch (err) { console.error(err); }
  };


  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleEditProductClick = () => {
    if (!selectedProduct) return;
    setEditProductName(selectedProduct.name);
    setEditProductCategory(selectedProduct.category_id);
    setEditProductPrice(selectedProduct.price.toString());
    setEditProductImage(selectedProduct.image || "");
    setEditProductRecipes(selectedProduct.recipe.map((r: any) => ({
      ingredient_id: r.ingredient_id,
      qty: String(r.qty)
    })));
    setShowEditProductModal(true);
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !editProductName || !editProductPrice) return;
    
    if (!selectedProduct || !editProductName || !editProductPrice) return;

    try {
      await fetch(`${API}/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProductName,
          price: parseInt(editProductPrice),
          category_id: editProductCategory,
          image_url: editProductImage,
          recipes: editProductRecipes.filter(r => r.ingredient_id && r.qty).map(r => ({
            ingredient_id: r.ingredient_id,
            quantity_used: parseFloat(r.qty)
          }))
        }),
      });
      setShowEditProductModal(false);
      fetchProducts();
      setSelectedProduct(null);
    } catch (err) { console.error(err); }
  };

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Produk & Resep (BOM)</h2>
          <p className="text-slate-500">Kelola daftar menu dan resep bahan baku pemotong stok.</p>
        </div>
        <button onClick={() => setShowAddProductModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Side: Product List */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 flex-shrink-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Cari produk..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-indigo-50/50 ${
                    selectedProduct?.id === product.id ? "bg-indigo-50/80 border-l-4 border-indigo-600" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <span className="text-sm font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex gap-4 text-sm mt-2">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Tag className="w-3.5 h-3.5" /> {product.category}
                    </span>
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                      Margin: {product.margin}%
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  Produk tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recipe (BOM) Details */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          {selectedProduct ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedProduct.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedProduct.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> Resep / Bill of Materials
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleEditProductClick} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(selectedProduct.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Financial Summary inside Recipe */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">Harga Jual (Price)</p>
                      <p className="text-lg font-bold text-slate-900">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-600 font-medium mb-1">Total HPP / COGS</p>
                      <p className="text-lg font-bold text-orange-700">Rp {selectedProduct.cogs.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Recipe List */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-slate-800">Komposisi Bahan Baku</h4>
                      <button onClick={() => setShowAddRecipeModal(true)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Tambah Bahan
                      </button>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-2 font-medium">Bahan</th>
                            <th className="px-4 py-2 font-medium text-right">Takaran</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedProduct.recipe.map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-slate-700">{r.item}</td>
                              <td className="px-4 py-3 text-right text-slate-600">
                                <span className="font-semibold text-slate-900">{r.qty}</span> {r.unit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 flex items-start gap-1.5">
                      <Settings2 className="w-4 h-4 flex-shrink-0" />
                      Setiap 1 produk terjual di Kasir (POS) akan otomatis mengurangi stok bahan-bahan di atas.
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
              <BookOpen className="w-16 h-16 opacity-20" />
              <p>Pilih produk di sebelah kiri untuk melihat resep dan HPP.</p>
            </div>
          )}
        </div>
      </div>
      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Tambah Produk Baru</h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                  <input type="text" value={newProductName} onChange={e => setNewProductName(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: Kopi Susu Aren" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp)</label>
                  <input type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: 15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Produk</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewProductImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                  />
                  {newProductImage && (
                    <div className="mt-2">
                      <img src={newProductImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>

                {/* Komposisi Bahan Baku */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Komposisi Bahan Baku (Resep)</label>
                    <button type="button" onClick={() => setNewProductRecipes([...newProductRecipes, { ingredient_id: inventory.length > 0 ? inventory[0].id : '', qty: '' }])} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Tambah Bahan
                    </button>
                  </div>
                  {newProductRecipes.map((recipe, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <select 
                        value={recipe.ingredient_id}
                        onChange={(e) => {
                          const updated = [...newProductRecipes];
                          updated[index].ingredient_id = e.target.value;
                          setNewProductRecipes(updated);
                        }}
                        className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      >
                        {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                      </select>
                      <input 
                        type="number" step="any" required placeholder="Takaran"
                        value={recipe.qty}
                        onChange={(e) => {
                          const updated = [...newProductRecipes];
                          updated[index].qty = e.target.value;
                          setNewProductRecipes(updated);
                        }}
                        className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = newProductRecipes.filter((_, i) => i !== index);
                          setNewProductRecipes(updated);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {newProductRecipes.length === 0 && (
                    <p className="text-xs text-slate-500 italic">Belum ada bahan baku ditambahkan.</p>
                  )}
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-4">Simpan Produk</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddRecipeModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Tambah Bahan Resep</h3>
                <button onClick={() => setShowAddRecipeModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddRecipe} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Bahan Baku</label>
                  <select value={recipeIngredientId} onChange={e => setRecipeIngredientId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900">
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Takaran (Berdasarkan satuan bahan)</label>
                  <input type="number" step="any" value={recipeQty} onChange={e => setRecipeQty(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: 15" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Tambahkan ke Resep</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditProductModal && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Edit Produk</h3>
                <button onClick={() => setShowEditProductModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleEditProductSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                  <input type="text" value={editProductName} onChange={e => setEditProductName(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: Kopi Susu Aren" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select value={editProductCategory} onChange={e => setEditProductCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual (Rp)</label>
                  <input type="number" value={editProductPrice} onChange={e => setEditProductPrice(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="Contoh: 15000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Produk</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditProductImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                  />
                  {editProductImage && (
                    <div className="mt-2">
                      <img src={editProductImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>

                {/* Komposisi Bahan Baku */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Komposisi Bahan Baku (Resep)</label>
                    <button type="button" onClick={() => setEditProductRecipes([...editProductRecipes, { ingredient_id: inventory.length > 0 ? inventory[0].id : '', qty: '' }])} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Tambah Bahan
                    </button>
                  </div>
                  {editProductRecipes.map((recipe, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <select 
                        value={recipe.ingredient_id}
                        onChange={(e) => {
                          const updated = [...editProductRecipes];
                          updated[index].ingredient_id = e.target.value;
                          setEditProductRecipes(updated);
                        }}
                        className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      >
                        {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                      </select>
                      <input 
                        type="number" step="any" required placeholder="Takaran"
                        value={recipe.qty}
                        onChange={(e) => {
                          const updated = [...editProductRecipes];
                          updated[index].qty = e.target.value;
                          setEditProductRecipes(updated);
                        }}
                        className="w-24 border border-slate-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = editProductRecipes.filter((_, i) => i !== index);
                          setEditProductRecipes(updated);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {editProductRecipes.length === 0 && (
                    <p className="text-xs text-slate-500 italic">Belum ada bahan baku ditambahkan.</p>
                  )}
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-4">Simpan Perubahan</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
