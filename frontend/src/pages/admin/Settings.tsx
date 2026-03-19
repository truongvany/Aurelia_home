import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Globe, CreditCard, Truck } from 'lucide-react';

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('Aurelia Boutique');
  const [storeEmail, setStoreEmail] = useState('support@aurelia.com');
  const [currency, setCurrency] = useState('VND');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [taxRate, setTaxRate] = useState(10);
  const [shippingRate, setShippingRate] = useState(20);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Persist settings via API
    setSuccessMessage('Cài đặt đã được lưu thành công.');
    window.setTimeout(() => setSuccessMessage(null), 4500);
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cài đặt cửa hàng</h2>
            <p className="text-sm text-slate-500 mt-1">Thiết lập thông tin và tham số mặc định cho cửa hàng.</p>
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
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#C5A059] hover:bg-[#B38D46] shadow-md shadow-amber-900/10 transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Thông tin cửa hàng</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên cửa hàng</label>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Tên cửa hàng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email hỗ trợ</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="support@yourstore.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiền tệ</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Múi giờ</label>
                <input
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Asia/Ho_Chi_Minh"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Cài đặt thanh toán</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thuế (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                min={0}
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phí vận chuyển mặc định</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={shippingRate}
                  onChange={(e) => setShippingRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min={0}
                />
                <span className="text-sm text-slate-500">VND</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="mt-1 h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-600">
                Các giá trị này sẽ được sử dụng khi tạo đơn mới.
              </p>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
