import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { ChevronRight, Heart, Share2, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';

type ProductDetail = Product & {
  categorySlug: string;
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
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const selectedVariant = product.variants.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select both size and color.');
      return;
    }

    try {
      setIsAddingToCart(true);
      await api.addToCart({
        productId: product._id,
        productVariantId: selectedVariant._id,
        quantity: 1
      });
      alert('Added to cart');
    } catch (error) {
      console.error(error);
      alert('Please sign in before adding to cart.');
    } finally {
      setIsAddingToCart(false);
    }
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
              <button className="p-2 text-slate-400 hover:text-gold transition-colors">
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
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Color: {selectedColor || 'Select'}</span>
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
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Size: {selectedSize || 'Select'}</span>
                <button className="text-xs text-slate-500 underline hover:text-charcoal">Size Guide</button>
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
            <div className="flex space-x-3 mb-8">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 font-medium uppercase tracking-[0.2em] text-sm transition-all duration-300 ${
                  product.inStock 
                    ? 'bg-charcoal text-white hover:bg-gold' 
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock || isAddingToCart}
              >
                {product.inStock ? (isAddingToCart ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
              </button>
              <button className="p-3.5 border border-slate-300 text-charcoal hover:border-charcoal hover:bg-slate-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Value Props */}
            <div className="space-y-3 border-t border-slate-200 pt-6">
              <div className="flex items-center text-sm text-slate-600">
                <Truck className="h-5 w-5 mr-3 text-gold" />
                Complimentary shipping on orders over $500
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <RefreshCw className="h-5 w-5 mr-3 text-gold" />
                Free returns within 30 days
              </div>
            </div>
          </div>
        </div>

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
    </div>
  );
}
