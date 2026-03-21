import { useEffect, useMemo, useState } from 'react';
import { Heart, ArrowRight, Search, X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import { getWishlistProductIds, getWishlistUpdatedEventName, toggleWishlistProduct } from '../utils/wishlist';

const ITEMS_PER_PAGE = 12;

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const syncWishlist = () => setWishlistIds(getWishlistProductIds());
    syncWishlist();
    window.addEventListener(getWishlistUpdatedEventName(), syncWishlist);
    window.addEventListener('storage', syncWishlist);
    return () => {
      window.removeEventListener(getWishlistUpdatedEventName(), syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const wishlistProducts = useMemo(() => {
    const orderMap = new Map<string, number>(wishlistIds.map((id, i) => [id, i]));
    return products
      .filter((p) => orderMap.has(p._id))
      .sort((a, b) => (orderMap.get(a._id) ?? 0) - (orderMap.get(b._id) ?? 0));
  }, [products, wishlistIds]);

  // Derive category list from wishlist products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    wishlistProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [wishlistProducts]);

  const filtered = useMemo(() => {
    return wishlistProducts.filter((p) => {
      const catOk = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const searchOk = !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [wishlistProducts, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory]);

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      toggleWishlistProduct(productId);
      setWishlistIds(getWishlistProductIds());
      setRemovingId(null);
    }, 280);
  };

  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const ns = Math.max(1, end - 4);
    return Array.from({ length: end - ns + 1 }, (_, i) => ns + i);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#f9f8f7] text-slate-900">
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.92); }
        }
        .wishlist-removing {
          animation: fadeOut 0.28s ease-out forwards;
          pointer-events: none;
        }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-2 font-medium">King Man</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-slate-900 flex items-center gap-3">
                Sản Phẩm Yêu Thích
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {wishlistProducts.length > 0
                  ? `Bạn đang lưu ${wishlistProducts.length} sản phẩm`
                  : 'Chưa có sản phẩm nào được lưu'}
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-900 rounded-full px-5 py-2.5 transition-all"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          /* ── Skeleton ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden border border-slate-100">
                <div className="aspect-[3/4] bg-slate-200" />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 bg-slate-200 rounded w-4/5" />
                  <div className="h-2.5 bg-slate-200 rounded w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
              <Heart className="h-9 w-9 text-rose-300" />
            </div>
            <h2 className="font-serif text-2xl text-slate-800 mb-2">Danh sách trống</h2>
            <p className="text-slate-500 text-sm max-w-xs mb-7">
              Nhấn vào biểu tượng trái tim trên card sản phẩm để lưu vào đây.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs uppercase tracking-[0.18em] font-semibold px-7 py-3 rounded-full hover:bg-rose-500 transition-colors"
            >
              Khám phá sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Toolbar: Search + Category chips ── */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-shrink-0 w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm trong danh sách yêu thích..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-full text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 placeholder:text-slate-400 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Category filter chips */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {[{ slug: 'all', label: 'Tất cả' }, ...categories.map((c) => ({ slug: c, label: c }))].map(({ slug, label }) => (
                  <button
                    key={slug}
                    onClick={() => setSelectedCategory(slug)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.1em] border transition-all ${
                      selectedCategory === slug
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {label}
                    {slug !== 'all' && (
                      <span className={`ml-1.5 ${selectedCategory === slug ? 'opacity-60' : 'opacity-40'}`}>
                        ({wishlistProducts.filter((p) => p.category === slug).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Result count */}
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap flex-shrink-0">
                {filtered.length} sản phẩm
              </p>
            </div>

            {/* ── No results ── */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-500 mb-3">Không tìm thấy sản phẩm phù hợp.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-sm text-slate-700 underline hover:text-slate-900"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                {/* ── Product Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
                  {paginated.map((item) => {
                    const discountedPrice = !!(item.discountPercent && item.discountPercent > 0)
                      ? item.price * (1 - item.discountPercent / 100)
                      : null;

                    return (
                      <article
                        key={item._id}
                        className={`group bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col ${
                          removingId === item._id ? 'wishlist-removing' : ''
                        }`}
                      >
                        {/* Image */}
                        <div className="relative aspect-[3/4] bg-[#ece8e2] overflow-hidden">
                          {!!(item.discountPercent && item.discountPercent > 0) && (
                            <span className="absolute top-2 left-2 z-10 bg-[#e53935] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                              -{item.discountPercent}%
                            </span>
                          )}
                          <Link to={`/product/${item._id}`}>
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          </Link>
                          {/* Remove from wishlist */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item._id)}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100"
                            aria-label="Bỏ khỏi yêu thích"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-2.5 flex flex-col flex-1">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400 mb-1 truncate">{item.category}</p>
                          <Link to={`/product/${item._id}`}>
                            <h3 className="text-[12px] font-medium text-slate-800 line-clamp-2 leading-snug hover:text-slate-600 transition-colors mb-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-auto flex items-center justify-between gap-1">
                            <div>
                              {discountedPrice ? (
                                <>
                                  <p className="text-[12px] font-bold text-[#e53935] leading-none">{formatVND(discountedPrice)}</p>
                                  <p className="text-[10px] text-slate-400 line-through">{formatVND(item.price)}</p>
                                </>
                              ) : (
                                <p className="text-[12px] font-bold text-slate-800">{formatVND(item.price)}</p>
                              )}
                            </div>
                            <Link
                              to={`/product/${item._id}`}
                              className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-slate-600 flex items-center justify-center transition-all"
                              aria-label={`Xem ${item.name}`}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 border-t border-slate-200 pt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {visiblePages.map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-full text-[13px] font-semibold border transition-all ${
                          currentPage === page
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}