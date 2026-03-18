import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { api } from '../lib/api';
import { CartPayload } from '../types';
import { formatVND } from '../utils/currency';

const VIETQR_BANK_BIN = '970422';
const VIETQR_ACCOUNT = '1903648271902';
const VIETQR_ACCOUNT_NAME = 'AURELIA HOME';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod'>('vietqr');
  const [placedPaymentMethod, setPlacedPaymentMethod] = useState<'vietqr' | 'cod' | null>(null);
  const [isQrConfirmed, setIsQrConfirmed] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await api.getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cart?.total ?? 0;
  const shippingFee: number = 0;
  const total = subtotal + shippingFee;

  const orderItems = order?.items ?? [];
  const summaryItems = isPlaced && order ? orderItems : cart?.items ?? [];
  const summarySubtotal = summaryItems.reduce((sum, item: any) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 0), 0);
  const summaryTotal = summarySubtotal + shippingFee;

  const qrAmount = Math.max(0, Math.round(summaryTotal));
  const qrInfo = encodeURIComponent('Thanh toan don hang Aurelia Home');
  const qrName = encodeURIComponent(VIETQR_ACCOUNT_NAME);
  const vietQrImage = `https://img.vietqr.io/image/${VIETQR_BANK_BIN}-${VIETQR_ACCOUNT}-compact2.png?amount=${qrAmount}&addInfo=${qrInfo}&accountName=${qrName}`;

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

  const handlePlaceOrder = async () => {
    if (!fullName.trim()) {
      alert('Vui lòng nhập họ tên người nhận.');
      return;
    }

    if (!email.trim()) {
      alert('Vui lòng nhập email.');
      return;
    }

    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!city.trim()) {
      alert('Vui lòng nhập thành phố.');
      return;
    }

    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    if (paymentMethod === 'vietqr' && !isQrConfirmed) {
      alert('Vui lòng xác nhận đã chuyển khoản VietQR trước khi đặt hàng.');
      return;
    }

    const shippingAddress = `${fullName}\n${phone}\n${email}\n${city}\n${address}`;

    try {
      setIsPlacingOrder(true);
      const orderCreated = await api.placeOrder({ shippingAddress });
      setOrder(orderCreated);
      setPlacedPaymentMethod(paymentMethod);
      setIsPlaced(true);
      setCart(await api.getCart());
    } catch (error) {
      console.error(error);
      alert('Không thể đặt hàng. Vui lòng đăng nhập và thử lại.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-charcoal font-bold mb-10 text-center">Thanh toán</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-3/5">
          {!isPlaced ? (
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Thông tin giao hàng</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Họ tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 p-3 mt-1 focus:outline-none focus:border-charcoal"
                    placeholder="Nguyen Van A"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 p-3 mt-1 focus:outline-none focus:border-charcoal"
                    placeholder="email@domain.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 p-3 mt-1 focus:outline-none focus:border-charcoal"
                    placeholder="0912 345 678"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Thành phố</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 p-3 mt-1 focus:outline-none focus:border-charcoal"
                    placeholder="Hà Nội"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-slate-700">Địa chỉ chi tiết</label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, ngõ/đường, phường/xã"
                  className="w-full border border-gray-300 p-3 mt-1 focus:outline-none focus:border-charcoal resize-none"
                />
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-serif font-bold text-charcoal">Payment Method</h3>
                <label className="flex items-start gap-3 border border-slate-300 p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={paymentMethod === 'vietqr'}
                    onChange={() => setPaymentMethod('vietqr')}
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">VietQR (Chuyen khoan ngan hang)</p>
                    <p className="text-xs text-slate-500 mt-1">Quet QR de thanh toan, sau do xac nhan de dat hang.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 border border-slate-300 p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="mt-1"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">COD (Thanh toan khi nhan hang)</p>
                    <p className="text-xs text-slate-500 mt-1">Ban thanh toan khi nhan don hang tai dia chi giao.</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'vietqr' && (
                <div className="mt-6 border border-slate-300 p-5 bg-slate-50">
                  <p className="text-sm font-semibold text-charcoal mb-3">Quét mã VietQR để thanh toán</p>
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <img
                      src={vietQrImage}
                      alt="VietQR Payment"
                      className="w-48 h-48 object-contain bg-white border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-charcoal">Ngân hàng:</span> MB Bank</p>
                    <p><span className="font-medium text-charcoal">Số tài khoản:</span> {VIETQR_ACCOUNT}</p>
                    <p><span className="font-medium text-charcoal">Chủ tài khoản:</span> {VIETQR_ACCOUNT_NAME}</p>
                    <p><span className="font-medium text-charcoal">Số tiền:</span> {formatVND(total)}</p>
                    </div>
                  </div>

                  <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={isQrConfirmed}
                      onChange={(e) => setIsQrConfirmed(e.target.checked)}
                    />
                    Tôi đã chuyển khoản qua VietQR
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  (cart?.items.length ?? 0) === 0 ||
                  (paymentMethod === 'vietqr' && !isQrConfirmed)
                }
                className="w-full bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors mt-8 disabled:opacity-60"
              >
                {isPlacingOrder ? 'Đang đặt hàng...' : paymentMethod === 'vietqr' ? 'Xác nhận thanh toán & Đặt hàng' : 'Đặt hàng'}
              </button>
              {(cart?.items.length ?? 0) === 0 && (
                <p className="mt-4 text-sm text-amber-700">Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.</p>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Đặt hàng thành công</h2>
              <p className="text-gray-600 mb-6">Thông tin đơn hàng của bạn:</p>

              {order ? (
                <div className="space-y-6 text-sm text-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold">Mã đơn</p>
                      <p>{order._id}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Trạng thái</p>
                      <p>{translateOrderStatus(order.status)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Ngày tạo</p>
                      <p>{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Hình thức thanh toán</p>
                      <p>{placedPaymentMethod === 'cod' ? 'COD (Thanh toán khi nhận hàng)' : 'VietQR (Chuyển khoản)'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Địa chỉ giao</p>
                    <pre className="whitespace-pre-wrap text-sm text-slate-600">{order.shippingAddress}</pre>
                  </div>

                  <div>
                    <p className="font-semibold mb-3">Sản phẩm đã đặt</p>
                    <div className="space-y-3">
                      {(order.items ?? []).map((item: any) => (
                        <div
                          key={`${item.productId}-${item.productVariantId}`}
                          className="flex gap-3 items-center p-3 border border-gray-100 rounded-lg"
                        >
                          <img
                            src={item.imageUrl || item.productImageUrl}
                            alt={item.name || item.productName}
                            className="w-20 h-20 object-cover bg-gray-100 rounded"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-charcoal">{item.name || item.productName}</p>
                            <p className="text-xs text-slate-500">Kích thước: {item.size} • Màu: {item.color}</p>
                            <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatVND(item.unitPrice)}</p>
                            <p className="text-xs text-slate-500">Tổng: {formatVND((item.unitPrice ?? 0) * (item.quantity ?? 0))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính</span>
                      <span>{formatVND(summarySubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Tổng</span>
                      <span>{formatVND(summaryTotal)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">Không có thông tin đơn hàng.</p>
              )}

              <Link
                to="/profile"
                className="inline-flex mt-6 px-6 py-3 bg-charcoal text-white text-sm uppercase tracking-wider hover:bg-gold transition-colors"
              >
                Xem lịch sử đơn hàng
              </Link>
            </div>
          )}
        </div>

        <div className="lg:w-2/5">
          <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-24">
<h2 className="text-lg font-serif font-bold text-charcoal mb-6">Tóm tắt đơn hàng</h2>

            <div className="space-y-6 mb-8">
              {summaryItems.map((item: any) => (
                <div key={`${item.productId}-${item.productVariantId}-${item.quantity}`} className="flex gap-4">
                  <img
                    src={item.imageUrl || item.productImageUrl}
                    alt={item.name || item.productName}
                    className="w-20 h-24 object-cover bg-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-1">{item.name || item.productName}</h3>
                    <p className="text-xs text-gray-500 mb-2">Size: {item.size} | Color: {item.color}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                      <span className="text-sm font-medium text-charcoal">{formatVND(item.unitPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span>{formatVND(summarySubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-serif font-bold text-charcoal">Tổng cộng</span>
                <span className="font-serif font-bold text-xl text-charcoal">{formatVND(summaryTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
