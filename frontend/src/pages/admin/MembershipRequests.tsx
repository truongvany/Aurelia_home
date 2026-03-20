import { useEffect, useState } from 'react';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { api } from '../../lib/api';

type MembershipRequest = {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  memberStatus: 'inactive' | 'pending' | 'active';
  membershipRequestedAt?: string | null;
  membershipReviewedAt?: string | null;
};

export default function MembershipRequests() {
  const [items, setItems] = useState<MembershipRequest[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'active' | 'inactive'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    try {
      setActionLoadingId(userId);
      await api.reviewAdminMembershipRequest(userId, action);
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
    return 'Không kích hoạt';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Membership Requests</h2>
        <p className="text-sm text-slate-500 mt-1">Duyệt yêu cầu tham gia membership từ khách hàng.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên/email/sđt"
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Khách hàng</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium">Ngày yêu cầu</th>
              <th className="px-6 py-4 font-medium">Ngày duyệt</th>
              <th className="px-6 py-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-sm text-slate-500">Đang tải dữ liệu...</td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-sm text-slate-500">Không có yêu cầu nào.</td>
              </tr>
            )}
            {!isLoading && items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{item.fullName}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                  <p className="text-xs text-slate-400">{item.phone || '-'}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{statusLabel(item.memberStatus)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.membershipRequestedAt ? new Date(item.membershipRequestedAt).toLocaleString('vi-VN') : '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.membershipReviewedAt ? new Date(item.membershipReviewedAt).toLocaleString('vi-VN') : '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleReview(item._id, 'approve')}
                      disabled={item.memberStatus !== 'pending' || actionLoadingId === item._id}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(item._id, 'reject')}
                      disabled={item.memberStatus !== 'pending' || actionLoadingId === item._id}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
