import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';

import hero1 from '../assets/images/hero_1.jpg';
import hero2 from '../assets/images/hero_2.jpg';
import hero3 from '../assets/images/hero_3.jpg';
import hero4 from '../assets/images/hero_4.jpg';

const heroImages = [hero1, hero2, hero3, hero4];

const heroGalleryCards = [
  {
    title: 'Smart Casual',
    subtitle: 'Phong cach linh hoat',
    image: hero1
  },
  {
    title: 'Office Ready',
    subtitle: 'Chinh chu moi ngay',
    image: hero2
  },
  {
    title: 'Weekend Fit',
    subtitle: 'Thoai mai xuong pho',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Layer Season',
    subtitle: 'Nang tam trang phuc',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop'
  }
];

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const showcaseCategoriesData = [
  { name: 'ÁO KHOÁC', slug: 'ao-khoac', desc: 'Thiết kế lịch lãm, giữ ấm hoàn hảo', images: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    'https://cdn.hstatic.net/products/1000253775/ao-khoac-jean-nam-icondenim-duskpath-1_cf426432e42e43d5970ada5246fd75e3_large.jpg'
  ]},
  { name: 'ÁO POLO', slug: 'ao-polo-sale', desc: 'Phong cách phóng khoáng, nam tính', images: [
    'https://thoitrangbigsize.vn/wp-content/uploads/2025/05/Trang-2.jpg',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    'https://media.routine.vn/1600x1200/prod/media/63ead3a9-b6b5-4693-b322-101f4eaa87bc.webp'
  ]},
  { name: 'SƠ MI', slug: 'ao-so-mi-dai', desc: 'Chỉn chu cho những sự kiện quan trọng', images: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=800&auto=format&fit=crop'
  ]},
  { name: 'ÁO THUN', slug: 'ao-thun', desc: 'Thoải mái tận hưởng mọi khoảnh khắc', images: [
    'https://pos.nvncdn.com/492284-9176/ps/20230823_hCRqmT37ek.jpeg?v=1692792715',
    'https://pos.nvncdn.com/492284-9176/ps/20241110_9edosBcfN5.jpeg?v=1731227374',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'
  ]},
  { name: 'QUẦN TÂY', slug: 'quan-au-sale', desc: 'Cắt may chuẩn xác, tôn dáng tuyệt đối', images: [
    'https://4men.com.vn/thumbs/2016/08/quan-tay-nau-co-gian-qt46-4068-p.jpg',
    'https://owen.cdn.vccloud.vn/media/catalog/product/cache/d52d7e242fac6dae82288d9a793c0676/q/s/qst242414._1.jpg',
    'https://down-vn.img.susercontent.com/file/48b740f54213047ecb9629c5aa816ffe'
  ]},
  { name: 'QUẦN SHORT', slug: 'quan-short', desc: 'Năng động dạo phố dịp cuối tuần', images: [
    'https://beyono.vn/gallery/8a390768-48d7-4f0d-9e0b-9c9ac87ffa26.jpg',
    'https://www.chapi.vn/img/product/2019/8/13/quan-short-nam-cotton-mna-new.jpg',
    'https://cdn.hstatic.net/products/1000402464/sp26ss05p-ak_khaki__1__dfca91a97ae84615893210a5df63b85b_master.jpg'
  ]},
  { name: 'PHỤ KIỆN', slug: 'tat-nam', desc: 'Điểm nhấn tinh tế, hoàn thiện trang phục', images: [
    'https://www.chapi.vn/img/product/2023/3/2/tat-nam-thoang-khi-mua-he-toe-24-500x500.jpg',
    'https://lavatino.com/wp-content/uploads/2020/01/That-lung-da-bo-cong-so-TINO-04-D02-TRANG-3-1-1000x1000-1.jpg',
    'https://scdn.thitruongsi.com/image/img/product/2023/04/14/61927430-da20-11ed-8d72-ed50fd08b479.jpg'
  ]}
];

