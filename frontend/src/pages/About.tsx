import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Megaphone, Star, Feather, Phone, Mail, Facebook, ChevronDown, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import logoImg from '../assets/images/logo.png';

type PageType = 'story' | 'about' | 'service';

export default function About() {
  const contactRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('about');
  const [fadeOut, setFadeOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToContact = () => {
    const yOffset = -80;
    const element = contactRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePageChange = (page: PageType) => {
    if (page !== currentPage) {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentPage(page);
        setFadeOut(false);
      }, 300);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.submitContact({
        name: formData.name,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message || undefined,
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const servicePillars = [
    {
      title: 'CSKH đa kênh',
      subtitle: 'Zalo - Hotline - Email',
    },
    {
      title: 'Cam kết rõ ràng',
      subtitle: 'Minh bạch từng chính sách',
    },
    {
      title: 'Phản hồi nhanh',
      subtitle: 'Ưu tiên trải nghiệm của bạn',
    },
  ];

  const serviceCommitments = [
    {
      title: 'Liên hệ chăm sóc khách hàng dễ dàng',
      desc: 'Đội ngũ King Man luôn sẵn sàng hỗ trợ qua hotline, email và kênh social. Bạn có thể nhận tư vấn nhanh về sản phẩm, size, đơn hàng hoặc mọi thắc mắc phát sinh.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip7_56.png',
    },
    {
      title: 'Thời gian trao đổi với tổng đài viên hợp lý',
      desc: 'Quy trình xử lý được chuẩn hóa giúp giảm thời gian chờ. Chúng tôi tập trung trả lời trọng tâm, rõ ràng để bạn nhận được giải pháp ngay trong lần liên hệ đầu tiên.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip10_48.png',
    },
    {
      title: 'Văn hóa xử lý tử tế và chuyên nghiệp',
      desc: 'King Man đề cao thái độ tôn trọng, lắng nghe và đồng hành với khách hàng. Mọi phản hồi đều được ghi nhận để cải thiện trải nghiệm mỗi ngày.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip4_43.png',
    },
    {
      title: 'Thông tin cá nhân được bảo mật',
      desc: 'Dữ liệu khách hàng được quản lý theo quy trình nội bộ và chỉ phục vụ cho mục đích chăm sóc đơn hàng, hậu mãi và cá nhân hóa trải nghiệm tại King Man.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip8_78.png',
    },
    {
      title: 'Khung giờ hỗ trợ ổn định mỗi ngày',
      desc: 'Bộ phận CSKH của King Man hoạt động theo khung giờ cố định và liên tục cập nhật tình trạng đơn, giúp bạn chủ động hơn trong mọi quyết định mua sắm.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip5_43.png',
    },
    {
      title: 'Đổi trả và hoàn tiền minh bạch',
      desc: 'Chính sách đổi trả được trình bày rõ theo từng nhóm sản phẩm. Chúng tôi ưu tiên xử lý nhanh, đơn giản và đảm bảo quyền lợi cho khách hàng.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip9_71.png',
    },
    {
      title: 'Giao hàng nhanh, cập nhật chủ động',
      desc: 'Đơn hàng được đóng gói cẩn thận và cập nhật trạng thái liên tục. Bạn luôn biết đơn hàng đang ở đâu và thời điểm dự kiến nhận.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip6_18.png',
    },
    {
      title: 'Mỗi phản hồi là một cam kết cải tiến',
      desc: 'King Man xem góp ý của khách hàng là dữ liệu quan trọng để nâng cấp sản phẩm và dịch vụ. Đó là cách chúng tôi giữ trải nghiệm ngày càng tốt hơn.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip2_5.png',
    },
    {
      title: 'Đóng gói cẩn thận theo tiêu chuẩn thương hiệu',
      desc: 'Mỗi sản phẩm trước khi gửi đi đều được kiểm tra ngoại quan, đóng gói chắc chắn và đảm bảo sạch sẽ, chỉn chu đúng tiêu chuẩn King Man.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip0_28.png',
    },
    {
      title: 'Chính sách hậu mãi dành cho khách hàng thân thiết',
      desc: 'Khách hàng đồng hành lâu dài sẽ nhận được ưu tiên hỗ trợ, thông tin ưu đãi sớm và các chương trình chăm sóc cá nhân hóa theo nhu cầu.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip3_26.png',
    },
    {
      title: 'Quy trình xử lý khiếu nại rõ ràng, có theo dõi',
      desc: 'Mọi phản ánh đều được ghi nhận theo mã xử lý, có thời hạn phản hồi và cập nhật trạng thái minh bạch để bạn luôn nắm tiến trình.',
      image:
        'https://mcdn.coolmate.me/image/October2023/mceclip1_2.png',
    },
  ];

  return (
    <div className="bg-[#f8f9fc] min-h-screen text-slate-800 font-sans selection:bg-black selection:text-white pb-32">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex flex-col items-center justify-center overflow-hidden bg-black">
        <div 
          className="absolute inset-0 z-0 opacity-70"
          style={{
            backgroundImage: 'url("https://cdn.hstatic.net/files/200000887901/file/pc_3cd9fa8481c04c4d867f66c096277f98.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-0" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-12">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] font-extrabold text-white mb-6 tracking-wide leading-tight drop-shadow-[0_14px_40px_rgba(0,0,0,0.5)] uppercase" style={{ letterSpacing: '0.08em' }}>
            KING MAN
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-lg leading-relaxed drop-shadow-md">
            Tất cả những điều bạn muốn biết về King Man!
          </p>
          <button 
            onClick={scrollToContact}
            className="bg-white hover:bg-gray-100 text-black font-bold py-4 px-10 rounded-full transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs md:text-sm"
          >
            Gia Nhập Ngay <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. Floating Navigation Tabs */}
      <section className="relative z-20 -mt-10 lg:-mt-14 max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 justify-center items-center">
          {/* Tab 1: Câu chuyện */}
          <button
            onClick={() => handlePageChange('story')}
            className={`bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] rounded-[24px] p-4 lg:p-5 flex items-center gap-4 lg:gap-5 w-full md:w-[320px] lg:w-[340px] transition-all duration-300 transform hover:-translate-y-1 group ${
              currentPage === 'story' ? 'ring-2 ring-[#1a56db] shadow-lg' : 'hover:bg-gray-50'
            }`}
          >
            <Feather className={`w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform ${
              currentPage === 'story' ? 'text-[#1a56db]' : 'text-black'
            }`} />
            <div className="flex-1 text-left">
              <h3 className={`font-bold text-[14px] lg:text-[15px] ${currentPage === 'story' ? 'text-[#1a56db]' : 'text-black'}`}>Câu chuyện</h3>
              <p className={`text-[12px] lg:text-[13px] font-bold ${currentPage === 'story' ? 'text-[#1a56db]' : 'text-slate-500'}`}>về King Man</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              currentPage === 'story' 
                ? 'border-2 border-[#1a56db] bg-[#1a56db]' 
                : 'border border-gray-200 group-hover:border-black'
            }`}>
              <ArrowRight className={`w-4 h-4 ${
                currentPage === 'story' ? 'text-white' : 'text-slate-400 group-hover:text-black'
              } transition-colors`} />
            </div>
          </button>

          {/* Tab 2: Về chúng tôi (Active by default) */}
          <button
            onClick={() => handlePageChange('about')}
            className={`shadow-[0_15px_40px_rgb(0,0,0,0.12)] rounded-[24px] p-4 lg:p-5 flex items-center gap-4 lg:gap-5 border-2 w-full md:w-[320px] lg:w-[360px] transform md:-translate-y-3 transition-all duration-300 ${
              currentPage === 'about' 
                ? 'border-[#1a56db] bg-white' 
                : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'
            }`}
          >
            <Megaphone className={`w-7 h-7 lg:w-8 lg:h-8 transition-all ${
              currentPage === 'about' ? 'text-[#1a56db] animate-pulse' : 'text-gray-400'
            }`} />
            <div className={`flex-1 text-left transition-all ${currentPage === 'about' ? 'text-[#1a56db]' : 'text-gray-600'}`}>
              <h3 className={`font-bold text-[14px] lg:text-[16px]`}>King Man</h3>
              <p className={`text-[12px] lg:text-[14px] font-bold`}>Về chúng tôi</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              currentPage === 'about' 
                ? 'bg-[#1a56db] shadow-lg shadow-blue-500/30' 
                : 'bg-gray-200'
            }`}>
              <ArrowRight className={`w-4 h-4 ${currentPage === 'about' ? 'text-white' : 'text-gray-500'}`} />
            </div>
          </button>

          {/* Tab 3: Dịch vụ khách hàng */}
          <button
            onClick={() => handlePageChange('service')}
            className={`bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] rounded-[24px] p-4 lg:p-5 flex items-center gap-4 lg:gap-5 w-full md:w-[320px] lg:w-[340px] transition-all duration-300 transform hover:-translate-y-1 group ${
              currentPage === 'service' ? 'ring-2 ring-[#1a56db] shadow-lg' : 'hover:bg-gray-50'
            }`}
          >
            <Star className={`w-7 h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform ${
              currentPage === 'service' ? 'text-[#1a56db]' : 'text-black'
            }`} />
            <div className="flex-1 text-left">
              <h3 className={`font-bold text-[14px] lg:text-[15px] ${currentPage === 'service' ? 'text-[#1a56db]' : 'text-black'}`}>DVKH</h3>
              <p className={`text-[12px] lg:text-[13px] font-bold ${currentPage === 'service' ? 'text-[#1a56db]' : 'text-slate-500'}`}>Xuất sắc</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              currentPage === 'service' 
                ? 'border-2 border-[#1a56db] bg-[#1a56db]' 
                : 'border border-gray-200 group-hover:border-black'
            }`}>
              <ArrowRight className={`w-4 h-4 ${
                currentPage === 'service' ? 'text-white' : 'text-slate-400 group-hover:text-black'
              } transition-colors`} />
            </div>
          </button>
        </div>
      </section>

      {/* 3. Dynamic Content Section */}
      <section className="mt-20 md:mt-32 max-w-[1240px] mx-auto px-4 md:px-8">
        {/* Fade transition wrapper */}
        <div className={`transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          
          {/* PAGE: ABOUT (Default) */}
          {currentPage === 'about' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl md:text-5xl lg:text-[54px] font-black text-[#111] mb-12 uppercase tracking-tight">KING MAN LÀ AI?</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Left: Dynamic Image Collage */}
                <div className="flex flex-col gap-4 lg:gap-5">
                  <div className="overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-sm">
                    <img 
                      src="https://cdn.hstatic.net/files/200000887901/file/aristino27606.jpg" 
                      alt="King Man Team 1" 
                      className="w-full h-[220px] lg:h-[300px] object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:gap-5">
                     <div className="overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-sm">
                       <img 
                         src="https://cdn.hstatic.net/files/200000887901/file/aristino27606.jpg" 
                         alt="King Man Office" 
                         className="w-full h-[180px] lg:h-[240px] object-cover transform hover:scale-105 transition-transform duration-700"
                       />
                     </div>
                     <div className="overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-sm">
                       <img 
                         src="https://cdn.hstatic.net/files/200000887901/file/dsc_1972_1500x1500.jpg" 
                         alt="King Man Culture" 
                         className="w-full h-[180px] lg:h-[240px] object-cover transform hover:scale-105 transition-transform duration-700"
                       />
                     </div>
                  </div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center">
                  <p className="text-slate-600 text-[15px] lg:text-[17px] leading-relaxed mb-6">
                    Vài năm trước, King Man chỉ là một website nhỏ bán những sản phẩm cơ bản cho nam giới. Không cửa hàng, không quá nhiều nguồn lực, và cũng không được nhìn nhận là một thương hiệu "thời trang" đúng nghĩa.
                  </p>
                  <p className="text-black text-[15px] lg:text-[17px] leading-relaxed mb-6 font-bold">
                    Chúng tôi bắt đầu với một niềm tin rất đơn giản: làm ra những sản phẩm chất lượng, thiết kế đẳng cấp, giá hợp lý — và phục vụ khách hàng một cách tử tế.
                  </p>
                  <p className="text-slate-600 text-[15px] lg:text-[17px] leading-relaxed mb-10">
                    Từ một mô hình trực tuyến còn mới thời điểm đó, King Man từng bước xây dựng năng lực của mình — từ phát triển sản phẩm, vận hành, công nghệ, đến trải nghiệm khách hàng. Qua nhiều năm không ngừng nỗ lực, chúng tôi không còn là một thương hiệu nhỏ chỉ bán đồ cơ bản cho nam giới nữa.
                  </p>

                  <div className="bg-black text-white p-8 lg:p-10 rounded-[32px] shadow-2xl transform hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p className="text-[16px] lg:text-[18px] leading-relaxed font-medium relative z-10">
                      King Man hôm nay là một <span className="font-black tracking-wide text-white">Premium Menswear Brand</span> — mở rộng sang nhiều danh mục hơn (áo, quần, phụ kiện...), hiện diện không chỉ online mà cả hệ thống offline, và từng bước đưa thương hiệu Việt ra thị trường quốc tế.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE: STORY */}
          {currentPage === 'story' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl md:text-5xl lg:text-[54px] font-black text-[#111] mb-12 uppercase tracking-tight">Câu Chuyện King Man</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Left: Story Image */}
                <div className="flex flex-col gap-4 lg:gap-5">
                  <div className="overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-lg">
                    <img 
                      src="https://mcdn.coolmate.me/uploads/April2022/93865627_10217886564377529_1941617773784334336_n_1.jpg" 
                      alt="King Man Journey" 
                      className="w-full h-[320px] lg:h-[400px] object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-[#1a56db] to-blue-600 text-white p-6 lg:p-8 rounded-[24px] lg:rounded-[32px]">
                    <p className="text-[14px] lg:text-[16px] leading-relaxed font-medium">
                      "Mỗi chi tiết, mỗi sản phẩm được tạo ra đều mang trong mình tình yêu, sự công phu và tận tâm của toàn bộ team King Man"
                    </p>
                    <p className="text-[12px] lg:text-[14px] mt-4 opacity-90">— Founder, King Man</p>
                  </div>
                </div>

                {/* Right: Story Content */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-black mb-6">Từ Một Giấc Mơ Nhỏ</h3>
                    <p className="text-slate-600 text-[15px] lg:text-[17px] leading-relaxed mb-6">
                      King Man bắt nguồn từ một đơn giản: một nhóm bạn trẻ yêu thích thời trang nam, muốn tạo ra những sản phẩm chất lượng cao nhưng vẫn giá cả phải chăng. Chúng tôi tin rằng mỗi nam giới đều xứng đáng có những mặc phẩm tốt, được thiết kế kỹ lưỡng và sản xuất từ những vật liệu tốt nhất.
                    </p>
                    <p className="text-slate-600 text-[15px] lg:text-[17px] leading-relaxed mb-6">
                      Những năm đầu không dễ dàng. Chúng tôi làm việc từ một không gian nhỏ, tự tay chụp ảnh, viết bài, quản lý kho hàng. Nhưng chính sự khó khăn đó đã dạy chúng tôi quý trọng mỗi khách hàng, hiểu được nhu cầu thực sự của họ.
                    </p>
                    <p className="text-black text-[15px] lg:text-[17px] leading-relaxed font-bold mb-6">
                      Hôm nay, King Man đã trở thành thương hiệu thời trang nam được yêu thích ở Việt Nam, với hàng ngàn khách hàng tin tưởng chúng tôi mỗi ngày. Nhưng chúng tôi vẫn giữ được tinh thần ban đầu: tận tâm với từng chi tiết, lắng nghe khách hàng, và không ngừng cải thiện.
                    </p>
                  </div>
                  
                  <div className="bg-[#f0f4ff] p-6 lg:p-8 rounded-[24px] border-l-4 border-[#1a56db]">
                    <h4 className="font-bold text-black text-[16px] lg:text-[18px] mb-4">Những Cột Mốc Quan Trọng</h4>
                    <ul className="space-y-3 text-[14px] lg:text-[15px] text-slate-700">
                      <li className="flex gap-3"><span className="text-[#1a56db] font-bold">2018</span> <span>King Man ra đời</span></li>
                      <li className="flex gap-3"><span className="text-[#1a56db] font-bold">2020</span> <span>Mở showroom đầu tiên</span></li>
                      <li className="flex gap-3"><span className="text-[#1a56db] font-bold">2022</span> <span>Khai trương chuỗi cửa hàng</span></li>
                      <li className="flex gap-3"><span className="text-[#1a56db] font-bold">2024</span> <span>Bước vào thị trường quốc tế</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE: CUSTOMER SERVICE */}
          {currentPage === 'service' && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-10 md:mb-14 px-2">
                <p className="text-[#1a56db] text-[11px] md:text-xs font-extrabold uppercase tracking-[0.18em] mb-2">11 cam kết dịch vụ</p>
                <h3 className="text-3xl md:text-5xl font-black text-[#111] uppercase tracking-tight leading-tight">
                  Trải nghiệm mua sắm đẳng cấp tại King Man
                </h3>
              </div>

              <div className="space-y-8 md:space-y-10">
                {serviceCommitments.map((item, idx) => {
                  const reverse = idx % 2 === 1;
                  const number = String(idx + 1).padStart(2, '0');

                  return (
                    <div key={item.title} className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-center">
                      <div className={`${reverse ? 'lg:order-2' : ''} relative overflow-hidden rounded-[24px] lg:rounded-[30px] border border-slate-200 shadow-[0_18px_40px_rgba(2,6,23,0.10)] bg-white`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-[220px] md:h-[280px] lg:h-[300px] object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>

                      <div className={`${reverse ? 'lg:order-1' : ''} relative bg-[#f5f7fc] p-6 md:p-8 lg:p-10 overflow-hidden`}>
                        <span className="absolute -right-2 md:right-1 -bottom-5 text-[90px] md:text-[120px] font-black text-slate-200/70 leading-none select-none">
                          {number}
                        </span>
                        <h4 className="text-xl md:text-2xl lg:text-[30px] font-black text-[#0f172a] uppercase leading-tight pr-16 md:pr-20">
                          {item.title}
                        </h4>
                        <p className="mt-4 text-[14px] md:text-[15px] text-slate-600 leading-relaxed relative z-10 max-w-xl">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. Contact Form Section */}
      <section ref={contactRef} className="mt-16 md:mt-24 max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0 overflow-hidden shadow-lg border border-gray-200">
          
          {/* Left: Contact Info (Dark Card) */}
          <div className="bg-[#1f1f1f] text-white p-7 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <img src={logoImg} alt="King Man" className="h-10 w-auto object-contain brightness-0 invert" />
                <div className="flex flex-col">
                  <h3 className="text-xl font-black tracking-widest uppercase leading-none">KING MAN</h3>
                  <span className="text-[9px] text-[#ff5500] uppercase tracking-[0.2em] font-bold mt-0.5 block">Customer Care</span>
                </div>
              </div>

              <p className="text-[14px] text-white/80 font-medium max-w-[300px] mb-8 leading-relaxed italic">
                Bất kì thắc mắc gì về sản phẩm, đừng ngại liên lạc với chúng tôi nhé!
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Hotline</p>
                    <p className="text-lg font-extrabold tracking-tight">1900 272 735</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Email</p>
                    <p className="text-[15px] font-bold tracking-wide text-[#ff5500]">cskh@kingman.vn</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2.5 mt-10 w-full">
               <div className="w-10 h-10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer text-[10px] font-bold tracking-wider">
                 Zalo
               </div>
               <div className="w-10 h-10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer">
                 <Facebook className="w-4 h-4" />
               </div>
            </div>
          </div>

          {/* Right: Contact Form (Light Card) */}
          <div className="bg-white p-7 lg:p-10">
             <div className="inline-block bg-[#ff5500] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
               Kết nối với chúng tôi
             </div>
             
             <h3 className="text-[26px] lg:text-[32px] font-semibold text-[#111] tracking-tight mb-7 leading-tight">
               Gửi yêu cầu cho King Man
             </h3>

             {submitted ? (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle className="w-7 h-7 text-green-600" />
                 </div>
                 <h4 className="text-xl font-bold text-slate-900 mb-2">Gửi thành công!</h4>
                 <p className="text-slate-500 text-[14px] mb-6 max-w-xs">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                 <button
                   type="button"
                   onClick={() => setSubmitted(false)}
                   className="text-sm font-bold text-[#ff5500] hover:underline uppercase tracking-wider"
                 >
                   Gửi yêu cầu khác
                 </button>
               </div>
             ) : (
             <form className="space-y-4" onSubmit={handleSubmitForm}>
               {error && (
                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium">{error}</div>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[11px] font-bold text-slate-600 mb-1.5 tracking-wide uppercase">Họ và tên <span className="text-[#ff5500]">*</span></label>
                   <input type="text" placeholder="VD: Nguyễn Văn A" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[14px] transition-shadow" required />
                 </div>
                 <div>
                   <label className="block text-[11px] font-bold text-slate-600 mb-1.5 tracking-wide uppercase">Số điện thoại <span className="text-[#ff5500]">*</span></label>
                   <input type="tel" placeholder="Nhập số điện thoại" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[14px] transition-shadow" required />
                 </div>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-slate-600 mb-1.5 tracking-wide uppercase">Vấn đề cần hỗ trợ <span className="text-[#ff5500]">*</span></label>
                 <div className="relative">
                   <select value={formData.subject} onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[14px] appearance-none cursor-pointer transition-shadow text-slate-800" required>
                     <option value="" disabled hidden>Chọn vấn đề</option>
                     <option value="Tư vấn sản phẩm / Size">Tư vấn sản phẩm / Size</option>
                     <option value="Hỗ trợ giao hàng / Tracking">Hỗ trợ giao hàng / Tracking</option>
                     <option value="Bảo hành / Đổi trả">Bảo hành / Đổi trả</option>
                     <option value="Đồng phục doanh nghiệp">Đồng phục doanh nghiệp</option>
                     <option value="Vấn đề khác">Vấn đề khác</option>
                   </select>
                   <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <ChevronDown className="w-4 h-4 text-gray-400" />
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-slate-600 mb-1.5 tracking-wide uppercase">Ghi chú</label>
                 <textarea rows={3} placeholder="Ghi thêm yêu cầu chi tiết (màu sắc, thời gian cần hàng,...)" value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[14px] resize-none transition-shadow"></textarea>
               </div>

               <button type="submit" disabled={submitting} className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[12px] group shadow-lg disabled:opacity-60 mt-2">
                 {submitting ? (
                   <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</>
                 ) : (
                   <>Gửi Yêu Cầu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </button>
             </form>
             )}
          </div>
        </div>
      </section>

    </div>
  );
}
