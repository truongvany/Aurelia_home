import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, AlertCircle, Plus, Trash2, Ruler } from 'lucide-react';
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

type VariantForm = {
  _id?: string;
  sku: string;
  size: string;
  color: string;
  stockQuantity: string;
  priceAdjustment: string;
};

const createEmptyVariant = (): VariantForm => ({
  sku: '',
  size: 'M',
  color: '#1e293b',
  stockQuantity: '0',
  priceAdjustment: '0'
});

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: ''
  });
  const [variants, setVariants] = useState<VariantForm[]>([createEmptyVariant()]);
  const [galleryInput, setGalleryInput] = useState('');
  const [existingImages, setExistingImages] = useState<Array<{ _id: string; url: string; alt: string; sortOrder: number }>>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [sizeGuideImageUrl, setSizeGuideImageUrl] = useState('');
  const [sizeGuideFile, setSizeGuideFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCategories()
      .then((data) => {
        setCategories(data);
        if (isNew && data.length > 0 && !form.categoryId) {
          setForm((prev) => ({ ...prev, categoryId: data[0]._id }));
        }
      })
      .catch(() => setCategories([]));
  }, [isNew, form.categoryId]);

  useEffect(() => {
    if (isNew) {
      return;
    }

    setIsLoading(true);
    setError(null);

    api
      .getAdminProductById(id!)
      .then((detail) => {
        setExistingImages(detail.images ?? []);
        setGalleryInput((detail.images ?? []).map((image) => image.url).join('\n'));
        setSizeGuideImageUrl(detail.sizeGuideImageUrl ?? '');

        const loadedVariants = (detail.variants ?? []).map((variant) => ({
          _id: variant._id,
          sku: variant.sku ?? '',
          size: variant.size || 'M',
          color: variant.color || '#1e293b',
          stockQuantity: String(variant.stockQuantity ?? 0),
          priceAdjustment: String(variant.priceAdjustment ?? 0)
        }));

        setVariants(loadedVariants.length > 0 ? loadedVariants : [createEmptyVariant()]);
        setForm({
          name: detail.name,
          description: detail.description,
          categoryId: detail.category?._id ?? '',
          price: String(detail.price),
          imageUrl: detail.imageUrl ?? ''
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load product'))
      .finally(() => setIsLoading(false));
  }, [id, isNew]);

  const handleVariantChange = (index: number, key: keyof VariantForm, value: string) => {
    setVariants((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

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
    if (!Number.isFinite(price) || price < 0) {
      setError('Giá phải là số hợp lệ và không âm');
      return;
    }

    const normalizedVariants = variants
      .map((variant) => ({
        sku: variant.sku.trim(),
        size: variant.size.trim(),
        color: variant.color.trim(),
        stockQuantity: Number(variant.stockQuantity),
        priceAdjustment: Number(variant.priceAdjustment || 0)
      }))
      .filter((variant) => variant.sku.length > 0);

    if (normalizedVariants.length === 0) {
      setError('Cần ít nhất 1 biến thể có SKU hợp lệ');
      return;
    }

    const hasInvalidStock = normalizedVariants.some(
      (variant) => !Number.isFinite(variant.stockQuantity) || variant.stockQuantity < 0
    );
    if (hasInvalidStock) {
      setError('Tồn kho của biến thể phải là số hợp lệ và không âm');
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
        variants: normalizedVariants
      };

      const product = isNew ? await api.createAdminProduct(payload) : await api.updateAdminProduct(id!, payload);

      if (files.length > 0) {
        for (const nextFile of files) {
          await api.uploadAdminProductImage(product._id, nextFile, form.name);
        }
      }

      if (sizeGuideFile) {
        await api.uploadAdminProductSizeGuideImage(product._id, sizeGuideFile);
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Thông Tin Cơ Bản</h3>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Tên Sản Phẩm *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="VD: Giày Thể Thao Nam"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Mô Tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Giá (VND) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                {form.price && Number(form.price) > 0 && (
                  <p className="text-xs text-slate-500 mt-2">Hiển thị: {formatVND(form.price)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Biến Thể Sản Phẩm (Màu / Size)</h3>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold uppercase tracking-[0.12em] hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm biến thể
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={`${variant._id ?? 'new'}-${index}`} className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold text-slate-700">Biến thể {index + 1}</p>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">SKU *</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        placeholder="VD: SKU-001-BL-42"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Kích cỡ</label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        placeholder="VD: M, 42, One Size"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Màu sắc</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={variant.color || '#1e293b'}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          className="h-9 w-12 rounded border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          placeholder="#1e293b"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Tồn kho</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stockQuantity}
                        onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">Ảnh Hướng Dẫn Chọn Size</h3>
            </div>

            {sizeGuideImageUrl && !sizeGuideFile && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={toAbsoluteImageUrl(sizeGuideImageUrl)}
                  alt="Size guide"
                  className="w-full max-h-[420px] object-contain bg-slate-50"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {sizeGuideFile && (
              <div className="rounded-lg overflow-hidden border border-slate-200 p-3 bg-slate-50">
                <p className="text-xs text-slate-600 mb-2">Ảnh sẽ upload khi bấm lưu:</p>
                <p className="text-sm font-medium text-slate-900">{sizeGuideFile.name}</p>
              </div>
            )}

            <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer block">
              <Upload className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Tải lên ảnh bảng size chuyên nghiệp</p>
              <p className="text-xs text-slate-500 mt-1">Ảnh này sẽ hiển thị trong popup "Hướng dẫn chọn kích thước" ở trang chi tiết sản phẩm.</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSizeGuideFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

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

          <div className="bg-blue-50 rounded-xl border border-blue-200 shadow-sm p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Hướng Dẫn</h4>
            <ul className="text-xs text-blue-800 space-y-2">
              <li>• Mỗi biến thể cần SKU riêng để quản lý tồn kho chính xác</li>
              <li>• Có thể thêm nhiều màu và nhiều size trong cùng sản phẩm</li>
              <li>• Upload ảnh bảng size để popup hướng dẫn ở trang chi tiết hiển thị chuyên nghiệp</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