const HoverCategoryCard = ({ cat, isAccordion }: { cat: any; isAccordion: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cat.images && cat.images.length > 1) {
      setImgIndex(1); // Triggers immediately on hover
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setImgIndex(0); // Resets smoothly on leave
  };

  useEffect(() => {
    let interval: number;
    if (isHovered && cat.images && cat.images.length > 1) {
      interval = window.setInterval(() => {
        setImgIndex((prev: number) => (prev + 1) % cat.images.length);
      }, 1200); // Faster, more dynamic interval
    }
    return () => clearInterval(interval);
  }, [isHovered, cat.images]);

  if (isAccordion) {
    return (
      <Link
        to={`/shop?category=${cat.slug}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative flex-1 hover:flex-[3] rounded-[32px] overflow-hidden transition-[flex] duration-700 ease-out cursor-pointer shadow-sm hover:shadow-2xl bg-black"
      >
        {cat.images?.map((img: string, i: number) => (
           <img 
             key={i}
             src={img} 
             alt={`${cat.name} ${i}`}
             className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
               imgIndex === i ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-110 z-0'
             } group-hover:scale-100`} 
             referrerPolicy="no-referrer"
           />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none z-20"></div>
        
        {/* Minimal Vertical Text (Default state) */}
        <div className="absolute bottom-12 left-0 w-full flex flex-col items-center justify-end opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none z-30">
          <h3 className="text-white text-xl font-serif tracking-[0.2em] drop-shadow-lg [writing-mode:vertical-rl] transform rotate-180 whitespace-nowrap">
            {cat.name}
          </h3>
        </div>

        {/* Expanded Content (Hover state) */}
        <div className="absolute inset-0 p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 flex flex-col items-start justify-end pointer-events-none group-hover:pointer-events-auto z-30">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
            <span className="inline-block w-12 h-[2px] bg-white/70 mb-4"></span>
            <h3 className="text-white text-4xl xl:text-5xl font-serif tracking-widest mb-3 drop-shadow-xl whitespace-nowrap">{cat.name}</h3>
            <p className="text-white/80 mb-8 text-sm max-w-sm drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
              {cat.desc}
            </p>
            <span className="inline-flex items-center justify-center bg-white text-slate-900 text-xs uppercase font-bold tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-slate-900 hover:text-white hover:ring-1 hover:ring-white transition-all shadow-lg pointer-events-auto cursor-pointer">
              Khám Phá <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Mobile layout
  return (
    <Link
      to={`/shop?category=${cat.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex-shrink-0 w-[300px] md:w-[400px] h-[450px] md:h-[550px] rounded-[32px] overflow-hidden snap-center shadow-lg hover:shadow-2xl transition-all duration-500 bg-black"
    >
        {cat.images?.map((img: string, i: number) => (
           <img 
             key={i}
             src={img} 
             alt={`${cat.name} ${i}`}
             className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
               imgIndex === i ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-110 z-0'
             } group-hover:scale-100`} 
             referrerPolicy="no-referrer"
           />
        ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none z-20"></div>
      
      <div className="absolute bottom-8 left-0 w-full px-8 flex flex-col items-start justify-end z-30 pointer-events-none">
        <span className="inline-block w-10 h-[2px] bg-white/70 mb-4 transform translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-700 ease-out"></span>
        <h3 className="text-white text-3xl md:text-4xl font-serif tracking-widest mb-3 drop-shadow-xl whitespace-nowrap transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">{cat.name}</h3>
        <p className="text-white/80 mb-6 text-sm drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out delay-75">
          {cat.desc}
        </p>
        <span className="inline-flex items-center justify-center bg-white text-slate-900 text-xs uppercase font-bold tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-slate-900 hover:text-white transition-colors shadow-lg pointer-events-auto transform translate-y-4 group-hover:translate-y-0 duration-700 ease-out delay-150">
          Khám Phá <ArrowRight className="ml-2 w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [shirtProducts, setShirtProducts] = useState<Product[]>([]);
  const [shirtLoading, setShirtLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [shirtIndex, setShirtIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isShirtsPaused, setIsShirtsPaused] = useState(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const shirtsCarouselRef = React.useRef<HTMLDivElement>(null);
  const itemImageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const [addingToCartProductId, setAddingToCartProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2400);
  };

  const animateFlyToCart = (productId: string) => {
    setTimeout(() => {
      const imageEl = itemImageRefs.current[productId];
      const cartButtonEl = document.querySelector('[data-cart-icon-button]') as HTMLElement | null;
      
      if (!imageEl) return;
      if (!cartButtonEl) return;

      const startRect = imageEl.getBoundingClientRect();
      const endRect = cartButtonEl.getBoundingClientRect();

      const flyImg = imageEl.cloneNode(true) as HTMLImageElement;
      flyImg.style.position = 'fixed';
      flyImg.style.top = `${startRect.top}px`;
      flyImg.style.left = `${startRect.left}px`;
      flyImg.style.width = `${startRect.width}px`;
      flyImg.style.height = `${startRect.height}px`;
      flyImg.style.borderRadius = '5px';
      flyImg.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
      flyImg.style.pointerEvents = 'none';
      flyImg.style.transformOrigin = 'center center';
      flyImg.style.transition = 'all 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      flyImg.style.zIndex = '9999';
      document.body.appendChild(flyImg);

      flyImg.style.transform = 'scale(0.8)';
      flyImg.style.opacity = '1';

      requestAnimationFrame(() => {
        const translateX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
        const translateY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
        const scaleDown = Math.min(endRect.width / startRect.width, endRect.height / startRect.height, 0.15);
        flyImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleDown})`;
        flyImg.style.opacity = '0.1';
      });

      const cartIconWrapper = document.querySelector('[data-cart-icon]') as HTMLElement | null;
      const cleanup = () => {
        flyImg.remove();
        if (cartIconWrapper) {
          cartIconWrapper.classList.remove('animate-pulse');
          cartIconWrapper.classList.add('cart-shake');
          window.setTimeout(() => {
            cartIconWrapper.classList.remove('cart-shake');
          }, 600);
        }
      };

      if (cartIconWrapper) {
        cartIconWrapper.classList.add('animate-pulse');
      }
      window.setTimeout(cleanup, 1000);
    }, 10);
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCartProductId(productId);
    try {
      const productDetail = await api.getProductById(productId);
      const variant = productDetail.variants.find((v) => v.stockQuantity > 0) ?? productDetail.variants[0];
      if (!variant) {
        showToast('Sản phẩm hiện không có phiên bản khả dụng.');
        return;
      }

      await api.addToCart({
        productId,
        productVariantId: variant._id,
        quantity: 1
      });

      animateFlyToCart(productId);
      showToast('Đã thêm vào giỏ hàng');
    } catch (error) {
      console.error(error);
      showToast('Vui lòng đăng nhập trước khi thêm vào giỏ hàng.');
    } finally {
      setAddingToCartProductId(null);
    }
  };

  const SHOWCASE_TABS = [
    { id: 'ao', label: 'Áo nam' },
    { id: 'quan', label: 'Quần nam' },
    { id: 'phu-kien', label: 'Phụ kiện' },
    { id: 'giam-gia', label: 'Giảm giá' }
  ];

  const [activeShowcaseTab, setActiveShowcaseTab] = useState(SHOWCASE_TABS[0].id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await api.getCategories();
        setCategories(categoryData);
        setActiveCategory(categoryData[0]?.slug ?? '');
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchCategoryProducts = async () => {
      try {
        setCategoryLoading(true);
        let products: Product[] = [];
        
        if (activeShowcaseTab === 'giam-gia') {
          const all = await api.getProducts();
          products = all.filter(p => p.discountPercent && p.discountPercent > 0);
        } else if (activeShowcaseTab === 'phu-kien') {
          const [res1, res2, res3, res4] = await Promise.all([
            api.searchProducts('dây lưng'),
            api.searchProducts('giày'),
            api.searchProducts('mũ'),
            api.searchProducts('tất')
          ]);
          
          const rawProducts = [...res1, ...res2, ...res3, ...res4];
          const uniqueIds = new Set();
          
          // Filter carefully to eliminate loose full-text matches (like shirts hitting 'mũ' description)
          for (const p of rawProducts) {
            if (!uniqueIds.has(p._id)) {
              const lowerName = p.name.toLowerCase();
              if (
                lowerName.includes('dây lưng') || 
                lowerName.includes('thắt lưng') ||
                lowerName.includes('giày') || 
                lowerName.includes('mũ') || 
                lowerName.includes('nón') ||
                lowerName.includes('tất') ||
                lowerName.includes('vớ')
              ) {
                uniqueIds.add(p._id);
                products.push(p);
              }
            }
          }
        } else {
          const searchQuery = activeShowcaseTab === 'ao' ? 'áo' : 'quần';
          products = await api.searchProducts(searchQuery);
        }

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
  }, [activeShowcaseTab]);

  const activeTabName = SHOWCASE_TABS.find(t => t.id === activeShowcaseTab)?.label || 'Sản phẩm';
  const displayProducts = categoryProducts.slice(0, 5);

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

  // Fetch shirt products
  useEffect(() => {
    const fetchShirts = async () => {
      try {
        setShirtLoading(true);
        // Find shirt category from the categories list
        const shirtCategory = categories.find(
          (cat) => cat.name.toLowerCase().includes('shirt') || 
                   cat.name.toLowerCase().includes('áo sơ mi') ||
                   cat.slug.toLowerCase().includes('shirt') ||
                   cat.slug.toLowerCase().includes('ao-so-mi')
        );
        
        if (shirtCategory) {
          const params = new URLSearchParams({ category: shirtCategory.slug });
          const products = await api.getProducts(params);
          setShirtProducts(products); // Fetch all shirt products
        } else {
          setShirtProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch shirt products', error);
        setShirtProducts([]);
      } finally {
        setShirtLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchShirts();
    }
  }, [categories]);

  // Auto-scroll shirts carousel (step-by-step, uses cloned items for infinite loop)
  useEffect(() => {
    if (shirtProducts.length === 0) return;

    const intervalId = window.setInterval(() => {
      if (isShirtsPaused) return;
      setShirtIndex((prev) => prev + 1);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [shirtProducts.length, isShirtsPaused]);

  useEffect(() => {
    const total = shirtProducts.length;
    if (total === 0) return;

    if (shirtIndex === total) {
      const timeoutId = window.setTimeout(() => {
        setIsTransitionEnabled(false);
        setShirtIndex(0);
      }, 600);
      return () => window.clearTimeout(timeoutId);
    }

    if (!isTransitionEnabled) {
      const timeoutId = window.setTimeout(() => setIsTransitionEnabled(true), 0);
      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [shirtIndex, shirtProducts.length, isTransitionEnabled]);

  const slotWidth = 236; // card width + gap
  const translateX = -shirtIndex * slotWidth;
  const trackStyle: React.CSSProperties = {
    transform: `translateX(${translateX}px)`,
    transition: isTransitionEnabled ? 'transform 0.6s ease' : 'none'
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative w-full min-h-[72vh] md:min-h-[82vh] bg-[#090f1b] group overflow-hidden">
        <img
          alt="King Man SS25 Lookbook"
          className="absolute inset-0 w-full h-full object-cover bg-black transition-opacity duration-1000"
          src={heroImages[heroIndex]}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070f]/90 via-[#0a1220]/70 to-[#101827]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.28),transparent_45%)]" />

        <button
          onClick={() => setHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 z-30"
          aria-label="Slide trước"
        >
          <ChevronLeft className="w-6 h-6 text-red-500 hover:text-red-600" />
        </button>

        <button
          onClick={() => setHeroIndex((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 z-30"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight className="w-6 h-6 text-red-500 hover:text-red-600" />
        </button>

        <div className="relative z-20 max-w-[1460px] mx-auto px-4 md:px-8 pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-7 text-white">
              <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] font-semibold mb-5">
                New Season Lookbook
              </p>
              <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl">
                Thoi trang nam hien dai, bo cuc ro rang de ban chon do nhanh hon
              </h1>
              <p className="mt-5 text-sm md:text-base text-slate-200/95 max-w-2xl leading-relaxed">
                Ket hop giua chat lieu cao cap, duong cat may gon dep va bang mau de phoi. Kham pha bo suu tap
                moi voi thong tin ngan gon, de hieu va de mua ngay tren cung mot man hinh.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center rounded-full bg-white text-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors"
                >
                  Mua ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/membership"
                  className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-colors"
                >
                  Quyen loi thanh vien
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                <div className="rounded-2xl bg-white/10 backdrop-blur px-3 py-3 border border-white/15">
                  <p className="text-xl md:text-2xl font-bold">500+</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-200">Mau moi</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur px-3 py-3 border border-white/15">
                  <p className="text-xl md:text-2xl font-bold">24h</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-200">Xu ly don</p>
                </div>
                <div className="rounded-2xl bg-white/10 backdrop-blur px-3 py-3 border border-white/15">
                  <p className="text-xl md:text-2xl font-bold">7-14</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-200">Ngay doi tra</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-md p-3 md:p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3 text-white">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-semibold">Hinh anh noi bat</p>
                  <p className="text-[11px] text-white/70">{heroIndex + 1}/{heroImages.length}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {heroGalleryCards.map((item, idx) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setHeroIndex(idx % heroImages.length)}
                      className="group/card relative text-left rounded-2xl overflow-hidden border border-white/20 hover:border-white/45 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-28 md:h-32 w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] truncate">{item.title}</p>
                        <p className="text-[10px] text-white/80 truncate">{item.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2.5">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === heroIndex
                  ? 'w-8 h-2.5 bg-red-500 shadow-md'
                  : 'w-2.5 h-2.5 bg-white/45 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Premium Category Showcase - Accordion & Carousel */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-slate-50 opacity-50 pointer-events-none"></div>

        <div className="max-w-[1500px] mx-auto px-4 md:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a2a2a] whitespace-nowrap">
                  Danh Mục Cửa Hàng
                </h2>
            </div>
            <div className="hidden md:block">
               <p className="text-slate-500 max-w-md text-sm leading-relaxed">Bộ sưu tập thời trang thiết kế với chất liệu cao cấp, cắt may tỉ mỉ, mang lại sự tự tin và khí chất lãnh đạo cho nam giới hiện đại.</p>
            </div>
          </div>
          
          {/* Desktop: Interactive Accordion Gallery */}
          <div className="hidden lg:flex w-full h-[600px] gap-4">
            {showcaseCategoriesData.map((cat, index) => (
              <React.Fragment key={index}>
                <HoverCategoryCard cat={cat} isAccordion={true} />
              </React.Fragment>
            ))}
          </div>

          {/* Mobile/Tablet: Large Horizontal Scroll Gallery */}
          <div className="lg:hidden flex gap-5 overflow-x-auto pb-12 pt-4 no-scrollbar snap-x snap-mandatory">
            {showcaseCategoriesData.map((cat, index) => (
              <React.Fragment key={index}>
                <HoverCategoryCard cat={cat} isAccordion={false} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

          {/* Dynamic Category Showcase */}
          <section className="py-10 bg-[#f8f9fa]">
            <div className="max-w-[1440px] mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-3">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a2a2a] whitespace-nowrap">
                  Bộ Sưu Tập Mới
                </h2>

                <div className="flex gap-2 overflow-x-auto no-scrollbar md:pb-0 scroll-smooth items-center">
                  {SHOWCASE_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveShowcaseTab(tab.id)}
                      className={`shrink-0 px-4 py-1.5 text-[11px] uppercase tracking-wider rounded-full transition-all duration-300 border ${
                        activeShowcaseTab === tab.id
                          ? 'bg-black text-white border-black font-semibold shadow-sm'
                          : 'bg-transparent text-gray-500 border-gray-300 hover:border-black hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {categoryLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 animate-pulse">
                  <div className="hidden lg:block lg:col-span-1 h-[600px] bg-gray-200 rounded" />
                  <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="bg-white p-2 rounded border border-gray-100 h-[280px]" />
                    ))}
                  </div>
                </div>
              ) : categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                  
                  {/* Left Big Hero Image */}
                  <div className="hidden lg:block lg:col-span-1 h-full overflow-hidden bg-gray-100 rounded">
                    <img 
                      src={
                        activeShowcaseTab === 'ao' ? showcaseCategoriesData.find(c => c.slug === 'ao-khoac')?.images?.[0] || heroImages[1] :
                        activeShowcaseTab === 'quan' ? showcaseCategoriesData.find(c => c.slug === 'quan-au-sale')?.images?.[0] || heroImages[2] :
                        activeShowcaseTab === 'phu-kien' ? showcaseCategoriesData.find(c => c.slug === 'tat-nam')?.images?.[0] || heroImages[3] : 
                        heroImages[0]
                      }
                      alt={activeTabName} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s]" 
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Right Products 5x2 Grid */}
                  <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categoryProducts.slice(0, 10).map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="bg-white p-2.5 rounded border border-gray-100/80 shadow-sm hover:border-gray-200 hover:shadow-md transition-all flex flex-col group"
                      >
                        <div className="aspect-[4/5] bg-gray-50/50 w-full mb-3 overflow-hidden relative">
                          {/* Top-left Badges */}
                          {!!product.discountPercent && product.discountPercent > 0 && (
                            <div className="absolute top-1.5 left-1.5 z-10 bg-[#e53935] text-white text-[9px] font-bold px-1 py-0.5 tracking-widest">
                              -{product.discountPercent}%
                            </div>
                          )}
                          <img
                            ref={(el) => { itemImageRefs.current[product._id] = el; }}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            src={product.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-center flex-1 flex flex-col px-0.5">
                          <h4 className="text-[11px] text-gray-700 line-clamp-2 leading-snug mb-2 min-h-[30px]">
                            {product.name}
                          </h4>
                          <div className="mt-auto">
                            <div className="font-bold text-[12px] text-black mb-3">
                              {!!product.discountPercent && product.discountPercent > 0 ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <span className="text-[#e53935]">{formatVND(product.price * (1 - product.discountPercent / 100))}</span>
                                  <span className="text-slate-400 line-through text-[10px] font-medium">{formatVND(product.price)}</span>
                                </div>
                              ) : (
                                formatVND(product.price)
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, product._id)}
                              disabled={addingToCartProductId === product._id}
                              className={`w-full flex items-center justify-center border-t border-gray-100 pt-2.5 opacity-90 hover:opacity-100 transition-opacity cursor-pointer ${addingToCartProductId === product._id ? 'opacity-50' : ''}`}
                            >
                              <span className="text-[9px] font-bold tracking-[0.05em] text-black pt-0.5">
                                {addingToCartProductId === product._id ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ'}
                              </span>
                              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center ml-1.5">
                                <ShoppingBag className="w-3 h-3" />
                              </div>
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded border border-gray-200 p-12 text-center">
                  <h3 className="text-xl font-serif text-slate-900 mb-2">Danh mục này hiện chưa có sản phẩm</h3>
                  <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">Vui lòng quay lại sau để cập nhật những thiết kế mới nhất.</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center bg-black text-white px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors"
                  >
                    Đi Tới Cửa Hàng
                    <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {activeShowcaseTab && categoryProducts.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Link
                    to={`/shop?category=${activeShowcaseTab}`}
                    className="inline-flex items-center justify-center border border-slate-600/60 text-slate-800 px-8 py-2.5 text-[12px] uppercase tracking-widest font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 rounded"
                  >
                    XEM TẤT CẢ <span className="font-bold ml-1">{activeTabName}</span> 
                  </Link>
                </div>
              )}
            </div>
          </section>

      {/* Bestseller Carousel */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a2a2a] whitespace-nowrap">
            Những Sản Phẩm Bán Chạy Nhất Mùa
          </h2>
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
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest rounded-tl-xl rounded-br-xl shadow-sm border border-slate-200">
                    Mới Nhập
                  </div>
                  {!!product.discountPercent && product.discountPercent > 0 && (
                    <div className="self-start bg-[#e53935] text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm tracking-widest">
                      -{product.discountPercent}%
                    </div>
                  )}
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
                {!!product.discountPercent && product.discountPercent > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[#e53935] font-bold text-sm">{formatVND(product.price * (1 - product.discountPercent / 100))}</p>
                    <p className="text-slate-400 font-medium text-[11px] line-through">{formatVND(product.price)}</p>
                  </div>
                ) : (
                  <p className="text-red-600 font-bold text-sm mt-1">{formatVND(product.price)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegant Shirts Collection */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#2a2a2a] whitespace-nowrap">
                  Áo Sơ Mi Lịch Lãm
                </h2>
                <p className="text-slate-600 text-lg mt-4 max-w-2xl leading-relaxed">Những chiếc áo sơ mi được chọn lọc từ các nhà thiết kế hàng đầu, kết hợp giữa vải chất lượng cao và thiết kế tinh tế.</p>
              </div>
              <Link
                to="/shop?category=shirts"
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-bold text-slate-900 hover:text-blue-600 transition-colors shrink-0"
              >
                Xem Tất Cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {shirtLoading ? (
            <div
              className="flex items-stretch gap-4 overflow-x-auto pb-4 animate-pulse no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-[220px] flex-shrink-0 bg-slate-200 rounded-tl-[32px] rounded-br-[32px] h-[340px]"
                />
              ))}
            </div>
          ) : shirtProducts.length > 0 ? (
            <div
              className="shirt-carousel-wrapper overflow-hidden"
              onMouseEnter={() => setIsShirtsPaused(true)}
              onMouseLeave={() => setIsShirtsPaused(false)}
            >
              <div className="shirt-carousel-track flex items-stretch gap-4" style={trackStyle}>
              {[...shirtProducts, ...shirtProducts].map((product, index) => (
                <Link
                  key={`${product._id}-${index}`}
                  to={`/product/${product._id}`}
                  className="w-[220px] flex-shrink-0 group bg-white border border-slate-200 rounded-tl-[32px] rounded-br-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-900/15 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative overflow-hidden">
                    <img
                      alt={product.name}
                      className="w-full h-[240px] object-cover transition-transform duration-700 group-hover:scale-110"
                      src={product.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      <div className="self-start bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase px-2.5 py-1 tracking-widest rounded-tl-lg rounded-br-lg shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Mới
                      </div>
                      {!!product.discountPercent && product.discountPercent > 0 && (
                        <div className="self-start bg-[#e53935] text-white text-[10px] font-bold uppercase px-2 py-1 tracking-widest rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          -{product.discountPercent}%
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif text-sm text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      {!!product.discountPercent && product.discountPercent > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-[#e53935] font-bold text-sm">{formatVND(product.price * (1 - product.discountPercent / 100))}</span>
                          <span className="text-slate-400 font-medium text-[11px] line-through">{formatVND(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-red-600 font-bold text-sm">{formatVND(product.price)}</span>
                      )}
                      <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-blue-600 group-hover:text-blue-700">Khám Phá</span>
                    </div>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          ) : (
            <div className="rounded-tl-[40px] rounded-br-[40px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="text-xl font-serif text-slate-900 mb-2">Áo Sơ Mi Chưa Có Hàng</h3>
              <p className="text-slate-500 mb-5 text-sm">Các sản phẩm áo sơ mi đang được cập nhật. Vui lòng quay lại sau.</p>
              <Link
                to="/shop"
                className="inline-flex items-center bg-slate-900 text-white px-6 py-2 text-xs uppercase tracking-[0.2em] font-bold hover:bg-blue-600 transition-colors rounded-tl-xl rounded-br-xl"
              >
                Đi Tới Cửa Hàng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-8 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/70 mb-2">Thong tin dich vu</p>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">Tim hieu day du chinh sach mua sam va dac quyen thanh vien</h3>
              <p className="text-sm text-white/80 mt-3 max-w-2xl">
                Xem thong tin minh bach ve doi tra, giao hang, bao mat va cac quyen loi danh rieng cho hoi vien King Man.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/policies"
                className="inline-flex items-center rounded-full bg-white text-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-slate-100 transition-colors"
              >
                Xem chinh sach
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center rounded-full border border-white/40 text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white/10 transition-colors"
              >
                Trang thanh vien
              </Link>
            </div>
          </div>
        </div>
      </section>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 opacity-95">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
