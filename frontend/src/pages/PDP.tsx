import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ChevronRight, Heart, Share2, Truck, RefreshCw, ArrowRight, X, Info, Package, Globe, Layers } from 'lucide-react';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import { isProductWishlisted, toggleWishlistProduct } from '../utils/wishlist';
import sizeGuideTemplate from '../assets/images/size-guide-template.svg';

type ProductDetail = Product & {
  categorySlug: string;
  sizeGuideImageUrl: string;
  images: Array<{ _id: string; url: string; alt: string; sortOrder: number }>;
  variants: Array<{ _id: string; size: string; color: string; sku: string; stockQuantity: number }>;
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

export default function PDP() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'returns' | 'shipping' | 'materials'>('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          return;
        }
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.categorySlug) {
      setRelatedProducts([]);
      return;
    }

    const fetchRelatedProducts = async () => {
      try {
        const params = new URLSearchParams();
        params.set('category', product.categorySlug);
        const sameCategoryProducts = await api.getProducts(params);
        const related = sameCategoryProducts.filter((item) => item._id !== product._id).slice(0, 5);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch related products', error);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [product?._id, product?.categorySlug]);

  const galleryImages = useMemo(() => {
    if (!product) {
      return [] as Array<{ id: string; url: string; alt: string }>;
    }

    const imagesFromGallery = (product.images ?? []).map((image) => ({
      id: image._id,
      url: toAbsoluteImageUrl(image.url),
      alt: image.alt || product.name
    }));

    const coverImage = toAbsoluteImageUrl(product.imageUrl);
    const galleryHasCover = imagesFromGallery.some((image) => image.url === coverImage);

    if (coverImage && !galleryHasCover) {
      return [{ id: 'cover', url: coverImage, alt: product.name }, ...imagesFromGallery];
    }

    return imagesFromGallery;
  }, [product]);

  useEffect(() => {
    if (galleryImages.length === 0) {
      setSelectedImage('');
      return;
    }

    setSelectedImage(galleryImages[0].url);
  }, [galleryImages]);

  useEffect(() => {
    if (!id) {
      setIsWishlisted(false);
      return;
    }

    setIsWishlisted(isProductWishlisted(id));
  }, [id]);

  useEffect(() => {
    if (!isSizeGuideOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSizeGuideOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSizeGuideOpen]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24">Product not found</div>;
  }

  const activeImage = selectedImage || toAbsoluteImageUrl(product.imageUrl);

  const selectedVariant = (product.variants ?? []).find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  );
  const sizeGuidePreviewUrl = product.sizeGuideImageUrl
    ? toAbsoluteImageUrl(product.sizeGuideImageUrl)
    : sizeGuideTemplate;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn cả kích thước và màu sắc.');
      return;
    }

    const qty = Math.max(1, quantity);
    if (selectedVariant.stockQuantity < qty) {
      alert('Số lượng vượt quá tồn kho. Vui lòng chọn ít hơn.');
      return;
    }

    try {
      setIsAddingToCart(true);
      await api.addToCart({
        productId: product._id,
        productVariantId: selectedVariant._id,
        quantity: qty
      });
      alert('Đã thêm vào giỏ hàng');
    } catch (error) {
      console.error(error);
      alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      alert('Please select both size and color.');
      return;
    }

    const qty = Math.max(1, quantity);
    if (selectedVariant.stockQuantity < qty) {
      alert('Số lượng vượt quá tồn kho. Vui lòng chọn ít hơn.');
      return;
    }

    try {
      setIsBuyingNow(true);
      await api.addToCart({
        productId: product._id,
        productVariantId: selectedVariant._id,
        quantity: qty
      });
      navigate('/checkout?source=buy-now');
    } catch (error) {
      console.error(error);
      alert('Vui lòng đăng nhập trước khi mua hàng.');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = () => {
    const next = toggleWishlistProduct(product._id);
    setIsWishlisted(next);
  };

  return (
    <div className="bg-white text-slate-900">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b border-slate-100">
        <nav className="flex items-center text-xs md:text-sm text-slate-500 tracking-wide">
          <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-charcoal">{product.category}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Image Gallery */}
          <div className="lg:w-7/12 flex gap-3 md:gap-4">
            <div className="flex md:flex-col gap-2 md:gap-3 md:w-20 shrink-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {galleryImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image.url)}
                  className={`aspect-[3/4] w-16 md:w-full bg-slate-100 border transition-all duration-200 overflow-hidden ${
                    selectedImage === image.url ? 'border-slate-900 ring-1 ring-slate-900' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-slate-100 aspect-[4/5] md:aspect-[3/4] relative overflow-hidden rounded-sm">
              <img
                src={activeImage}
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-5/12 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-serif text-3xl md:text-[2.5rem] leading-tight text-charcoal font-semibold">{product.name}</h1>
              <button className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-gold hover:border-slate-300 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] bg-slate-100 text-slate-700">
                {product.category}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${
                  product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {product.inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
            
            <p className="text-2xl text-slate-700 font-medium mb-6">{formatVND(product.price)}</p>
            
            <div className="mb-6">
              <p className="text-slate-600 leading-relaxed text-sm md:text-[15px]">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-charcoal">Màu sắc: {selectedColor || ''}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border text-xs uppercase tracking-wide transition-colors ${
                      selectedColor === color 
                        ? 'border-charcoal bg-charcoal text-white' 
                        : 'border-slate-300 text-slate-600 hover:border-charcoal'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-charcoal">Kích thước: {selectedSize || ''}</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-slate-500 underline hover:text-charcoal"
                >
                  Hướng dẫn chọn kích thước
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border text-xs font-medium transition-colors ${
                      selectedSize === size 
                        ? 'border-charcoal bg-charcoal text-white' 
                        : 'border-slate-300 text-slate-600 hover:border-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-700">Số lượng</span>
                <div className="flex items-center gap-1.5 rounded-full border border-slate-300 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-8 w-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    disabled={!product.inStock || isAddingToCart || isBuyingNow}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={selectedVariant ? selectedVariant.stockQuantity : undefined}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-14 h-8 bg-transparent text-center text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-8 w-8 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    disabled={!product.inStock || isAddingToCart || isBuyingNow}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className={`h-11 rounded-full px-4 font-semibold uppercase tracking-[0.18em] text-[11px] transition-all duration-300 ${
                    product.inStock
                      ? 'bg-charcoal text-white hover:bg-gold shadow-sm hover:shadow-md'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock || isAddingToCart}
                >
                  {product.inStock ? (isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ') : 'Hết hàng'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className={`h-11 rounded-full px-4 font-semibold uppercase tracking-[0.18em] text-[11px] transition-all duration-300 ${
                    product.inStock
                      ? 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                      : 'border border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock || isBuyingNow}
                >
                  {product.inStock ? (isBuyingNow ? 'Đang xử lý...' : 'Mua ngay') : 'Không khả dụng'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`h-11 rounded-full border px-4 transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-300 text-charcoal hover:border-charcoal hover:bg-white'
                  }`}
                  aria-label={isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Yêu thích</span>
                </button>
              </div>
            </div>

            {/* Value Props */}
            <div className="space-y-3 border-t border-slate-200 pt-6">
              <div className="flex items-center text-sm text-slate-600">
                <Truck className="h-5 w-5 mr-3 text-gold" />
                Miễn phí vận chuyển cho đơn hàng trên 500.000₫
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <RefreshCw className="h-5 w-5 mr-3 text-gold" />
                Đổi trả miễn phí trong vòng 30 ngày
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Product Details & Policies Section */}
        <section className="mt-16 border-t border-slate-100 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Detailed Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Info className="h-5 w-5 text-slate-900" />
                </div>
                <h3 className="font-serif text-2xl text-slate-900">Chi tiết sản phẩm</h3>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed italic mb-6">
                  "{product.description}"
                </p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t border-slate-100 pt-6">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">SKU</span>
                    <span className="text-sm font-medium text-slate-900">{selectedVariant?.sku ?? 'AURELIA-GEN'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Phân loại</span>
                    <span className="text-sm font-medium text-slate-900">{product.category}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Chất liệu chính</span>
                    <span className="text-sm font-medium text-slate-900">Premium Merino Wool</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 mb-1">Xuất xứ</span>
                    <span className="text-sm font-medium text-slate-900">Made in Italy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Package className="h-5 w-5 text-slate-900" />
                </div>
                <h3 className="font-serif text-xl text-slate-900">Vận chuyển</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  <p className="text-sm text-slate-600">Giao hàng tiêu chuẩn miễn phí cho đơn hàng từ 500.000₫.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  <p className="text-sm text-slate-600">Thời gian nhận hàng từ 2-5 ngày làm việc trên toàn quốc.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                  <p className="text-sm text-slate-600">Dịch vụ giao hàng hỏa tốc trong 2h tại khu vực nội thành.</p>
                </li>
              </ul>
            </div>

            {/* Returns & Materials */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Globe className="h-5 w-5 text-slate-900" />
                  </div>
                  <h3 className="font-serif text-xl text-slate-900">Chính sách đổi trả</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Đổi trả dễ dàng trong vòng 30 ngày kể từ khi nhận hàng. 
                  Sản phẩm phải còn nguyên nhãn mác và chưa qua sử dụng.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Layers className="h-5 w-5 text-slate-900" />
                  </div>
                  <h3 className="font-serif text-xl text-slate-900">Bảo quản</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Giặt khô hoặc giặt tay nhẹ nhàng với nước lạnh. Tránh phơi trực tiếp dưới ánh nắng gay gắt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">Explore more</p>
              <h2 className="font-serif text-3xl text-charcoal">Sản phẩm liên quan</h2>
            </div>
            {product.categorySlug && (
              <Link
                to={`/shop?category=${encodeURIComponent(product.categorySlug)}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-700 hover:text-charcoal transition-colors"
              >
                Xem thêm trong danh mục này
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {relatedProducts.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có sản phẩm liên quan trong danh mục này.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="group border border-slate-200 hover:border-slate-300 transition-colors bg-white"
                >
                  <div className="aspect-[3/4] bg-slate-100 overflow-hidden">
                    <img
                      src={toAbsoluteImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{item.category}</p>
                    <h3 className="text-sm font-medium text-charcoal line-clamp-2 min-h-[2.4rem]">{item.name}</h3>
                    <p className="text-sm font-semibold text-slate-700">{formatVND(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-sm p-4 md:p-6" role="dialog" aria-modal="true">
          <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
            <div className="w-full max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-900">Hướng dẫn chọn kích thước</h3>
                  <p className="text-xs text-slate-500">Đối chiếu số đo của bạn với bảng size trước khi đặt hàng.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="h-9 w-9 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center"
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 md:p-5 bg-slate-50 max-h-[80vh] overflow-auto">
                <img
                  src={sizeGuidePreviewUrl}
                  alt="Bảng hướng dẫn chọn kích thước"
                  className="w-full h-auto rounded-xl border border-slate-200 bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
