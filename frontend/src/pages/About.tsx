import React, { useEffect, useState } from 'react';
import '../assets/css/about.css';

// --- Mock Data (MongoDB Ready Structure) ---
interface HeritageItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  align: 'left' | 'right';
}

interface TimelineEvent {
  _id: string;
  year: string;
  title: string;
  description: string;
}

interface ProcessStep {
  _id: string;
  stepNumber: string;
  title: string;
  description: string;
}

interface MasterpieceHotspot {
  _id: string;
  x: number;
  y: number;
  title: string;
  material: string;
  description: string;
}

interface Collaboration {
  _id: string;
  partnerName: string;
  description: string;
  logoUrl: string;
}

const mockHeritage: HeritageItem[] = [
  {
    _id: 'h1',
    title: 'Khởi Nguồn Đam Mê',
    description: 'Bắt đầu từ một xưởng may nhỏ tại Ý, Aurelia Home mang trong mình khát vọng định nghĩa lại sự sang trọng của thời trang nam giới thông qua những đường cắt may tỉ mỉ nhất.',
    imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2000&auto=format&fit=crop',
    year: 2026,
    align: 'left'
  },
  {
    _id: 'h2',
    title: 'Nghệ Thuật Bespoke',
    description: 'Mỗi bộ trang phục không chỉ là vải vóc, mà là một tác phẩm nghệ thuật độc bản, được đo ni đóng giày cho từng cá nhân, tôn vinh khí chất người mặc.',
    imageUrl: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2000&auto=format&fit=crop',
    year: 2027,
    align: 'right'
  }
];

const mockTimeline: TimelineEvent[] = [
  {
    _id: 't1',
    year: '2026',
    title: 'Viên Gạch Đầu Tiên',
    description: 'Thành lập studio thiết kế đầu tiên tại Milan, tập trung vào nghiên cứu form dáng chuẩn mực cho quý ông châu Á.'
  },
  {
    _id: 't2',
    year: '2028',
    title: 'Vươn Tầm Quốc Tế',
    description: 'Khai trương Flagship Store tại Paris và Tokyo, đánh dấu bước chuyển mình thành thương hiệu xa xỉ toàn cầu.'
  },
  {
    _id: 't3',
    year: '2030',
    title: 'Kỷ Nguyên Haute Couture',
    description: 'Ra mắt bộ sưu tập may đo cao cấp (Haute Couture) dành riêng cho nam giới, trình diễn tại Tuần lễ Thời trang Paris.'
  },
  {
    _id: 't4',
    year: '2032',
    title: 'Phát Triển Bền Vững',
    description: 'Chuyển đổi 100% nguồn nguyên liệu sang các nhà cung cấp đạt chuẩn sinh thái và đạo đức toàn cầu.'
  }
];

const mockProcess: ProcessStep[] = [
  {
    _id: 'p1',
    stepNumber: '01',
    title: 'Lắng Nghe & Thấu Hiểu',
    description: 'Cuộc trò chuyện riêng tư cùng nghệ nhân để thấu hiểu phong cách, sở thích và số đo độc bản của bạn.'
  },
  {
    _id: 'p2',
    stepNumber: '02',
    title: 'Bản Phác Thảo Độc Bản',
    description: 'Lựa chọn từ hơn 500 mẫu vải thượng hạng. Mỗi đường cắt đều được tính toán bằng tỷ lệ vàng.'
  },
  {
    _id: 'p3',
    stepNumber: '03',
    title: 'Tinh Chỉnh Hoàn Hảo',
    description: 'Trải qua 3 lần thử đồ (fitting) khắt khe, đảm bảo bộ trang phục ôm trọn từng chuyển động cơ thể.'
  }
];

const mockHotspots: MasterpieceHotspot[] = [
  {
    _id: 'hs1',
    x: 35,
    y: 25,
    title: 'Ve Áo Peak Lapel',
    material: 'Lụa Taffeta Ý',
    description: 'Được khâu tay hoàn toàn với 120 mũi kim, tạo độ cong hoàn hảo và sự sang trọng tuyệt đối.'
  },
  {
    _id: 'hs2',
    x: 60,
    y: 55,
    title: 'Khuy Áo Sừng Trâu',
    material: 'Sừng Trâu Tự Nhiên',
    description: 'Được đánh bóng thủ công, mỗi chiếc khuy mang một vân độc bản không thể trộn lẫn.'
  },
  {
    _id: 'hs3',
    x: 45,
    y: 75,
    title: 'Chất Liệu Chủ Đạo',
    material: 'Len Merino Super 150s',
    description: 'Sợi len siêu mịn nhập khẩu từ Úc, mang lại cảm giác nhẹ tựa lông hồng nhưng giữ phom dáng hoàn hảo.'
  }
];

