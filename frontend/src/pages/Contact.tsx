import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, Briefcase, Handshake } from 'lucide-react';
import { api } from '../lib/api';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tư vấn sản phẩm');
  const [message, setMessage] = useState('');

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
    <div className="min-h-screen bg-white text-slate-900 font-sans pt-20">
      
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Liên Hệ Với King Man</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Chúng tôi luôn ở đây để lắng nghe, hỗ trợ và đồng hành cùng bạn. Bất kể là câu hỏi về sản phẩm, đơn hàng hay để hợp tác phát triển.
          </p>
        </div>
      </section>

      {/* Overview Information Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Chăm sóc khách hàng</h3>
            <p className="text-gray-500 text-sm mb-4">Hỗ trợ các vấn đề về đơn hàng, đổi trả và tư vấn sản phẩm.</p>
            <p className="font-medium text-black">1900 1234</p>
            <p className="text-sm text-gray-500 mt-1">support@kingman.vn</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Hợp tác kinh doanh</h3>
            <p className="text-gray-500 text-sm mb-4">Dành cho đại lý, đối tác nhượng quyền và nhà cung cấp.</p>
            <p className="font-medium text-black">090 123 4567</p>
            <p className="text-sm text-gray-500 mt-1">partner@kingman.vn</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Tuyển dụng</h3>
            <p className="text-gray-500 text-sm mb-4">Tham gia đội ngũ King Man để phát triển sự nghiệp của bạn.</p>
            <p className="font-medium text-black">(0236) 1234 567</p>
            <p className="text-sm text-gray-500 mt-1">hr@kingman.vn</p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:items-start">
          
          {/* Left: Form */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Gửi tin nhắn</h2>
              <p className="text-slate-500 text-sm">Điền thông tin bên dưới, chuyên viên của chúng tôi sẽ liên hệ lại sớm nhất.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white" placeholder="Nguyễn Văn A" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white" placeholder="email@example.com" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white" placeholder="0901234567" />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Tiêu đề</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer">
                      <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
                      <option value="Đơn hàng">Vấn đề đơn hàng</option>
                      <option value="Đại lý / Hợp tác">Đại lý / Hợp tác</option>
                      <option value="Góp ý / Khiếu nại">Góp ý / Khiếu nại</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Nội dung</label>
                <textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="block w-full p-4 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-black focus:border-black transition-colors bg-gray-50 focus:bg-white resize-none" placeholder="Hãy mô tả chi tiết yêu cầu của bạn..."></textarea>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                  <span>Chúng tôi sẽ cố gắng phản hồi trong vòng 24 giờ làm việc.</span>
                  <span>{message.length}/500</span>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center space-x-2 w-full md:w-auto px-10 py-3.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}</span>
              </button>
            </form>
          </div>

          {/* Right: Quick Image / Brand Side */}
          <div className="hidden lg:flex flex-col flex-1 max-w-md space-y-8 mt-4">
            <div className="bg-black text-white p-8 rounded-2xl shadow-lg relative overflow-hidden h-full flex flex-col justify-center">
              <h3 className="text-2xl font-serif mb-4 relative z-10">Liên Hệ.</h3>
              <p className="text-gray-300 font-light leading-relaxed relative z-10 mb-8">
                Tốc độ và sự tận tâm là kim chỉ nam cho mọi tương tác của chúng tôi. Chúng tôi tự hào mang đến trải nghiệm dịch vụ xuất sắc như chính sản phẩm King Man.
              </p>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Giờ làm việc</h4>
                    <p className="text-xs text-gray-400">8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Hệ Thống Cửa Hàng</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Trải nghiệm trực tiếp những thiết kế mới nhất và không gian mua sắm chuyên nghiệp tại các showroom của King Man trên toàn quốc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Store List */}
          <div className="space-y-6">
            {/* Store 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-black transition-colors cursor-pointer group">
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Flagship Store Đà Nẵng</h3>
                <div className="flex items-start text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-slate-400" />
                  <p>459 Tôn Đức Thắng, Phường Hòa Khánh Nam, Quận Liên Chiểu, TP. Đà Nẵng</p>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-slate-400" />
                  <p>(0236) 1234 567</p>
                </div>
              </div>
            </div>

            {/* Store 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-black transition-colors cursor-pointer group">
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Concept Store Hà Nội</h3>
                <div className="flex items-start text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-slate-400" />
                  <p>12 Bạch Mai, Phường Cầu Dền, Quận Hai Bà Trưng, TP. Hà Nội</p>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-slate-400" />
                  <p>(024) 7654 321</p>
                </div>
              </div>
            </div>

            {/* Store 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-black transition-colors cursor-pointer group">
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Boutique Store Hồ Chí Minh</h3>
                <div className="flex items-start text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-slate-400" />
                  <p>89 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-slate-400" />
                  <p>(028) 9876 543</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-full min-h-[400px] bg-slate-100 relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              title="King Man Flagship Đà Nẵng"
              loading="lazy"
              referrerPolicy="no-referrer"
              src="https://maps.google.com/maps?q=459%20Ton%20Duc%20Thang%2C%20Lien%20Chieu%2C%20Da%20Nang&output=embed"
            />
          </div>

        </div>
      </section>
      
    </div>
  );
}
