import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

type AdminOrder = {
  _id: string;
  customer: string;
  date: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  productImageUrl?: string;
  productName?: string;
};

const statusTone = (status: string) => {
  if (status === 'delivered') return 'bg-emerald-100 text-emerald-700';
  if (status === 'paid' || status === 'pending') return 'bg-blue-100 text-blue-700';
  if (status === 'shipped') return 'bg-purple-100 text-purple-700';
  return 'bg-red-100 text-red-700';
};

const translateOrderStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'paid':
      return 'Đã thanh toán';
    case 'shipped':
      return 'Đang giao';
    case 'delivered':
      return 'Đã giao';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

const translatePaymentStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ thanh toán';
    case 'paid':
      return 'Đã thanh toán';
    case 'failed':
      return 'Thất bại';
    default:
      return status;
  }
};

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleMarkPaid = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updateAdminPaymentStatus(orderId, 'paid');
      await api.updateAdminOrderStatus(orderId, 'paid');
      // refresh list
      const refreshed = await api.getAdminOrders({ search: search || undefined, limit: 100 });
      setOrders(refreshed.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xác nhận thanh toán');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.updateAdminOrderStatus(orderId, 'cancelled');
      const refreshed = await api.getAdminOrders({ search: search || undefined, limit: 100 });
      setOrders(refreshed.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể hủy đơn hàng');
    } finally {
      setUpdatingOrderId(null);
    }
  };

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
        <h2 className="text-2xl font-bold text-slate-900">Đơn hàng</h2>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã đơn hoặc khách hàng..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </button>
        </div>
        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-3 py-2 font-medium whitespace-nowrap">Đơn hàng</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Sản phẩm</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Khách hàng</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Ngày</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Tổng</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap">Trạng thái</th>
                <th className="px-3 py-2 font-medium text-right whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td className="px-3 py-4 text-sm text-slate-500" colSpan={7}>Đang tải đơn hàng...</td>
                </tr>
              )}
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-slate-500" colSpan={7}>Không tìm thấy đơn hàng.</td>
                </tr>
              )}
              {!isLoading && orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-3 py-3 text-sm font-bold text-slate-900 whitespace-nowrap">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                        {order.productImageUrl ? (
                          <img src={order.productImageUrl} alt="Sản phẩm" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200" />
                        )}
                      </div>
                      <span className="truncate text-sm text-slate-800" title={order.productName}>
                        {order.productName || 'Sản phẩm'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-600 whitespace-nowrap truncate">{order.customer}</td>
                  <td className="px-3 py-3 text-sm text-slate-500 whitespace-nowrap">{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-3 py-3 text-sm text-slate-900 font-medium whitespace-nowrap">{formatVND(order.totalAmount)}</td>
                  <td className="px-3 py-3 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${statusTone(order.status)}`}>
                      {translateOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-right whitespace-nowrap space-x-1">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(order._id)}
                      disabled={updatingOrderId === order._id || order.paymentStatus === 'paid'}
                      className="inline-flex items-center p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                      title="Xác nhận thanh toán"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={updatingOrderId === order._id || order.status === 'cancelled'}
                      className="inline-flex items-center p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                      title="Hủy đơn"
                    >
                      <X className="h-4 w-4" />
                    </button>
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