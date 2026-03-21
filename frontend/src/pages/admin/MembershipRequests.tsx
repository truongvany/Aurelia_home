import { useEffect, useState } from 'react';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { api } from '../../lib/api';

type MembershipRequest = {
  _id: string;
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  memberStatus: 'inactive' | 'pending' | 'active';
  membershipRequestedAt?: string | null;
  membershipReviewedAt?: string | null;
  membershipReviewNote?: string;
  paymentAmount?: number;
  paymentTransferNote?: string;
  recipientBankName?: string;
  recipientAccountNumber?: string;
  recipientAccountName?: string;
  proofImageUrl?: string;
};

export default function MembershipRequests() {
  const [items, setItems] = useState<MembershipRequest[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'active' | 'inactive'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = await api.getAdminMembershipRequests({
        page: 1,
        limit: 100,
        search: search || undefined,
        status
      });
      setItems(payload.items as MembershipRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải membership requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, status]);

  const handleReview = async (userId: string, action: 'approve' | 'reject') => {
    const note = window.prompt(
      action === 'approve' ? 'Ghi chú duyệt (không bắt buộc):' : 'Lý do từ chối (không bắt buộc):',
      ''
    ) ?? '';

    try {
      setActionLoadingId(userId);
      await api.reviewAdminMembershipRequest(userId, action, note || undefined);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể cập nhật yêu cầu');
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusLabel = (value: MembershipRequest['memberStatus']) => {
    if (value === 'pending') return 'Chờ duyệt';
    if (value === 'active') return 'Đã duyệt';
    return 'Đã từ chối';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Đăng ký thành viên</h2>
        <p className="text-sm text-slate-500 mt-1">Kiểm tra thông tin cá nhân, bằng chứng thanh toán và duyệt yêu cầu thành viên.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên/email/sđt/nội dung CK"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'active' | 'inactive')}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="pending">Chờ duyệt</option>
          <option value="active">Đã duyệt</option>
          <option value="inactive">Đã từ chối</option>
        </select>
      </div>

      <div className="space-y-4">
        {modalImageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-[90vh] max-w-[90vw] bg-white rounded-xl p-4 shadow-2xl">
              <button
                type="button"
                onClick={() => setModalImageSrc(null)}
                className="absolute right-3 top-3 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                aria-label="Đóng xem ảnh"
              >
                ✕
              </button>
              <div className="mb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.25))}
                  className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold"
                >
                  + Zoom
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.25))}
                  className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold"
                >
                  - Zoom
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold"
                >
                  Reset
                </button>
              </div>
              <div className="overflow-auto max-h-[70vh]">
                <img
                  src={modalImageSrc}
                  alt="Bằng chứng chuyển khoản"
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease' }}
                  className="mx-auto max-h-[70vh] max-w-[90vw] object-contain"
                />
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {isLoading && <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-500">Đang tải dữ liệu...</div>}

        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm text-slate-500">Không có yêu cầu nào.</div>
        )}

        {!isLoading &&
          items.map((item) => (
            <article key={item._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.fullName}</h3>
                  <p className="text-sm text-slate-600">{item.email} | {item.phone || '-'}</p>
                  <p className="text-sm text-slate-600">Địa chỉ: {item.address || '-'}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Trạng thái: <span className="font-semibold">{statusLabel(item.memberStatus)}</span></p>
                  <p>Ngày yêu cầu: {item.membershipRequestedAt ? new Date(item.membershipRequestedAt).toLocaleString('vi-VN') : '-'}</p>
                  <p>Ngày duyệt: {item.membershipReviewedAt ? new Date(item.membershipReviewedAt).toLocaleString('vi-VN') : '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">
                <div className="space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">Số tiền:</span> {(item.paymentAmount ?? 0).toLocaleString('vi-VN')}đ</p>
                  <p><span className="font-semibold">Nội dung CK:</span> {item.paymentTransferNote || '-'}</p>
                  <p>
                    <span className="font-semibold">Tài khoản nhận:</span>{' '}
                    {[item.recipientBankName, item.recipientAccountNumber, item.recipientAccountName].filter(Boolean).join(' | ') || '-'}
                  </p>
                  <p><span className="font-semibold">Ghi chú duyệt:</span> {item.membershipReviewNote || '-'}</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {item.proofImageUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setModalImageSrc(item.proofImageUrl!);
                        setZoomLevel(1);
                      }}
                      className="block w-full text-left"
                      aria-label="Xem ảnh bằng chứng"
                    >
                      <img
                        src={item.proofImageUrl}
                        alt="Bằng chứng chuyển khoản"
                        className="w-full h-44 object-cover rounded-md border border-slate-200 hover:opacity-90 transition"
                      />
                      <span className="mt-2 inline-block text-xs text-blue-600">Xem ảnh</span>
                    </button>
                  ) : (
                    <p className="text-xs text-slate-500">Không có bằng chứng</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleReview(item.userId, 'approve')}
                  disabled={item.memberStatus !== 'pending' || actionLoadingId === item.userId}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Duyệt
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(item.userId, 'reject')}
                  disabled={item.memberStatus !== 'pending' || actionLoadingId === item.userId}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Từ chối
                </button>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
