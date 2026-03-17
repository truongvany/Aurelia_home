import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-charcoal text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">Sold Out</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center">
        <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
