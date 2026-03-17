import React from 'react';
import { Search, Filter } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-001', customer: 'Julian Vance', date: '2026-03-17', total: '$1,250.00', status: 'Processing', payment: 'Paid' },
  { id: 'ORD-002', customer: 'Marcus Thorne', date: '2026-03-16', total: '$345.00', status: 'Shipped', payment: 'Paid' },
  { id: 'ORD-003', customer: 'Elena Rostova', date: '2026-03-16', total: '$890.00', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-004', customer: 'David Chen', date: '2026-03-15', total: '$220.00', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-005', customer: 'Sarah Jenkins', date: '2026-03-14', total: '$1,560.00', status: 'Cancelled', payment: 'Refunded' },
  { id: 'ORD-006', customer: 'Michael Chang', date: '2026-03-14', total: '$450.00', status: 'Processing', payment: 'Pending' },
];

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Orders & Payments</h2>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders by ID or customer..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.payment === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      order.payment === 'Refunded' ? 'bg-slate-100 text-slate-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}