import { Link } from 'react-router-dom';
import { ArrowUp, Facebook, Instagram, Mail, MapPin, Phone, Truck, Wallet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 text-[#0f1f3d] pt-12 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 pb-12 border-b border-slate-100">
          
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h3 className="text-[24px] font-serif font-bold text-[#0f1f3d] mb-4">KING MAN</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-6">
              Hệ thống thời trang nam cao cấp, theo đuổi phong cách lịch lãm hiện đại và dịch vụ tư vấn cá nhân hóa.
            </p>
            <ul className="space-y-4 text-[12px] text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span className="leading-relaxed">Tầng 8, Tòa nhà 311-313 Trường Chinh, P. Phương Liệt, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                <a href="tel:0964942121" className="hover:text-[#0f1f3d] font-bold transition-colors">0964 942 121</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                <a href="mailto:cskh@kingman.vn" className="hover:text-[#0f1f3d] font-bold transition-colors">cskh@kingman.vn</a>
              </li>
            </ul>
          </div>

          {/* Cột 2: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f1f3d] mb-5">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-[12px] text-slate-500">
              <li><Link to="/shop" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Sản phẩm mới</Link></li>
              <li><Link to="/about" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Về King Man</Link></li>
              <li><Link to="/membership" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Chính sách thẻ thành viên</Link></li>
              <li><Link to="/" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Chính sách đổi trả</Link></li>
              <li><Link to="/" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Bảo mật thông tin</Link></li>
              <li><Link to="/contact" className="hover:text-[#0f1f3d] hover:font-bold transition-all">Liên hệ chúng tôi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Vận chuyển & Thanh toán bằng SVG / CSS Logos */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f1f3d] mb-4">Vận chuyển</h4>
            <div className="flex flex-wrap gap-2.5 mb-8 items-center cursor-default">
              <span title="Giao Hàng Nhanh" className="bg-[#fff0f1] text-[#E63946] font-black italic text-[11px] px-2 py-1.5 rounded-[3px] tracking-tighter">GHN</span>
              <span title="Ninja Van" className="bg-[#ffeef1] text-[#C41130] font-black text-[12px] px-2 py-1.5 rounded-[3px] uppercase tracking-tighter">ninja<span className="font-normal lowercase">van</span></span>
              <span title="Ahamove" className="bg-[#fff4eb] text-[#F26B22] font-extrabold text-[11px] px-2 py-1.5 rounded-[3px] tracking-tight">Ahamove</span>
              <span title="J&T Express" className="bg-[#DD131F] text-white font-black italic text-[10px] px-2 py-1.5 rounded-[3px] tracking-tighter shadow-sm relative overflow-hidden">
                <span className="relative z-10">J&T <span className="font-normal border-l pl-0.5 ml-0.5 border-white/40 leading-none">EXPRESS</span></span>
              </span>
            </div>

            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f1f3d] mb-4">Thanh toán</h4>
            <div className="flex flex-wrap gap-2.5 items-center cursor-default">
              <span title="VNPay" className="bg-slate-50 border border-slate-100 flex items-center justify-center px-2 min-h-[26px] text-[#005BAA] font-extrabold italic tracking-tighter rounded-[3px]">
                VN<span className="text-[#EE2E24]">PAY</span>
              </span>
              <span title="Momo" className="bg-[#A50064] text-white px-2 min-h-[26px] flex items-center justify-center text-[12px] font-bold tracking-tight rounded-[3px]">
                momo
              </span>
              <span title="ZaloPay" className="bg-slate-50 border border-slate-100 flex items-center justify-center px-2 min-h-[26px] text-[#0068FF] font-bold tracking-tight rounded-[3px]">
                Zalo<span className="text-[#00C25A]">Pay</span>
              </span>
              <span title="Visa" className="bg-slate-50 border border-slate-100 px-2 min-h-[26px] text-[14px] text-[#1A1F71] font-black italic tracking-tighter rounded-[3px] flex items-center justify-center">
                VISA
              </span>
              <span title="Mastercard" className="bg-slate-50 border border-slate-100 min-h-[26px] rounded-[3px] items-center flex justify-center relative w-10 shrink-0">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full mix-blend-multiply absolute left-2"></div>
                <div className="w-3.5 h-3.5 bg-amber-500 rounded-full mix-blend-multiply absolute right-2"></div>
              </span>
            </div>
          </div>

          {/* Cột 4: Đăng ký & Social */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f1f3d] mb-4">Đăng ký nhận tin</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
              Nhập email để trở thành người đầu tiên nhận thông báo ưu đãi và các BST giới hạn.
            </p>
            <form className="flex mb-8">
              <input
                type="email"
                placeholder="Nhập email..."
                className="flex-1 px-4 py-2.5 text-[12px] text-[#0f1f3d] bg-slate-50 border border-r-0 border-slate-200 focus:outline-none focus:border-[#0f1f3d]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f1f3d] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shrink-0"
              >
                Gửi
              </button>
            </form>

            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0f1f3d] mb-4">Kết nối với chúng tôi</h4>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:text-white hover:bg-[#0f1f3d] hover:border-[#0f1f3d] transition-all flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} KING MAN. Đã TẤT CẢ QUYỀN.</p>
          <div className="flex gap-6 items-center">
            <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="text-[10px] text-slate-400 hover:text-[#0f1f3d] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
            >
              Lên đầu trang <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
