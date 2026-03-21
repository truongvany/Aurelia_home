import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import policyImage from '../assets/images/chinh-sach.jpg';
import { MembershipPayload } from '../types';

type RewardTier = {
  name: string;
  minSpend: number;
  discount: string;
  birthdayDiscount: string;
};

type PaymentConfig = {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferPrefix: string;
  isActive: boolean;
  amount: number;
};

const REWARD_TIERS: RewardTier[] = [
  { name: 'Thân Thiết', minSpend: 0, discount: '0%', birthdayDiscount: '20%' },
  { name: 'VIP', minSpend: 5000000, discount: '10%', birthdayDiscount: '25%' },
  { name: 'Vàng', minSpend: 20000000, discount: '15%', birthdayDiscount: '35%' }
];

const POLICY_ROWS = [
  {
    label: 'Điều kiện lên hạng',
    values: ['Dưới 5.000.000đ', 'Từ 5.000.000đ đến dưới 20.000.000đ', 'Từ 20.000.000đ trở lên']
  },
  {
    label: 'Điều kiện duy trì thẻ',
    values: ['Vĩnh viễn', 'Vĩnh viễn', 'Vĩnh viễn']
  },
  {
    label: 'Ưu đãi hàng nguyên giá',
    values: ['0%', '10%', '15%']
  },
  {
    label: 'Số lần áp dụng',
    values: ['Theo chương trình', 'Không giới hạn', 'Không giới hạn']
  },
  {
    label: 'Ưu đãi sinh nhật',
    values: ['20%', '25%', '35%']
  }
];

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

