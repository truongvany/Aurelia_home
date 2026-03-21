import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

type AdminProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  stockStatus: string;
  imageUrl: string;
};

export default function Products() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState<{ role: string } | null>(null);

  const scrollStorageKey = 'admin-products-scroll-position';

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock' || p.stockQuantity <= 5).length;
    const totalCategories = categories.length;
    return { totalProducts, lowStockCount, totalCategories };
  }, [products, categories]);

  const backendOrigin = useMemo(() => {
    const apiBase = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000/api/v1';
    return apiBase.replace('/api/v1', '');
  }, []);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      api
        .getAdminProducts({ search: search || undefined, category: category || undefined, limit: 100 })
        .then((payload) => setProducts(payload.items))
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load products'))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, category]);

  useEffect(() => {
    if (!isLoading) {
      const saved = Number(sessionStorage.getItem(scrollStorageKey) ?? '0');
      if (saved > 0) {
        window.scrollTo({ top: saved, behavior: 'auto' });
      }
    }
  }, [isLoading]);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/120x120?text=No+Image';
    return url.startsWith('http') ? url : `${backendOrigin}${url}`;
  };

  const handleArchive = async (productId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn lưu trữ sản phẩm này?')) return;

    try {
      await api.archiveAdminProduct(productId);
      setProducts((prev) => prev.filter((item) => item._id !== productId));
      setError(null);
    } catch (err) {
      console.error('Delete product error:', err);
      setError(err instanceof Error ? err.message : 'Không thể xóa sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sản phẩm</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý sản phẩm, tồn kho và danh mục</p>
        </div>
        <Link to="/admin/products/new" className="bg-[#C5A059] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B38D46] transition-colors flex items-center shadow-md shadow-amber-900/10">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng sản phẩm</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn kho thấp</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.lowStockCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCategories}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item._id} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Sản phẩm</th>
                <th className="px-6 py-4 font-medium">Danh mục</th>
                <th className="px-6 py-4 font-medium">Giá</th>
                <th className="px-6 py-4 font-medium">Tồn kho</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Đang tải sản phẩm...</td>
                </tr>
              )}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Không tìm thấy sản phẩm.</td>
                </tr>
              )}
              {!isLoading && products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border border-slate-200">
                        <img className="h-full w-full object-cover" src={getImageUrl(product.imageUrl)} alt={product.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500">Mã: {product._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatVND(product.price)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.stockQuantity} sản phẩm</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      product.stockStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      product.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.stockStatus === 'Active' ? 'Đang bán' : product.stockStatus === 'Low Stock' ? 'Sắp hết' : 'Ngưng bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/admin/products/${product._id}`}
                        onClick={() => sessionStorage.setItem(scrollStorageKey, String(window.scrollY))}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleArchive(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Lưu trữ sản phẩm">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}