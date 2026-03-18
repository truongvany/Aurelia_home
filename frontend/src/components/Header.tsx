import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

// Logo is located in the parent workspace root (outside the frontend/src folder)
import logo from '../../../logo.png';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated || user?.role !== 'customer') {
        setCartCount(0);
        return;
      }

      try {
        const cart = await api.getCart();
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch {
        setCartCount(0);
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
            <Link to="/cart" className="p-2 text-[#0a192f] hover:text-[#1e3a8a] transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
            </Link>
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
