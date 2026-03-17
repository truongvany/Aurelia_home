import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-offwhite pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-bold tracking-widest uppercase text-white mb-6 block">
              Aurelia Home
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Defining modern luxury for the discerning gentleman. Crafted with precision, designed for legacy.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-400 hover:text-gold transition-colors text-sm">Shop All</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-gold transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold transition-colors text-sm">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Client Services</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-gold transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-gold transition-colors text-sm">Size Guide</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Aurelia Home. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