const mockCollabs: Collaboration[] = [
  {
    _id: 'c1',
    partnerName: 'Ermenegildo Zegna',
    description: 'Đối tác cung cấp nguồn vải len cao cấp độc quyền cho các bộ sưu tập giới hạn.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ermenegildo_Zegna_Logo.svg/2560px-Ermenegildo_Zegna_Logo.svg.png'
  },
  {
    _id: 'c2',
    partnerName: 'Loro Piana',
    description: 'Đồng sáng tạo dòng sản phẩm áo khoác Cashmere siêu nhẹ mùa Đông.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Loro_Piana_logo.svg/2560px-Loro_Piana_logo.svg.png'
  },
  {
    _id: 'c3',
    partnerName: 'Vibram',
    description: 'Phát triển đế giày da công thái học, kết hợp giữa nét cổ điển và sự thoải mái.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vibram_logo.svg/2560px-Vibram_logo.svg.png'
  },
  {
    _id: 'c4',
    partnerName: 'Leica Camera',
    description: 'Bộ sưu tập phụ kiện da thuộc phiên bản giới hạn dành cho nhiếp ảnh gia.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Leica_Camera_logo.svg/2560px-Leica_Camera_logo.svg.png'
  },
  {
    _id: 'c5',
    partnerName: 'Aston Martin',
    description: 'Thiết kế trang phục lái xe (Driving Wear) lấy cảm hứng từ những siêu xe huyền thoại.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Aston_Martin_logo.svg/2560px-Aston_Martin_logo.svg.png'
  },
  {
    _id: 'c6',
    partnerName: 'Baccarat',
    description: 'Chế tác khuy áo pha lê độc bản cho dòng sản phẩm Tuxedo dạ tiệc cao cấp.',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Baccarat_logo.svg/2560px-Baccarat_logo.svg.png'
  }
];

