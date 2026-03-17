import { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { api } from '../lib/api';

export default function PLP() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    size: false,
    color: false
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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.set('category', selectedCategory);
        }
        const data = await api.getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal font-bold mb-4">The Collection</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore our full range of meticulously crafted garments, designed for the modern gentleman.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden flex items-center justify-center w-full py-3 border border-gray-300 text-charcoal font-medium uppercase tracking-widest"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="mr-2 h-5 w-5" />
          Filter & Sort
        </button>

        {/* Sidebar Filters */}
        <aside className={`lg:w-64 shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="border-b border-gray-200 pb-6">
              <button 
                className="flex justify-between items-center w-full text-left font-medium text-charcoal uppercase tracking-wider text-sm"
                onClick={() => toggleSection('category')}
              >
                Category
                {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSections.category && (
                <div className="mt-4 space-y-3">
                  {[{ slug: 'all', name: 'All' }, ...categories].map(cat => (
                    <label key={cat.slug} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-charcoal border-gray-300 rounded-sm focus:ring-charcoal"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span className="text-gray-600 group-hover:text-charcoal transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="border-b border-gray-200 pb-6">
              <button 
                className="flex justify-between items-center w-full text-left font-medium text-charcoal uppercase tracking-wider text-sm"
                onClick={() => toggleSection('size')}
              >
                Size
                {openSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSections.size && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className="border border-gray-300 py-2 text-sm text-center hover:border-charcoal hover:bg-charcoal hover:text-white transition-colors">
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="border-b border-gray-200 pb-6">
              <button 
                className="flex justify-between items-center w-full text-left font-medium text-charcoal uppercase tracking-wider text-sm"
                onClick={() => toggleSection('color')}
              >
                Color
                {openSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSections.color && (
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Charcoal', hex: '#333333' },
                    { name: 'Navy', hex: '#000080' },
                    { name: 'Camel', hex: '#C19A6B' },
                    { name: 'Olive', hex: '#556B2F' }
                  ].map(color => (
                    <label key={color.name} className="flex items-center space-x-3 cursor-pointer group">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-charcoal border-gray-300 rounded-sm focus:ring-charcoal" />
                      <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }}></span>
                      <span className="text-gray-600 group-hover:text-charcoal transition-colors">{color.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{products.length} Results</p>
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border-none bg-transparent font-medium text-charcoal focus:ring-0 cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                  <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
