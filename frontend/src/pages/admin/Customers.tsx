import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Users, CurrencyDollar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

type AdminCustomer = {
  _id: string;
  fullName: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgPerCustomer = totalCustomers ? totalSpent / totalCustomers : 0;
    return { totalCustomers, totalOrders, totalSpent, avgPerCustomer };
  }, [customers]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      api
        .getAdminCustomers({ search: search || undefined, limit: 100 })
        .then((payload) => setCustomers(payload.items))
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load customers'))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Khách hàng</h2>
          <p className="text-sm text-slate-500 mt-1">Danh sách khách hàng, đơn hàng và doanh thu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng khách</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng đơn</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{formatVND(stats.totalSpent)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trung bình/khách</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{formatVND(stats.avgPerCustomer)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4 flex-col lg:flex-row lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Làm mới
            </Link>
          </div>
        </div>

        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Đơn hàng</th>
                <th className="px-6 py-4 font-medium">Tổng chi</th>
                <th className="px-6 py-4 font-medium">Tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Đang tải khách hàng...</td>
                </tr>
              )}
              {!isLoading && customers.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Không tìm thấy khách hàng.</td>
                </tr>
              )}
              {!isLoading && customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {customer.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="ml-3 text-sm font-bold text-slate-900">{customer.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.orderCount}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{formatVND(customer.totalSpent)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link to={`/admin/customers/${customer._id}`} className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100" title="Xem chi tiết">
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