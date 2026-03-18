import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import type { CartPayload } from '../types';
import { formatVND } from '../utils/currency';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    try {
      setError(null);
      const nextCart = await api.getCart();
      setCart(nextCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const mutate = async (action: () => Promise<CartPayload>) => {
    try {
      setIsMutating(true);
      setError(null);
      const nextCart = await action();
      setCart(nextCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thao tác thất bại');
    } finally {
      setIsMutating(false);
    }
  };

  const items = cart?.items ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal font-bold">Giỏ hàng của bạn</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý sản phẩm trước khi đặt hàng.</p>
        </div>
        <Link to="/shop" className="text-sm uppercase tracking-wider text-slate-600 hover:text-charcoal">
          Tiếp tục mua sắm
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <div className="text-slate-500 text-sm">Đang tải giỏ hàng...</div>
      ) : items.length === 0 ? (
        <div className="border border-slate-200 bg-white p-8 text-center space-y-4">
          <p className="text-slate-600">Giỏ hàng hiện đang trống.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-charcoal text-white text-sm uppercase tracking-wider hover:bg-gold transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border border-slate-200 bg-white p-4 sm:p-5 flex gap-4">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="w-24 h-32 object-cover bg-slate-100"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium text-charcoal">{item.productName}</h2>
                      <p className="text-xs text-slate-500 mt-1">Size: {item.size} | Màu: {item.color}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => mutate(() => api.removeCartItem(item._id))}
                      className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-60"
                      aria-label="Xoa san pham"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center border border-slate-300">
                      <button
                        type="button"
                        disabled={isMutating || item.quantity <= 1}
                        onClick={() => mutate(() => api.updateCartItem(item._id, item.quantity - 1))}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        aria-label="Giam so luong"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-sm min-w-10 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => mutate(() => api.updateCartItem(item._id, item.quantity + 1))}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        aria-label="Tang so luong"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Đơn giá</p>
                      <p className="text-sm font-medium text-slate-700">{formatVND(item.unitPrice)}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">Tạm tính</p>
                      <p className="text-sm font-semibold text-charcoal">{formatVND(item.lineTotal)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="border border-slate-200 bg-white p-6 space-y-4 sticky top-24">
              <h3 className="font-serif text-xl text-charcoal">Tổng đơn hàng</h3>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tạm tính</span>
                <span>{formatVND(cart?.total ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Vận chuyển</span>
                <span>Mien phi</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-charcoal">Tổng cộng</span>
                <span className="font-semibold text-charcoal">{formatVND(cart?.total ?? 0)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full bg-charcoal text-white py-3 text-sm uppercase tracking-widest hover:bg-gold transition-colors"
              >
                Tiến hành đặt hàng
              </button>

              <button
                type="button"
                disabled={isMutating}
                onClick={() => mutate(() => api.clearCart())}
                className="w-full py-3 text-sm uppercase tracking-widest border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                Xóa toàn bộ giỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
