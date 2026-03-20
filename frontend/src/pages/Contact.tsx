import React, { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, PhoneCall, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import '../assets/css/Contact.css';

interface JobOpening {
  _id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  meta: string;
  status: string;
}

const openings: JobOpening[] = [
  {
    _id: 'j1',
    icon: BriefcaseBusiness,
    title: 'Retail Stylist',
    desc: 'Tư vấn phong cách tại showroom, tập trung trải nghiệm khách hàng cao cấp.',
    meta: 'TP. HCM • Full-time',
    status: 'Đang tuyển'
  },
  {
    _id: 'j2',
    icon: Building2,
    title: 'Visual Merchandiser',
    desc: 'Triển khai ngôn ngữ trưng bày và tiêu chuẩn visual theo mùa bộ sưu tập.',
    meta: 'TP. HCM • Part-time',
    status: 'Đang tuyển'
  },
  {
    _id: 'j3',
    icon: Clock3,
    title: 'Customer Care Assistant',
    desc: 'Hỗ trợ hậu mãi, xử lý yêu cầu khách hàng qua hotline và nền tảng số.',
    meta: 'Hybrid • Full-time',
    status: 'Ưu tiên'
  }
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Nam');
  const [position, setPosition] = useState('Retail Stylist');
  const [shift, setShift] = useState<'Part-time' | 'Full-time'>('Full-time');
  const [cvChannel, setCvChannel] = useState<'Gmail' | 'Zalo'>('Gmail');
  const [cvContact, setCvContact] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !dateOfBirth || !gender || !position || !shift || !cvChannel || !phone.trim()) {
      alert('Vui lòng điền đầy đủ thông tin ứng tuyển.');
      return;
    }

    if (!cvContact.trim()) {
      alert(`Vui lòng nhập thông tin ${cvChannel} để nhận CV.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitContact({
        name: fullName.trim(),
        email: cvChannel === 'Gmail' ? cvContact.trim() : 'ungvien.zalo@aurelia.local',
        subject: `[Ứng tuyển] ${position} - ${shift}`,
        message: [
          `Họ và tên: ${fullName.trim()}`,
          `Ngày tháng năm sinh: ${dateOfBirth}`,
          `Giới tính: ${gender}`,
          `Vị trí tuyển dụng: ${position}`,
          `Ca làm: ${shift}`,
          `Gửi CV qua: ${cvChannel}`,
          `Thông tin liên hệ CV: ${cvContact.trim()}`,
          `Số điện thoại liên hệ: ${phone.trim()}`
        ].join('\n')
      });

      alert('Hồ sơ ứng tuyển đã được ghi nhận. Bộ phận tuyển dụng sẽ liên hệ sớm nhất.');
      setFullName('');
      setDateOfBirth('');
      setGender('Nam');
      setPosition('Retail Stylist');
      setShift('Full-time');
      setCvChannel('Gmail');
      setCvContact('');
      setPhone('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể gửi hồ sơ lúc này. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      alert('Yêu cầu của ngài đã được tiếp nhận. Concierge của chúng tôi sẽ liên hệ ngay lập tức.');
    }
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
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-20 text-center fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-800">
            Phòng Chờ <span className="text-[#C5A059] italic font-light">Concierge</span>
          </h1>
          <div className="w-24 h-px bg-[#C5A059] mx-auto mb-8"></div>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light tracking-wide">
            Không gian kỹ thuật số dành riêng cho những yêu cầu độc bản, lịch hẹn thử đồ riêng tư và đặc quyền hỗ trợ từ đội ngũ chuyên gia của chúng tôi.
          </p>
        </div>
      </section>

      <section className="bg-[#06080c] py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 md:mb-20 fade-in-up">
            <span className="text-[#C5A059] text-[10px] tracking-[0.38em] uppercase font-semibold">Careers At Aurelia</span>
            <h2 className="font-serif text-4xl md:text-6xl text-[#F4EEE3] mt-4 tracking-tight">
              Tuyển Dụng <span className="italic font-light">& Việc Làm</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              {openings.map((item, idx) => (
                <div key={item._id} className="job-card p-6 md:p-8 group fade-in-up" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start justify-between mb-5 gap-4">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-[#C5A059]" />
                      <h3 className="font-serif text-2xl text-[#F4EEE3] tracking-tight">{item.title}</h3>
                    </div>
                    <span className="job-status">{item.status}</span>
                  </div>
                  <p className="text-[#D7D2C9]/75 text-sm leading-relaxed mb-6">{item.desc}</p>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#A99D84]">{item.meta}</p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 fade-in-up" style={{ transitionDelay: '200ms' }}>
              <div className="application-panel p-8 sm:p-12 md:p-16 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C5A059]/10 blur-3xl pointer-events-none"></div>

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
    </section>

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
