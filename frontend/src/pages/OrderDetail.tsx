import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, MapPin, Receipt, Package } from 'lucide-react';
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
    <div className="bg-[#f8f9fa] min-h-screen text-[#0a192f] py-12 md:py-20 selection:bg-[#0f1f3d] selection:text-white pb-24">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <Link 
          to="/profile" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-[13px] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Trở về hồ sơ
        </Link>
        
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <Receipt className="w-6 h-6 text-slate-400" />
                <h1 className="text-2xl font-serif font-bold text-[#0f1f3d]">Chi tiết đơn hàng</h1>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Mã đơn</p>
                <p className="font-mono text-[15px] font-bold text-[#0f1f3d]">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <p className="text-[12px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 px-5 py-3.5 min-w-[150px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Trạng thái đơn</p>
              {order.status === 'delivered' || order.status === 'paid' ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle className="w-4 h-4 fill-emerald-600 text-white" />
                  <span className="text-[11px] uppercase tracking-widest font-black">{translateOrderStatus(order.status)}</span>
                </div>
              ) : order.status === 'cancelled' ? (
                <div className="flex items-center gap-1.5 text-rose-600">
                  <XCircle className="w-4 h-4 fill-rose-600 text-white" />
                  <span className="text-[11px] uppercase tracking-widest font-black">{translateOrderStatus(order.status)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-widest font-black">{translateOrderStatus(order.status)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-[#fcfcfc]">
            {/* Products List */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-slate-400" />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-left">Sản phẩm đã đặt</h2>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${item.productVariantId}`} className="flex gap-4 p-4 bg-white border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    <img
                      src={item.imageUrl ?? ''}
                      alt={item.name}
                      className="w-20 h-24 object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="text-[14px] font-bold text-[#0f1f3d] truncate mb-1.5">{item.name}</p>
                      <p className="text-[12px] text-slate-500 font-medium">Size: <span className="text-slate-800 font-bold">{item.size}</span> <span className="mx-1">•</span> Màu: <span className="text-slate-800 font-bold">{item.color}</span></p>
                      <p className="text-[12px] text-slate-500 font-medium mt-1">Số lượng: x{item.quantity}</p>
                    </div>
                    <div className="text-right flex flex-col justify-center shrink-0">
                       <p className="text-[14px] font-bold text-[#0f1f3d]">{formatVND(item.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">
              {/* Delivery Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-left">Giao hàng & Mã ưu đãi</h2>
                </div>
                <div className="bg-white p-5 border border-slate-100 shadow-sm mb-4">
                  {order.shippingAddress.includes('\n') ? (
                     <div className="space-y-3 text-[13px]">
                       {order.shippingAddress.split('\n').map((line, idx) => {
                         let label = '';
                         if (idx === 0) label = 'Người nhận:';
                         else if (idx === 1) label = 'Điện thoại:';
                         else if (idx === 2) label = 'Email:';
                         else if (idx === 3) label = 'Khu vực:';
                         else if (idx === 4) label = 'Địa chỉ chi tiết:';
                         
                         if (!label) return <div key={idx} className="pl-[6.5rem] text-slate-800 font-medium leading-relaxed">{line}</div>;
                         
                         return (
                           <div key={idx} className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                             <span className="text-slate-400 w-24 shrink-0 font-medium">{label}</span>
                             <span className={`text-slate-800 leading-relaxed ${idx === 0 ? 'font-bold text-[#0f1f3d]' : idx === 1 ? 'font-bold' : 'font-medium'}`}>
                               {line}
                             </span>
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                       {order.shippingAddress}
                     </div>
                   )}
                </div>
                {order.appliedCouponCode && (
                  <div className="bg-[#fcfcfc] border border-dashed border-[#ff9eb5] p-3 text-[12px] text-[#0f1f3d] font-medium flex justify-between">
                    <span>Mã ưu đãi đã dùng:</span>
                    <span className="font-bold text-rose-600 uppercase">{order.appliedCouponCode}</span>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 text-left">Thanh toán</h2>
                </div>
                <div className="bg-white p-5 border border-slate-100 shadow-sm space-y-3 text-[13px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính ({order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                    <span className="font-medium text-[#0f1f3d]">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-[#0f1f3d] break-words">Miễn phí</span>
                  </div>
                  {order.discountAmount ? (
                     <div className="flex justify-between text-rose-600 font-medium">
                       <span>Giảm giá</span>
                       <span>-{formatVND(order.discountAmount)}</span>
                     </div>
                  ) : null}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-3">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Tổng tiền</span>
                    <span className="text-[18px] font-bold text-rose-600">{formatVND(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 bg-slate-50 p-6 flex justify-between items-center">
            <Link
              to="/profile"
              className="text-[11px] font-bold text-slate-500 hover:text-[#0f1f3d] uppercase tracking-widest transition-colors"
            >
              Về danh sách
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#0f1f3d] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
