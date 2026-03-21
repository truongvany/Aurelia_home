import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShoppingBag, User, Pencil, Check, X, ShieldCheck, Diamond, Star, ChevronRight, LogOut, MapPin, Award, CreditCard, Ticket, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MembershipPayload, OrderPayload, ProfilePayload } from '../types';
import { formatVND } from '../utils/currency';

export default function Profile() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [membership, setMembership] = useState<MembershipPayload | null>(null);
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
        const [profileData, ordersData, membershipData] = await Promise.all([
          api.getProfile(),
          api.getMyOrders(),
          api.getMembership()
        ]);
        setProfile(profileData);
        setEditedPhone(profileData.user.phone ?? '');
        setOrders(ordersData);
        setMembership(membershipData);
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
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-slate-300 bg-white text-slate-800 font-bold uppercase tracking-widest text-[11px]">
              <span>Premium</span>
            </div>
          ) : (
            <Link to="/membership" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-[11px] uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors">
              <Star className="h-3.5 w-3.5" />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 p-8"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-20 h-20 flex items-center justify-center text-3xl font-serif text-white shrink-0 ${isMember ? 'bg-amber-600' : 'bg-slate-900'}`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{displayName}</h2>
                  <p className="text-[13px] text-slate-500 mt-1">{profile?.user.email ?? 'Chưa cập nhật email'}</p>
                  
                  <div className="mt-3">
                    {isMember ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Thành viên Premium
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        <Check className="w-3.5 h-3.5" /> Đang xét duyệt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                        Tài khoản thường
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Hạng thành viên</p>
                  </div>
                  <p className="text-[15px] font-bold text-slate-900">{profile?.user.tier || 'Mới'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Điểm tích lũy</p>
                  </div>
                  <p className="text-[15px] font-bold text-slate-900">{(profile?.user.points || 0).toLocaleString()} Điểm</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Số điện thoại</p>
                </div>
                <div className="flex items-center justify-between group h-[34px]">
                  {isEditingPhone ? (
                    <div className="flex items-center gap-2 w-full max-w-[220px]">
                      <input
                        className="flex-1 border border-slate-300 px-3 py-1.5 text-[13px] focus:outline-none focus:border-slate-800 transition-colors"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        placeholder="Nhập..."
                      />
                      <button
                        onClick={handleSavePhone}
                        disabled={isSavingPhone}
                        className="p-1.5 bg-slate-900 text-white shrink-0 hover:bg-slate-800 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setIsEditingPhone(false); setEditedPhone(profile?.user.phone ?? ''); }}
                        className="p-1.5 bg-slate-100 text-slate-600 shrink-0 hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[14px] font-medium text-slate-900 truncate">{profile?.user.phone || 'Chưa cập nhật'}</p>
                      <button
                        onClick={() => setIsEditingPhone(true)}
                        className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-900 transition-all bg-slate-50 border border-slate-200"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white shadow-sm border border-slate-200 overflow-hidden"
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
                <Link to="/profile/vouchers" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Ticket className="w-5 h-5 text-slate-400 group-hover:text-charcoal transition-colors" />
                    <span className="font-medium">Voucher của bạn</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </Link>
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

          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border text-[#0a192f] border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-3">
                <Package className="h-6 w-6 text-charcoal" />
                <h2 className="text-2xl font-bold font-serif text-charcoal">Lịch sử đơn hàng</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 bg-white">
                  <div className="w-16 h-16 border border-slate-200 rounded-full flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">Chưa có đơn hàng nào</h3>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm">Bạn chưa từng mua sắm tại King Man. Hãy khám phá ngay các bộ sưu tập thời trang tinh tế của chúng tôi.</p>
                  <Link to="/shop" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f1f3d] text-white text-[11px] uppercase tracking-widest font-bold hover:bg-slate-800 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="block p-5 bg-white hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 w-full min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                             <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Mã đơn</p>
                             <p className="font-mono text-sm font-bold text-[#0f1f3d]">#{order._id.slice(-8).toUpperCase()}</p>
                             <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold border rounded-none ${
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

                          <div className="mb-2.5">
                            <p className="text-[13px] font-semibold text-[#0f1f3d] line-clamp-1">
                              {order.items?.[0]?.name || 'Sản phẩm của King Man'}
                              {order.items && order.items.length > 1 && (
                                <span className="text-slate-500 font-medium"> và {order.items.length - 1} sản phẩm khác</span>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pb-2 mb-2">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={`${item.productId}-${idx}`} className="shrink-0 group/img relative">
                                <img 
                                  src={item.imageUrl || item.productImageUrl} 
                                  alt={item.name} 
                                  className="w-14 h-16 object-cover border border-slate-200 shrink-0" 
                                  referrerPolicy="no-referrer" 
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                  <span className="text-white text-[10px] font-bold">x{item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                        </div>
                        
                        <div className="w-full md:w-auto shrink-0 flex items-center justify-between md:justify-end gap-6 text-right px-4 py-3 bg-white border border-slate-200 group-hover:border-slate-300 transition-colors">
                          <div className="text-left md:text-right">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Tổng tiền</p>
                            <p className="text-base font-bold text-[#0f1f3d]">{formatVND(order.totalAmount)}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors hidden md:block" />
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

