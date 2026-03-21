import React, { useRef, useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, Briefcase, Handshake, ArrowRight, Building2 } from 'lucide-react';
import { api } from '../lib/api';

type StoreLocation = {
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
};

export default function Contact() {
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn sản phẩm');
  const [message, setMessage] = useState('');
  const [activeStore, setActiveStore] = useState(0);

  const contactPillars = [
    { title: 'Phản hồi nhanh', subtitle: 'Trong 24h làm việc' },
    { title: 'Hỗ trợ đa kênh', subtitle: 'Hotline - Email - Form' },
    { title: 'Tư vấn rõ ràng', subtitle: 'Theo đúng nhu cầu của bạn' },
  ];

  const stores: StoreLocation[] = [
    {
      name: 'Flagship Store Đà Nẵng',
      address: '459 Tôn Đức Thắng, Phường Hòa Khánh Nam, Quận Liên Chiểu, TP. Đà Nẵng',
      phone: '(0236) 1234 567',
      mapUrl: 'https://maps.google.com/maps?q=459%20Ton%20Duc%20Thang%2C%20Lien%20Chieu%2C%20Da%20Nang&output=embed',
    },
    {
      name: 'Concept Store Hà Nội',
      address: '12 Bạch Mai, Phường Cầu Dền, Quận Hai Bà Trưng, TP. Hà Nội',
      phone: '(024) 7654 321',
      mapUrl: 'https://maps.google.com/maps?q=12%20Bach%20Mai%2C%20Hai%20Ba%20Trung%2C%20Ha%20Noi&output=embed',
    },
    {
      name: 'Boutique Store Hồ Chí Minh',
      address: '89 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
      phone: '(028) 9876 543',
      mapUrl: 'https://maps.google.com/maps?q=89%20Nguyen%20Trai%2C%20Quan%201%2C%20Ho%20Chi%20Minh&output=embed',
    },
  ];

  const scrollToForm = () => {
    if (!formRef.current) return;
    const offsetY = -90;
    const targetY = formRef.current.getBoundingClientRect().top + window.scrollY + offsetY;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitContact({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject,
        message: message.trim()
      });

      alert('Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.');
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('Tư vấn sản phẩm');
      setMessage('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen text-slate-800 font-sans selection:bg-black selection:text-white pb-24">
      <section className="relative w-full min-h-[70vh] md:min-h-[78vh] flex items-center overflow-hidden bg-black pt-24">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'url("https://cdn.hstatic.net/files/1000360022/collection/icondenim-mickey-racing_a622f91382be46d08deb2d167a1ff032.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/30" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl">
            <p className="text-white/80 text-sm uppercase tracking-[0.2em] mb-4">KING MAN CONTACT CENTER</p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-7">
              Liên Hệ Rõ Ràng,
              <br />
              Hỗ Trợ Chuyên Nghiệp.
            </h1>
            <p className="text-base md:text-lg text-white/85 max-w-2xl leading-relaxed mb-10">
              Từ hỗ trợ đơn hàng, tư vấn sản phẩm đến hợp tác kinh doanh, đội ngũ King Man luôn sẵn sàng phản hồi nhanh,
              đầy đủ thông tin và đúng nhu cầu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-gray-200 transition-all"
              >
                Gửi yêu cầu ngay
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:19001234"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
              >
                Hotline
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {contactPillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className={`bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.08)] border border-slate-100 text-left transition-all hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] ${
                idx === 0
                  ? 'rounded-tr-3xl rounded-bl-3xl rounded-tl-none rounded-br-none'
                  : idx === 1
                  ? 'rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none'
                  : 'rounded-tr-3xl rounded-bl-3xl rounded-tl-none rounded-br-none'
              }`}
            >
              <p className="text-slate-900 text-lg font-extrabold tracking-tight">{pillar.title}</p>
              <p className="text-slate-500 text-sm mt-1">{pillar.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={formRef} className="max-w-[1400px] mx-auto px-4 md:px-8 mt-20">
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start w-full">
          <div className="bg-white rounded-none p-6 md:p-10 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase mb-3">Gửi Tin Nhắn</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Để lại thông tin, chúng tôi sẽ liên hệ lại.</h2>
              <p className="text-slate-500 mt-4 text-sm md:text-base">
                Chuyên viên King Man sẽ phản hồi trong khung giờ làm việc và ưu tiên xử lý theo mức độ khẩn cấp của yêu cầu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700">Họ và tên</label>
                  <div className="relative">
                    <User className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="fullName"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-none text-base focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-colors bg-slate-50 focus:bg-white"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-none text-base focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-colors bg-slate-50 focus:bg-white"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-none text-base focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-colors bg-slate-50 focus:bg-white"
                      placeholder="0901234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">Tiêu đề</label>
                  <div className="relative">
                    <MessageSquare className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-none text-base focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-colors bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
                      <option value="Đơn hàng">Vấn đề đơn hàng</option>
                      <option value="Đại lý / Hợp tác">Đại lý / Hợp tác</option>
                      <option value="Góp ý / Khiếu nại">Góp ý / Khiếu nại</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700">Nội dung</label>
                <textarea
                  id="message"
                  required
                  maxLength={500}
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full p-4 border border-slate-200 rounded-none text-base focus:ring-2 focus:ring-slate-900/15 focus:border-slate-900 transition-colors bg-slate-50 focus:bg-white resize-none"
                  placeholder="Hãy mô tả chi tiết yêu cầu của bạn..."
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cam kết phản hồi trong vòng 24 giờ làm việc.</span>
                  <span>{message.length}/500</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-black text-white rounded-none p-8 relative overflow-hidden shadow-sm">
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10" />
              <div className="absolute -bottom-12 -left-8 w-36 h-36 bg-white/5" />
              <div className="relative z-10">
                <h3 className="font-serif text-3xl mb-4">Liên Hệ.</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  Tốc độ và sự tận tâm là kim chỉ nam cho mọi tương tác với khách hàng tại King Man.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Giờ làm việc</p>
                      <p className="text-xs text-slate-300 mt-1">8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Hotline</p>
                      <p className="text-xs text-slate-300 mt-1">1900 1234</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-none p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Building2 className="w-5 h-5 text-slate-900" />
                <h4 className="text-lg font-bold text-slate-900">Ưu tiên xử lý</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>- Đơn hàng đang giao hoặc cần đổi trả gấp</li>
                <li>- Yêu cầu hợp tác từ đại lý và đối tác mới</li>
                <li>- Góp ý chất lượng dịch vụ và hậu mãi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-4 md:px-8 mt-20">
        <div className="text-center mb-12 md:mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Showroom Locator</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Hệ Thống Cửa Hàng King Man</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Chọn showroom để xem địa chỉ chi tiết và bản đồ. Bạn có thể ghé cửa hàng gần nhất để trải nghiệm sản phẩm trực tiếp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-7 lg:gap-10 items-start">
          <div className="space-y-4">
            {stores.map((store, index) => {
              const isActive = index === activeStore;

              return (
                <button
                  type="button"
                  key={store.name}
                  onClick={() => setActiveStore(index)}
                  className={`w-full text-left rounded-2xl p-5 md:p-6 border transition-all ${
                    isActive
                      ? 'bg-black text-white border-black shadow-[0_16px_28px_rgba(15,23,42,0.25)]'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <h3 className="text-lg font-bold mb-3">{store.name}</h3>
                  <div className={`flex items-start text-sm mb-3 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                    <MapPin className={`w-4 h-4 mt-0.5 mr-2 shrink-0 ${isActive ? 'text-slate-300' : 'text-slate-400'}`} />
                    <span>{store.address}</span>
                  </div>
                  <div className={`flex items-center text-sm ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                    <Phone className={`w-4 h-4 mr-2 shrink-0 ${isActive ? 'text-slate-300' : 'text-slate-400'}`} />
                    <span>{store.phone}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[28px] overflow-hidden border border-slate-200 shadow-[0_12px_34px_rgba(2,6,23,0.12)] min-h-[430px] bg-slate-100 relative">
            <iframe
              key={stores[activeStore].name}
              className="absolute inset-0 w-full h-full"
              title={stores[activeStore].name}
              loading="lazy"
              referrerPolicy="no-referrer"
              src={stores[activeStore].mapUrl}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
