import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Bot, Package, RefreshCw, Headset, CreditCard } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import fabricTexture from '../assets/images/pic-1.jpg';
import hero1 from '../assets/images/hero_1.jpg';
import hero2 from '../assets/images/hero_2.jpg';
import hero3 from '../assets/images/hero_3.jpg';
import hero4 from '../assets/images/hero_4.jpg';

const heroImages = [hero1, hero2, hero3, hero4];

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
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);

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

  // Auto-scroll carousel - infinite loop left to right
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollSpeed = 0.6;
    let animationId: number;

    const animate = () => {
      if (!isCarouselPaused) {
        carousel.scrollLeft += scrollSpeed;

        // Reset when reached end
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [bestsellers, isCarouselPaused]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[75vh] 2xl:h-[80vh] bg-white group">
        <img 
          alt="Aurelia SS25 Lookbook" 
          className="absolute inset-0 w-full h-full object-cover md:object-contain bg-white transition-opacity duration-1000"
          src={heroImages[heroIndex]}
          referrerPolicy="no-referrer"
        />
        {/* Lớp phủ siêu mờ chỉ đủ để chữ có thể đọc được nhưng không làm mờ ảnh */}
        <div className="absolute inset-0 bg-white/10"></div>
        
        {/* Nút Previous - Chỉ hiện khi hover vào banner */}
        <button 
          onClick={() => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          <ChevronLeft className="w-6 h-6 text-red-500 hover:text-red-600" />
        </button>

        {/* Nút Next - Chỉ hiện khi hover vào banner */}
        <button 
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
        >
          <ChevronRight className="w-6 h-6 text-red-500 hover:text-red-600" />
        </button>



        {/* Text caption ở gần dưới cùng */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center">
          <div className="text-black font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] drop-shadow-sm">
            LOOKBOOK <span className="font-medium text-slate-800">FOR MEN</span> 26
          </div>
        </div>

        {/* Nút phân trang (dots) định vị đè lên vạch biên dưới cùng */}
        <div className="absolute -bottom-2 left-0 right-0 z-30 flex justify-center gap-3">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === heroIndex 
                  ? 'w-4 h-4 bg-red-600 shadow-md scale-110' 
                  : 'w-4 h-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Brand Heritage */}
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-4 block">Di Sản Của Chúng Tôi</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Nghệ Thuật Thủ Công Vĩnh Cửu, Nguồn Gốc Bền Vững.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Tại Aurelia Home, mỗi mũi kim kể một câu chuyện về sự tận tâm. Chúng tôi tin rằng sự xa xỉ đích thực nằm ở sự kết hợp giữa các loại vải hiệu suất cao tự nhiên và các kỹ thuật may đo hàng thế kỷ.
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

          {/* Dynamic Category Showcase */}
          <section className="py-24 bg-slate-50">
            <div className="max-w-[1440px] mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-3 block">Khám phá danh mục</span>
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
                  <div className="lg:col-span-7 h-[480px] bg-slate-200 rounded-tl-[40px] rounded-br-[40px]" />
                  <div className="lg:col-span-5 grid sm:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-[227px] bg-slate-200 rounded-tl-[24px] rounded-br-[24px]" />
                    ))}
                  </div>
                </div>
              ) : categoryLeadProduct ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <Link
                    to={`/product/${categoryLeadProduct._id}`}
                    className="lg:col-span-7 relative h-[460px] md:h-[520px] rounded-tl-[40px] rounded-br-[40px] overflow-hidden group"
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
                        className="group bg-white border border-slate-200 rounded-tl-[24px] rounded-br-[24px] overflow-hidden hover:shadow-xl hover:shadow-slate-900/10 transition-all"
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
                <div className="rounded-tl-[40px] rounded-br-[40px] border border-dashed border-slate-300 bg-white p-14 text-center">
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
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div>
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-2 block">Tinh Hoa Của Chúng Tôi</span>
            <h2 className="text-4xl font-serif text-slate-900">Những Sản Phẩm Bán Chạy Nhất Mùa</h2>
          </div>
        </div>
        
        <div 
          ref={carouselRef}
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          className="flex space-x-6 px-6 overflow-x-auto no-scrollbar max-w-[1440px] mx-auto py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...bestsellers, ...bestsellers].map((product, index) => (
            <div key={`${product._id}-${index}`} className="w-[260px] shrink-0 group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-white rounded-tl-[32px] rounded-br-[32px] shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                <img 
                  alt={product.name} 
                  className="w-full h-[340px] object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={product.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest rounded-tl-xl rounded-br-xl shadow-sm border border-slate-200">
                  Mới Nhập
                </div>
                <Link 
                  to={`/product/${product._id}`} 
                  className="absolute bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-sm text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs uppercase tracking-[0.2em] font-bold text-center block"
                >
                  Mua Ngay
                </Link>
              </div>
              <div className="px-1">
                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                <p className="text-slate-500 text-sm mt-1">{formatVND(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-white py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex items-center space-x-4">
              <div className="shrink-0 flex items-center justify-center">
                <Package className="w-10 h-10 text-slate-700" strokeWidth={1} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-medium text-slate-900 mb-0.5">Miễn phí vận chuyển</h4>
                <p className="text-[13px] text-slate-500">Áp dụng cho mọi đơn hàng từ 500k</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center space-x-4">
              <div className="shrink-0 flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-slate-700" strokeWidth={1} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-medium text-slate-900 mb-0.5">Đổi hàng dễ dàng</h4>
                <p className="text-[13px] text-slate-500">7 ngày đổi hàng vì bất kì lí do gì</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center space-x-4">
              <div className="shrink-0 flex items-center justify-center">
                <Headset className="w-10 h-10 text-slate-700" strokeWidth={1} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-medium text-slate-900 mb-0.5">Hỗ trợ nhanh chóng</h4>
                <p className="text-[13px] text-slate-500">HOTLINE 24/7: 0964942121</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center space-x-4">
              <div className="shrink-0 flex items-center justify-center">
                <CreditCard className="w-10 h-10 text-slate-700" strokeWidth={1} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[15px] font-medium text-slate-900 mb-0.5">Thanh toán đa dạng</h4>
                <p className="text-[13px] text-slate-500">Thanh toán khi nhận hàng, Napas, Visa,<br className="hidden lg:block 2xl:hidden" /> Chuyển Khoản</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
