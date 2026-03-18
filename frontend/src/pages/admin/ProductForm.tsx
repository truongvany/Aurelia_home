import React from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockProducts = [
  { id: 'PROD-001', name: 'Sterling Charcoal Suit', category: 'Outerwear', price: '$1,250.00', stock: 45, status: 'Active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY' },
  { id: 'PROD-002', name: 'Midnight Wool Blazer', category: 'Knitwear', price: '$890.00', stock: 12, status: 'Low Stock', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i87OVxxHmXunaf2nV6RiRdkzm0xIfz7Y08mMzSsDa_7UmulYg6nIlHDtegH4XL_-zONXUmzj1tN0WnJGcwc8kuUe-C4hpQobTA6QIMw0Ws8y-DnnCHcg04FeH7sie07O9ibl1mHmSxRSNDWlJhrw3qcNWLu6jJLeZJYdvhRWPsv7ta0uqjXcA8BK4Axsq8Q31Eqt2fDHkbtnTgGy8QNifJ3mhbogqXq_VTs7IG_8iXTeTBD-Z-IS-BroR1dC2AbCO671tI5pA1Q' },
  { id: 'PROD-003', name: 'Egyptian Cotton Shirt', category: 'Shirts', price: '$220.00', stock: 150, status: 'Active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkp0y2C5sO1Kmu91TWIe7h52GvFcx0SmWm6yi-P4Q-C8fA1CzZqU4g5fguoaaXzb2x6tuCDAp5hhhQTzDTkFT83YMgOUUWv09T-BjnNNBEPSX8bz9zcvgq3jIgzzDckCKuB_vIouYoyZR7ECLCZR0703Rvs6Tavi0yJI5biQLzxTQ6W6m0ssRY2i3yR6LfpgkhUgtUs23Amzigrm7XQm_5M8rhY6Zf19HqelKZzSH8RkKcGGrBAmj7H07F10NsKCvjSdXxq0TvYq0' },
  { id: 'PROD-004', name: 'Hand-Stitched Belt', category: 'Accessories', price: '$180.00', stock: 0, status: 'Out of Stock', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3fvopJ4PhAVgkq5NfFoID5ynBIrdzvSVBtewp2HioS4M8Jn_5kO10K0n1P_OORiArGz567PAw-qwr3yHNCevPBF7mZ90E6iR2WkoCB8q28DuI9ufe50dRNic7Xu8WHEOO9pNyCW0soMPHCl4fXH0SlH49L-xqTzS3JPdA8nhYxTOCsOKfJJEH0lDnW0NjLKp6AM-bu7V4iSjw6St7fcmp2tvuOogG-F5M4oqME6tYpe8pxv8QjSppX3iqmSBC3yvCjVbAiB2fAQw' },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Products</h2>
        <Link to="/admin/products/new" className="bg-[#C5A059] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#B38D46] transition-colors flex items-center shadow-md shadow-amber-900/10">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Link>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Outerwear</option>
            <option>Knitwear</option>
            <option>Shirts</option>
            <option>Accessories</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden border border-slate-200">
                        <img className="h-full w-full object-cover" src={product.image} alt={product.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{product.price}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.stock} units</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/products/${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
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