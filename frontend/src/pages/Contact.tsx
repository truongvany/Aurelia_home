import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import '../assets/css/Contact.css';

interface ServicePortal {
  _id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  sub: string;
  hasStatus?: boolean;
}

const portals: ServicePortal[] = [
  { _id: 'p1', icon: Phone, title: "Direct Line", desc: "+1 (800) 123-4567", sub: "Mon - Fri, 09:00 - 18:00 EST", hasStatus: true },
  { _id: 'p2', icon: Mail, title: "Thư Tín Kỹ Thuật Số", desc: "concierge@aurelia.com", sub: "Phản hồi trong vòng 2 giờ" },
  { _id: 'p3', icon: MapPin, title: "Flagship Lounge", desc: "125 Fifth Avenue, NY", sub: "Chỉ tiếp đón qua lịch hẹn" },
  { _id: 'p4', icon: Clock, title: "Đặc Quyền 24/7", desc: "Private Concierge", sub: "Dành riêng cho thành viên VIP" }
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Yêu cầu của ngài đã được tiếp nhận. Concierge của chúng tôi sẽ liên hệ ngay lập tức.');
    }, 1500);
  };

  return (
    <div className="concierge-bg min-h-screen text-slate-900 font-sans overflow-hidden">
      
      {/* Hero Section (Above the fold) */}
      <section className="relative h-[40vh] min-h-[400px] flex flex-col justify-end hero-macro-bg">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0"></div>
        
        {/* Interactive Hotspot on a mock logo for the hero */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer">
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-[0.3em] uppercase text-center">Aurelia Home</h2>
            <div className="absolute -top-4 -right-8 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="w-8 h-8 animate-spin-slow" />
            </div>
          </div>
          <p className="text-[#C5A059] text-sm tracking-[0.4em] uppercase mt-4 opacity-80">Digital Concierge</p>
        </div>

        <div className="relative z-10 w-full">
          <div className="marquee-contact-container py-3">
            <div className="marquee-contact-content text-[#C5A059] font-medium tracking-[0.3em] text-xs md:text-sm uppercase">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="mx-8">DỊCH VỤ CONCIERGE CHỈ DÀNH CHO BẠN &bull; LIÊN HỆ ĐỘC QUYỀN &bull; CHẮC CHẮN SỰ HOÀN HẢO &bull;</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-20 text-center fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-800">
            Phòng Chờ <span className="text-[#C5A059] italic font-light">Concierge</span>
          </h1>
          <div className="w-24 h-px bg-[#C5A059] mx-auto mb-8"></div>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light tracking-wide">
            Không gian kỹ thuật số dành riêng cho những yêu cầu độc bản, lịch hẹn thử đồ riêng tư và đặc quyền hỗ trợ từ đội ngũ chuyên gia của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Service Portals */}
          <div className="lg:col-span-5 space-y-6">
            {portals.map((item, idx) => (
              <div 
                key={item._id}
                className="dark-glass-portal p-6 rounded-2xl flex items-center space-x-4 group fade-in-up"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-slate-800/45 border border-[#C5A059]/25 flex items-center justify-center shrink-0 group-hover:bg-slate-800 transition-colors duration-300 relative">
                  <item.icon className="h-5 w-5 gold-leaf-icon" />
                  {item.hasStatus && (
                    <div className="absolute top-0 right-0">
                      <div className="status-dot"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] mb-2">{item.title}</h3>
                  <p className="text-lg font-serif mb-1 text-white tracking-wide">{item.desc}</p>
                  <p className="text-sm text-slate-400 font-light">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: The Concierge Inquiry Form */}
          <div className="lg:col-span-7 fade-in-up" style={{ transitionDelay: '200ms' }}>
            <div className="light-glass-form p-10 md:p-14 rounded-3xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="font-serif text-3xl mb-10 text-slate-800">Gửi Yêu Cầu Độc Bản</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="input-deep-wrapper group">
                    <label htmlFor="firstName" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-4">
                      Chúng tôi nên gọi ngài là gì?
                    </label>
                    <input 
                      type="text" 
                      id="firstName"
                      required 
                      className="w-full input-deep px-6 py-4 text-slate-800 focus:outline-none placeholder-slate-300"
                      placeholder="Họ và Tên"
                    />
                  </div>
                  <div className="input-deep-wrapper group">
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-4">
                      Số điện thoại ưu tiên
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      className="w-full input-deep px-6 py-4 text-slate-800 focus:outline-none placeholder-slate-300"
                      placeholder="+84..."
                    />
                  </div>
                </div>
                
                <div className="input-deep-wrapper group">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-4">
                    Làm thế nào để chúng tôi gửi thư phản hồi?
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    required 
                    className="w-full input-deep px-6 py-4 text-slate-800 focus:outline-none placeholder-slate-300"
                    placeholder="Địa chỉ Email"
                  />
                </div>

                <div className="input-deep-wrapper group">
                  <label htmlFor="subject" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-4">
                    Chủ đề của cuộc trò chuyện này là gì?
                  </label>
                  <select 
                    id="subject" 
                    className="w-full input-deep px-6 py-4 text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option>Đặt lịch thử đồ riêng tư (Private Fitting)</option>
                    <option>Tư vấn may đo Bespoke</option>
                    <option>Yêu cầu dịch vụ VIP</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div className="input-deep-wrapper group">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 ml-4">
                    Hãy chia sẻ yêu cầu độc bản của ngài...
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    required 
                    className="w-full input-deep px-6 py-4 text-slate-800 focus:outline-none resize-none placeholder-slate-300"
                    placeholder="Chi tiết yêu cầu..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group flex items-center justify-center space-x-4 w-full px-8 py-5 bg-slate-900 text-[#C5A059] font-bold uppercase tracking-[0.2em] rounded-xl transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 disabled:opacity-70 mt-8"
                >
                  <span>{isSubmitting ? 'Đang kết nối...' : 'Gửi Yêu Cầu'}</span>
                  <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isSubmitting ? 'translate-x-4 opacity-0' : 'group-hover:translate-x-2'}`} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-12 text-center fade-in-up">
          <h2 className="font-serif text-3xl font-bold text-slate-800 mb-4">Tìm chúng tôi</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            Trải nghiệm không gian Aurelia Home tại địa điểm flagship của chúng tôi.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
          <iframe
            className="w-full h-80 sm:h-96"
            title="Aurelia Home Location"
            loading="lazy"
            referrerPolicy="no-referrer"
            src="https://maps.google.com/maps?q=125%20Fifth%20Avenue%2C%20New%20York%2C%20NY&output=embed"
          />
        </div>
      </section>
    </div>
  );
}
