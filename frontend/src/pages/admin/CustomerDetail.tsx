import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    Promise.all([api.getAdminCustomerById(id), api.getAdminCustomerOrders(id)])
      .then(([customerData, orderData]) => {
        setCustomer(customerData);
        setOrders(orderData);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load customer'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading customer...</div>;
  }

  if (!customer) {
    return <div className="text-sm text-red-600">{error ?? 'Customer not found.'}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/customers" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Customer Profile</h2>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-200">
              <div className="h-20 w-20 rounded-full bg-slate-900 text-[#C5A059] flex items-center justify-center text-2xl font-bold mb-4">
                {customer.fullName
                  .split(' ')
                  .map((word: string) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{customer.fullName}</h3>
              <p className="text-sm text-slate-500 mt-1">Customer</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-3 text-slate-400" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-3 text-slate-400" />
                {customer.phone || 'Not provided'}
              </div>
              <div className="flex items-start text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-3 text-slate-400 mt-0.5" />
                <span>Address not available</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                Joined {new Date(customer.createdAt).toLocaleDateString()}
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
                <p className="text-xl font-bold text-slate-900">${customer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center text-slate-500 mb-1">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium uppercase tracking-wider">Orders</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{customer.orderCount}</p>
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
                  {orders.length === 0 && (
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-500" colSpan={4}>No orders yet.</td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        <Link to={`/admin/orders/${order._id}`} className="hover:text-blue-600">{order.orderCode.slice(-8).toUpperCase()}</Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] uppercase tracking-wider font-bold">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
