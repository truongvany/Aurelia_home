import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, ShoppingBag, User, Pencil, Check, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { OrderPayload, ProfilePayload } from '../types';
import { formatVND } from '../utils/currency';

export default function Profile() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [profileData, ordersData] = await Promise.all([api.getProfile(), api.getMyOrders()]);
        setProfile(profileData);
        setEditedPhone(profileData.user.phone ?? '');
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const displayName = profile ? `${profile.user.firstName} ${profile.user.lastName}` : 'Khách hàng';

  const handleSavePhone = async () => {
    if (!profile) return;
    setIsSavingPhone(true);
    try {
      const updated = await api.updateProfile({ phone: editedPhone.trim() });
      setProfile((prev) => (prev ? { ...prev, user: { ...prev.user, phone: updated.phone } } : prev));
      setIsEditingPhone(false);
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật số điện thoại. Vui lòng thử lại.');
    } finally {
      setIsSavingPhone(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-slate-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen text-[#0a192f] py-16 selection:bg-[#0a192f] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight uppercase">Hồ sơ cá nhân</h1>
          <p className="text-slate-600">Xin chào {displayName}. Quản lý thông tin tài khoản và lịch sử đơn hàng của bạn.</p>
        </motion.div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-charcoal flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin tài khoản
              </h2>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Họ tên:</span> {displayName}
                </p>
                <p>
                  <span className="text-slate-500">Email:</span> {profile?.user.email ?? '-'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Số điện thoại:</span>
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="border border-slate-300 p-1 text-sm focus:outline-none focus:border-charcoal"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleSavePhone}
                        disabled={isSavingPhone}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-charcoal text-white text-xs rounded hover:bg-gold transition-colors disabled:opacity-60"
                      >
                        <Check className="h-3 w-3" />
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPhone(false);
                          setEditedPhone(profile?.user.phone ?? '');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-slate-300 text-xs rounded hover:bg-slate-100 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{profile?.user.phone ?? '-'}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingPhone(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Chỉnh sửa
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <Link to="/cart" className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm hover:bg-slate-100 transition-colors">
                  Giỏ hàng
                </Link>
                <Link to="/checkout" className="inline-flex items-center justify-center px-4 py-2 bg-charcoal text-white text-sm hover:bg-gold transition-colors">
                  Đặt hàng
                </Link>
              </div>

              <button
                type="button"
                onClick={signOut}
                className="w-full mt-2 py-2 text-sm text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-4">
              <h2 className="font-semibold text-charcoal flex items-center gap-2">
                <Package className="h-4 w-4" />
                Lịch sử đơn hàng
              </h2>

              {orders.length === 0 ? (
                <div className="border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  Bạn chưa có đơn hàng nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="block border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-sm hover:border-slate-300 transition"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">Mã đơn</p>
                        <p className="font-medium text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-slate-700 line-clamp-2">
                          {(order.items ?? []).map((item) => item.name).join(', ') || 'Không có sản phẩm'}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm font-semibold text-charcoal">{formatVND(order.totalAmount)}</p>
                        <span
                          className={`inline-flex mt-1 px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {translateOrderStatus(order.status)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-charcoal">
                  <ShoppingBag className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
