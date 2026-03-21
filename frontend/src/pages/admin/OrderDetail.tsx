import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

const translateOrderStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'paid':
      return 'Đã xác nhận';
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

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    api
      .getAdminOrderById(id)
      .then(setOrder)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load order'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleUpdateStatus = async (status: 'pending' | 'paid' | 'cancelled' | 'shipped' | 'delivered') => {
    if (!id) return;

    setIsUpdating(true);
    try {
      await api.updateAdminOrderStatus(id, status);
      const refreshed = await api.getAdminOrderById(id);
      setOrder(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Đang tải đơn hàng...</div>;
  }

  if (!order) {
    return <div className="text-sm text-red-600">{error ?? 'Không tìm thấy đơn hàng.'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Chi tiết đơn hàng</h2>
            <p className="text-sm text-slate-500">Mã đơn: <span className="font-medium text-slate-800">#{order.orderCode.slice(-8).toUpperCase()}</span></p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
            <DollarSign className="w-4 h-4" />
            {translatePaymentStatus(order.payment?.status ?? 'pending')}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
            <Truck className="w-4 h-4" />
            {translateOrderStatus(order.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Mã đơn</p>
                  <p className="text-base font-medium text-slate-900">#{order.orderCode.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Ngày đặt</p>
                  <p className="text-base text-slate-700">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Khách hàng</p>
                  <p className="text-base text-slate-700">
                    {`${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}`.trim() || order.customer?.email}
                  </p>
                  <p className="text-sm text-slate-500">{order.customer?.email}</p>
                  {order.customer?.phone && <p className="text-sm text-slate-500">{order.customer.phone}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Trạng thái</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {translateOrderStatus(order.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Thanh toán</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {translatePaymentStatus(order.payment?.status ?? 'pending')}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Tổng hóa đơn</p>
                  <p className="text-base font-semibold text-slate-900">{formatVND(order.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Địa chỉ giao hàng</p>
              <pre className="mt-2 text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-200 whitespace-pre-wrap">{order.shippingAddress}</pre>
            </div>

            {order.billingAddress && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Địa chỉ thanh toán</p>
                <pre className="mt-2 text-sm text-slate-700 bg-slate-50 p-4 rounded border border-slate-200 whitespace-pre-wrap">{order.billingAddress}</pre>
              </div>
            )}

            {order.payment?.proofImageUrl && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Bằng chứng thanh toán (Khách gửi)</p>
                <a href={order.payment.proofImageUrl} target="_blank" rel="noopener noreferrer" className="block w-fit">
                  <img
                    src={order.payment.proofImageUrl}
                    alt="Bằng chứng thanh toán"
                    className="max-w-sm w-full rounded border border-slate-300 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </a>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Sản phẩm</h3>
              <p className="text-xs text-slate-500">Danh sách sản phẩm trong đơn hàng</p>
            </div>
            <div className="divide-y divide-slate-200">
              {order.items.map((item: any, idx: number) => (
                <div key={`${item.productId}-${idx}`} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      Size: {item.size} • Màu: {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatVND(item.unitPrice)}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                    <p className="text-xs text-slate-600 font-semibold mt-1">{formatVND(item.unitPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-3">Cập nhật trạng thái</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus('pending')}
                disabled={isUpdating || order.status === 'pending'}
                className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Chờ xử lý
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('paid')}
                disabled={isUpdating || order.status === 'paid'}
                className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Xác nhận (Đã thanh toán)
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('shipped')}
                disabled={isUpdating || order.status === 'shipped'}
                className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Đang giao
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('delivered')}
                disabled={isUpdating || order.status === 'delivered'}
                className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Đã giao
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={isUpdating || order.status === 'cancelled'}
                className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
