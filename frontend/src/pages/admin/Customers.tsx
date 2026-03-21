import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Users, DollarSign, FileText, Gift, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

type AdminCustomer = {
  _id: string;
  fullName: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  points: number;
  tier: string;
  isMember: boolean;
  memberStatus: 'inactive' | 'pending' | 'active';
};

export default function Customers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'member' | 'non-member'>('all');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<Set<string>>(new Set());

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<AdminCustomer[]>([]);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: 0,
    minOrderAmount: 0,
    expiresAt: '',
    maxUsesPerUser: 1,
  });
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCustomerIds(new Set(customers.map(c => c._id)));
    } else {
      setSelectedCustomerIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedCustomerIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedCustomerIds(newSet);
  };

  const handleOpenVoucherModal = (customersToGift: AdminCustomer[]) => {
    setSelectedCustomers(customersToGift);
    const codePrefix = customersToGift.length === 1 
      ? `GIFT-${customersToGift[0]._id.slice(-6).toUpperCase()}` 
      : `GIFT-BULK`;
      
    setVoucherForm({
      code: `${codePrefix}-${Date.now().toString().slice(-4)}`,
      discountType: 'percent',
      discountValue: 10,
      minOrderAmount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxUsesPerUser: 1,
    });
    setVoucherError(null);
    setVoucherSuccess(null);
    setIsVoucherModalOpen(true);
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomers.length === 0) return;
    setIsCreatingVoucher(true);
    setVoucherError(null);
    setVoucherSuccess(null);

    try {
      await Promise.all(
        selectedCustomers.map(customer =>
          api.createAdminVoucher({
            ...voucherForm,
            code: selectedCustomers.length === 1 ? voucherForm.code : `${voucherForm.code}-${customer._id.slice(-4).toUpperCase()}`,
            source: 'generic',
            assignedUserId: customer._id,
            expiresAt: new Date(voucherForm.expiresAt).toISOString(),
          })
        )
      );

      setVoucherSuccess(`Tặng voucher thành công cho ${selectedCustomers.length} người!`);
      setSelectedCustomerIds(new Set());
      setTimeout(() => {
        setIsVoucherModalOpen(false);
      }, 2000);
    } catch (err) {
      setVoucherError(err instanceof Error ? err.message : 'Không thể tạo voucher');
    } finally {
      setIsCreatingVoucher(false);
    }
  };

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgPerCustomer = totalCustomers ? totalSpent / totalCustomers : 0;
    return { totalCustomers, totalOrders, totalSpent, avgPerCustomer };
  }, [customers]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      api
        .getAdminCustomers({ 
          search: search || undefined, 
          limit: 100,
          memberStatus: memberStatusFilter === 'all' ? undefined : memberStatusFilter 
        })
        .then((payload) => {
          setCustomers(payload.items);
          setSelectedCustomerIds(new Set()); // Reset selections on search/filter changes
        })
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load customers'))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, memberStatusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Khách hàng</h2>
          <p className="text-sm text-slate-500 mt-1">Danh sách khách hàng, đơn hàng và doanh thu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng khách</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng đơn</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{formatVND(stats.totalSpent)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trung bình/khách</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{formatVND(stats.avgPerCustomer)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4 flex-col lg:flex-row lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={memberStatusFilter}
              onChange={(e) => setMemberStatusFilter(e.target.value as any)}
              className="pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Tất cả khách hàng</option>
              <option value="member">Thành viên Premium</option>
              <option value="non-member">Khách hàng thường</option>
            </select>
            
            {selectedCustomerIds.size > 0 && (
              <button
                onClick={() => handleOpenVoucherModal(customers.filter(c => selectedCustomerIds.has(c._id)))}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Gift className="h-4 w-4" />
                Tặng {selectedCustomerIds.size} Voucher
              </button>
            )}
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Làm mới
            </Link>
          </div>
        </div>

        {error && <p className="px-4 pb-3 text-sm text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={customers.length > 0 && selectedCustomerIds.size === customers.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Đơn hàng</th>
                <th className="px-6 py-4 font-medium">Hạng / Phân loại</th>
                <th className="px-6 py-4 font-medium">Điểm</th>
                <th className="px-6 py-4 font-medium">Tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Đang tải khách hàng...</td>
                </tr>
              )}
              {!isLoading && customers.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-500" colSpan={6}>Không tìm thấy khách hàng.</td>
                </tr>
              )}
              {!isLoading && customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomerIds.has(customer._id)}
                      onChange={() => handleSelectOne(customer._id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {customer.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="ml-3 text-sm font-bold text-slate-900">{customer.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{formatVND(customer.totalSpent)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 font-medium uppercase tracking-wider">{customer.tier || 'Mới'}</p>
                    {customer.isMember || customer.memberStatus === 'active' ? (
                      <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                        Member
                      </span>
                    ) : (
                      <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 uppercase">
                        Thường
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{(customer.points || 0).toLocaleString('vi-VN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-sm text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenVoucherModal([customer])}
                      className="inline-flex items-center p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                      title="Tặng Voucher"
                    >
                      <Gift className="h-4 w-4" />
                    </button>
                    <Link to={`/admin/customers/${customer._id}`} className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Xem chi tiết">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isVoucherModalOpen && selectedCustomers.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tặng Voucher</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedCustomers.length === 1 
                    ? `Cho ${selectedCustomers[0].fullName} (${selectedCustomers[0].email})` 
                    : `Gửi hàng loạt cho ${selectedCustomers.length} khách hàng`}
                </p>
              </div>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateVoucher} className="p-6 space-y-4">
              {voucherError && <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-lg">{voucherError}</div>}
              {voucherSuccess && <div className="p-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg">{voucherSuccess}</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã Voucher</label>
                <input
                  type="text"
                  required
                  value={voucherForm.code}
                  onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại giảm giá</label>
                  <select
                    value={voucherForm.discountType}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as 'percent' | 'fixed' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percent">Giảm %</option>
                    <option value="fixed">Giảm số tiền</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giá trị ({voucherForm.discountType === 'percent' ? '%' : 'VNĐ'})
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={voucherForm.discountValue || ''}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={voucherForm.minOrderAmount || ''}
                    onChange={(e) => setVoucherForm({ ...voucherForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày hết hạn</label>
                  <input
                    type="date"
                    required
                    value={voucherForm.expiresAt}
                    onChange={(e) => setVoucherForm({ ...voucherForm, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isCreatingVoucher || !!voucherSuccess}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCreatingVoucher ? 'Đang tạo...' : 'Tạo & Tặng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}