export default function About() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Intersection Observer for fade-in-up animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-blended-light min-h-screen text-slate-800 font-sans overflow-hidden relative">
      {/* Noise Overlay for Editorial Print Feel */}
      <div className="noise-overlay"></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none"></div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full border border-slate-300/40 floating-slow pointer-events-none z-0"></div>
      <div className="absolute top-3/4 right-10 w-96 h-96 rounded-full border border-slate-300/30 floating-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
      
      {/* 1. Hero Section (Khởi nguyên) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0 opacity-30 grayscale"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/30 z-0" />

        <div className="relative z-10 text-center px-4 fade-in-up visible flex flex-col items-center">
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-serif font-bold text-watermark tracking-tighter mb-0 select-none leading-none">
            AURELIA
          </h1>
          <div className="bg-slate-100/60 backdrop-blur-md px-8 py-3 rounded-full border border-slate-200 shadow-sm mt-[-1rem] md:mt-[-2rem] mb-8 z-10">
            <h2 className="text-xl md:text-3xl text-slate-800 font-serif italic tracking-wide m-0">
              Vũ Trụ Độc Bản
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium tracking-[0.3em] uppercase max-w-2xl mx-auto">
            Nơi nghệ thuật cắt may giao thoa cùng di sản vượt thời gian
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-60">
          <span className="text-xs tracking-[0.2em] text-slate-500 uppercase mb-4" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <div className="w-px h-12 bg-slate-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-600 animate-[scroll-down_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Marquee Text-Roll */}
        <div className="absolute bottom-0 w-full border-t border-slate-200/40 py-4 bg-slate-100/40 backdrop-blur-md z-10">
          <div className="marquee-container">
            <div className="marquee-content text-slate-400 font-medium tracking-[0.2em] text-sm">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="mx-4">EST. 2026 &bull; ĐỘC BẢN &bull; NGHỆ THUẬT CẮT MAY &bull;</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Founder Quote */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center fade-in-up relative z-10">
        <p className="text-3xl md:text-5xl font-serif italic text-slate-700 leading-relaxed mb-10">
          "Sự sang trọng thực sự không nằm ở chiếc logo hào nhoáng, mà ở cảm giác tĩnh tại khi lớp lụa thượng hạng chạm vào làn da bạn."
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-slate-300 p-1">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover rounded-full grayscale" referrerPolicy="no-referrer" />
          </div>
          <h4 className="text-sm font-bold tracking-widest uppercase text-slate-900">Aurelius</h4>
          <p className="text-xs text-slate-500 tracking-widest uppercase mt-1">Founder & Creative Director</p>
        </div>
      </section>

      {/* 3. Lịch sử Kế thừa (The Heritage) */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32 fade-in-up">
          <h2 className="text-4xl font-serif text-slate-900 mb-6">Lịch Sử Kế Thừa</h2>
          <div className="w-16 h-px bg-slate-400 mx-auto"></div>
        </div>

        <div className="space-y-40">
          {mockHeritage.map((item) => (
            <div key={item._id} className={`flex flex-col md:flex-row items-center gap-16 ${item.align === 'right' ? 'md:flex-row-reverse' : ''} fade-in-up`}>
              <div className="w-full md:w-1/2 relative img-hover-zoom rounded-2xl">
                {/* Asymmetrical decorative background */}
                <div className={`absolute inset-0 border border-slate-300 rounded-2xl ${item.align === 'left' ? 'translate-x-4 translate-y-4' : '-translate-x-4 translate-y-4'}`}></div>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-xl shadow-slate-200/50 grayscale-[20%]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-6 px-4 md:px-8">
                <span className="text-slate-400 font-serif text-2xl italic">{item.year}</span>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Hành Trình Phát Triển (The Evolution Timeline) */}
      <section className="py-32 bg-slate-100/40 backdrop-blur-md border-y border-slate-200/50 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-24 fade-in-up">
            <h2 className="text-4xl font-serif text-slate-900 mb-6">Hành Trình Phát Triển</h2>
            <p className="text-slate-500 font-light text-lg">Những cột mốc định hình thương hiệu.</p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent hidden md:block"></div>
            
            <div className="space-y-24">
              {mockTimeline.map((event, index) => (
                <div key={event._id} className={`timeline-item relative flex flex-col md:flex-row items-center justify-between fade-in-up ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-100 rounded-full border-2 border-slate-400 z-10 hidden md:block timeline-dot"></div>
                  
                  <div className="w-full md:w-5/12"></div> {/* Empty space for alignment */}
                  
                  <div className={`w-full md:w-5/12 glass-panel-light p-8 rounded-2xl relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right text-left'}`}>
                    <span className="text-5xl font-serif font-bold text-outline-gray opacity-40 absolute top-4 right-6">{event.year}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">{event.title}</h3>
                    <p className="text-slate-600 font-light leading-relaxed relative z-10">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Nghệ Thuật Chế Tác (The Process) */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 fade-in-up">
          <h2 className="text-4xl font-serif text-slate-900 mb-6">Nghệ Thuật Chế Tác</h2>
          <div className="w-16 h-px bg-slate-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {mockProcess.map((step) => (
            <div key={step._id} className="relative fade-in-up group p-6 border border-transparent hover:border-slate-200 rounded-2xl transition-colors duration-500">
              <div className="text-8xl font-serif font-light text-slate-100 absolute -top-6 -left-2 z-0 transition-transform duration-500 group-hover:-translate-y-2">
                {step.stepNumber}
              </div>
              <div className="relative z-10 pt-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Đỉnh cao Chế tác (Masterpieces) */}
      <section className="py-32 relative bg-slate-50 border-y border-slate-200/50 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-4xl font-serif text-slate-900 mb-6">Đỉnh Cao Chế Tác</h2>
            <p className="text-slate-500 font-light text-lg">Chạm vào từng chi tiết tinh xảo nhất.</p>
          </div>

          <div className="relative max-w-5xl mx-auto fade-in-up">
            <img 
              src="https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?q=80&w=2000&auto=format&fit=crop" 
              alt="Masterpiece Suit" 
              className="w-full rounded-2xl shadow-xl shadow-slate-200/50 grayscale-[10%]"
              referrerPolicy="no-referrer"
            />
            
            {/* Interactive Hotspots */}
            {mockHotspots.map((hotspot) => (
              <div 
                key={hotspot._id}
                className="absolute"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onMouseEnter={() => setActiveHotspot(hotspot._id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Hotspot Dot */}
                <div className="relative flex items-center justify-center cursor-pointer group">
                  <div className="hotspot-pulse absolute w-8 h-8 bg-slate-800 rounded-full opacity-60"></div>
                  <div className="relative w-3 h-3 bg-slate-100 border-2 border-slate-800 rounded-full z-10 transition-transform group-hover:scale-125"></div>
                </div>

                {/* Info Panel (Light Glassmorphism) */}
                <div 
                  className={`absolute left-10 top-1/2 -translate-y-1/2 w-72 p-5 glass-panel-light rounded-2xl transition-all duration-500 z-20 ${
                    activeHotspot === hotspot._id ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'
                  }`}
                >
                  <h4 className="font-bold text-slate-900 text-base mb-1">{hotspot.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">{hotspot.material}</p>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">{hotspot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Vòng tròn Hợp tác (Aurelia Collaborations) */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 fade-in-up">
          <h2 className="text-4xl font-serif text-slate-900 mb-6">Đối Tác Toàn Cầu</h2>
          <div className="w-16 h-px bg-slate-400 mx-auto mb-8"></div>
          <p className="text-slate-500 font-light text-lg max-w-2xl mx-auto">
            Sự kết hợp hoàn hảo giữa Aurelia Home và những biểu tượng di sản thế giới, tạo nên những kiệt tác vượt thời gian.
          </p>
        </div>

        {/* Featured Collaboration */}
        <div className="mb-16 bg-slate-100 border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col md:flex-row fade-in-up">
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ermenegildo_Zegna_Logo.svg/2560px-Ermenegildo_Zegna_Logo.svg.png" alt="Zegna" className="w-48 mb-8 opacity-80" referrerPolicy="no-referrer" />
            <h3 className="text-2xl font-serif text-slate-900 mb-4">Aurelia x Zegna</h3>
            <p className="text-slate-600 font-light leading-relaxed">
              Bộ sưu tập giới hạn sử dụng 100% chất liệu len Trofeo độc quyền từ nhà máy dệt Zegna tại Trivero, Ý. Một bản giao hưởng của nghệ thuật dệt may và thiết kế đương đại.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-auto img-hover-zoom">
            <img src="https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=1000&auto=format&fit=crop" alt="Fabric" className="w-full h-full object-cover grayscale-[30%]" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* Grid Collaborations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCollabs.slice(1).map((collab) => (
            <div key={collab._id} className="glass-panel-light p-10 rounded-3xl fade-in-up hover:-translate-y-3 transition-transform duration-500">
              <div className="h-16 flex items-center justify-center mb-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <img src={collab.logoUrl} alt={collab.partnerName} className="max-h-full max-w-[140px] object-contain" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-3">{collab.partnerName}</h3>
              <p className="text-sm text-slate-600 text-center leading-relaxed font-light">
                {collab.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Triết lý Bền vững (Sustainable Elegance) */}
      <section className="relative py-40 overflow-hidden z-10">
        <div 
          className="absolute inset-0 z-0 grayscale-[50%]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-slate-900/60 z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-end">
          <div className="w-full md:w-1/2 lg:w-5/12 glass-panel-light !bg-slate-100/85 p-12 rounded-3xl fade-in-up">
            <h2 className="text-3xl font-serif text-slate-900 mb-6">Sự Thanh Lịch Bền Vững</h2>
            <div className="w-12 h-px bg-slate-400 mb-6"></div>
            <p className="text-slate-700 font-light leading-relaxed mb-6">
              Tại Aurelia Home, chúng tôi tin rằng sự xa xỉ thực sự không bao giờ làm tổn hại đến hành tinh. 
              Mỗi mét vải lụa, mỗi cuộn len đều được truy xuất nguồn gốc rõ ràng từ các trang trại sinh thái tại Úc và Ý.
            </p>
            <p className="text-slate-700 font-light leading-relaxed">
              Cam kết giảm thiểu 80% lượng nước thải trong quá trình nhuộm vải vào năm 2030, chúng tôi đang viết lại định nghĩa về thời trang cao cấp: Đẹp cho bạn, Tốt cho Trái Đất.
            </p>
          </div>
        </div>
      </section>

      {/* Logo Loop Footer */}
      <div className="py-12 bg-slate-100 border-t border-slate-200 overflow-hidden relative z-10">
        <div className="marquee-container">
          <div className="logo-loop-content flex items-center opacity-10">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="mx-16 text-3xl font-serif font-bold text-slate-900">
                AURELIA HOME
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}