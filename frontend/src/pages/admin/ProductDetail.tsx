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
  colorCode: string;
  colorName: string;
  imageUrl: string;
  imageFile: File | null;
  imagePreviewUrl?: string;
  stockQuantity: string;
  priceAdjustment: string;
};

const createEmptyVariant = (): VariantForm => ({
  sku: '',
  size: 'M',
  colorCode: '#1e293b',
  colorName: '',
  imageUrl: '',
  imageFile: null,
  imagePreviewUrl: undefined,
  stockQuantity: '0',
  priceAdjustment: '0'
});

const isHexColor = (value: string) => /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value.trim());

const getColorPickerValue = (value: string) => {
  const normalized = value.trim();
  if (isHexColor(normalized)) {
    if (normalized.length === 4) {
      const [r, g, b] = normalized.slice(1).split('');
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return normalized;
  }
  return '#1e293b';
};

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
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState<string | null>(null);
  const [sizeGuideImageUrl, setSizeGuideImageUrl] = useState('');
  const [sizeGuideFile, setSizeGuideFile] = useState<File | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
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

        const loadedVariants = (detail.variants ?? []).map((variant) => {
          const isHex = /^#([0-9a-f]{3}){1,2}$/i.test(variant.color ?? '');
          return {
            _id: variant._id,
            sku: variant.sku ?? '',
            size: variant.size || 'M',
            colorCode: isHex ? variant.color || '#1e293b' : '#1e293b',
            colorName: isHex ? '' : variant.color || '',
            imageUrl: variant.imageUrl || '',
            imageFile: null,
            imagePreviewUrl: undefined,
            stockQuantity: String(variant.stockQuantity ?? 0),
            priceAdjustment: String(variant.priceAdjustment ?? 0)
          };
        });

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

  const handleVariantFileChange = (index: number, file: File | null) => {
    setVariants((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          if (item.imagePreviewUrl) URL.revokeObjectURL(item.imagePreviewUrl);
          return {
            ...item,
            imageFile: file,
            imagePreviewUrl: file ? URL.createObjectURL(file) : undefined
          };
        }
        return item;
      })
    );
  };

  const handleDeleteProductImage = async (imageId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      return;
    }

    if (!id) {
      return;
    }

    try {
      setDeletingImageId(imageId);
      await api.deleteAdminProductImage(id, imageId);
      setExistingImages((prev) => prev.filter((image) => image._id !== imageId));
    } catch (err) {
      console.error('Xóa ảnh không thành công', err);
      alert('Không thể xóa ảnh. Vui lòng thử lại.');
    } finally {
      setDeletingImageId(null);
    }
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
        colorCode: variant.colorCode.trim(),
        colorName: variant.colorName.trim(),
        imageUrl: variant.imageUrl.trim(),
        imageFile: variant.imageFile,
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

    const hasMissingColor = normalizedVariants.some(
      (variant) => variant.colorCode.length === 0 && variant.colorName.length === 0
    );
    if (hasMissingColor) {
      setError('Mỗi biến thể cần chọn màu hoặc nhập tên màu');
      return;
    }

    const hasMissingVariantImage = normalizedVariants.some(
      (variant) => !variant.imageUrl && !variant.imageFile
    );
    if (hasMissingVariantImage) {
      setError('Mỗi biến thể cần ảnh đại diện màu (dán link hoặc tải ảnh lên)');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      // Collect gallery URLs from textarea
      const galleryUrls = galleryInput
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      // For new products, use existing imageUrl or empty (will upload main image after creating)
      const payload = {
        name: form.name.trim(),
        description: form.description,
        categoryId: form.categoryId,
        price,
        imageUrl: mainImageFile ? undefined : (form.imageUrl || undefined),
        imageUrls: galleryUrls,
        variants: normalizedVariants.map((variant) => ({
          sku: variant.sku,
          size: variant.size,
          color: variant.colorName || variant.colorCode,
          imageUrl: variant.imageUrl,
          stockQuantity: variant.stockQuantity,
          priceAdjustment: variant.priceAdjustment
        }))
      };

      const product = isNew ? await api.createAdminProduct(payload) : await api.updateAdminProduct(id!, payload);

      // Upload main product image if file is selected (AFTER product is created)
      if (mainImageFile) {
        const uploadedMainImage = await api.uploadAdminProductImage(product._id, mainImageFile, form.name);
        await api.updateAdminProduct(product._id, {
          imageUrl: uploadedMainImage.url,
          imageUrls: galleryUrls,
          variants: normalizedVariants.map((variant) => ({
            sku: variant.sku,
            size: variant.size,
            color: variant.colorName || variant.colorCode,
            imageUrl: variant.imageUrl,
            stockQuantity: variant.stockQuantity,
            priceAdjustment: variant.priceAdjustment
          }))
        });
      }

      const hasVariantFiles = normalizedVariants.some((variant) => Boolean(variant.imageFile));
      if (hasVariantFiles) {
        const uploadedVariantImageUrls: string[] = [];

        for (let i = 0; i < normalizedVariants.length; i += 1) {
          const variant = normalizedVariants[i];
          if (variant.imageFile) {
            const uploaded = await api.uploadAdminProductVariantImage(
              product._id,
              variant.imageFile,
              `${form.name} - ${(variant.colorName || variant.colorCode) || variant.sku}`
            );
            uploadedVariantImageUrls.push(uploaded.pathUrl);
          } else {
            uploadedVariantImageUrls.push(variant.imageUrl);
          }
        }

        await api.updateAdminProduct(product._id, {
          variants: normalizedVariants.map((variant, index) => ({
            sku: variant.sku,
            size: variant.size,
            color: variant.colorName || variant.colorCode,
            imageUrl: uploadedVariantImageUrls[index],
            stockQuantity: variant.stockQuantity,
            priceAdjustment: variant.priceAdjustment
          }))
        });
      }

      // Upload gallery images from files
      if (files.length > 0) {
        for (const nextFile of files) {
          await api.uploadAdminProductImage(product._id, nextFile, form.name);
        }
      }

      // Upload size guide image if selected
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
                        value={getColorPickerValue(variant.colorCode)}
                        onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)}
                        className="h-9 w-12 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={variant.colorName}
                        onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)}
                        placeholder="Tên màu (ví dụ Đen, Nâu)"
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
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Ảnh màu bằng link</label>
                      <input
                        type="text"
                        value={variant.imageUrl}
                        onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                        placeholder="VD: https://example.com/red.jpg"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <p className="mt-1 text-[11px] text-slate-500">Có thể dán URL hoặc dùng tải ảnh bên dưới.</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Tải ảnh đại diện theo màu</label>
                      <label className="block border border-dashed border-slate-300 rounded-lg p-3 hover:border-slate-400 hover:bg-white transition-colors cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-600 truncate">
                            {variant.imageFile ? `Đã chọn: ${variant.imageFile.name}` : 'Chọn ảnh màu từ máy'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                            <Upload className="h-3.5 w-3.5" />
                            Tải lên
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleVariantFileChange(index, e.target.files?.[0] ?? null)}
                        />
                      </label>
                      {(variant.imageFile || variant.imageUrl) && (
                        <div className="mt-3 rounded-md border border-slate-200 bg-white p-2 inline-flex items-center gap-2">
                          {(variant.imagePreviewUrl || variant.imageUrl) ? (
                            <img
                              src={variant.imagePreviewUrl || toAbsoluteImageUrl(variant.imageUrl)}
                              alt={`Preview ${variant.colorName || variant.colorCode}`}
                              className="w-12 h-12 rounded object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                              FILE
                            </div>
                          )}
                          <div>
                            <p className="text-[11px] text-slate-600">Ảnh đại diện màu sẽ hiển thị ở trang sản phẩm user.</p>
                            {variant.imageFile && <p className="text-[11px] text-slate-500">{variant.imageFile.name}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Hình Ảnh Sản Phẩm</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Ảnh Đại Diện Chính</label>
                <p className="text-xs text-slate-500 mb-3">Chọn 1 trong 2: dán URL hoặc tải ảnh lên</p>
                
                {(form.imageUrl || mainImagePreviewUrl) && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 w-32 h-40">
                    <img
                      src={mainImagePreviewUrl || toAbsoluteImageUrl(form.imageUrl)}
                      alt="Main product"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                {mainImageFile && (
                  <div className="mb-3 text-sm text-slate-600 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    Đã chọn: {mainImageFile.name}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">URL Hình Ảnh</label>
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mainImageUpload" className="cursor-pointer">
                      <span className="text-xs font-medium text-slate-600 mb-1.5 block">Hoặc Tải Từ Máy</span>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center hover:border-slate-400 hover:bg-slate-50 transition-colors">
                        <Upload className="h-4 w-4 text-slate-400 mx-auto mb-1" />
                        <p className="text-[11px] text-slate-600 font-medium">Chọn ảnh</p>
                      </div>
                    </label>
                    <input
                      id="mainImageUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setMainImageFile(file);
                        if (mainImagePreviewUrl) URL.revokeObjectURL(mainImagePreviewUrl);
                        setMainImagePreviewUrl(file ? URL.createObjectURL(file) : null);
                        if (file) {
                          setForm({ ...form, imageUrl: '' });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Ảnh Trình Bày Bổ Sung (mỗi dòng 1 URL)</label>
                <textarea
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y text-sm"
                  placeholder="https://example.com/image-1.jpg&#10;https://example.com/image-2.jpg"
                />
              </div>
            </div>

            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-900 mb-3">Ảnh Trình Bày Hiện Có</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map((image) => (
                    <div key={image._id} className="relative aspect-[3/4] border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                      <img
                        src={toAbsoluteImageUrl(image.url)}
                        alt={image.alt || form.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        disabled={deletingImageId === image._id}
                        onClick={() => handleDeleteProductImage(image._id)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-600 rounded-full p-1 text-xs font-medium transition-colors"
                      >
                        {deletingImageId === image._id ? 'Đang xóa...' : 'Xóa'}
                      </button>
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
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files ?? []) as File[];
                  setFiles(newFiles);
                  filePreviews.forEach((p) => URL.revokeObjectURL(p));
                  setFilePreviews(newFiles.map((f) => URL.createObjectURL(f)));
                }}
              />
            </label>

            {files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-900 mb-3">Sẽ Tải Lên</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filePreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-[3/4] border border-blue-200 rounded-md overflow-hidden bg-blue-50">
                      <img
                        src={preview}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
