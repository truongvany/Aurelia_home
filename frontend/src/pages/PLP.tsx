import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, Filter, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/api';
import { formatVND } from '../utils/currency';
import PriceRangeSlider from '../components/PriceRangeSlider';

export default function PLP() {
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') ?? 'all';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 20;

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    size: true,
    color: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await api.getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (queryCategory !== selectedCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [queryCategory, selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        const data = await api.getProducts(params);
        setAllProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const sizeOptions = useMemo(() => {
    const values = new Set<string>();
    allProducts.forEach((product) => {
      product.sizes.forEach((size) => values.add(size));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const colorOptions = useMemo(() => {
    const values = new Set<string>();
    allProducts.forEach((product) => {
      product.colors.forEach((color) => values.add(color));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);

  const priceBounds = useMemo(() => {
    if (allProducts.length === 0) return [0, 0] as [number, number];
    const prices = allProducts.map((p) => p.price);
    const min = 0; // Always start from 0đ
    const max = Math.max(...prices);
    return [min, Math.ceil(max)] as [number, number];
  }, [allProducts]);

  useEffect(() => {
    if (priceBounds[1] > 0) {
      setPriceRange(priceBounds);
    }
  }, [priceBounds]);

  const filteredProducts = useMemo(() => {
    const next = allProducts.filter((product) => {
      const sizeMatch = selectedSize === 'all' || product.sizes.includes(selectedSize);
      const colorMatch = selectedColor === 'all' || product.colors.includes(selectedColor);
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return sizeMatch && colorMatch && priceMatch;
    });

    if (sortBy === 'price-asc') {
      return [...next].sort((a, b) => a.price - b.price);
    }

    if (sortBy === 'price-desc') {
      return [...next].sort((a, b) => b.price - a.price);
    }

    if (sortBy === 'name-asc') {
      return [...next].sort((a, b) => a.name.localeCompare(b.name));
    }

    return next;
  }, [allProducts, selectedSize, selectedColor, priceRange, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSize, selectedColor, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const visiblePages = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    const normalizedStart = Math.max(1, end - 4);

    return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
  }, [currentPage, totalPages]);

  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const priceSpan = Math.max(1, priceBounds[1] - priceBounds[0]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        <section className="mb-10 px-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-3">Aurelia Shop</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl lg:text-6xl leading-[0.95]">Sản phẩm mới</h1>
              <p className="mt-4 text-sm lg:text-base text-slate-600 max-w-3xl">
                Trình bày tinh gọn, dữ liệu rõ ràng, trải nghiệm mua sắm cao cấp với hiển thị 4 sản phẩm mỗi hàng.
              </p>
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-700">{filteredProducts.length} sản phẩm</p>
          </div>
        </section>

        <button
          className="lg:hidden w-full bg-slate-900 text-white py-3 text-xs uppercase tracking-[0.2em] font-semibold mb-6 flex items-center justify-center gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" /> Bộ lọc
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
          <aside className={`lg:col-span-3 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24">
              <div className="mb-8">
                <h2 className="font-semibold uppercase tracking-[0.16em] text-xs mb-4">Danh mục</h2>
                <button
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.16em] text-slate-700 mb-3"
                  onClick={() => toggleSection('category')}
                >
                  Chọn danh mục
                  {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.category && (
                  <div className="space-y-1">
                    {[{ slug: 'all', name: 'Tất cả' }, ...categories].map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`block w-full py-2 text-left text-sm uppercase tracking-[0.12em] transition-colors ${
                          selectedCategory === cat.slug ? 'text-slate-950 font-semibold bg-slate-200/70' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <button
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.16em] text-slate-700 mb-3"
                  onClick={() => toggleSection('size')}
                >
                  Kích cỡ
                  {openSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.size && (
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSize('all')}
                      className={`px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                        selectedSize === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                      }`}
                    >
                      Tất cả
                    </button>
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                          selectedSize === size ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <button
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-[0.16em] text-slate-700 mb-3"
                  onClick={() => toggleSection('color')}
                >
                  Màu sắc
                  {openSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openSections.color && (
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedColor('all')}
                      className={`px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
                        selectedColor === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                      }`}
                    >
                      Tất cả
                    </button>
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 text-xs uppercase tracking-[0.08em] transition-colors ${
                          selectedColor === color ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-700 mb-3">Khoảng giá</p>
                <div className="text-sm text-slate-600 mb-4 flex items-center justify-between">
                  <span className="font-semibold">{formatVND(priceRange[0])}</span>
                  <span className="font-semibold">{formatVND(priceRange[1])}</span>
                </div>
                <PriceRangeSlider
                  min={priceBounds[0]}
                  max={priceBounds[1]}
                  step={Math.max(1000, Math.round(priceSpan / 40))}
                  currentRange={priceRange}
                  onRangeChange={setPriceRange}
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-700 mb-3">Sắp xếp</p>
                <div className="flex flex-wrap gap-1 mb-5">
                  {[
                    { id: 'newest', label: 'Mới nhất' },
                    { id: 'price-asc', label: 'Giá tăng' },
                    { id: 'price-desc', label: 'Giá giảm' },
                    { id: 'name-asc', label: 'Tên A-Z' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSortBy(option.id)}
                      className={`px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${
                        sortBy === option.id ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setPriceRange(priceBounds);
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-900 text-white py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-slate-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 px-1">
              <p className="text-sm text-slate-600">
                Hiển thị {startItem}-{endItem} trên {filteredProducts.length} sản phẩm
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">20 sản phẩm mỗi trang</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-7">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-3">
                    <div className="aspect-[4/5] bg-slate-300 mb-3" />
                    <div className="h-3 bg-slate-300 w-5/6 mb-2" />
                    <div className="h-3 bg-slate-300 w-1/2" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-20 text-center bg-white/70">
                <h3 className="font-serif text-3xl mb-3">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-slate-600 mb-8">Hãy thử thay đổi bộ lọc để xem thêm sản phẩm.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSize('all');
                    setSelectedColor('all');
                    setPriceRange(priceBounds);
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className="bg-slate-900 text-white px-7 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-slate-700 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                  {paginatedProducts.map((product) => (
                    <article key={product._id} className="group bg-white p-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.18)]">
                      <div className="relative overflow-hidden bg-[#ece8e2] mb-3">
                        <Link to={`/product/${product._id}`} className="block">
                          <img
                            alt={product.name}
                            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={product.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-stretch">
                            <Link
                              to={product.inStock ? `/product/${product._id}` : '#'}
                              onClick={(event) => {
                                if (!product.inStock) {
                                  event.preventDefault();
                                }
                              }}
                              className={`flex-1 py-3 px-3 text-[11px] uppercase tracking-[0.14em] font-semibold flex items-center justify-center gap-2 ${
                                product.inStock ? 'bg-[#f2efe9] text-slate-900 hover:bg-[#dfd9ce]' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingBag className="h-4 w-4" /> Thêm vào giỏ
                            </Link>
                            <Link
                              to={`/product/${product._id}`}
                              className="w-12 bg-[#2f2f2f] text-white hover:bg-black flex items-center justify-center"
                              aria-label={`Xem nhanh ${product.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">{product.category}</p>
                      <Link to={`/product/${product._id}`} className="block mb-1">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.4rem]">{product.name}</h3>
                      </Link>
                      <p className="text-base font-semibold text-slate-900 mb-1">{formatVND(product.price)}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {product.colors.length} màu • {product.sizes.length} size
                      </p>
                    </article>
                  ))}
                </div>

                <div className="mt-10 bg-white/80 px-3 py-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-slate-900 text-white px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {visiblePages.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 text-sm font-semibold transition-colors ${
                          currentPage === pageNumber ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-slate-900 text-white px-5 py-3 text-xs uppercase tracking-[0.18em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
