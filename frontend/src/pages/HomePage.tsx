import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import fabricTexture from '../assets/images/pic-1.jpg';
import hero1 from '../assets/images/hero-1.jpg';
import hero2 from '../assets/images/hero-2.jpg';
import hero3 from '../assets/images/hero-3.jpg';

const heroImages = [hero1, hero2, hero3];

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await api.getCategories();
        setCategories(categoryData);
        setActiveCategory(categoryData[0]?.slug ?? '');
      } catch (error) {
        console.error('Failed to fetch categories', error);
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) {
      return;
    }

    let cancelled = false;

    const fetchCategoryProducts = async () => {
      try {
        setCategoryLoading(true);
        const params = new URLSearchParams({ category: activeCategory });
        const products = await api.getProducts(params);
        if (!cancelled) {
          setCategoryProducts(products);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch category products', error);
          setCategoryProducts([]);
        }
      } finally {
        if (!cancelled) {
          setCategoryLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const activeCategoryName =
    categories.find((category) => category.slug === activeCategory)?.name ?? 'Danh Mục';
  const categoryLeadProduct = categoryProducts[0];
  const categoryGridProducts = categoryProducts.slice(1, 5);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featured = await api.getFeaturedProducts();
        setBestsellers(featured);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      }
    };

    fetchFeatured();

    const interval = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-900">
        <img 
          alt="Cinematic tailored suit detail" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-1000"
          src={heroImages[heroIndex]}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900/60"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif mb-8 max-w-4xl leading-tight">
            Bộ Sưu Tập <br/> <span className="italic">Quý Ông</span> Hiện Đại
          </h1>
          <div className="flex flex-col items-center space-y-6">
            <p className="text-white/80 text-lg font-light tracking-wide max-w-xl">
              Định nghĩa lại sự xa xỉ qua độ chính xác kiến trúc và nghệ thuật thủ công bền vững.
            </p>
            <Link to="/shop" className="bg-blue-600 text-white px-12 py-4 text-sm uppercase tracking-[0.2em] font-medium hover:bg-blue-700 transition-all duration-500 shadow-xl">
              Mua Ngay
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Brand Heritage */}
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-4 block">Di Sản Của Chúng Tôi</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Nghệ Thuật Thủ Công Vĩnh Cửu, Nguồn Gốc Bền Vững.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Tại Aurelia Homme, mỗi mũi kim kể một câu chuyện về sự tận tâm. Chúng tôi tin rằng sự xa xỉ đích thực nằm ở sự kết hợp giữa các loại vải hiệu suất cao tự nhiên và các kỹ thuật may đo hàng thế kỷ.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-2">Len Nguyên Chất</h4>
                <p className="text-sm text-slate-500">Nguồn gốc từ các trang trại đạo đức ở vùng núi Ý.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-2">Da Nguyên Bán</h4>
                <p className="text-sm text-slate-500">Da được ủ bằng chiết xuất tự nhiên để tăng độ bền.</p>
              </div>
            </div>
            <Link to="/about" className="inline-block mt-12 border-b border-slate-900 pb-1 text-sm uppercase tracking-widest font-bold hover:text-blue-600 hover:border-blue-600 transition-all">
              Khám Phá Quy Trình Của Chúng Tôi
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative flex justify-end">
              <img 
                alt="Tailor working on a coat" 
                className="w-4/5 h-[600px] object-cover shadow-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdTfO1Wl18BVzWJR4RUxStVkaR405sAapuSQNSBQLxjCo2msEFKhlAXnz9ns2CfwaBbich4tmMr9kxIGXvsKFO7o8sYlrr0tD8Y78jAB-ydwe9XD3_ZCwYxPvSIE-aoFAZisvIIHx6Q4Cak4r70QQlw-T6j-Ih8zWE3IrSQKQuvqLRIyD18dPZBBW89gJOeLPoSGn-vPHBH5uNjoqDMwCKx5VacPphVlBec0xi2Iuzky3smkfp0DEB-dW-SDSUUEq2AzxmdRkALs0"
                referrerPolicy="no-referrer"
              />
              <img 
                alt="Fabric texture detail" 
                className="absolute -bottom-10 -left-6 w-1/2 h-80 object-cover border-8 border-white shadow-xl hidden md:block" 
                src={fabricTexture}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Stylist Intro */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.04),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.07),transparent_45%)]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-600 shadow-sm">
              AI Styling Concierge
            </span>
            <h2 className="mt-5 text-slate-900 text-4xl md:text-5xl font-serif leading-tight">
              Gặp Gỡ Trợ Lý AI Cá Nhân Hóa
              <span className="block text-slate-500 mt-2 text-2xl md:text-3xl">Cho Việc Chăm Sóc Và Phong Cách</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              Lời khuyên phong cách siêu cá nhân hóa dựa trên hình dáng cơ thể, loại sự kiện và tủ đồ hiện tại của bạn.
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 md:p-10 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/80 to-transparent" />

            <div className="flex flex-col md:flex-row gap-8 md:gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-3 animate-[fadeIn_0.6s_ease-out]">
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold ring-4 ring-blue-50">
                    AH
                  </div>
                  <div className="bg-slate-900 text-white rounded-2xl rounded-tl-none p-4 text-sm md:text-[15px] max-w-[86%] shadow-lg shadow-slate-900/20">
                    "Xin chào, Julian. Dựa trên thân hình thể thao của bạn và sự kiện 'Black Tie Sáng Tạo' tối nay, tôi đề xuất Bộ Vest Hải Quân Giữa Đêm."
                  </div>
                </div>

                <div className="flex items-start flex-row-reverse gap-3 animate-[fadeIn_0.8s_ease-out]">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-semibold ring-4 ring-blue-50">
                    ME
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tr-none p-4 text-sm md:text-[15px] text-slate-700 max-w-[86%]">
                    "Hãy cho tôi xem một số phụ kiện để kết hợp với bộ đó."
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-500 mb-3">Gợi Ý Hoàn Thiện Outfit</p>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv7nuZWjLmR1ENl_TiiJ6vF2Am1ocD3ig6x_SyVJl4-uvI3V8VhKkEVWjqgNmgolbyAU0rebFkrCNVcdUY8rLEs8MjO7SGqKAFG-elzLdklCBQTkIdXKr08832Cj0n3tv5nKKmCS7CedR05Wt9SVuOejcIIgK39rxII2P170qILpCrMtYJhFDPcvNE6tH5N5THYIMiZE0Ak10tNQ3iBSwxVEgvPWtoAUq6tYSXJg1r-LJDGfQUat5tDk3V3hdZLuvnAJbeva1-PiE" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpeO8hFJv8ChrIB3DfP6n0NdIAElu-A1AUsYvjVluF-DwRn6fsBC7mYjckuEwJpYDutVL28umJK0Tjqm5E5WwKfxVFv8dNl2z1M98Wn6TPsiVbRkDEe5A3k0BJhBsTls7jcr6keA5CC4ZoSVpOZwngst7nsiWnQDYNyKBdk2pQMPl4sfAr70uZx-YhyhQ2PQza8i2CoNXfjdaSsp_pNE3GOuJzrjg-2olTV7zf69MKUB-pcCWgux96T0Tl6PHRNesjsMEIFXV-nk8" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center border border-dashed border-slate-300 cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors bg-white text-slate-500">
                      <span className="text-xs font-semibold">+3 More</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 flex flex-col justify-center items-center text-center space-y-6 border-t md:border-t-0 md:border-l border-slate-200 pt-8 md:pt-0 md:pl-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-200/60 blur-lg animate-pulse" />
                  <div className="relative w-24 h-24 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                    <Bot className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-blue-600 font-bold">Phân Tích AI Trực Tiếp</p>
                  <p className="mt-2 text-sm text-slate-500">Nhận tư vấn phối đồ theo sự kiện, thời tiết và phong cách riêng của bạn.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('aurelia:open-chat'))}
                  className="w-full py-3.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 text-center block rounded-xl shadow-lg shadow-slate-900/15"
                >
                  Mở Chat Trợ Lý
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Dynamic Category Showcase */}
          <section className="py-24 bg-slate-50">
            <div className="max-w-[1440px] mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-3 block">Danh Mục Từ Database</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-slate-900">Khám Phá Theo Danh Mục</h2>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  Xem Toàn Bộ Cửa Hàng
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-3 mb-8 no-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => setActiveCategory(category.slug)}
                    className={`shrink-0 px-5 py-2.5 rounded-full border text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${
                      activeCategory === category.slug
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/25'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {categoryLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
                  <div className="lg:col-span-7 h-[480px] bg-slate-200 rounded-3xl" />
                  <div className="lg:col-span-5 grid sm:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-[227px] bg-slate-200 rounded-2xl" />
                    ))}
                  </div>
                </div>
              ) : categoryLeadProduct ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <Link
                    to={`/product/${categoryLeadProduct._id}`}
                    className="lg:col-span-7 relative h-[460px] md:h-[520px] rounded-3xl overflow-hidden group"
                  >
                    <img
                      alt={categoryLeadProduct.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={categoryLeadProduct.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/40 text-white/90 bg-black/20 backdrop-blur-sm">
                      {activeCategoryName}
                    </div>
                    <div className="absolute left-7 right-7 bottom-7 text-white">
                      <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-3">{categoryLeadProduct.name}</h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{categoryLeadProduct.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">{formatVND(categoryLeadProduct.price)}</span>
                        <span className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-bold">
                          Mua Ngay <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="lg:col-span-5 grid sm:grid-cols-2 gap-6">
                    {categoryGridProducts.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all"
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={product.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-5">
                          <h4 className="font-semibold text-slate-900 mb-2 line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-900 font-semibold">{formatVND(product.price)}</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600">Chi Tiết</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
                  <h3 className="text-2xl font-serif text-slate-900 mb-3">Danh mục này chưa có sản phẩm hiển thị</h3>
                  <p className="text-slate-500 mb-6">Hệ thống đã đọc đúng danh mục trong database nhưng chưa có dữ liệu sản phẩm hoạt động.</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center bg-slate-900 text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-blue-600 transition-colors"
                  >
                    Đi Tới Cửa Hàng
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}

              {activeCategory && (
                <div className="mt-8 text-right">
                  <Link
                    to={`/shop?category=${encodeURIComponent(activeCategory)}`}
                    className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-bold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Xem thêm sản phẩm {activeCategoryName}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>

      {/* Bestseller Carousel */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
          <div>
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-2 block">Tinh Hoa Của Chúng Tôi</span>
            <h2 className="text-4xl font-serif text-slate-900">Những Sản Phẩm Bán Chạy Nhất Mùa</h2>
          </div>
          <div className="hidden md:flex space-x-4">
            <button className="w-12 h-12 rounded-full border border-slate-900/20 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="w-12 h-12 rounded-full border border-slate-900/20 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-8 px-6 overflow-x-auto no-scrollbar pb-8 max-w-[1440px] mx-auto">
          {bestsellers.map(product => (
            <div key={product._id} className="min-w-[300px] flex-shrink-0 group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-white">
                <img 
                  alt={product.name} 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={product.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] uppercase px-2 py-1 tracking-widest">
                  Mới Nhập
                </div>
                <Link 
                  to={`/product/${product._id}`} 
                  className="absolute bottom-0 left-0 w-full bg-slate-900 text-white py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs uppercase tracking-widest font-bold text-center block"
                >
                  Thêm Nhanh
                </Link>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">{product.name}</h4>
              <p className="text-slate-500 text-sm mt-1">{formatVND(product.price)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
