import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '../../lib/api';

type SettingsFormState = {
  storeName: string;
  storeEmail: string;
  currency: string;
  timezone: string;
  taxRate: number;
  shippingRate: number;
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferPrefix: string;
  membershipPaymentActive: boolean;
};

const DEFAULT_FORM: SettingsFormState = {
  storeName: 'King Man',
  storeEmail: 'support@kingman.vn',
  currency: 'VND',
  timezone: 'Asia/Ho_Chi_Minh',
  taxRate: 10,
  shippingRate: 20000,
  bankBin: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  transferPrefix: 'PREMIUM',
  membershipPaymentActive: true
};

type BankItem = {
  bin: string;
  code: string;
  shortName: string;
  name: string;
  logo?: string;
};

export default function AdminSettings() {
  const [form, setForm] = useState<SettingsFormState>(DEFAULT_FORM);
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [bankQuery, setBankQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const [data, bankList] = await Promise.all([api.getAdminSettings(), api.getAdminBanks()]);
        setBanks(bankList);
        setForm({
          storeName: data.store.name,
          storeEmail: data.store.email,
          currency: data.store.currency,
          timezone: data.store.timezone,
          taxRate: data.store.taxRate,
          shippingRate: data.store.shippingRate,
          bankBin: data.membershipPayment.bankBin,
          bankName: data.membershipPayment.bankName,
          accountNumber: data.membershipPayment.accountNumber,
          accountName: data.membershipPayment.accountName,
          transferPrefix: data.membershipPayment.transferPrefix,
          membershipPaymentActive: data.membershipPayment.isActive
        });

        const selectedBank = bankList.find((item) => item.bin === data.membershipPayment.bankBin);
        if (selectedBank) {
          setBankQuery(`${selectedBank.shortName} - ${selectedBank.bin}`);
        }
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : 'Không thể tải cài đặt');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const filteredBanks = useMemo(() => {
    const keyword = bankQuery.trim().toLowerCase();
    if (!keyword) {
      return banks;
    }

    return banks.filter((item) => {
      const searchable = `${item.shortName} ${item.name} ${item.code} ${item.bin}`.toLowerCase();
      return searchable.includes(keyword);
    });
  }, [banks, bankQuery]);

  const selectedBank = useMemo(
    () => banks.find((item) => item.bin === form.bankBin) ?? null,
    [banks, form.bankBin]
  );

  const handleSelectBank = (selectedBin: string) => {
    const bank = banks.find((item) => item.bin === selectedBin);
    if (!bank) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      bankBin: bank.bin,
      bankName: bank.name
    }));
    setBankQuery(`${bank.shortName} - ${bank.bin}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.bankBin.trim() || !form.accountNumber.trim() || !form.accountName.trim()) {
      alert('Vui lòng chọn ngân hàng và nhập đầy đủ số tài khoản, tên tài khoản.');
      return;
    }

    try {
      setIsSaving(true);
      await api.updateAdminSettings({
        store: {
          name: form.storeName,
          email: form.storeEmail,
          currency: form.currency,
          timezone: form.timezone,
          taxRate: form.taxRate,
          shippingRate: form.shippingRate
        },
        membershipPayment: {
          bankBin: form.bankBin,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
          transferPrefix: form.transferPrefix,
          isActive: form.membershipPaymentActive
        }
      });

      setSuccessMessage('Cài đặt đã được lưu thành công.');
      window.setTimeout(() => setSuccessMessage(null), 4500);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-600">Đang tải cài đặt...</div>;
  }

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý thông tin cửa hàng và cấu hình VietQR cho đăng ký thành viên.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {successMessage && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C5A059] hover:bg-[#B38D46] disabled:opacity-50 transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Thông tin cửa hàng</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên cửa hàng</label>
            <input
              value={form.storeName}
              onChange={(e) => setForm((prev) => ({ ...prev, storeName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email hỗ trợ</label>
            <input
              type="email"
              value={form.storeEmail}
              onChange={(e) => setForm((prev) => ({ ...prev, storeEmail: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiền tệ</label>
            <input
              value={form.currency}
              onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Múi giờ</label>
            <input
              value={form.timezone}
              onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Thuế (%)</label>
            <input
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm((prev) => ({ ...prev, taxRate: Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              min={0}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phí vận chuyển mặc định (VND)</label>
            <input
              type="number"
              value={form.shippingRate}
              onChange={(e) => setForm((prev) => ({ ...prev, shippingRate: Number(e.target.value) }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              min={0}
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Cấu hình VietQR cho đăng ký thành viên</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tìm kiếm ngân hàng</label>
            <input
              value={bankQuery}
              onChange={(e) => setBankQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="Nhập tên ngân hàng, mã viết tắt hoặc BIN"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Chọn ngân hàng</label>
            <select
              value={form.bankBin}
              onChange={(e) => handleSelectBank(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">-- Chọn ngân hàng --</option>
              {filteredBanks.map((item) => (
                <option key={item.bin} value={item.bin}>
                  {item.shortName} - {item.name} ({item.bin})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Hiển thị {filteredBanks.length} / {banks.length} ngân hàng.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">BIN ngân hàng (tự động)</label>
            <input
              value={form.bankBin}
              readOnly
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên ngân hàng (tự động)</label>
            <input
              value={selectedBank?.name || form.bankName}
              readOnly
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số tài khoản</label>
            <input
              value={form.accountNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên tài khoản</label>
            <input
              value={form.accountName}
              onChange={(e) => setForm((prev) => ({ ...prev, accountName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiền tố nội dung chuyển khoản</label>
            <input
              value={form.transferPrefix}
              onChange={(e) => setForm((prev) => ({ ...prev, transferPrefix: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              placeholder="PREMIUM"
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.membershipPaymentActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    membershipPaymentActive: e.target.checked
                  }))
                }
              />
              Bật thanh toán Premium bằng VietQR
            </label>
          </div>
        </div>
      </section>
    </form>
  );
}
