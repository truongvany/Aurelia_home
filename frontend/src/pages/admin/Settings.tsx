import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Trash2, Plus } from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [images, setImages] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY'
  ]);

  const [sizes, setSizes] = useState(['S', 'M', 'L']);
  const [colors, setColors] = useState(['#1e293b', '#64748b']);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save product
    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/products" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/products" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C5A059] hover:bg-[#B38D46] shadow-md shadow-amber-900/10 transition-colors flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input type="text" defaultValue={isEditing ? "Sterling Charcoal Suit" : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Midnight Wool Blazer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea rows={5} defaultValue={isEditing ? "A premium charcoal suit tailored from fine Italian wool." : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Describe the product..." />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                <input type="number" defaultValue={isEditing ? 1250 : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Compare at Price ($)</label>
                <input type="number" defaultValue={isEditing ? 1400 : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input type="text" defaultValue={isEditing ? "PROD-001" : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. AH-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input type="number" defaultValue={isEditing ? 45 : ""} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="0" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Variants</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <span key={size} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium flex items-center">
                    {size}
                    <button className="ml-2 text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-500 rounded-full text-sm font-medium hover:bg-slate-50">
                  + Add Size
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Colors</label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <div key={color} className="relative group">
                    <div className="h-8 w-8 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }}></div>
                    <button className="absolute -top-1 -right-1 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button className="h-8 w-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Product Status</h3>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-700">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 pt-4">Category</h3>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-700">
              <option value="outerwear">Outerwear</option>
              <option value="knitwear">Knitwear</option>
              <option value="shirts">Shirts</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Images</h3>
            
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Product" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md text-slate-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors">
                <Upload className="h-6 w-6 mb-2 text-slate-400" />
                <span className="text-sm font-medium">Upload Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}