export default function Membership() {
  const { isAuthenticated, user, refreshMe } = useAuth();
  const [points, setPoints] = useState(0);
  const [currentTierIndex, setCurrentTierIndex] = useState(0);
  const [membershipData, setMembershipData] = useState<MembershipPayload | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTransferNote, setPaymentTransferNote] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setPoints(0);
      setCurrentTierIndex(0);
      setMembershipData(null);
      setPaymentConfig(null);
      return;
    }

    const userPoints = user.points || 0;
    setPoints(userPoints);

    const estimatedSpend = userPoints * 10000;
    let tierIdx = 0;
    for (let i = REWARD_TIERS.length - 1; i >= 0; i--) {
      if (estimatedSpend >= REWARD_TIERS[i].minSpend) {
        tierIdx = i;
        break;
      }
    }
    setCurrentTierIndex(tierIdx);

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    setFullName(name || user.email || '');
    setPhone(user.phone || '');
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadMembershipContext = async () => {
      try {
        setIsLoadingConfig(true);
        const [membership, config] = await Promise.all([
          api.getMembership(),
          api.getMembershipPaymentConfig()
        ]);
        setMembershipData(membership);
        setPaymentConfig(config);
        if (!paymentTransferNote) {
          setPaymentTransferNote(`${config.transferPrefix || 'PREMIUM'} ${user?.email || ''}`.trim());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadMembershipContext();
  }, [isAuthenticated, user?.email]);

  const estimatedSpend = points * 10000;
  const currentTier = REWARD_TIERS[currentTierIndex];
  const nextTier = currentTierIndex < REWARD_TIERS.length - 1 ? REWARD_TIERS[currentTierIndex + 1] : null;
  const isPremiumActive = user?.isMember && user?.memberStatus === 'active';
  const isPremiumPending = user?.memberStatus === 'pending';

  const vietQrImage = useMemo(() => {
    if (!paymentConfig?.bankBin || !paymentConfig?.accountNumber || !paymentConfig?.accountName) {
      return '';
    }

    const amount = paymentConfig.amount || 29000;
    const addInfo = encodeURIComponent(paymentTransferNote || `${paymentConfig.transferPrefix} ${user?.email || ''}`);
    const accountName = encodeURIComponent(paymentConfig.accountName);

    return `https://img.vietqr.io/image/${paymentConfig.bankBin}-${paymentConfig.accountNumber}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
  }, [paymentConfig, paymentTransferNote, user?.email]);

  const handleProofFileChange = (file: File | null) => {
    if (!file) {
      setProofImage(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh cho bằng chứng thanh toán.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 5MB.');
      return;
    }

    setProofImage(file);
  };

  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleEnrollPremium = async () => {
    if (!isAuthenticated) return;

    if (!paymentConfig?.isActive) {
      alert('Đăng ký Premium hiện đang tạm ngưng. Vui lòng liên hệ hỗ trợ.');
      return;
    }

    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }

    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại.');
      return;
    }

    if (!proofImage) {
      alert('Vui lòng upload bằng chứng thanh toán.');
      return;
    }

    try {
      setIsSubmitting(true);
      const note = (paymentTransferNote || `${paymentConfig.transferPrefix} ${user?.email || ''}`).trim();
      await api.enrollMembership({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        paymentTransferNote: note,
        proofImage
      });

      await refreshMe();
      const latestMembership = await api.getMembership();
      setMembershipData(latestMembership);
      setNotificationVisible(true);
      setTimeout(() => setNotificationVisible(false), 6500);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestRequest = membershipData?.latestRequest;

  return (
    <div className="min-h-screen bg-[#f3f5f8] pt-24 pb-16 relative">
      {notificationVisible && (
        <div className="fixed right-4 top-24 z-50 w-80 rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-lg shadow-emerald-200/30 animate-slide-in-right">
          <p className="text-sm font-semibold text-emerald-900">Đã gửi đăng ký thành viên</p>
          <p className="mt-1 text-xs text-emerald-800">Admin sẽ kiểm tra bằng chứng và duyệt trong 1-2 giờ làm việc.</p>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 border border-slate-200 bg-white px-6 py-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0f1f3d] sm:text-4xl">Chính Sách Khách Hàng</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Đăng ký thành viên Premium với thông tin cá nhân đầy đủ và bằng chứng thanh toán VietQR.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
          <section className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-[#0f1f3d] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white">
              Chính sách thành viên
            </div>
            <img src={policyImage} alt="Chính sách khách hàng King Man" className="h-full w-full object-cover" />
          </section>

          <section className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-[#0f1f3d] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white">
              Thông tin và đăng ký thanh toán
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Mã khách hàng</p>
                  <p className="mt-2 text-xl font-bold text-[#0f1f3d]">{user?.customerCode || '...'}</p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Điểm Rewards</p>
                  <p className="mt-2 text-xl font-bold text-[#0f1f3d]">{points.toLocaleString('vi-VN')}</p>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Hạng hiện tại</p>
                  <p className="mt-2 text-xl font-bold text-[#0f1f3d]">{currentTier.name}</p>
                </div>
              </div>

              <div className="border border-slate-200 bg-white p-4 text-sm text-slate-700">
                {nextTier ? (
                  <p>
                    Bạn cần thêm <strong>{formatCurrency(nextTier.minSpend - estimatedSpend)}</strong> chi tiêu để lên hạng{' '}
                    <strong>{nextTier.name}</strong>.
                  </p>
                ) : (
                  <p>Bạn đang ở hạng cao nhất trong chương trình Rewards.</p>
                )}
              </div>

              {isAuthenticated && (
                <div className="border border-slate-200 bg-white p-5 space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#0f1f3d]">Đổi điểm nhận ưu đãi</p>
                  <p className="text-xs text-slate-500">Mã ưu đãi sẽ tự động thêm vào kho Voucher của bạn rành riêng cho mã khách hàng gốc.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { type: 'freeship', name: 'Free Ship TOÀN QUỐC', points: 300 },
                      { type: 'discount_10', name: 'Giảm 10% Đơn hàng', points: 1500 },
                      { type: 'discount_20', name: 'Giảm 20% Đơn hàng', points: 3000 }
                    ].map((item) => (
                      <div key={item.type} className="flex h-24 bg-white border border-red-600 relative shrink-0 hover:shadow-md transition-shadow">
                        
                        {/* Perforated left edge ticket stub */}
                        <div className="w-6 bg-red-600 flex flex-col justify-evenly items-center shrink-0">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 px-4 py-3 flex flex-col justify-center">
                          <p className="text-[13px] font-bold text-[#0f1f3d] uppercase tracking-wide leading-tight">{item.name}</p>
                          <p className="text-xs text-red-600 font-bold mt-1">🏷 {item.points} ĐIỂM</p>
                        </div>

                        {/* Dashed separator with physical notches */}
                        <div className="w-0 border-l border-dashed border-red-300 relative shrink-0 my-2">
                          {/* Top notch */}
                          <div className="absolute -top-[9px] -left-[6px] w-[12px] h-[6px] bg-white border border-t-0 border-red-600 rounded-b-full z-10"></div>
                          {/* Bottom notch */}
                          <div className="absolute -bottom-[9px] -left-[6px] w-[12px] h-[6px] bg-white border border-b-0 border-red-600 rounded-t-full z-10"></div>
                        </div>

                        {/* Button Area */}
                        <div className="w-[88px] px-2 flex items-center justify-center shrink-0 bg-red-50/30">
                          <button
                            onClick={async () => {
                              if (points < item.points) {
                                alert(`Bạn không đủ ${item.points} điểm để đổi quà này!`);
                                return;
                              }
                              if (window.confirm(`Xác nhận đổi ${item.points} điểm lấy ${item.name}?`)) {
                                try {
                                  await api.exchangePointsForVoucher(item.type);
                                  alert("Đổi mã thành công! Bạn có thể xem trong kho Voucher.");
                                  await refreshMe(); // update points locally
                                } catch(e: any) {
                                  alert(e.message || "Lỗi khi đổi điểm");
                                }
                              }
                            }}
                            disabled={points < item.points}
                            className={`w-full py-2.5 px-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none transition-colors ${
                               points >= item.points ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Đổi ngay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <Link to="/profile/vouchers" className="text-xs font-semibold text-[#0f1f3d] hover:underline uppercase tracking-wide">
                      Xem kho Voucher của bạn &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-[#0f1f3d]">Đăng nhập để đăng ký Premium</p>
                  <p className="mt-1 text-sm text-slate-600">Vui lòng đăng nhập để gửi thông tin cá nhân và bằng chứng thanh toán.</p>
                  <Link to="/auth" className="mt-3 inline-block bg-[#0f1f3d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1530]">
                    Đăng ký / Đăng nhập
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="border border-slate-200 bg-white p-4 space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#0f1f3d]">Đăng ký King Man Premium</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Nguyễn Văn A"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Số điện thoại</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-slate-300 px-3 py-2 text-sm"
                        placeholder="090xxxxxxx"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                      disabled={isSubmitting}
                    />
                  </div>

                  {isLoadingConfig && <p className="text-sm text-slate-500">Đang tải cấu hình thanh toán...</p>}

                  {!isLoadingConfig && paymentConfig && (
                    <>
                      <div className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
                        <p><span className="font-semibold">Phí thành viên:</span> {formatCurrency(paymentConfig.amount)}</p>
                        <p>
                          <span className="font-semibold">Tài khoản nhận:</span>{' '}
                          {[paymentConfig.bankName, paymentConfig.accountNumber, paymentConfig.accountName]
                            .filter(Boolean)
                            .join(' | ') || 'Chưa cấu hình'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Nội dung chuyển khoản</label>
                        <input
                          type="text"
                          value={paymentTransferNote}
                          onChange={(e) => setPaymentTransferNote(e.target.value)}
                          className="w-full border border-slate-300 px-3 py-2 text-sm"
                          disabled={isSubmitting}
                        />
                      </div>

                      {vietQrImage ? (
                        <div className="border border-slate-200 bg-slate-50 p-3 text-center">
                          <img src={vietQrImage} alt="VietQR thanh toán Premium" className="mx-auto h-[190px] w-[190px]" />
                          <p className="mt-2 text-xs text-slate-500">Quét QR và chuyển đúng nội dung để admin dễ đối soát.</p>
                        </div>
                      ) : (
                        <div className="border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
                          Cấu hình VietQR chưa đầy đủ. Vui lòng liên hệ admin.
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                          Upload bằng chứng thanh toán
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProofFileChange(e.target.files?.[0] ?? null)}
                          className="w-full border border-slate-300 px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-[#0f1f3d] file:px-3 file:py-2 file:text-white"
                          disabled={isSubmitting}
                        />
                        {proofImage && <p className="mt-1 text-xs text-slate-500">Đã chọn: {proofImage.name}</p>}
                      </div>

                      <div className={`border p-3 text-sm ${isPremiumActive ? 'border-emerald-500 bg-emerald-50 text-emerald-900 rounded-md shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isPremiumActive ? 'text-emerald-700' : ''}`}>Trạng thái:</span>
                          {isPremiumActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                              Đã kích hoạt (Thanh toán thành công)
                            </span>
                          ) : (
                            <span>{isPremiumPending ? 'Đang chờ duyệt' : 'Chưa đăng ký'}</span>
                          )}
                        </div>
                        {latestRequest?.requestedAt && (
                          <p className={`mt-2 ${isPremiumActive ? 'text-emerald-700/80' : ''}`}>Yêu cầu gần nhất: {new Date(latestRequest.requestedAt).toLocaleString('vi-VN')}</p>
                        )}
                        {latestRequest?.reviewNote && <p className={`mt-1 ${isPremiumActive ? 'text-emerald-700/80' : ''}`}>Ghi chú admin: {latestRequest.reviewNote}</p>}
                      </div>

                      {!isPremiumActive && (
                        <button
                          onClick={handleEnrollPremium}
                          disabled={isSubmitting || (!paymentConfig.isActive && !isPremiumPending)}
                          className="w-full bg-[#0f1f3d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0a1530] disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                          {isSubmitting ? 'Đang gửi đăng ký...' : isPremiumPending ? 'Gửi lại thông tin / bằng chứng' : 'Xác nhận đã chuyển khoản'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-[#0f1f3d] px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white">
            Bảng thông tin chính sách
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-700">
                  <th className="border border-slate-200 px-4 py-3">Tiêu chí</th>
                  <th className="border border-slate-200 px-4 py-3">Hạng Thân Thiết</th>
                  <th className="border border-slate-200 px-4 py-3">Hạng VIP</th>
                  <th className="border border-slate-200 px-4 py-3">Hạng Vàng</th>
                </tr>
              </thead>
              <tbody>
                {POLICY_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="border border-slate-200 px-4 py-3 font-semibold text-[#0f1f3d]">{row.label}</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-700">{row.values[0]}</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-700">{row.values[1]}</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-700">{row.values[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
