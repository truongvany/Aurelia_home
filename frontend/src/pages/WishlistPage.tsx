import { useEffect, useMemo, useState } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import { getWishlistProductIds, getWishlistUpdatedEventName, toggleWishlistProduct } from '../utils/wishlist';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const syncWishlist = () => {
      setWishlistIds(getWishlistProductIds());
    };

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
      } catch (error) {
        console.error('Failed to fetch products', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const wishlistProducts = useMemo(() => {
    const orderMap = new Map(wishlistIds.map((id, index) => [id, index]));

    return products
      .filter((product) => orderMap.has(product._id))
      .sort((a, b) =>
        Number(orderMap.get(a._id) ?? 0) - Number(orderMap.get(b._id) ?? 0)
      );
  }, [products, wishlistIds]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-slate-100 rounded-2xl h-[360px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-white text-slate-900">
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 mb-2">Danh sách của bạn</p>
            <h1 className="font-serif text-3xl md:text-5xl text-slate-900">Sản Phẩm Yêu Thích</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-600">{wishlistProducts.length} sản phẩm</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-16 text-center bg-slate-50">
            <Heart className="h-10 w-10 mx-auto text-slate-400 mb-4" />
            <h2 className="font-serif text-2xl text-slate-900 mb-3">Bạn chưa thêm sản phẩm nào</h2>
            <p className="text-slate-600 mb-6">Nhấn vào biểu tượng trái tim ở trang chi tiết để lưu lại sản phẩm bạn thích.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-xs uppercase tracking-[0.18em] font-semibold px-6 py-3 hover:bg-blue-600 transition-colors"
            >
              Mua sắm ngay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((item) => (
              <article
                key={item._id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all"
              >
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      toggleWishlistProduct(item._id);
                      setWishlistIds(getWishlistProductIds());
                    }}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full border border-rose-200 bg-white/95 text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center"
                    aria-label="Bỏ khỏi yêu thích"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">{item.category}</p>
                  <h3 className="text-sm md:text-base font-semibold text-slate-900 line-clamp-2 min-h-[2.8rem] mb-3">{item.name}</h3>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm md:text-base font-semibold text-slate-800">{formatVND(item.price)}</span>
                    <Link
                      to={`/product/${item._id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors"
                    >
                      Xem
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}