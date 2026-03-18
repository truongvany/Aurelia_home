import React from 'react';
import { Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="ml-3 text-sm font-bold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{customer.spent}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{customer.joined}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link to={`/admin/customers/${customer.id}`} className="inline-flex items-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="h-4 w-4" />
                    </Link>
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