import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { api } from '../../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    sku: '',
    size: 'M',
    color: '#1e293b',
    imageUrl: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCategories()
      .then((data) => {
        setCategories(data);
        if (!isNew && data.length > 0 && !form.categoryId) {
          setForm((prev) => ({ ...prev, categoryId: data[0]._id }));
        }
      })
      .catch(() => setCategories([]));
  }, [isNew]);

  useEffect(() => {
    if (isNew || !id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    api
      .getAdminProductById(id)
      .then((detail) => {
        const firstVariant = detail.variants[0];
        setForm({
          name: detail.name,
          description: detail.description,
          categoryId: detail.category?._id ?? '',
          price: String(detail.price),
          stock: String(firstVariant?.stockQuantity ?? 0),
          sku: firstVariant?.sku ?? '',
          size: firstVariant?.size ?? 'M',
          color: firstVariant?.color ?? '#1e293b',
          imageUrl: detail.imageUrl ?? ''
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load product'))
      .finally(() => setIsLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!form.categoryId) {
      setError('Category is required');
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative number');
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError('Stock must be a valid non-negative number');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        categoryId: form.categoryId,
        price,
        imageUrl: form.imageUrl || undefined,
        variant: {
          sku: form.sku,
          stockQuantity: stock,
          size: form.size,
          color: form.color
        }
      };

      const product = isNew
        ? await api.createAdminProduct(payload)
        : await api.updateAdminProduct(id!, payload);

      if (file) {
        await api.uploadAdminProductImage(product._id, file, form.name);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading product...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/products" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">{isNew ? 'Add New Product' : 'Edit Product'}</h2>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Product Name</label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
              <textarea 
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Category</label>
                <select 
                  value={form.categoryId}
                  onChange={(e) => setForm({...form, categoryId: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">SKU</label>
                <input 
                  type="text" 
                  value={form.sku}
                  onChange={(e) => setForm({...form, sku: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Price ($)</label>
                <input 
                  type="number" 
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Stock</label>
                <input 
                  type="number" 
                  value={form.stock}
                  onChange={(e) => setForm({...form, stock: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Size</label>
                <input
                  type="text"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Color</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Product Images</h3>
            <label className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer block">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Click to upload one image</p>
              {file && <p className="text-xs text-slate-500 mt-2">Selected: {file.name}</p>}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Publish</h3>
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-2"
            >
              {isSaving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
            </button>
            <Link 
              to="/admin/products"
              className="w-full block text-center text-slate-600 px-4 py-2 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
