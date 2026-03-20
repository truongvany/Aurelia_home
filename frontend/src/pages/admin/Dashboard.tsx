import React, { useEffect, useState, useMemo } from 'react';
import { Package, Users, ShoppingCart, DollarSign, AlertCircle, TrendingUp, Eye, ArrowRight, Plus, Settings, BarChart3, Clock, UserCheck, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatVND } from '../../utils/currency';

interface DashboardData {
  summary: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockVariants: number;
    pendingMembershipRequests: number;
    activeMembers: number;
    activeVouchers: number;
    usedMembershipVouchers: number;
  };
  recentOrders: Array<{
    _id: string;
    orderCode: string;
    customer?: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-700';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const payload = await api.getAdminDashboard();
        setData(payload);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate derived metrics
  const metrics = useMemo(() => {
    if (!data) return null;
    const recentOrders = data.recentOrders || [];
    const avgOrderValue = recentOrders.length > 0 
      ? recentOrders.reduce((sum, order) => sum + order.totalAmount, 0) / recentOrders.length 
      : 0;
    const deliveredOrders = recentOrders.filter(o => o.status.toLowerCase() === 'delivered').length;
    const fulfillmentRate = recentOrders.length > 0 ? (deliveredOrders / recentOrders.length) * 100 : 0;
    return { avgOrderValue, fulfillmentRate, deliveredOrders };
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg border border-red-200">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const summary = data?.summary;
  const recentOrders = data?.recentOrders ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Tổng quan thông tin kinh doanh hôm nay</p>
        </div>
      </div>

      {/* Quick Alerts */}
      {summary && summary.lowStockVariants > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-lg">{summary.lowStockVariants} sản phẩm tồn kho thấp</h3>
            <p className="text-sm text-amber-700 mt-1">Cần bổ sung ngay để tránh mất hàng</p>
          </div>
          <Link to="/admin/products" className="text-amber-700 hover:text-amber-900 text-sm font-bold whitespace-nowrap bg-amber-100 px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors">
            Xem chi tiết →
          </Link>
        </div>
      )}

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Link to="/admin/orders" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Doanh Thu</span>
            <div className="bg-amber-100 p-3 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{formatVND(summary?.totalRevenue ?? 0)}</h3>
          <p className="text-xs text-amber-700 font-semibold">Tổng từ tất cả đơn hàng</p>
        </Link>

        {/* Total Orders */}
        <Link to="/admin/orders" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Đơn Hàng</span>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{summary?.totalOrders ?? 0}</h3>
          <p className="text-xs text-blue-700 font-semibold">Tổng số đơn hàng</p>
        </Link>

        {/* Total Products */}
        <Link to="/admin/products" className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Sản Phẩm</span>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{summary?.totalProducts ?? 0}</h3>
          <p className="text-xs text-emerald-700 font-semibold">Sản phẩm đang bán</p>
        </Link>

        {/* Total Customers */}
        <Link to="/admin/customers" className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">Khách Hàng</span>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{summary?.totalCustomers ?? 0}</h3>
          <p className="text-xs text-purple-700 font-semibold">Tổng khách hàng</p>
        </Link>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Order Value */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Giá Trị TB/Đơn</span>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{formatVND(metrics?.avgOrderValue ?? 0)}</h3>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-500">Trung bình {recentOrders.length} đơn gần đây</p>
        </div>

        {/* Fulfillment Rate */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Tỷ Lệ Hoàn Thành</span>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{metrics?.fulfillmentRate.toFixed(0)}%</h3>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${metrics?.fulfillmentRate ?? 0}%` }}></div>
          </div>
          <p className="text-xs text-slate-500">{metrics?.deliveredOrders} đơn đã giao</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Cảnh Báo Hàng</span>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{summary?.lowStockVariants ?? 0}</h3>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: summary?.lowStockVariants ? '80%' : '0%' }}></div>
          </div>
          <p className="text-xs text-slate-500">Cần bổ sung tồn kho</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/admin/membership-requests" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Pending Membership</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary?.pendingMembershipRequests ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Yêu cầu chờ duyệt</p>
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Active Members</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary?.activeMembers ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Khách hàng thành viên</p>
        </div>
        <Link to="/admin/vouchers" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Active Vouchers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary?.activeVouchers ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Voucher đang hoạt động</p>
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Used Membership Vouchers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{summary?.usedMembershipVouchers ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Lượt dùng voucher member</p>
        </div>
      </div>

      {/* Quick Shortcuts & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-xl text-white p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Phím Tắt & Tác Vụ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products/new" className="group bg-white/10 hover:bg-blue-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-blue-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Thêm Sản Phẩm</p>
            <p className="text-xs text-white/70 mt-1">Tạo sản phẩm mới</p>
          </Link>

          <Link to="/admin/orders" className="group bg-white/10 hover:bg-emerald-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-emerald-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Xem Đơn Hàng</p>
            <p className="text-xs text-white/70 mt-1">Quản lý đơn hàng</p>
          </Link>

          <Link to="/admin/customers" className="group bg-white/10 hover:bg-purple-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-purple-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Khách Hàng</p>
            <p className="text-xs text-white/70 mt-1">Quản lý khách hàng</p>
          </Link>

          <Link to="/admin/settings" className="group bg-white/10 hover:bg-amber-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-amber-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <Settings className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Cài Đặt</p>
            <p className="text-xs text-white/70 mt-1">Cấu hình cửa hàng</p>
          </Link>

          <Link to="/admin/membership-requests" className="group bg-white/10 hover:bg-purple-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-purple-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <UserCheck className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Duyệt Membership</p>
            <p className="text-xs text-white/70 mt-1">Xử lý yêu cầu tham gia</p>
          </Link>

          <Link to="/admin/vouchers" className="group bg-white/10 hover:bg-rose-600 transition-all rounded-xl p-5 text-center border border-white/20 hover:border-rose-400">
            <div className="bg-white/20 group-hover:bg-white/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
              <Ticket className="h-6 w-6" />
            </div>
            <p className="font-semibold text-sm">Quản lý Voucher</p>
            <p className="text-xs text-white/70 mt-1">Tạo và khóa voucher</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Đơn Hàng Gần Đây</h2>
            <p className="text-sm text-slate-500 mt-0.5">{recentOrders.length} đơn hàng mới nhất</p>
          </div>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">Chưa có đơn hàng nào</p>
            <p className="text-xs text-slate-400 mt-2">Đơn hàng sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                  <th className="px-6 py-4 font-semibold">Khách Hàng</th>
                  <th className="px-6 py-4 font-semibold">Thành Tiền</th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 font-semibold">Ngày Đặt</th>
                  <th className="px-6 py-4 font-semibold text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">{order.orderCode.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{order.customer || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatVND(order.totalAmount)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/admin/orders/${order._id}`} className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        <Eye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Business Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Tóm Tắt Kinh Doanh
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Doanh thu trung bình/đơn</span>
              <span className="font-semibold text-slate-900">{formatVND(metrics?.avgOrderValue ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Tổng khách hàng</span>
              <span className="font-semibold text-slate-900">{summary?.totalCustomers ?? 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Trung bình đơn/khách</span>
              <span className="font-semibold text-slate-900">{summary && summary.totalCustomers ? Math.round((summary.totalOrders / summary.totalCustomers) * 10) / 10 : 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Thông Tin Nhanh
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Sản phẩm còn hàng</span>
              <span className="font-semibold text-slate-900">{(summary?.totalProducts ?? 0) - (summary?.lowStockVariants ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Cảnh báo tồn kho</span>
              <span className="font-semibold text-red-600">{summary?.lowStockVariants ?? 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Tỷ lệ hoàn thành</span>
              <span className="font-semibold text-emerald-600">{metrics?.fulfillmentRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}