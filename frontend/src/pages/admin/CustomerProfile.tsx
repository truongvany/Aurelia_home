import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

export default function CustomerProfile() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/customers" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Customer Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-200">
              <div className="h-20 w-20 rounded-full bg-slate-900 text-[#C5A059] flex items-center justify-center text-2xl font-bold mb-4">
                JV
              </div>
              <h3 className="text-xl font-bold text-slate-900">Julian Vance</h3>
              <p className="text-sm text-slate-500 mt-1">VIP Customer</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-3 text-slate-400" />
                julian.vance@example.com
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-3 text-slate-400" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-start text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-3 text-slate-400 mt-0.5" />
                <span>123 Luxury Lane<br />Beverly Hills, CA 90210</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                Joined Jan 15, 2024
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Lifetime Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center text-slate-500 mb-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium uppercase tracking-wider">Total Spent</span>
                </div>
                <p className="text-xl font-bold text-slate-900">$14,250.00</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center text-slate-500 mb-1">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium uppercase tracking-wider">Orders</span>
                </div>
                <p className="text-xl font-bold text-slate-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Order History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      <Link to="/admin/orders/ORD-001" className="hover:text-blue-600">ORD-001</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">Mar 17, 2026</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">$1,250.00</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] uppercase tracking-wider font-bold">Processing</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      <Link to="/admin/orders/ORD-009" className="hover:text-blue-600">ORD-009</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">Feb 10, 2026</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">$3,400.00</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] uppercase tracking-wider font-bold">Delivered</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      <Link to="/admin/orders/ORD-024" className="hover:text-blue-600">ORD-024</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">Dec 05, 2025</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">$890.00</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] uppercase tracking-wider font-bold">Delivered</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}