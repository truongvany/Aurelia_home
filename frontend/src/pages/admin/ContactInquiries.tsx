import React, { useEffect, useState } from 'react';
import { MessageSquare, Phone, Mail, User, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

type InquiryStatus = 'new' | 'in_progress' | 'resolved';

interface ContactInquiry {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message?: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<InquiryStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  new: { label: 'Mới', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: AlertCircle },
  in_progress: { label: 'Đang xử lý', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  resolved: { label: 'Đã xử lý', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
};

export default function ContactInquiries() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminContactInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to fetch contact inquiries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: InquiryStatus) => {
    setUpdatingId(id);
    try {
      await api.updateAdminContactInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus } : inq))
      );
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = filterStatus === 'all'
    ? inquiries
    : inquiries.filter((inq) => inq.status === filterStatus);

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    in_progress: inquiries.filter((i) => i.status === 'in_progress').length,
    resolved: inquiries.filter((i) => i.status === 'resolved').length,
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yêu cầu liên hệ</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các yêu cầu hỗ trợ từ khách hàng ({counts.all} tổng cộng)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { key: 'all' as const, label: 'Tất cả', count: counts.all, color: 'bg-slate-100 text-slate-700' },
          { key: 'new' as const, label: 'Mới', count: counts.new, color: 'bg-blue-50 text-blue-700' },
          { key: 'in_progress' as const, label: 'Đang xử lý', count: counts.in_progress, color: 'bg-amber-50 text-amber-700' },
          { key: 'resolved' as const, label: 'Đã xử lý', count: counts.resolved, color: 'bg-green-50 text-green-700' },
        ]).map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilterStatus(stat.key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterStatus === stat.key
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
            <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${stat.color.split(' ')[1]}`}>{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Table + Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className={`${selectedInquiry ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Khách hàng</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Vấn đề</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Trạng thái</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Ngày gửi</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Chưa có yêu cầu nào</p>
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => {
                    const cfg = statusConfig[inq.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={inq._id}
                        onClick={() => setSelectedInquiry(inq)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                          selectedInquiry?._id === inq._id ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{inq.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{inq.phone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 line-clamp-1 max-w-[200px]">{inq.subject}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDate(inq.createdAt)}</td>
                        <td className="px-5 py-4">
                          <select
                            value={inq.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(inq._id, e.target.value as InquiryStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={updatingId === inq._id}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 cursor-pointer"
                          >
                            <option value="new">Mới</option>
                            <option value="in_progress">Đang xử lý</option>
                            <option value="resolved">Đã xử lý</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedInquiry && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1 self-start sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Chi tiết</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium uppercase tracking-wider"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Họ tên</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedInquiry.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Số điện thoại</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedInquiry.phone}</p>
                </div>
              </div>

              {selectedInquiry.email && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedInquiry.email}</p>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Vấn đề</p>
                <p className="text-sm font-semibold text-slate-900 mb-3">{selectedInquiry.subject}</p>
                
                {selectedInquiry.message && (
                  <>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Ghi chú</p>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedInquiry.message}
                    </p>
                  </>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2">Cập nhật trạng thái</p>
                <div className="flex gap-2 flex-wrap">
                  {(['new', 'in_progress', 'resolved'] as InquiryStatus[]).map((s) => {
                    const cfg = statusConfig[s];
                    const active = selectedInquiry.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(selectedInquiry._id, s)}
                        disabled={active || updatingId === selectedInquiry._id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          active
                            ? `${cfg.bg} ${cfg.color} border-current`
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                        } disabled:opacity-50`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mt-4">
                Gửi lúc: {formatDate(selectedInquiry.createdAt)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
