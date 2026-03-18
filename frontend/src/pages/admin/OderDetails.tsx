import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, MapPin, CreditCard, Truck, Package } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/orders" className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              Order {id || 'ORD-001'}
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] uppercase tracking-wider font-bold">Processing</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Placed on March 17, 2026 at 10:45 AM</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
              <Package className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-900">Order Items</h3>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium text-center">Quantity</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY" alt="Suit" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-slate-900">Sterling Charcoal Suit</p>
                          <p className="text-xs text-slate-500">Size: 40R, Color: Charcoal</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-center text-slate-600">1</td>
                    <td className="py-4 text-sm font-medium text-slate-900 text-right">$1,250.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex justify-end">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>$1,250.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Tax</span>
                      <span>$106.25</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                      <span>Total</span>
                      <span>$1,356.25</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
              <Truck className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-900">Fulfillment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Standard Shipping</p>
                  <p className="text-xs text-slate-500">FedEx Ground (3-5 business days)</p>
                </div>
                <button className="px-4 py-2 bg-[#C5A059] text-white rounded-lg text-sm font-semibold hover:bg-[#B38D46] transition-colors">
                  Mark as Shipped
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Customer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  JV
                </div>
                <div className="ml-3">
                  <Link to="/admin/customers/1" className="text-sm font-semibold text-blue-600 hover:underline">Julian Vance</Link>
                  <p className="text-xs text-slate-500">julian.vance@example.com</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">3 Orders</p>
                <p className="text-sm text-slate-600">Customer since Jan 2025</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
              <MapPin className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-900">Shipping Address</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 leading-relaxed">
                Julian Vance<br />
                123 Luxury Lane<br />
                Suite 400<br />
                Beverly Hills, CA 90210<br />
                United States<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center">
              <CreditCard className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="text-lg font-bold text-slate-900">Payment</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">Visa ending in 4242</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">Paid</span>
              </div>
              <p className="text-xs text-slate-500">Processed on Mar 17, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}