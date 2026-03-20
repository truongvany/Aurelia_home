import { useEffect, useState } from 'react';
import { PlusCircle, Search, Ticket, TicketX } from 'lucide-react';
import { api } from '../../lib/api';

type VoucherRow = {
  _id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  source: 'generic' | 'welcome' | 'membership';
  maxUsesPerUser: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
};

export default function Vouchers() {
  const [items, setItems] = useState<VoucherRow[]>([]);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'generic' | 'welcome' | 'membership' | ''>('');
  const [isActiveFilter, setIsActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [maxUsesPerUser, setMaxUsesPerUser] = useState(1);
  const [expiresAt, setExpiresAt] = useState('');
  const [sourceInput, setSourceInput] = useState<'generic' | 'welcome' | 'membership'>('generic');
  const [isCreating, setIsCreating] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = await api.getAdminVouchers({
        page: 1,
        limit: 100,
        search: search || undefined,
        source: source || undefined,
        isActive: isActiveFilter === 'all' ? undefined : isActiveFilter === 'active'
      });
      setItems(payload.items as VoucherRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải vouchers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, source, isActiveFilter]);

  const handleCreate = async () => {
    if (!code.trim()) {
      alert('Vui lòng nhập mã voucher.');
      return;
    }

    if (!expiresAt) {
      alert('Vui lòng chọn hạn dùng.');
      return;
    }

    try {
      setIsCreating(true);
      await api.createAdminVoucher({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount,
        maxUsesPerUser,
        expiresAt: new Date(expiresAt).toISOString(),
        source: sourceInput
      });

      setCode('');
      setDiscountValue(10);
      setMinOrderAmount(0);
      setMaxUsesPerUser(1);
      setExpiresAt('');
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tạo voucher');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeactivate = async (voucherId: string) => {
    try {
      await api.deactivateAdminVoucher(voucherId);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể deactivate voucher');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Voucher Management</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý danh sách voucher và kích hoạt ưu đãi.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Tạo voucher mới
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mã voucher</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ví dụ: WELCOME10"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Loại giảm giá</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (VNĐ)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Giá trị giảm {discountType === 'percent' ? '(%)' : '(VNĐ)'}
            </label>
            <input
              type="number"
              min="0"
              step={discountType === 'percent' ? '1' : '1000'}
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder={discountType === 'percent' ? '10' : '50000'}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Đơn hàng tối thiểu (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="10000"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Số lần dùng tối đa / người</label>
            <input
              type="number"
              min="1"
              value={maxUsesPerUser}
              onChange={(e) => setMaxUsesPerUser(Number(e.target.value))}
              placeholder="1"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Hạn sử dụng</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nguồn gốc</label>
            <select
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value as 'generic' | 'welcome' | 'membership')}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="generic">Generic</option>
              <option value="welcome">Welcome</option>
              <option value="membership">Membership</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full bg-slate-900 text-white rounded-lg px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              {isCreating ? 'Đang tạo...' : 'Tạo voucher'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo code"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value as 'generic' | 'welcome' | 'membership' | '')}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Tất cả nguồn</option>
          <option value="generic">Generic</option>
          <option value="welcome">Welcome</option>
          <option value="membership">Membership</option>
        </select>

        <select
          value={isActiveFilter}
          onChange={(e) => setIsActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang active</option>
          <option value="inactive">Đã deactivate</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Giảm giá</th>
              <th className="px-6 py-4 font-medium">Nguồn</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Hạn dùng</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-sm text-slate-500">Đang tải vouchers...</td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-sm text-slate-500">Không có voucher nào.</td>
              </tr>
            )}
            {!isLoading && items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.code}</td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {item.discountType === 'percent' ? `${item.discountValue}%` : `${item.discountValue.toLocaleString('vi-VN')}đ`}
                  <p className="text-xs text-slate-500">Min: {item.minOrderAmount.toLocaleString('vi-VN')}đ</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.source}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.usedCount}/{item.maxUsesPerUser}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.expiresAt).toLocaleString('vi-VN')}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDeactivate(item._id)}
                    disabled={!item.isActive}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                  >
                    {item.isActive ? <TicketX className="h-4 w-4" /> : <Ticket className="h-4 w-4" />}
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
