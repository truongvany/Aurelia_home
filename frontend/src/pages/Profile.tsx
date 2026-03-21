import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShoppingBag, User, Pencil, Check, X, ShieldCheck, Diamond, Star, ChevronRight, LogOut, MapPin, Award, CreditCard, Ticket, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MembershipPayload, OrderPayload, ProfilePayload, VoucherPayload } from '../types';
import { formatVND } from '../utils/currency';

export default function Profile() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [membership, setMembership] = useState<MembershipPayload | null>(null);
  const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateOrderStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'paid': return 'Đã thanh toán';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const [profileData, ordersData, membershipData, vouchersData] = await Promise.all([
          api.getProfile(),
          api.getMyOrders(),
          api.getMembership(),
          api.getVouchers()
        ]);
        setProfile(profileData);
        setEditedPhone(profileData.user.phone ?? '');
        setOrders(ordersData);
        setMembership(membershipData);
        setVouchers(vouchersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const displayName = profile ? `${profile.user.firstName} ${profile.user.lastName}`.trim() || 'Khách hàng' : 'Khách hàng';
  const isMember = membership?.user.memberStatus === 'active';
  const isPending = membership?.user.memberStatus === 'pending';
  const availableVouchers = vouchers.filter((v) => !v.isExpired && v.usedCount < v.maxUsesPerUser);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-charcoal animate-spin" />
          <p className="text-sm font-medium">Đang tải hồ sơ của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#0a192f] py-12 md:py-20 selection:bg-charcoal selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
              Hồ Sơ Của Tôi
            </h1>
            <p className="mt-2 text-slate-600 font-medium">Xin chào, {displayName}</p>
          </div>
          {isMember ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-200 via-gold to-amber-400 text-charcoal font-bold rounded-full shadow-[0_4px_20px_rgba(251,191,36,0.3)]">
              <span>Premium</span>
            </div>
          ) : (
            <Link to="/membership" className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors shadow-md">
              <Star className="h-4 w-4" />
              <span>Nâng cấp thành viên</span>
            </Link>
          )}
        </motion.div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 flex items-center justify-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main User Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`relative overflow-hidden rounded-2xl shadow-xl border ${isMember ? 'border-amber-200 bg-gradient-to-br from-white via-amber-50 to-amber-100' : 'border-slate-200 bg-white'}`}
            >
              {/* Premium Background Glow */}
              {isMember && (
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-gold/40 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
              )}
              
              <div className="p-8 relative z-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif text-white shadow-lg shrink-0 ${isMember ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-charcoal'}`}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-charcoal leading-tight">{displayName}</h2>
                    <p className="text-sm text-slate-500 mt-1">{profile?.user.email ?? 'Chưa cập nhật email'}</p>
                    
                    <div className="mt-2">
                      {isMember ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-amber-200 text-amber-900 rounded-md">
                          <ShieldCheck className="w-3 h-3" /> Thành viên Premium
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-md">
                          <Check className="w-3 h-3" /> Đang xét duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                          Tài khoản thường
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-200/60 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Hạng thành viên</p>
                      <p className="text-sm font-semibold text-charcoal">{profile?.user.tier || 'Mới'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Điểm tích lũy</p>
                      <p className="text-sm font-bold text-charcoal">{(profile?.user.points || 0).toLocaleString()} pt</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Số điện thoại</p>
                      {isEditingPhone ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-charcoal"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                          />
                          <button
                            onClick={handleSavePhone}
                            disabled={isSavingPhone}
                            className="p-1.5 bg-charcoal text-white rounded hover:bg-slate-800 transition-colors shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setIsEditingPhone(false); setEditedPhone(profile?.user.phone ?? ''); }}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition-colors shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <p className="text-sm font-medium text-slate-800 truncate">{profile?.user.phone || 'Chưa cập nhật'}</p>
                          <button
                            onClick={() => setIsEditingPhone(true)}
                            className="p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-charcoal transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
            >
              <div className="divide-y divide-slate-100">
                <Link to="/cart" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3 text-slate-700">
                    <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-charcoal transition-colors" />
                    <span className="font-medium">Giỏ hàng của bạn</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </Link>
                {!isMember && (
                  <Link to="/membership" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 text-amber-700">
                      <Diamond className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
                      <span className="font-medium">Đăng ký Membership</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-300 group-hover:text-amber-500 transition-colors" />
                  </Link>
                )}
                {isMember && (
                  <Link to="/membership" className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-transparent hover:bg-amber-50 transition-colors group">
                    <div className="flex items-center gap-3 text-amber-800">
                      <SparklesIcon className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Đặc quyền của bạn</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
                  </Link>
                )}
                <button 
                  onClick={signOut}
                  className="w-full flex items-center justify-between p-4 hover:bg-rose-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3 text-rose-600">
                    <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium">Đăng xuất</span>
                  </div>
                </button>
              </div>
            </motion.div>
            
            {/* Vouchers Widget */}
            {availableVouchers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-charcoal text-white rounded-2xl shadow-lg p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    <Ticket className="w-5 h-5 text-amber-400" />
                    Voucher của bạn
                  </h3>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">{availableVouchers.length}</span>
                </div>
                <div className="space-y-3">
                  {availableVouchers.slice(0, 2).map((v) => (
                    <div key={v._id} className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold text-amber-300 tracking-wide text-sm">{v.code}</p>
                        <p className="text-xs text-slate-300 mt-0.5">Giảm {v.discountType === 'percent' ? `${v.discountValue}%` : formatVND(v.discountValue)}</p>
                      </div>
                      <div className="text-xs text-white/60">
                        {v.minOrderAmount > 0 ? `Đơn từ ${formatVND(v.minOrderAmount)}` : 'Mọi đơn'}
                      </div>
                    </div>
                  ))}
                  {availableVouchers.length > 2 && (
                    <Link to="/cart" className="block text-center text-xs text-amber-300 hover:text-amber-200 mt-2 hover:underline">
                      Xem tất cả trong phần thanh toán
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border text-[#0a192f] border-slate-200 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3">
                <Package className="h-6 w-6 text-charcoal" />
                <h2 className="text-2xl font-bold font-serif text-charcoal">Lịch sử đơn hàng</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <Package className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Chưa có đơn hàng nào</h3>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm">Bạn chưa từng mua sắm tại King Man. Hãy khám phá ngay các bộ sưu tập thời trang tinh tế của chúng tôi.</p>
                  <Link to="/shop" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                    <ShoppingBag className="w-5 h-5" />
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="block p-6 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Mã đơn hàng</p>
                          <p className="font-mono text-lg font-bold text-charcoal">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-3 md:text-right">
                          <span className={`inline-flex items-center px-3 py-1 text-xs uppercase tracking-widest font-bold rounded-full border ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : order.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {translateOrderStatus(order.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6 mt-4 items-start md:items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 line-clamp-2">
                            {(order.items ?? []).map((item) => item.name).join(', ') || 'Sản phẩm của King Man'}
                          </p>
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="w-full md:w-auto p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between md:justify-end gap-6 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          <div className="text-left md:text-right">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-0.5">Tổng tiền</p>
                            <p className="text-lg font-bold text-charcoal">{formatVND(order.totalAmount)}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-charcoal transition-colors hidden md:block" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

