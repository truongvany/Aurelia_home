import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, Heart } from 'lucide-react';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';
import type { CartItemApi } from '../types';
import type { Product } from '../types';
import { getWishlistProductIds, getWishlistUpdatedEventName } from '../utils/wishlist';

// Logo is located in the parent workspace root (outside the frontend/src folder)
import logo from '../assets/images/logo.png';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemApi[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistPreviewItems, setWishlistPreviewItems] = useState<Product[]>([]);
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const syncWishlistData = async () => {
      const wishlistIds = getWishlistProductIds();
      setWishlistCount(wishlistIds.length);

      if (wishlistIds.length === 0) {
        setWishlistPreviewItems([]);
        return;
      }

      try {
        const products = await api.getProducts();
        const orderMap = new Map(wishlistIds.map((id, index) => [id, index]));
        const preview = products
          .filter((product) => orderMap.has(product._id))
          .sort((a, b) => (orderMap.get(a._id) ?? 0) - (orderMap.get(b._id) ?? 0))
          .slice(0, 4);
        setWishlistPreviewItems(preview);
      } catch {
        setWishlistPreviewItems([]);
      }
    };

    syncWishlistData();

    window.addEventListener(getWishlistUpdatedEventName(), syncWishlistData);
    window.addEventListener('storage', syncWishlistData);

    return () => {
      window.removeEventListener(getWishlistUpdatedEventName(), syncWishlistData);
      window.removeEventListener('storage', syncWishlistData);
    };
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || user?.role !== 'customer') {
        setCartCount(0);
        setCartItems([]);
        return;
      }

      try {
        const cart = await api.getCart();
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
        setCartItems(cart.items);
      } catch {
        setCartCount(0);
        setCartItems([]);
      }
    };

    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener('aurelia:cart-updated', handleCartUpdated);
    loadCart();

    return () => {
      window.removeEventListener('aurelia:cart-updated', handleCartUpdated);
    };
  }, [isAuthenticated, user?.role]);

  const profileTarget = !isAuthenticated ? '/auth' : user?.role === 'admin' ? '/admin' : '/profile';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <button className="p-2 -ml-2 mr-2 md:hidden text-[#0a192f] hover:text-[#1e3a8a] transition-colors">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center font-serif text-2xl font-bold tracking-widest uppercase text-[#0a192f]">
              <img src={logo} alt="Aurelia Home" className="h-15 w-auto mr-2" />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider">Trang chủ</Link>  
            <Link to="/shop" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider">Thời trang mới</Link>
            <Link to="/about" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider">Giới thiệu</Link>
            <Link to="/contact" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider">Liên hệ</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to={profileTarget} className="p-2 text-[#0a192f] hover:text-[#1e3a8a] transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <div className="group relative">
              <Link to="/wishlist" className="p-2 text-[#0a192f] hover:text-[#1e3a8a] transition-colors relative block" aria-label="Sản phẩm yêu thích">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="absolute right-0 top-full z-50 w-80 pt-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="rounded-2xl border border-slate-200 bg-white/98 p-3 shadow-[0_16px_45px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sản phẩm yêu thích</p>
                  {wishlistPreviewItems.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500">Chưa có sản phẩm yêu thích</p>
                  ) : (
                    <div className="space-y-2">
                      {wishlistPreviewItems.map((item) => (
                        <Link key={item._id} to={`/product/${item._id}`} className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-2 hover:bg-slate-100 transition-colors">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.category}</p>
                          </div>
                          <p className="text-xs font-semibold text-slate-700">{formatVND(item.price)}</p>
                        </Link>
                      ))}
                      <Link
                        to="/wishlist"
                        className="mt-1 block rounded-xl bg-slate-900 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-slate-700"
                      >
                        Xem danh sách yêu thích
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="group relative" data-cart-icon>
              <Link to="/cart" className="p-2 text-[#0a192f] hover:text-[#1e3a8a] transition-colors relative block" aria-label="Giỏ hàng" data-cart-icon-button>
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
              </Link>

              <div className="absolute right-0 top-full z-50 w-80 pt-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="rounded-2xl border border-slate-200 bg-white/98 p-3 shadow-[0_16px_45px_rgba(15,23,42,0.18)] backdrop-blur-sm">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Giỏ hàng gần đây</p>
                  {cartItems.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500">Chưa có sản phẩm trong giỏ</p>
                  ) : (
                    <div className="space-y-2">
                      {cartItems.slice(0, 4).map((item) => (
                        <Link
                          key={item._id}
                          to={`/product/${item.productId}`}
                          className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-2 hover:bg-slate-100 transition-colors"
                        >
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="h-12 w-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">{item.productName}</p>
                            <p className="text-xs text-slate-500">SL: {item.quantity} • {item.size} / {item.color}</p>
                          </div>
                          <p className="text-xs font-semibold text-slate-700">{formatVND(item.lineTotal)}</p>
                        </Link>
                      ))}
                      <Link
                        to="/cart"
                        className="mt-1 block rounded-xl bg-slate-900 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-slate-700"
                      >
                        Xem giỏ hàng
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={signOut}
                className="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
