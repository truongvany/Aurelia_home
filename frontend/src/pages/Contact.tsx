import React, { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, PhoneCall } from 'lucide-react';
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
    }
  };

  return (
    <div className="careers-page min-h-screen text-slate-900 font-sans overflow-hidden">
      <section className="relative h-[800px] w-full flex flex-col justify-end hero-careers-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-[#090A0D]/55 to-transparent z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pb-16 fade-in-up">
          <span className="text-[#C5A059] tracking-[0.6em] font-bold text-[10px] mb-8 block uppercase">ENQUIRIES & PARTNERSHIPS</span>
          <h1 className="font-serif text-7xl md:text-9xl text-white mb-10 leading-none tracking-tight">
            ELEGANCE <br />
            <span className="text-[#F0E7D6] italic font-light">Redefined.</span>
          </h1>
          <p className="text-white/75 max-w-2xl mx-auto font-light leading-relaxed text-base md:text-lg tracking-wide">
            Crafting the future of masculine luxury. Join our network of excellence in tailoring and high-end design.
          </p>
        </div>

        <div className="relative z-10 w-full">
          <div className="marquee-contact-container py-3">
            <div className="marquee-contact-content text-[#C5A059] font-medium tracking-[0.3em] text-xs md:text-sm uppercase">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="mx-8">TUYỂN DỤNG ƯU TIÊN • PHÁT TRIỂN SỰ NGHIỆP CÙNG AURELIA • MÔI TRƯỜNG THỜI TRANG CHUYÊN NGHIỆP •</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f6] py-20 md:py-24 px-6 md:px-10 border-y border-[#e7e7e7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 fade-in-up">
          <div className="space-y-5">
            <span className="text-[#C5A059] text-[10px] tracking-[0.28em] font-semibold uppercase">Trụ sở tuyển dụng</span>
            <p className="text-slate-800 font-medium leading-relaxed">Showroom Quận 1, TP.HCM<br />Làm việc trực tiếp và hybrid</p>
          </div>
          <div className="space-y-5">
            <span className="text-[#C5A059] text-[10px] tracking-[0.28em] font-semibold uppercase">Hotline tuyển dụng</span>
            <p className="text-slate-900 font-serif text-3xl tracking-tight">0901 234 567</p>
            <p className="text-slate-500 text-[10px] tracking-[0.25em] uppercase">Thứ 2 - Thứ 7 | 09:00 - 18:00</p>
          </div>
          <div className="space-y-5">
            <span className="text-[#C5A059] text-[10px] tracking-[0.28em] font-semibold uppercase">Kênh nhận CV</span>
            <p className="text-slate-800 font-medium">Gmail: hiring@aureliahome.vn</p>
            <p className="text-slate-800 font-medium">Zalo: 0901 234 567</p>
          </div>
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

                <h3 className="font-serif text-3xl md:text-4xl text-[#0F0F0F] mb-10 tracking-tight uppercase">Official Application</h3>

                <form onSubmit={handleSubmit} className="space-y-9 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-deep-wrapper">
                      <label htmlFor="fullName" className="recruitment-label">Họ và tên</label>
                      <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyen Van A" className="application-input" required />
                    </div>

                    <div className="input-deep-wrapper">
                      <label htmlFor="phone" className="recruitment-label">Số điện thoại liên hệ</label>
                      <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" className="application-input" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-deep-wrapper">
                      <label htmlFor="dob" className="recruitment-label">Ngày tháng năm sinh</label>
                      <input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="application-input" required />
                    </div>

                    <div className="input-deep-wrapper">
                      <label htmlFor="gender" className="recruitment-label">Giới tính</label>
                      <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="application-input appearance-none" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-deep-wrapper">
                      <label htmlFor="position" className="recruitment-label">Vị trí tuyển dụng</label>
                      <select id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="application-input appearance-none" required>
                        <option value="Retail Stylist">Retail Stylist</option>
                        <option value="Visual Merchandiser">Visual Merchandiser</option>
                        <option value="Customer Care Assistant">Customer Care Assistant</option>
                        <option value="Kho vận / Inventory Assistant">Kho vận / Inventory Assistant</option>
                      </select>
                    </div>

                    <div>
                      <label className="recruitment-label mb-3 block">Employment Type</label>
                      <div className="flex flex-wrap gap-7 items-center pt-2">
                        <label className="radio-inline">
                          <input type="radio" name="shift" value="Part-time" checked={shift === 'Part-time'} onChange={() => setShift('Part-time')} />
                          <span>Part-time</span>
                        </label>
                        <label className="radio-inline">
                          <input type="radio" name="shift" value="Full-time" checked={shift === 'Full-time'} onChange={() => setShift('Full-time')} />
                          <span>Full-time</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="recruitment-label mb-3 block">Preferred Communication</label>
                      <div className="flex flex-wrap gap-7 items-center pt-2">
                        <label className="radio-inline">
                          <input type="radio" name="cvChannel" value="Gmail" checked={cvChannel === 'Gmail'} onChange={() => setCvChannel('Gmail')} />
                          <span>Gmail</span>
                        </label>
                        <label className="radio-inline">
                          <input type="radio" name="cvChannel" value="Zalo" checked={cvChannel === 'Zalo'} onChange={() => setCvChannel('Zalo')} />
                          <span>Zalo</span>
                        </label>
                      </div>
                    </div>

                    <div className="input-deep-wrapper">
                      <label htmlFor="cvContact" className="recruitment-label">{cvChannel === 'Gmail' ? 'Gmail nhận CV' : 'Số/Zalo nhận CV'}</label>
                      <input
                        id="cvContact"
                        type="text"
                        value={cvContact}
                        onChange={(e) => setCvContact(e.target.value)}
                        placeholder={cvChannel === 'Gmail' ? 'tenban@gmail.com' : '09xx xxx xxx'}
                        className="application-input"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="group recruitment-submit">
                    <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Submit Dossier'}</span>
                    <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isSubmitting ? 'translate-x-3 opacity-0' : 'group-hover:translate-x-2'}`} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EFECE6] py-12 px-6 md:px-10 border-y border-[#D9D2C5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h4 className="font-serif text-3xl text-[#0F0F0F] tracking-tight text-center md:text-left">Cần hỗ trợ thêm về tuyển dụng?</h4>
          <a href="tel:0901234567" className="inline-flex items-center gap-3 px-9 py-4 bg-[#111111] text-[#F2EDE3] uppercase text-[10px] tracking-[0.34em] font-semibold hover:bg-[#C5A059] hover:text-[#111111] transition-colors">
            <PhoneCall className="h-4 w-4" />
            Liên hệ ngay
          </a>
        </div>
      </section>
    </div>
  );
}
