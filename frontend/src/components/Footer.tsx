import { Link } from 'react-router-dom';
import { ArrowUp, Facebook, Instagram, Mail, MapPin, Phone, Truck, Wallet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f3f3f3] text-[#132033]">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-14 pb-12 border-b border-slate-300/70">
          <div className="xl:pr-8 xl:border-r xl:border-slate-300/70">
            <h3 className="text-[34px] leading-none font-serif tracking-tight mb-4 text-[#111827]">King Man</h3>
            <p className="text-[15px] leading-8 text-slate-700 max-w-sm mb-7">
              Hệ thống thời trang nam cao cấp, theo đuổi phong cách lịch lãm hiện đại và dịch vụ tư vấn cá nhân hóa.
            </p>

            <div className="flex items-center gap-3 mb-8">
              {[Facebook, Instagram, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label="Mạng xã hội"
                  className="w-10 h-10 bg-white text-slate-700 hover:text-white hover:bg-slate-900 transition-colors flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <h4 className="text-lg font-semibold text-[#111827] mb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5" /> Phương thức thanh toán
            </h4>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-slate-600">
              {['VNPAY', 'MOMO', 'ZaloPay', 'VISA', 'Mastercard'].map((item) => (
                <span key={item} className="bg-white px-3 py-2">{item}</span>
              ))}
            </div>
          </div>

          <div className="xl:px-2 xl:border-r xl:border-slate-300/70">
            <h4 className="text-[32px] leading-none font-serif mb-6 text-[#111827]">Thông tin liên hệ</h4>
            <ul className="space-y-5 text-[16px] leading-8 text-slate-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-slate-900" />
                <span>Tầng 8, Tòa nhà 311-313 Trường Chinh, Phường Phương Liệt, Thành phố Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-900" />
                <a href="tel:0964942121" className="hover:text-slate-900 transition-colors">0964 942 121</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-900" />
                <a href="mailto:cskh@kingman.vn" className="hover:text-slate-900 transition-colors">cskh@kingman.vn</a>
              </li>
            </ul>

            <h5 className="text-lg font-semibold text-[#111827] mt-8 mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5" /> Phương thức vận chuyển
            </h5>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-slate-600">
              {['GHN', 'Ninja Van', 'Ahamove', 'J&T Express'].map((item) => (
                <span key={item} className="bg-white px-3 py-2">{item}</span>
              ))}
            </div>
          </div>

          <div className="xl:px-2 xl:border-r xl:border-slate-300/70">
            <h4 className="text-[32px] leading-none font-serif mb-6 text-[#111827]">Nhóm liên kết</h4>
            <ul className="space-y-3 text-[16px] text-slate-700">
              <li><Link to="/shop" className="hover:text-slate-900 transition-colors">Tìm kiếm</Link></li>
              <li><Link to="/about" className="hover:text-slate-900 transition-colors">Giới thiệu</Link></li>
              <li><Link to="/" className="hover:text-slate-900 transition-colors">Chính sách đổi trả</Link></li>
              <li><Link to="/" className="hover:text-slate-900 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/" className="hover:text-slate-900 transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/contact" className="hover:text-slate-900 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="xl:pl-2">
            <h4 className="text-[32px] leading-none font-serif mb-6 text-[#111827]">Đăng ký nhận tin</h4>
            <p className="text-[16px] leading-8 text-slate-700 mb-5">
              Nhận cập nhật sản phẩm mới, ưu đãi đặc biệt và thông tin giảm giá mới nhất từ King Man.
            </p>

            <form className="flex bg-white">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 text-[15px] text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#111827] text-white text-sm font-semibold uppercase tracking-[0.15em] hover:bg-[#0b1220] transition-colors"
              >
                Đăng ký
              </button>
            </form>

            <div className="mt-10 flex justify-end">
              <a
                href="#"
                className="text-slate-700 hover:text-slate-900 transition-colors uppercase tracking-[0.18em] text-xs font-semibold flex items-center gap-2"
              >
                Về đầu trang <ArrowUp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-slate-600">Copyright © {new Date().getFullYear()} King Man. Powered by Haravan.</p>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.16em] text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Chính sách bảo mật</Link>
            <Link to="/" className="hover:text-slate-900 transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
