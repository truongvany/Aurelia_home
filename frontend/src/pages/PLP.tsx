import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, Filter, ShoppingBag, Search } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import PriceRangeSlider from '../components/PriceRangeSlider';

const ProductCardItem: React.FC<{ 
  product: Product; 
  onAddToCart: (id: string) => void; 
  addingToCartProductId: string | null;
  imageRef: (el: HTMLImageElement | null) => void;
}> = ({ 
  product, 
  onAddToCart, 
  addingToCartProductId, 
  imageRef 
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] ?? null);

  const getColorImage = (color?: string) => {
    if (!color || !product.colorImages) return undefined;

    // exact key match first
    if (product.colorImages[color]) return product.colorImages[color];

    const normalized = color.trim().toLowerCase();

    // case-insensitive fallback
    const matchedEntry = Object.entries(product.colorImages).find(
      ([key]) => key.trim().toLowerCase() === normalized
    );

    if (matchedEntry) return matchedEntry[1];

    return undefined;
  };

  const displayImage = getColorImage(selectedColor) || product.imageUrl;

  return (
    <article className="group transition-transform duration-300 relative flex flex-col">
      <div className="relative overflow-hidden bg-[#ece8e2] mb-4 rounded-xl">
        <Link to={`/product/${product._id}`} className="block">
          <img
            ref={imageRef}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={displayImage}
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => onAddToCart(product._id)}
              disabled={!product.inStock || addingToCartProductId === product._id}
              className={`flex-1 py-3 px-3 text-[11px] uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-2 ${
                product.inStock
                  ? 'bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              } ${addingToCartProductId === product._id ? 'cursor-wait opacity-70' : ''}`}
            >
              <ShoppingBag className="h-4 w-4" /> {addingToCartProductId === product._id ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>
            <Link
              to={`/product/${product._id}`}
              className="w-12 bg-[#2f2f2f]/90 backdrop-blur-sm text-white hover:bg-black flex items-center justify-center"
              aria-label={`Xem nhanh ${product.name}`}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {product.colors.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {product.colors.map(color => {
            const getVietnameseColorHex = (name: string): string => {
              const val = name.toLowerCase().trim();
              if (val.startsWith('#')) return val;
              if (val.includes('đen') || val === 'black') return '#000000';
              if (val.includes('trắng') || val === 'white') return '#ffffff';
              if (val.includes('nâu') || val === 'brown') return '#5d4037';
              if (val.includes('xám') || val.includes('ghi') || val === 'grey' || val === 'gray') return '#9e9e9e';
              if (val.includes('đỏ') || val === 'red') return '#e53935';
              if (val.includes('xanh nav') || val.includes('xanh dương') || val === 'navy' || val === 'blue') return '#1e3a8a';
              if (val.includes('xanh lá') || val.includes('xanh ngọc') || val === 'green') return '#2e7d32';
              if (val.includes('vàng') || val === 'yellow') return '#fbc02d';
              if (val.includes('cam') || val === 'orange') return '#f57c00';
              if (val.includes('tím') || val === 'purple') return '#8e24aa';
              if (val.includes('hồng') || val === 'pink') return '#f48fb1';
              if (val.includes('kem') || val.includes('be') || val === 'beige') return '#f5f5dc';
              if (val.includes('bạc') || val === 'silver') return '#e0e0e0';
              
              // Fallback simple hash to generate deterministic pleasing background colors
              let hash = 0;
              for (let i = 0; i < val.length; i++) hash = val.charCodeAt(i) + ((hash << 5) - hash);
              const h = hash % 360;
              return `hsl(${h > 0 ? h : -h}, 30%, 50%)`;
            };

            const mappedHex = getVietnameseColorHex(color);
            const isWhite = mappedHex === '#ffffff' || mappedHex.toLowerCase() === 'white';
            return (
              <button 
                key={color}
                onClick={(e) => { e.preventDefault(); setSelectedColor(color); }}
                className={`w-[26px] h-[26px] rounded-full border transition-all ${
                  selectedColor === color 
                    ? 'ring-1 ring-[#1e3a8a] ring-offset-2 border-transparent' 
                    : isWhite ? 'border-slate-300 hover:border-slate-400' : 'border-slate-200/40 hover:scale-110'
                }`}
                style={{ backgroundColor: mappedHex }}
                title={color}
              />
            );
          })}
        </div>
      )}

      <Link to={`/product/${product._id}`} className="block mb-1.5">
        <h3 className="text-[15px] font-medium text-slate-800 line-clamp-2 leading-relaxed hover:text-[#1e3a8a] transition-colors">{product.name}</h3>
      </Link>
      <p className="text-[15px] font-bold text-slate-900 mt-auto">{formatVND(product.price)}</p>
    </article>
  );
}

