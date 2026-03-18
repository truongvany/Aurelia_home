import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Truck, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    api
      .getAdminOrderById(id)
      .then(setOrder)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unable to load order'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleMarkShipped = async () => {
    if (!id) return;

    setIsUpdating(true);
    try {
      await api.updateAdminOrderStatus(id, 'shipped');
      const refreshed = await api.getAdminOrderById(id);
      setOrder(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading order...</div>;
  }

  if (!order) {
    return <div className="text-sm text-red-600">{error ?? 'Order not found.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/admin/orders" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{order.orderCode}</h3>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] uppercase tracking-wider font-bold">
                {order.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Customer</p>
                <p className="text-sm font-semibold text-slate-900">
                  {`${order.customer?.firstName ?? ''} ${order.customer?.lastName ?? ''}`.trim() || order.customer?.email}
                </p>
                <p className="text-sm text-slate-600">{order.customer?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Shipping Address</p>
                <p className="text-sm text-slate-600">{order.shippingAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Quantity</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={`${item.productId}-${idx}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 text-right font-medium">${item.unitPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-slate-400" />
              Payment
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] uppercase font-bold tracking-wider">
                  {order.payment?.status ?? 'pending'}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-slate-400" />
              Fulfillment
            </h3>
            <p className="text-sm text-slate-600 mb-4">Ready to ship</p>
            <button
              onClick={handleMarkShipped}
              disabled={isUpdating || order.status === 'shipped' || order.status === 'delivered'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Mark as Shipped'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
