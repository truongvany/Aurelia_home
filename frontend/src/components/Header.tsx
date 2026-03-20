import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, Heart, Bell } from 'lucide-react';
import { api } from '../lib/api';
import type { MegaMenuCategory } from '../lib/api';
import { formatVND } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';
import type { CartItemApi } from '../types';
import type { Product } from '../types';
import { getWishlistProductIds, getWishlistUpdatedEventName, setWishlistProductIds } from '../utils/wishlist';

// Logo is located in the parent workspace root (outside the frontend/src folder)
import logo from '../assets/images/logo.png';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItemApi[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistPreviewItems, setWishlistPreviewItems] = useState<Product[]>([]);
  const [megaMenu, setMegaMenu] = useState<MegaMenuCategory[]>([]);
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const syncWishlistData = async () => {
      const wishlistIds = getWishlistProductIds();

      if (wishlistIds.length === 0) {
        setWishlistCount(0);
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

        const validWishlistIds = products
          .filter((product) => orderMap.has(product._id))
          .map((product) => product._id);

        if (validWishlistIds.length !== wishlistIds.length) {
          setWishlistProductIds(validWishlistIds);
        }

        setWishlistCount(validWishlistIds.length);
        setWishlistPreviewItems(preview);
      } catch {
        setWishlistCount(0);
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
    // Fetch mega menu categories only once
    api.getMegaMenu()
      .then(setMegaMenu)
      .catch(() => console.error("Could not fetch mega menu"));
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

  const location = useLocation();
  const queryCategory = new URLSearchParams(location.search).get('category') ?? '';
  const profileTarget = !isAuthenticated ? '/auth' : user?.role === 'admin' ? '/admin' : '/profile';
  const featuredColumn = megaMenu.find((column) => column.title === 'SẢN PHẨM ƯU ĐÃI');
  const quickLinks = featuredColumn?.items.slice(0, 3) ?? [];

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Bar Announcement / Contact Info */}
      <div className="bg-[#1d1d1f] text-[#f5f5f7] text-[12px] font-medium hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[36px]">
            {/* Left side: Notifications */}
            <div className="flex items-center cursor-pointer hover:text-white transition-colors group">
              <div className="relative flex items-center mr-2 pt-0.5">
                <Bell className="h-3.5 w-3.5 text-slate-300 group-hover:text-white transition-colors" />
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 bg-red-600 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-[#1d1d1f]">
                  0
                </span>
              </div>
              <span className="tracking-wide">Thông báo của tôi</span>
            </div>

            {/* Right side: Contact */}
            <div className="flex items-center space-x-3.5 tracking-wide">
              <div className="flex items-center font-medium">
                <span className="text-slate-300 mr-1.5">Hotline mua hàng:</span>
                <a href="tel:0964942121" className="font-bold text-white hover:text-blue-400 transition-colors">0964942121</a>
                <span className="ml-1.5 text-slate-400">(8:30-21:30, Tất cả các ngày trong tuần)</span>
              </div>
              <span className="text-[#424245]">|</span>
              <Link to="/contact" className="hover:text-white transition-colors text-slate-300">Liên hệ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm relative z-40">
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
          <nav className="hidden md:flex space-x-8 h-full items-center">
            <Link to="/" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider h-full flex items-center">Trang chủ</Link>

            <div className="group flex items-center h-full">
              <Link to="/shop" className="text-sm font-medium text-[#0a192f] group-hover:text-[#1e3a8a] transition-colors uppercase tracking-wider h-full flex items-center relative z-10">
                Thời trang
                <div className="absolute left-0 right-0 top-full h-4" />
              </Link>

              <div className="absolute left-0 top-full w-full bg-white opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t border-slate-100 pb-0 flex flex-col z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="flex pt-8 pb-10">
                    <div className="flex-1 grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.max(1, megaMenu.length)}, minmax(0, 1fr))` }}>
                      {megaMenu.map((column, idx) => (
                        <div key={idx} className="flex flex-col space-y-4">
                          <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#0a192f] mb-1 flex items-center hover:text-[#1e3a8a] cursor-pointer group/title transition-colors">
                            {column.title} <span className="ml-1 text-[#1e3a8a] transition-transform group-hover/title:translate-x-1">→</span>
                          </h3>
                          <ul className="space-y-3">
                            {column.items.map((item, itemIdx) => {
                              const active = queryCategory === item.slug;
                              return (
                                <li key={itemIdx}>
                                  <Link
                                    to={`/shop?category=${encodeURIComponent(item.slug)}`}
                                    className={`text-sm font-medium transition-colors block ${
                                      active
                                        ? 'text-[#0f286d] hover:text-[#0b1d5c]'
                                        : 'text-slate-500 hover:text-[#0f286d]'
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="w-[260px] ml-8 flex flex-col gap-4 border-l border-slate-100 pl-8">
                      <Link
                        to={quickLinks[0] ? `/shop?category=${encodeURIComponent(quickLinks[0].slug)}` : '/shop'}
                        className="relative group/img overflow-hidden rounded-xl aspect-[4/3] block"
                      >
                        <img src="https://product.hstatic.net/1000102419/product/thmts057navy__2__4464ce7894784744803de471b6e277f7_master.jpg" alt="Đồ Thu Đông" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-bold text-[15px] tracking-wide">{quickLinks[0]?.name ?? 'Khám phá danh mục'}</p>
                        </div>
                      </Link>
                      <Link
                        to={quickLinks[1] ? `/shop?category=${encodeURIComponent(quickLinks[1].slug)}` : '/shop'}
                        className="relative group/img overflow-hidden rounded-xl aspect-[4/3] block"
                      >
                        <img src="https://dongphucbonmua.com/wp-content/uploads/2019/08/dong-phuc-quan-au-cong-so-nam-mau-den.jpg" alt="Pickleball Nam" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-bold text-[15px] tracking-wide">{quickLinks[1]?.name ?? 'Bộ sưu tập mới'}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 py-3 mt-auto">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center space-x-8">
                    <span className="text-[11px] text-slate-400 font-medium uppercase tracking-[0.2em]">DANH MỤC NỔI BẬT</span>
                    {(quickLinks.length > 0 ? quickLinks : megaMenu.flatMap((column) => column.items).slice(0, 3)).map((item) => (
                      <Link
                        key={item.slug}
                        to={`/shop?category=${encodeURIComponent(item.slug)}`}
                        className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#0a192f] hover:text-[#1e3a8a] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#1e3a8a] hover:after:w-full after:transition-all after:duration-300"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider h-full flex items-center">Giới thiệu</Link>
            <Link to="/contact" className="text-sm font-medium text-[#0a192f] hover:text-[#1e3a8a] transition-colors uppercase tracking-wider h-full flex items-center">Liên hệ</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/membership"
              className="md:hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0a192f] hover:text-[#1e3a8a]"
            >
              Member
            </Link>
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
    </div>
  );
}
