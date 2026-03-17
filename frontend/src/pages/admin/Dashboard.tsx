import React from 'react';
import { Search } from 'lucide-react';

const mockCustomers = [
  { id: 'CUST-001', name: 'Julian Vance', email: 'julian.vance@example.com', orders: 12, spent: '$14,250.00', joined: '2024-01-15' },
  { id: 'CUST-002', name: 'Marcus Thorne', email: 'marcus.t@example.com', orders: 3, spent: '$1,345.00', joined: '2025-11-20' },
  { id: 'CUST-003', name: 'Elena Rostova', email: 'elena.r@example.com', orders: 8, spent: '$6,890.00', joined: '2025-06-10' },
];

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{customer.spent}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{customer.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}