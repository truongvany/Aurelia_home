import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Gift, Sparkles, Truck, Wrench, ShieldCheck, ScissorsLineDashed, Headset } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { MembershipPayload, VoucherPayload } from '../types';

const memberBenefits = [
  {
    key: 'freeShipping',
    title: 'Miễn phí vận chuyển',
    description: 'Mọi đơn hàng đều được miễn phí ship khi bạn là thành viên.',
    icon: Truck
  },
  {
    key: 'flexibleSizeExchange',
    title: 'Trả đổi size linh hoạt',
    description: 'Hỗ trợ đổi size nhanh chóng với ưu tiên dành riêng cho member.',
    icon: ScissorsLineDashed
  },
  {
    key: 'priorityContact',
    title: 'Liên hệ nhanh chóng',
    description: 'Kênh hỗ trợ ưu tiên giúp xử lý yêu cầu trong thời gian ngắn hơn.',
    icon: Headset
  },
  {
    key: 'freeAlteration',
    title: 'Sửa đồ miễn phí',
    description: 'Tinh chỉnh lên form vừa vặn hơn tại điểm dịch vụ của Aurelia Home.',
    icon: Wrench
  },
  {
    key: 'fashionWarranty',
    title: 'Bảo hành thời trang',
    description: 'Chính sách bảo hành cho nhóm sản phẩm giày dép và phụ kiện chọn lọc.',
    icon: ShieldCheck
  },
  {
    key: 'bespokeDesignSupport',
    title: 'Đặt thiết kế riêng',
    description: 'Nhận tư vấn cá nhân hóa cho nhu cầu thiết kế theo phong cách cá nhân.',
    icon: Sparkles
  }
] as const;

const formatDate = (value: string) => new Date(value).toLocaleDateString('vi-VN');

export default function Membership() {
  const { isAuthenticated, user, refreshMe } = useAuth();
  const [membership, setMembership] = useState<MembershipPayload | null>(null);
  const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memberStatus = membership?.user.memberStatus ?? user?.memberStatus ?? 'inactive';
  const isPending = memberStatus === 'pending';
  const isMemberActive = memberStatus === 'active';

  const activeVouchers = useMemo(
    () => vouchers.filter((voucher) => !voucher.isExpired && voucher.usedCount < voucher.maxUsesPerUser),
    [vouchers]
  );

  useEffect(() => {
    const loadPrivateData = async () => {
      if (!isAuthenticated) {
        setMembership(null);
        setVouchers([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [membershipData, voucherData] = await Promise.all([
          api.getMembership(),
          api.getVouchers()
        ]);
        setMembership(membershipData);
        setVouchers(voucherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu Membership');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivateData();
  }, [isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setIsEnrolling(true);
      setError(null);
      const data = await api.enrollMembership();
      setMembership(data);
      const voucherData = await api.getVouchers();
      setVouchers(voucherData);
      await refreshMe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể kích hoạt Membership');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#f3f0eb] text-[#1c1a18]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,160,89,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(28,26,24,0.12),transparent_40%)]" />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="rounded-3xl border border-[#d6c5a5] bg-[#fbf9f6]/90 p-8 md:p-12 shadow-[0_25px_60px_rgba(34,27,17,0.12)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#cab07a] bg-[#f6ecda] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#7f5a22]">
            <Crown className="h-4 w-4" />
            Aurelia Member
          </p>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl leading-tight">
            Membership dành cho trải nghiệm thời trang cao cấp
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg text-[#5f564c]">
            Kích hoạt membership để nhận voucher độc quyền, miễn phí vận chuyển trên mọi đơn,
            cùng các đặc quyền chăm sóc và bảo hành dành cho khách hàng thân thiết.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-[#1f1a14] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#3a2f23]"
              >
                Đăng nhập để tham gia
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleEnroll}
                disabled={isPending || isMemberActive || isEnrolling}
                className="inline-flex items-center justify-center rounded-full bg-[#1f1a14] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#3a2f23] disabled:opacity-60"
              >
                {isMemberActive
                  ? 'Bạn đã là thành viên'
                  : isPending
                    ? 'Yêu cầu đang chờ duyệt'
                    : isEnrolling
                      ? 'Đang gửi yêu cầu...'
                      : 'Gửi yêu cầu tham gia'}
              </button>
            )}

            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[#1f1a14] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f1a14] hover:bg-[#1f1a14] hover:text-white"
            >
              Mua sắm ngay
            </Link>
          </div>

          {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
          {isPending && (
            <p className="mt-3 text-sm text-amber-700">
              Yêu cầu của bạn đã được gửi. Quyền lợi membership sẽ kích hoạt sau khi admin duyệt.
            </p>
          )}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memberBenefits.map((benefit) => {
            const Icon = benefit.icon;
            const enabled = isMemberActive && membership?.benefits?.[benefit.key as keyof MembershipPayload['benefits']];

            return (
              <article
                key={benefit.key}
                className="rounded-2xl border border-[#e6dac7] bg-white/90 p-6 shadow-[0_16px_36px_rgba(45,34,24,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-[#9b6b2d]" />
                  <span className={`text-xs font-semibold uppercase tracking-[0.15em] ${enabled ? 'text-emerald-700' : 'text-[#a2937c]'}`}>
                    {enabled ? 'Đang kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1f1a14]">{benefit.title}</h3>
                <p className="mt-2 text-sm text-[#6f6458]">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative bg-[#1f1a14] py-14 text-[#f7f2e8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl">Voucher dành cho Membership</h2>
            <Gift className="h-7 w-7 text-[#d8b173]" />
          </div>

          {!isAuthenticated ? (
            <p className="mt-4 text-sm text-[#d7ccbf]">Đăng nhập để xem voucher cá nhân và áp dụng tại trang thanh toán.</p>
          ) : isPending ? (
            <p className="mt-4 text-sm text-[#d7ccbf]">Tài khoản đang chờ duyệt membership. Voucher membership sẽ xuất hiện sau khi được duyệt.</p>
          ) : isLoading ? (
            <p className="mt-4 text-sm text-[#d7ccbf]">Đang tải voucher...</p>
          ) : activeVouchers.length === 0 ? (
            <p className="mt-4 text-sm text-[#d7ccbf]">Hiện chưa có voucher khả dụng. Hãy tham gia Membership để nhận ưu đãi đầu tiên.</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeVouchers.map((voucher) => (
                <article key={voucher._id} className="rounded-2xl border border-[#46382a] bg-[#2a221a] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d8b173]">{voucher.source}</p>
                  <p className="mt-3 text-2xl font-bold">{voucher.code}</p>
                  <p className="mt-2 text-sm text-[#e6daca]">Giảm {voucher.discountValue}% cho đơn từ {voucher.minOrderAmount.toLocaleString('vi-VN')}đ</p>
                  <p className="mt-3 text-xs text-[#bcae9a]">Hạn dùng: {formatDate(voucher.expiresAt)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
