import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { ChevronRight, Heart, Share2, Truck, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';

type ProductDetail = Product & {
  variants: Array<{ _id: string; size: string; color: string; sku: string; stockQuantity: number }>;
};

export default function PDP() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          return;
        }
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24">Product not found</div>;
  }

  const selectedVariant = product.variants.find(
    (variant) => variant.size === selectedSize && variant.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select both size and color.');
      return;
    }

    try {
      setIsAddingToCart(true);
      await api.addToCart({
        productId: product._id,
        productVariantId: selectedVariant._id,
        quantity: 1
      });
      alert('Added to cart');
    } catch (error) {
      console.error(error);
      alert('Please sign in before adding to cart.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
        <nav className="flex text-sm text-gray-500">
          <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-charcoal">{product.category}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-3/5 flex gap-4">
            <div className="hidden md:flex flex-col gap-4 w-24 shrink-0">
              {[1, 2, 3, 4].map((num) => (
                <button key={num} className="aspect-[3/4] bg-gray-100 border border-transparent hover:border-charcoal transition-colors">
                  <img 
                    src={`https://picsum.photos/seed/coat-detail-${num}/200/300`} 
                    alt={`Thumbnail ${num}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 bg-gray-100 aspect-[3/4] relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-2/5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-serif text-3xl md:text-4xl text-charcoal font-bold">{product.name}</h1>
              <button className="p-2 text-gray-400 hover:text-gold transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-xl text-gray-600 mb-8">${product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium uppercase tracking-wider text-charcoal">Color: {selectedColor || 'Select'}</span>
              </div>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      selectedColor === color 
                        ? 'border-charcoal bg-charcoal text-white' 
                        : 'border-gray-300 text-gray-600 hover:border-charcoal'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium uppercase tracking-wider text-charcoal">Size: {selectedSize || 'Select'}</span>
                <button className="text-sm text-gray-500 underline hover:text-charcoal">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-sm transition-colors ${
                      selectedSize === size 
                        ? 'border-charcoal bg-charcoal text-white' 
                        : 'border-gray-300 text-gray-600 hover:border-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mb-12">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-medium uppercase tracking-widest transition-all duration-300 ${
                  product.inStock 
                    ? 'bg-charcoal text-white hover:bg-gold' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock || isAddingToCart}
              >
                {product.inStock ? (isAddingToCart ? 'Adding...' : 'Add to Cart') : 'Out of Stock'}
              </button>
              <button className="p-4 border border-gray-300 text-charcoal hover:border-charcoal hover:bg-gray-50 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
            </div>

            {/* Value Props */}
            <div className="space-y-4 border-t border-gray-200 pt-8">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-5 w-5 mr-3 text-gold" />
                Complimentary shipping on orders over $500
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RefreshCw className="h-5 w-5 mr-3 text-gold" />
                Free returns within 30 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
