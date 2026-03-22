import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';
import { api } from '../lib/api';
import { CartPayload, VoucherPayload } from '../types';
import { formatVND } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';



export default function CheckoutPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
  const [order, setOrder] = useState<any | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<{
    bankBin?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'cod'>('vietqr');
  const [placedPaymentMethod, setPlacedPaymentMethod] = useState<'vietqr' | 'cod' | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [cartData, voucherData, configData] = await Promise.all([
             api.getCart(), 
             api.getVouchers(),
             api.getMembershipPaymentConfig().catch(() => null)
        ]);
        setCart(cartData);
        setVouchers(voucherData);
        if (configData) setPaymentConfig(configData);
      } catch (error) {
        console.error('Failed to load checkout data', error);
      }
    };

    fetchCheckoutData();
  }, []);

  useEffect(() => {
    if (cart?.appliedCouponCode) {
      setCouponCodeInput(cart.appliedCouponCode);
    }
  }, [cart?.appliedCouponCode]);

  const subtotal = cart?.total ?? 0;
  const discountAmount = cart?.discountAmount ?? 0;
  const shippingFee: number = cart?.shippingFee ?? 0;
  const total = cart?.finalAmount ?? subtotal - discountAmount + shippingFee;

  const orderItems = order?.items ?? [];
  const summaryItems = isPlaced && order ? orderItems : cart?.items ?? [];
  const summarySubtotal = summaryItems.reduce((sum, item: any) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 0), 0);
  const summaryDiscount = isPlaced ? (order?.discountAmount ?? 0) : discountAmount;
  const summaryShippingFee = isPlaced ? (order?.shippingFee ?? shippingFee) : shippingFee;
  const summaryTotal = isPlaced
    ? (order?.finalAmount ?? Math.max(0, summarySubtotal - summaryDiscount) + summaryShippingFee)
    : (cart?.finalAmount ?? Math.max(0, summarySubtotal - summaryDiscount) + summaryShippingFee);

  const qrAmount = Math.max(0, Math.round(summaryTotal));
  const qrInfo = encodeURIComponent('Thanh toan don hang King Man');
  const qrBankBin = paymentConfig?.bankBin || '970422';
  const qrAccount = paymentConfig?.accountNumber || '1903648271902';
  const qrName = encodeURIComponent(paymentConfig?.accountName || 'KING MAN');
  const vietQrImage = `https://img.vietqr.io/image/${qrBankBin}-${qrAccount}-compact2.png?amount=${qrAmount}&addInfo=${qrInfo}&accountName=${qrName}`;

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

    if (paymentMethod === 'vietqr' && !proofImage) {
      alert('Vui lòng upload ảnh chụp màn hình chuyển khoản (bằng chứng thanh toán) để xác nhận đặt hàng.');
      return;
    }

    const shippingAddress = `${fullName}\n${phone}\n${email}\n${city}\n${address}`;

    try {
      setIsPlacingOrder(true);
      const orderCreated = await api.placeOrder({
        shippingAddress,
        couponCode: cart?.appliedCouponCode || undefined,
        proofImage: paymentMethod === 'vietqr' ? proofImage : undefined
      });
      setOrder(orderCreated);
      setPlacedPaymentMethod(paymentMethod);
      setIsPlaced(true);
      setCart(await api.getCart());
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Không thể đặt hàng. Vui lòng đăng nhập và thử lại.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      alert('Vui lòng nhập mã voucher.');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const updated = await api.applyCartCoupon(couponCodeInput.trim());
      setCart(updated);
      setIsLoadingVouchers(true);
      const refreshedVouchers = await api.getVouchers();
      setVouchers(refreshedVouchers);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể áp dụng voucher.');
    } finally {
      setIsApplyingCoupon(false);
      setIsLoadingVouchers(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setIsApplyingCoupon(true);
      const updated = await api.removeCartCoupon();
      setCart(updated);
      setCouponCodeInput('');
      setIsLoadingVouchers(true);
      const refreshedVouchers = await api.getVouchers();
      setVouchers(refreshedVouchers);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể gỡ voucher.');
    } finally {
      setIsApplyingCoupon(false);
      setIsLoadingVouchers(false);
    }
  };

  const getVoucherState = (voucher: VoucherPayload) => {
    if (!voucher.isActive || voucher.isExpired) {
      return { canApply: false, reason: 'Voucher đã hết hạn hoặc ngừng kích hoạt' };
    }

    if (voucher.usedCount >= voucher.maxUsesPerUser) {
      return { canApply: false, reason: 'Bạn đã dùng hết lượt voucher này' };
    }

    if (subtotal < voucher.minOrderAmount) {
      return {
        canApply: false,
        reason: `Đơn tối thiểu ${formatVND(voucher.minOrderAmount)} để dùng voucher này`
      };
    }

    return { canApply: true, reason: '' };
  };

  const handleApplyVoucherCard = async (code: string) => {
    setCouponCodeInput(code);
    try {
      setIsApplyingCoupon(true);
      const updated = await api.applyCartCoupon(code);
      setCart(updated);
      setIsLoadingVouchers(true);
      const refreshedVouchers = await api.getVouchers();
      setVouchers(refreshedVouchers);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể áp dụng voucher.');
    } finally {
      setIsApplyingCoupon(false);
      setIsLoadingVouchers(false);
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

              <div className="mt-6 border border-slate-200 p-4 space-y-3">
                <p className="text-sm font-semibold text-charcoal uppercase tracking-wider">Voucher</p>
                {vouchers.length > 0 && (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {vouchers.slice(0, 6).map((voucher) => {
                      const voucherState = getVoucherState(voucher);
                      const isApplied = cart?.appliedCouponCode === voucher.code;
                      return (
                        <div
                          key={voucher._id}
                          className={`border p-3 text-xs flex items-start justify-between gap-3 ${
                            isApplied ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-800">{voucher.code}</p>
                            <p className="text-slate-600">
                              {voucher.discountType === 'percent'
                                ? `Giảm ${voucher.discountValue}%`
                                : `Giảm ${formatVND(voucher.discountValue)}`}
                              {voucher.minOrderAmount > 0 ? ` • Đơn từ ${formatVND(voucher.minOrderAmount)}` : ''}
                            </p>
                            <p className="text-slate-500">
                              HSD: {new Date(voucher.expiresAt).toLocaleDateString('vi-VN')} • Lượt dùng: {voucher.usedCount}/{voucher.maxUsesPerUser}
                            </p>
                            {!voucherState.canApply && !isApplied && (
                              <p className="text-rose-600">{voucherState.reason}</p>
                            )}
                          </div>
                          {isApplied ? (
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              disabled={isApplyingCoupon}
                              className="px-3 py-2 text-[10px] uppercase tracking-wider bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                            >
                              Gỡ mã
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleApplyVoucherCard(voucher.code)}
                              disabled={isApplyingCoupon || !voucherState.canApply || (cart?.items.length ?? 0) === 0}
                              className="px-3 py-2 text-[10px] uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-60"
                            >
                              Dùng mã
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Nhập mã voucher"
                    className="flex-1 border border-gray-300 p-3 text-sm focus:outline-none focus:border-charcoal"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || (cart?.items.length ?? 0) === 0}
                    className="px-4 py-3 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-700 disabled:opacity-60"
                  >
                    {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                  </button>
                </div>
                {isLoadingVouchers && <p className="text-xs text-slate-500">Đang làm mới danh sách voucher...</p>}
                {!!cart?.appliedCouponCode && (
                  <div className="flex items-center justify-between text-sm text-emerald-700">
                    <span>Đã áp dụng: {cart.appliedCouponCode}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={isApplyingCoupon}
                      className="text-xs uppercase tracking-wider text-rose-600 hover:text-rose-700"
                    >
                      Gỡ mã
                    </button>
                  </div>
                )}
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
                    <p><span className="font-medium text-charcoal">Ngân hàng:</span> {paymentConfig?.bankName || 'MB Bank'}</p>
                    <p><span className="font-medium text-charcoal">Số tài khoản:</span> {paymentConfig?.accountNumber || '1903648271902'}</p>
                    <p><span className="font-medium text-charcoal">Chủ tài khoản:</span> {paymentConfig?.accountName || 'KING MAN'}</p>
                    <p><span className="font-medium text-charcoal">Số tiền:</span> {formatVND(summaryTotal)}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <p className="text-sm font-semibold text-charcoal mb-2">Upload bằng chứng thanh toán (Bắt buộc)</p>
                    <p className="text-xs text-slate-500 mb-3">Vui lòng tải lên ảnh chụp màn hình chuyển khoản thành công để admin duyệt đơn hàng.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 5 * 1024 * 1024) {
                           alert('Kích thước ảnh tối đa là 5MB.');
                           return;
                        }
                        setProofImage(file || null);
                      }}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[#0f1f3d] file:text-white hover:file:bg-slate-800"
                    />
                    {proofImage && <p className="mt-2 text-xs font-semibold text-emerald-600">✓ Đã chọn: {proofImage.name}</p>}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={
                  isPlacingOrder ||
                  (cart?.items.length ?? 0) === 0 ||
                  (paymentMethod === 'vietqr' && !proofImage)
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
                      <span>Giảm giá voucher</span>
                      <span>-{formatVND(summaryDiscount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        Phí vận chuyển 
                        {user?.isMember && user?.memberStatus === 'active' && <span className="text-amber-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded"><Crown className="w-3 h-3"/> Premium</span>}
                      </span>
                      <span className={summaryShippingFee === 0 ? 'text-emerald-600 font-semibold' : ''}>{summaryShippingFee === 0 ? 'Miễn phí' : formatVND(summaryShippingFee)}</span>
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
                <span>Giảm voucher</span>
                <span>-{formatVND(summaryDiscount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  Phí vận chuyển 
                  {user?.isMember && user?.memberStatus === 'active' && <span className="text-amber-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded"><Crown className="w-3 h-3"/> Premium</span>}
                </span>
                <span className={summaryShippingFee === 0 ? 'text-emerald-600 font-semibold' : ''}>{summaryShippingFee === 0 ? 'Miễn phí' : formatVND(summaryShippingFee)}</span>
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
