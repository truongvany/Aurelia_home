import React, { useEffect } from 'react';
import { Award, Feather, PenTool, ChevronDown, CheckCircle } from 'lucide-react';
import '../assets/css/about.css'; // Keep if we need custom scrollbar or animations

// --- Mock Data ---
interface HeritageItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  align: 'left' | 'right';
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface ProcessStep {
  id: string;
  icon: any;
  title: string;
  description: string;
}

const mockHeritage: HeritageItem[] = [
  {
    id: 'h1',
    title: 'Khởi Nguồn Đam Mê',
    description: 'Bắt đầu từ một xưởng may nhỏ tại Ý vào năm 1985, Aurelia Home mang trong mình khát vọng định nghĩa lại sự sang trọng của thời trang nam giới. Chúng tôi tin rằng mỗi đường kim mũi chỉ không chỉ là kỹ thuật, mà là ngôn ngữ của sự tinh tế và đẳng cấp.',
    imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2000&auto=format&fit=crop',
    year: 1985,
    align: 'left'
  },
  {
    id: 'h2',
    title: 'Nghệ Thuật Bespoke',
    description: 'Tại Aurelia, Bespoke không chỉ là may đo, đó là hành trình khám phá bản ngã. Mỗi bộ trang phục là một tác phẩm nghệ thuật độc bản, được đo ni đóng giày để tôn vinh khí chất và câu chuyện riêng của người mặc.',
    imageUrl: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2000&auto=format&fit=crop',
    year: 2010,
    align: 'right'
  }
];

const mockTimeline: TimelineEvent[] = [
  {
    id: 't1',
    year: '1985',
    title: 'Viên Gạch Đầu Tiên',
    description: 'Thành lập studio thiết kế đầu tiên tại Milan, tập trung vào nghiên cứu form dáng chuẩn mực.'
  },
  {
    id: 't2',
    year: '1998',
    title: 'Vươn Tầm Quốc Tế',
    description: 'Khai trương Flagship Store tại Paris và Tokyo, đánh dấu bước chuyển mình toàn cầu.'
  },
  {
    id: 't3',
    year: '2015',
    title: 'Kỷ Nguyên Mới',
    description: 'Ra mắt bộ sưu tập Haute Couture dành riêng cho nam giới tại Tuần lễ Thời trang Paris.'
  },
  {
    id: 't4',
    year: '2024',
    title: 'Phát Triển Bền Vững',
    description: 'Cam kết 100% nguồn nguyên liệu đạt chuẩn sinh thái và đạo đức toàn cầu.'
  }
];

const mockProcess: ProcessStep[] = [
  {
    id: 'p1',
    icon: Feather,
    title: 'Lắng Nghe & Thấu Hiểu',
    description: 'Cuộc trò chuyện riêng tư cùng nghệ nhân để thấu hiểu phong cách và số đo độc bản của bạn.'
  },
  {
    id: 'p2',
    icon: PenTool,
    title: 'Phác Thảo & Chế Tác',
    description: 'Lựa chọn từ hơn 500 mẫu vải thượng hạng. Mỗi đường cắt đều được tính toán tỉ mỉ.'
  },
  {
    id: 'p3',
    icon: CheckCircle,
    title: 'Tinh Chỉnh Hoàn Hảo',
    description: 'Trải qua các lần thử đồ (fitting) khắt khe, đảm bảo trang phục ôm trọn từng chuyển động.'
  }
];

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <span className="block text-[#e2c78a] text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-4">
            Since 1985
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-sm">
            AURELIA HOME
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed">
            Nơi di sản may đo Ý gặp gỡ phong cách sống đương đại. <br className="hidden md:block"/>
            Chúng tôi kiến tạo sự lịch lãm trường tồn.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce opacity-70">
           <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="w-full h-96 overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1520975698513-c1aaeca1264e?q=80&w=2000&auto=format&fit=crop"
              alt="King Man thương hiệu thời trang nam"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Về King Man</h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
              King Man là cửa hàng chuyên cung cấp thời trang nam cao cấp, mang đến phong cách hiện đại, nam tính và dễ ứng dụng trong cuộc sống hằng ngày.
            </p>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
              Chúng tôi tập trung vào chất lượng sản phẩm, từ chất liệu đến form dáng, giúp khách hàng luôn tự tin và thoải mái khi mặc.
            </p>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
              Với đa dạng sản phẩm như áo, quần, phụ kiện và giày dép, King Man hướng đến việc xây dựng phong cách riêng cho mỗi khách hàng.
            </p>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với dịch vụ tận tâm và sản phẩm chất lượng.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Heritage Section */}
      <section className="py-12 md:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">Di Sản & Câu Chuyện</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Hành trình 40 năm chinh phục những chuẩn mực khắt khe nhất của thời trang nam giới.</p>
          </div>

          <div className="space-y-24">
            {mockHeritage.map((item) => (
              <div key={item.id} className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 relative group">
                  <div className="absolute inset-0 bg-[#C5A059] transform translate-x-3 translate-y-3 rounded-lg transition-transform md:group-hover:translate-x-5 md:group-hover:translate-y-5"></div>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="relative w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute -top-6 -left-6 bg-white p-4 shadow-xl rounded-lg border border-slate-100 hidden md:block">
                     <span className="text-4xl font-serif font-bold text-slate-900">{item.year}</span>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-6">
                  <h3 className="text-3xl font-bold text-slate-900 font-serif">{item.title}</h3>
                  <div className="w-20 h-1 bg-[#C5A059]"></div>
                  <p className="text-slate-600 leading-loose text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Timeline */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-slate-900 z-0"></div>
         <div className="relative z-10 container mx-auto text-white">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
               <h2 className="text-3xl md:text-4xl font-serif mb-4">Cột Mốc Lịch Sử</h2>
               <div className="w-full max-w-3xl mx-auto h-px bg-slate-700 mt-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {mockTimeline.map((event, index) => (
                  <div key={event.id} className="relative p-6 border-l-2 border-[#C5A059] bg-slate-800/50 backdrop-blur-sm rounded-r-lg hover:bg-slate-800 transition-colors animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000" style={{ transitionDelay: `${index * 150}ms` }}>
                     <span className="text-4xl font-serif font-bold text-[#C5A059] opacity-40 absolute top-4 right-4">{event.year}</span>
                     <h3 className="text-xl font-bold mb-3 mt-2">{event.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">{event.description}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Process */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Quy Trình Chế Tác</h2>
            <p className="text-slate-500">Sự tỉ mỉ tạo nên đẳng cấp.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {mockProcess.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="group p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform group-hover:border-[#C5A059]">
                    <Icon className="h-6 w-6 text-slate-700 group-hover:text-[#C5A059] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Contact Banner */}
      <section className="py-20 bg-[#C5A059] text-white">
         <div className="container mx-auto px-6 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Trải Nghiệm Aurelia Home</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
               Đặt lịch hẹn riêng tại showroom của chúng tôi để được tư vấn và trải nghiệm dịch vụ may đo bespoke đẳng cấp.
            </p>
            <button className="px-8 py-3 bg-white text-[#C5A059] font-bold rounded-lg shadow-lg hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
               Liên Hệ Ngay
            </button>
         </div>
      </section>

      <div className="h-0"></div>
    </div>
  );
}