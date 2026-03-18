import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const formatVND = (value: string | number): string => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
};

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000/api/v1';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '');

const toAbsoluteImageUrl = (url?: string | null) => {
  if (!url) {
    return '';
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${API_ORIGIN}${normalized}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // "new" is a static route (no id param), so `id` may be undefined.
  const isNew = !id || id === 'new';

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
  const [galleryInput, setGalleryInput] = useState('');
  const [existingImages, setExistingImages] = useState<Array<{ _id: string; url: string; alt: string; sortOrder: number }>>([]);
  const [files, setFiles] = useState<File[]>([]);
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
    if (isNew) {
      return;
    }

    setIsLoading(true);
    setError(null);

    api
      .getAdminProductById(id!)
      .then((detail) => {
        const firstVariant = detail.variants[0];
        setExistingImages(detail.images ?? []);
        setGalleryInput((detail.images ?? []).map((image) => image.url).join('\n'));
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
      setError('Tên sản phẩm là bắt buộc');
      return;
    }

    if (!form.categoryId) {
      setError('Danh mục là bắt buộc');
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price < 0) {
      setError('Giá phải là số hợp lệ và không âm');
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError('Số lượng tồn kho phải là số hợp lệ và không âm');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const imageUrls = galleryInput
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        description: form.description,
        categoryId: form.categoryId,
        price,
        imageUrl: form.imageUrl || undefined,
        imageUrls,
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

      if (files.length > 0) {
        for (const nextFile of files) {
          await api.uploadAdminProductImage(product._id, nextFile, form.name);
        }
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu sản phẩm');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Đang tải sản phẩm...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/products" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold text-slate-900">{isNew ? 'Thêm Sản Phẩm Mới' : 'Chỉnh Sửa Sản Phẩm'}</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông Tin Cơ Bản */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Thông Tin Cơ Bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Tên Sản Phẩm *</label>
              <input 
                type="text" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="VD: Giày Thể Thao Nam"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Mô Tả</label>
              <textarea 
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={4}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Danh Mục *</label>
                <select 
                  value={form.categoryId}
                  onChange={(e) => setForm({...form, categoryId: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                >
                  <option value="">-- Chọn danh mục --</option>
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
                  placeholder="VD: SKU-001"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Giá Và Tồn Kho */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Giá Và Tồn Kho</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Giá (VND) *</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
                {form.price && Number(form.price) > 0 && (
                  <p className="text-xs text-slate-500 mt-2">Hiển thị: {formatVND(form.price)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Số Lượng Tồn Kho *</label>
                <input 
                  type="number" 
                  value={form.stock}
                  onChange={(e) => setForm({...form, stock: e.target.value})}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Biến Thể Sản Phẩm */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Biến Thể Sản Phẩm</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-3">Kích Cỡ</label>
                
                {/* Size Presets */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setForm({ ...form, size })}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          form.size === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <p className="text-xs text-slate-500 mb-2">Số kích cỡ:</p>
                    <div className="flex flex-wrap gap-2">
                      {['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setForm({ ...form, size })}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            form.size === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Custom Size Input */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <label className="block text-xs font-medium text-slate-600 mb-2">Hoặc nhập tùy chỉnh:</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="VD: Freesize, One Size"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Màu Sắc</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-10 w-14 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="#1e293b"
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hình Ảnh */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Hình Ảnh Sản Phẩm</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">URL Hình Ảnh</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Ảnh Trình Bày (mỗi dòng 1 URL)</label>
              <textarea
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y text-sm"
                placeholder="https://example.com/image-1.jpg&#10;https://example.com/image-2.jpg"
              />
              <p className="text-xs text-slate-500 mt-2">Những ảnh này sẽ hiển thị ở cột thumbnail bên trái trang chi tiết sản phẩm.</p>
            </div>

            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-900 mb-3">Ảnh Trình Bày Hiện Có</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((image) => (
                    <div key={image._id} className="aspect-[3/4] border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                      <img
                        src={toAbsoluteImageUrl(image.url)}
                        alt={image.alt || form.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer block">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Tải lên ảnh trình bày</p>
              <p className="text-xs text-slate-500 mt-1">Có thể chọn nhiều tệp (JPG, PNG, WebP)</p>
              {files.length > 0 && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <p className="text-xs font-medium">Đã chọn {files.length} tệp</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-4">Công Bố</h3>
            <div className="space-y-3">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2"
              >
                {isSaving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-blue-400 rounded-full"></div>}
                <span>{isSaving ? 'Đang Lưu...' : isNew ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi'}</span>
              </button>
              <Link 
                to="/admin/products"
                className="w-full block text-center text-slate-700 px-4 py-2.5 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-colors"
              >
                Hủy
              </Link>
            </div>
          </div>

          {/* Thông Tin Bổ Sung */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Hướng Dẫn</h4>
            <ul className="text-xs text-blue-800 space-y-2">
              <li>• Tên sản phẩm là bắt buộc</li>
              <li>• Chọn danh mục để phân loại</li>
              <li>• Nhập giá bằng VND</li>
              <li>• Thêm hình ảnh để tăng bán hàng</li>
              <li>• SKU giúp quản lý hàng tồn kho</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
