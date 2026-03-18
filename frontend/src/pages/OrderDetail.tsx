import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { OrderPayload } from '../types';
import { formatVND } from '../utils/currency';

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

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      try {
        setError(null);
        const fetched = await api.getMyOrderById(id);
        setOrder(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const subtotal = order?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-slate-500">Đang tải đơn hàng...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-slate-500">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 text-sm text-slate-600 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
        <span className="h-4 w-px bg-slate-200" />
        <Link to="/profile" className="hover:text-charcoal">
          Hồ sơ của tôi
        </Link>
      </div>

      <div className="bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-charcoal mb-4">Chi tiết đơn hàng</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold text-slate-600">Mã đơn</p>
            <p className="text-base font-medium text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">Trạng thái</p>
            <p className="text-base font-medium text-charcoal">{translateOrderStatus(order.status)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">Ngày đặt</p>
            <p className="text-base font-medium text-charcoal">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600">Tổng tiền</p>
            <p className="text-base font-medium text-charcoal">{formatVND(order.totalAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-3">Sản phẩm</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.productVariantId}`} className="flex gap-3 items-start p-3 border border-slate-200 rounded-lg">
                  <img
                    src={item.imageUrl ?? ''}
                    alt={item.name}
                    className="w-20 h-20 object-cover bg-gray-100 rounded"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">{item.name}</p>
                    <p className="text-xs text-slate-500">Size: {item.size} • Màu: {item.color}</p>
                    <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatVND(item.unitPrice)}</p>
                    <p className="text-xs text-slate-500">Tổng: {formatVND(item.unitPrice * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-3">Thông tin giao hàng</h2>
            <pre className="whitespace-pre-wrap text-sm text-slate-600 bg-slate-50 p-4 rounded border border-slate-200">{order.shippingAddress}</pre>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-base font-semibold mt-2">
                <span>Tổng</span>
                <span>{formatVND(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-charcoal text-white text-sm uppercase tracking-widest hover:bg-gold transition-colors"
          >
            Mua tiếp
          </Link>
        </div>
      </div>
    </div>
  );
}