export default function PLP() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') ?? 'all';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addingToCartProductId, setAddingToCartProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const itemImageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const itemsPerPage = 20;

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    size: false,
    color: false,
    price: false,
    sort: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2400);
  };

  const animateFlyToCart = (productId: string) => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const imageEl = itemImageRefs.current[productId];
      const cartButtonEl = document.querySelector('[data-cart-icon-button]') as HTMLElement | null;
      
      if (!imageEl) {
        console.warn(`Image ref not found for product ${productId}`);
        return;
      }
      if (!cartButtonEl) {
        console.warn('Cart button element not found');
        return;
      }

      const startRect = imageEl.getBoundingClientRect();
      const endRect = cartButtonEl.getBoundingClientRect();

      // Clone the image and position it over the original
      const flyImg = imageEl.cloneNode(true) as HTMLImageElement;
      flyImg.style.position = 'fixed';
      flyImg.style.top = `${startRect.top}px`;
      flyImg.style.left = `${startRect.left}px`;
      flyImg.style.width = `${startRect.width}px`;
      flyImg.style.height = `${startRect.height}px`;
      flyImg.style.borderRadius = '20px';
      flyImg.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
      flyImg.style.pointerEvents = 'none';
      flyImg.style.transformOrigin = 'center center';
      flyImg.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      flyImg.style.zIndex = '9999';
      document.body.appendChild(flyImg);

      // Start at smallest size for strong visual impact
      flyImg.style.transform = 'scale(0.5)';
      flyImg.style.opacity = '1';

      requestAnimationFrame(() => {
        const translateX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
        const translateY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
        const scaleDown = Math.min(endRect.width / startRect.width, endRect.height / startRect.height, 0.2);
        flyImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleDown})`;
        flyImg.style.opacity = '0.3';
      });

      const cartIconWrapper = document.querySelector('[data-cart-icon]') as HTMLElement | null;
      const cleanup = () => {
        flyImg.remove();
        if (cartIconWrapper) {
          cartIconWrapper.classList.remove('animate-pulse');
          cartIconWrapper.classList.add('cart-shake');
          window.setTimeout(() => {
            cartIconWrapper.classList.remove('cart-shake');
          }, 600);
        }
      };

      if (cartIconWrapper) {
        cartIconWrapper.classList.add('animate-pulse');
      }
      window.setTimeout(cleanup, 1200);
    }, 50);
  };

  const handleAddToCart = async (productId: string) => {
    setAddingToCartProductId(productId);
    try {
      const productDetail = await api.getProductById(productId);
      const variant = productDetail.variants.find((v) => v.stockQuantity > 0) ?? productDetail.variants[0];
      if (!variant) {
        showToast('Sản phẩm hiện không có phiên bản khả dụng.');
        return;
      }

      await api.addToCart({
        productId,
        productVariantId: variant._id,
        quantity: 1
      });

      animateFlyToCart(productId);
      showToast('Đã thêm vào giỏ hàng');
    } catch (error) {
      console.error(error);
      showToast('Vui lòng đăng nhập trước khi thêm vào giỏ hàng.');
    } finally {
      setAddingToCartProductId(null);
    }
  };

  const updateCategory = (slug: string) => {
    setSelectedCategory(slug);

    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }

    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await api.getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (queryCategory !== selectedCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [queryCategory, selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        const data = await api.getProducts(params);
        setAllProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const sizeOptions = useMemo(() => {
    const values = new Set<string>();
    allProducts.forEach((product) => {
      product.sizes.forEach((size) => values.add(size));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const colorOptions = useMemo(() => {
    const values = new Set<string>();
    allProducts.forEach((product) => {
      product.colors.forEach((color) => values.add(color));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return [0, 0] as [number, number];
    const prices = allProducts.map((p) => p.price);
    const min = 0; // Always start from 0đ
    const max = Math.max(...prices);
    return [min, Math.ceil(max)] as [number, number];
  }, [allProducts]);

  useEffect(() => {
    if (priceBounds[1] > 0) {
      setPriceRange(priceBounds);
    }
  }, [priceBounds]);

  const filteredProducts = useMemo(() => {
    const next = allProducts.filter((product) => {
      const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize);
      const colorMatch = selectedColor === 'all' || product.colors.includes(selectedColor);
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return sizeMatch && colorMatch && priceMatch && searchMatch;
    });

    if (sortBy === 'price-asc') {
      return [...next].sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-desc') {
      return [...next].sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'name-asc') {
      return [...next].sort((a, b) => a.name.localeCompare(b.name));
    }

    return next;
  }, [allProducts, selectedSize, selectedColor, priceRange, sortBy, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSize, selectedColor, priceRange, sortBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const normalizedStart = Math.max(1, end - 4);

    return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
  }, [currentPage, totalPages]);

  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const priceSpan = Math.max(1, priceBounds[1] - priceBounds[0]);
  const activeCategoryLabel = selectedCategory === 'all'
    ? 'Sản phẩm mới'
    : categories.find((cat) => cat.slug === selectedCategory)?.name ?? selectedCategory.replace(/[-_]/g, ' ');

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <style>{`
        @keyframes cartShake {
          0%, 100% { transform: translateX(0) scale(1); }
          20% { transform: translateX(-2px) scale(1.04); }
          40% { transform: translateX(2px) scale(1.04); }
          60% { transform: translateX(-1px) scale(1.02); }
          80% { transform: translateX(1px) scale(1.02); }
        }
        .cart-shake {
          animation: cartShake 0.45s ease-out !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        <section className="mb-10 px-2 lg:mb-14">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-3 font-medium">Aurelia Shop</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1 w-full max-w-full overflow-hidden">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900 mb-6">{activeCategoryLabel}</h1>
              
              <div className="flex flex-nowrap items-center bg-slate-50/70 border border-slate-200/80 rounded-full pl-5 pr-1.5 py-1.5 shadow-sm max-w-4xl overflow-hidden backdrop-blur hover:bg-white transition-colors">
                <p className="text-[13px] md:text-sm text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis flex-1 mr-4 shrink">
                  Trình bày tinh gọn, dữ liệu rõ nét và phong cách sang trọng theo danh mục đã chọn.
                </p>
                <div className="relative w-[180px] md:w-[280px] lg:w-[320px] shrink-0 group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all placeholder:text-slate-400/80 text-slate-800 shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 rounded-full p-1.5 cursor-pointer group-hover:bg-slate-700 transition-colors pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>

            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 whitespace-nowrap shrink-0 pb-3 lg:pb-6">
              {filteredProducts.length} sản phẩm
            </p>
          </div>
        </section>

        <button
          className="lg:hidden w-full bg-slate-900 text-white py-3 text-xs uppercase tracking-[0.2em] font-semibold mb-6 flex items-center justify-center gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" /> Bộ lọc
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
          <aside className={`lg:col-span-3 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 pr-4">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <button
                  className="w-full flex items-center justify-between text-left text-[15px] font-semibold text-slate-800"
                  onClick={() => toggleSection('category')}
                >
                  Danh mục
                  {openSections.category ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {openSections.category && (
                  <div className="mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {[{ slug: 'all', name: 'Tất cả' }, ...categories].map((cat) => {
                      const isSelected = selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => updateCategory(cat.slug)}
                          className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${isSelected ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                          </span>
                          <span className={isSelected ? "font-medium text-slate-900" : ""}>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <button
                  className="w-full flex items-center justify-between text-left text-[15px] font-semibold text-slate-800"
                  onClick={() => toggleSection('size')}
                >
                  Kích thước
                  {openSections.size ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {openSections.size && (
                  <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedSize('all')}
                      className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${selectedSize === 'all' ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                        {selectedSize === 'all' && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                      </span>
                      <span className={selectedSize === 'all' ? "font-medium text-slate-900" : ""}>Tất cả</span>
                    </button>
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${selectedSize === size ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                          {selectedSize === size && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                        </span>
                        <span className={selectedSize === size ? "font-medium text-slate-900" : ""}>{size}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <button
                  className="w-full flex items-center justify-between text-left text-[15px] font-semibold text-slate-800"
                  onClick={() => toggleSection('color')}
                >
                  Màu sắc
                  {openSections.color ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {openSections.color && (
                  <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => setSelectedColor('all')}
                      className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${selectedColor === 'all' ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                        {selectedColor === 'all' && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                      </span>
                      <span className={selectedColor === 'all' ? "font-medium text-slate-900" : ""}>Tất cả</span>
                    </button>
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${selectedColor === color ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                          {selectedColor === color && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                        </span>
                        <span className={selectedColor === color ? "font-medium text-slate-900" : ""}>{color}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200">
                <button
                  className="w-full flex items-center justify-between text-left text-[15px] font-semibold text-slate-800 mb-4"
                  onClick={() => toggleSection('price')}
                >
                  Giá
                  {openSections.price ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {openSections.price && (
                  <>
                  <div className="text-[14px] text-slate-600 mb-4 flex items-center justify-between">
                    <span className="font-semibold">{formatVND(priceRange[0])}</span>
                    <span className="font-semibold">{formatVND(priceRange[1])}</span>
                  </div>
                  <PriceRangeSlider
                    min={priceBounds[0]}
                    max={priceBounds[1]}
                    step={Math.max(1000, Math.round(priceSpan / 40))}
                    currentRange={priceRange}
                    onRangeChange={setPriceRange}
                  />
                  </>
                )}
              </div>

              <div className="mb-6 pb-6">
                <button
                  className="w-full flex items-center justify-between text-left text-[15px] font-semibold text-slate-800 mb-4"
                  onClick={() => toggleSection('sort')}
                >
                  Sắp xếp
                  {openSections.sort ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>
                {openSections.sort && (
                  <div className="mt-2 space-y-3">
                    {[
                      { id: 'newest', label: 'Mới nhất' },
                      { id: 'price-asc', label: 'Giá tăng' },
                      { id: 'price-desc', label: 'Giá giảm' },
                      { id: 'name-asc', label: 'Tên A-Z' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={sortBy === option.id}
                        onClick={() => setSortBy(option.id)}
                        className="group flex items-center gap-3 w-full text-left text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-colors shrink-0 ${sortBy === option.id ? 'border-slate-800' : 'border-slate-300 group-hover:border-slate-500'}`}>
                          {sortBy === option.id && <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                        </span>
                        <span className={sortBy === option.id ? "font-medium text-slate-900" : ""}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  updateCategory('all');
                  setSelectedSize('all');
                  setSelectedColor('all');
                  setPriceRange(priceBounds);
                  setSortBy('newest');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="w-full border border-slate-300 text-slate-700 rounded-md py-2.5 text-[14px] font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 px-1">
              <p className="text-sm text-slate-600">
                Hiển thị {startItem}-{endItem} trên {filteredProducts.length} sản phẩm
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">20 sản phẩm mỗi trang</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-3">
                    <div className="aspect-[4/5] bg-slate-300 mb-3" />
                    <div className="h-3 bg-slate-300 w-5/6 mb-2" />
                    <div className="h-3 bg-slate-300 w-1/2" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-20 text-center bg-white/70">
                <h3 className="font-serif text-3xl mb-3">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-slate-600 mb-8">Hãy thử thay đổi bộ lọc để xem thêm sản phẩm.</p>
                <button
                  type="button"
                  onClick={() => {
                    updateCategory('all');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setPriceRange(priceBounds);
                    setSortBy('newest');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 text-white px-7 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-slate-700 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {paginatedProducts.map((product) => (
                    <ProductCardItem
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      addingToCartProductId={addingToCartProductId}
                      imageRef={(el) => { itemImageRefs.current[product._id] = el; }}
                    />
                  ))}
                </div>

                <div className="mt-14 bg-white/80 px-3 py-3 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-slate-900 text-white px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {visiblePages.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 text-sm font-semibold transition-colors ${
                          currentPage === pageNumber ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-slate-900 text-white px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 opacity-95">
            {toastMessage}
          </div>
        )}
    </div>
  );
}
