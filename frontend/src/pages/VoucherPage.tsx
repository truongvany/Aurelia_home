import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Ticket, Search, Info } from 'lucide-react';
import { api } from '../lib/api';
import { VoucherPayload } from '../types';
import { formatVND } from '../utils/currency';

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await api.getVouchers();
        setVouchers(data);
      } catch (err) {
        console.error('Lỗi khi tải voucher:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  // Reset page when tab/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const availableVouchers = vouchers.filter((v) => !v.isExpired && v.usedCount < v.maxUsesPerUser);
  const usedVouchers = vouchers.filter((v) => v.isExpired || v.usedCount >= v.maxUsesPerUser);

  const displayedVouchers = (activeTab === 'available' ? availableVouchers : usedVouchers).filter(v => 
    v.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(displayedVouchers.length / itemsPerPage));
  const paginatedVouchers = displayedVouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-[#0a192f] py-8 md:py-10 selection:bg-rose-500 selection:text-white pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        
        {/* Navigation & Header */}
        <div className="mb-8 relative">
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-[13px] group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Trở về hồ sơ
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                Kho Voucher Của Bạn
              </h1>
              <p className="mt-2 text-[13px] text-slate-500">Quản lý các mã ưu đãi và phiếu mua hàng King Man</p>
            </div>
            
            <div className="relative w-full md:w-64 shrink-0">
              <input 
                type="text" 
                placeholder="Tìm kiếm mã voucher..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all text-[13px] shadow-sm"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-3 px-2 text-[13px] font-bold uppercase tracking-wide transition-all ${
              activeTab === 'available' 
                ? 'text-rose-600 border-b-2 border-rose-500' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Mã Khả Dụng ({availableVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`pb-3 px-2 text-[13px] font-bold uppercase tracking-wide transition-all ${
              activeTab === 'used' 
                ? 'text-slate-800 border-b-2 border-slate-800' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Lịch sử ({usedVouchers.length})
          </button>
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-white rounded-lg border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : displayedVouchers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-1">Không tìm thấy mã ưu đãi</h3>
            <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
              Chưa có voucher nào {activeTab === 'available' ? 'khả dụng cho bạn lúc này' : 'trong lịch sử của bạn'}.
            </p>
            {activeTab === 'used' && (
              <button onClick={() => setActiveTab('available')} className="mt-4 text-[13px] text-rose-600 font-bold hover:underline">
                Xem mã khả dụng
              </button>
            )}
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5"
            >
              {paginatedVouchers.map((v, index) => {
                const isExpiredItem = activeTab === 'used';
                const borderColor = isExpiredItem ? 'border-slate-200' : 'border-[#ff9eb5]';
                const sideColor = isExpiredItem ? 'bg-slate-300' : 'bg-[#f40f51]';

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    key={v._id} 
                    className={`relative bg-white border ${borderColor} rounded-[8px] flex h-[110px] sm:h-[120px] transition-shadow hover:shadow-md group`}
                  >
                    {/* Left thick accent bar */}
                    <div className={`w-[5px] ${sideColor} rounded-[6px_0_0_6px] shrink-0`} />
                    
                    {/* Left Content */}
                    <div className="flex-1 py-3 px-5 flex items-center relative">
                      <div className="w-full pr-8">
                        <h3 className={`text-[15px] sm:text-[17px] font-bold tracking-tight mb-1 leading-tight uppercase ${isExpiredItem ? 'text-slate-500' : 'text-slate-900'}`}>
                          ƯU ĐÃI {v.discountType === 'percent' ? `${v.discountValue}%` : formatVND(v.discountValue)}
                        </h3>
                        <p className={`text-[11px] sm:text-[12px] leading-snug line-clamp-2 ${isExpiredItem ? 'text-slate-400' : 'text-slate-500'}`}>
                          Áp dụng cho đơn hàng {v.minOrderAmount > 0 ? `từ ${formatVND(v.minOrderAmount)}` : 'mọi giá trị'}. {v.maxDiscountAmount ? `Giảm tối đa ${formatVND(v.maxDiscountAmount)}.` : ''}
                        </p>
                      </div>

                      {/* Info Icon absolute centered vertically near the divider */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 shrink-0">
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border ${isExpiredItem ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400'} cursor-help transition-colors`}>
                           <Info className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>

                    {/* Dotted Divider & Notches - Note: bg-[#fcfcfc] matches the page background for cutouts */}
                    <div className="w-[1px] relative flex flex-col justify-center">
                      <div className={`absolute inset-y-1.5 left-0 border-l-[1.5px] border-dashed ${isExpiredItem ? 'border-slate-200' : 'border-[#ffe4e9]'}`} />
                      
                      {/* Top Notch - covers precisely the top border */}
                      <div className={`absolute -top-[1px] left-1/2 -translate-x-1/2 w-[14px] h-[7px] bg-[#fcfcfc] rounded-b-full border-b border-l border-r ${borderColor} z-10`} />
                      
                      {/* Bottom Notch - covers precisely the bottom border */}
                      <div className={`absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[14px] h-[7px] bg-[#fcfcfc] rounded-t-full border-t border-l border-r ${borderColor} z-10`} />
                    </div>

                    {/* Right Action */}
                    <div className="w-[125px] sm:w-[140px] px-3 sm:px-4 flex flex-col items-center justify-center shrink-0">
                      <div className="text-center w-full mb-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 truncate flex flex-col sm:block">
                          Mã: <span className={`font-bold tracking-normal uppercase ${isExpiredItem ? 'text-slate-400' : 'text-slate-800'}`}>{v.code}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 whitespace-nowrap">
                          HSD: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {!isExpiredItem ? (
                        <button 
                          onClick={() => handleCopyCode(v.code)}
                          className={`w-full py-[8px] rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center
                            ${copiedCode === v.code 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-black text-white hover:bg-slate-800'}
                          `}
                        >
                          {copiedCode === v.code ? 'Đã chép' : 'Sao chép mã'}
                        </button>
                      ) : (
                        <div className="w-full py-[8px] rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold uppercase flex items-center justify-center cursor-not-allowed">
                          Đã dùng
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {visiblePages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-[13px] font-medium rounded-full flex items-center justify-center transition-all ${
                      currentPage === pageNum 
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
