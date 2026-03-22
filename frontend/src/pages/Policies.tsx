import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Crown,
  CreditCard,
  Headset,
  RefreshCw,
  ShieldCheck,
  Truck
} from 'lucide-react';
import chinhSachImg from '../assets/images/chinh-sach.jpg';

const servicePolicies = [
  {
    icon: RefreshCw,
    title: 'Chính sách đổi trả',
    subtitle: 'Linh hoạt và minh bạch',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop',
    points: [
      'Hỗ trợ đổi trả trong vòng 7-14 ngày kể từ khi nhận hàng.',
      'Sản phẩm giữ nguyên tem mác, chưa qua sử dụng và còn hóa đơn.',
      'Xử lý yêu cầu đổi trả trong 24-48 giờ làm việc.'
    ]
  },
  {
    icon: Truck,
    title: 'Chính sách giao hàng',
    subtitle: 'Nhanh, đúng hẹn, toàn quốc',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1400&auto=format&fit=crop',
    points: [
      'Miễn phí vận chuyển cho đơn hàng đạt ngưỡng giá trị ưu đãi.',
      'Thời gian giao tiêu chuẩn 2-5 ngày tùy khu vực.',
      'Cập nhật trạng thái đơn hàng theo từng mốc vận chuyển.'
    ]
  },
  {
    icon: ShieldCheck,
    title: 'Bảo mật thông tin',
    subtitle: 'An toàn dữ liệu khách hàng',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1400&auto=format&fit=crop',
    points: [
      'Thông tin cá nhân được mã hóa và bảo vệ theo tiêu chuẩn bảo mật.',
      'Không chia sẻ dữ liệu với bên thứ ba nếu không có sự đồng ý.',
      'Khách hàng có quyền yêu cầu cập nhật hoặc xóa dữ liệu theo quy định.'
    ]
  },
  {
    icon: Crown,
    title: 'Đặc quyền thành viên',
    subtitle: 'Lợi ích riêng cho hội viên',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1400&auto=format&fit=crop',
    points: [
      'Nhận thông báo sớm nhất về BST mới và sự kiện mở bán giới hạn.',
      'Tích điểm đổi ưu đãi theo cấp độ hội viên.',
      'Nhận ưu đãi sinh nhật và quà tặng đặc biệt.'
    ]
  }
];

const supportHighlights = [
  {
    icon: CreditCard,
    title: 'Thanh toán linh hoạt',
    description: 'Hỗ trợ nhiều phương thức thanh toán an toàn để bạn mua sắm dễ dàng hơn.',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1400&auto=format&fit=crop'
  },
  {
    icon: Headset,
    title: 'Hỗ trợ nhanh',
    description: 'Đội ngũ chăm sóc sẵn sàng giải đáp và đồng hành trong suốt quá trình mua sắm.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1400&auto=format&fit=crop'
  }
];

const orderFlow = [
  'Đặt đơn trên website và xác nhận thông tin giao nhận.',
  'Đơn hàng được xử lý, đóng gói và bàn giao cho đơn vị vận chuyển.',
  'Nhận hàng, kiểm tra sản phẩm và liên hệ ngay nếu cần hỗ trợ đổi trả.'
];

export default function Policies() {
  return (
    <div className="bg-[#eef2f7] text-slate-900">
      <section className="border-b border-slate-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-7 border border-slate-300 bg-slate-50 p-6 md:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] font-bold text-blue-700 mb-4">Thong tin mua sam</p>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl leading-tight">
                  Chính sách rõ ràng, thông tin đầy đủ, mua sắm an tâm
                </h1>
                <p className="mt-5 text-slate-600 max-w-2xl leading-relaxed">
                  Trang này tổng hợp toàn bộ nội dung quan trọng về đổi trả, giao hàng, bảo mật và đặc quyền
                  thành viên. Mỗi mục đều được trình bày ngắn gọn, dễ đọc, dễ tra cứu.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/membership"
                  className="inline-flex items-center border border-slate-900 bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-blue-700 hover:border-blue-700 transition-colors"
                >
                  Khám phá thành viên
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center border border-slate-400 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors"
                >
                  Cần hỗ trợ ngay
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 border border-slate-300 bg-white p-3">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop"
                alt="Khach hang mua sam thoi trang"
                className="w-full h-[240px] md:h-[290px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="grid grid-cols-3 border-l border-t border-slate-300 mt-3">
                <div className="border-r border-b border-slate-300 p-3 bg-slate-50">
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Phan hoi</p>
                </div>
                <div className="border-r border-b border-slate-300 p-3 bg-white">
                  <p className="text-2xl font-bold">7-14</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Ngay doi tra</p>
                </div>
                <div className="border-b border-slate-300 p-3 bg-slate-50">
                  <p className="text-2xl font-bold">2-5</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Ngay giao</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 border-l-4 border-blue-700 pl-4">
          <h2 className="text-2xl md:text-3xl font-bold">Chính sách chi tiết</h2>
          <p className="text-slate-600 mt-1 text-sm">Mỗi mục dưới đây đều có hình minh họa và các điểm cần biết quan trọng.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left: Featured Image - Sticky on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <img
              src={chinhSachImg}
              alt="Chính sách King Man"
              className="w-full h-auto border border-slate-300 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 border border-slate-300 bg-white p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Cam kết của chúng tôi</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 bg-blue-600 shrink-0"></span>
                  <span>Minh bạch trong mọi giao dịch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 bg-blue-600 shrink-0"></span>
                  <span>Khách hàng là ưu tiên hàng đầu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-3 w-3 bg-blue-600 shrink-0"></span>
                  <span>Hỗ trợ tận tình mọi lúc</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Policy Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servicePolicies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <article key={policy.title} className="border border-slate-300 bg-white">
                    <img
                      src={policy.image}
                      alt={policy.title}
                      className="w-full h-32 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-9 w-9 border border-blue-200 bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-slate-900">{policy.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{policy.subtitle}</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {policy.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                            <span className="mt-0.5 h-3 w-3 bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[8px]">
                              <Check className="h-2 w-2" />
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 border border-slate-300 bg-white p-7 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-slate-500 mb-4">Quy trinh don hang</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">3 buoc nhan hang don gian</h3>
            <ol className="space-y-4">
              {orderFlow.map((step, idx) => (
                <li key={step} className="flex gap-4">
                  <span className="h-8 w-8 bg-slate-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>

            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop"
              alt="Kho van chuyen don hang"
              className="w-full h-48 md:h-56 object-cover mt-7 border border-slate-300"
              referrerPolicy="no-referrer"
            />
          </article>

          <div className="space-y-6">
            {supportHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border border-slate-300 bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-6">
                    <div className="h-10 w-10 border border-slate-300 bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
