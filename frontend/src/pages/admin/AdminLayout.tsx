import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Bell, Search, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders & Payments', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  // Helper to determine if a path is active, including sub-routes
  const isActive = (itemPath: string) => {
    if (itemPath === '/admin') {
      return path === '/admin';
    }
    return path.startsWith(itemPath);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-center">
          <Link to="/admin" className="flex flex-col items-center">
            <span className="text-2xl font-serif font-bold tracking-widest text-[#C5A059]">AH</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 mt-1 font-medium">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen bg-slate-50/50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center text-slate-800 font-semibold text-lg">
            {navItems.find(item => isActive(item.path))?.label || 'Admin'}
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-64 outline-none placeholder:text-slate-400"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[#C5A059] font-bold text-xs border border-slate-200">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-medium">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}