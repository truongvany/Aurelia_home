import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

type AdminOrder = {
  _id: string;
  customer: string;
  date: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
};

const statusTone = (status: string) => {
  if (status === 'delivered') return 'bg-emerald-100 text-emerald-700';
  if (status === 'paid' || status === 'pending') return 'bg-blue-100 text-blue-700';
  if (status === 'shipped') return 'bg-purple-100 text-purple-700';
  return 'bg-red-100 text-red-700';
};

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      api
        .getAdminOrders({ search: search || undefined, limit: 100 })
        .then((payload) => setOrders(payload.items))
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load orders'))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Orders & Payments</h2>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by ID or customer..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={7}>Loading orders...</td>
                </tr>
              )}
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={7}>No orders found.</td>
                </tr>
              )}
              {!isLoading && orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      order.paymentStatus === 'failed' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link to={`/admin/orders/${order._id}`} className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="h-4 w-4" />
                    </Link>
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