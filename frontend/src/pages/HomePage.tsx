import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Bot, Sparkles } from 'lucide-react';
import { Product } from '../types';

const mockBestsellers: Product[] = [
  {
    _id: 'prod-1',
    name: 'Sterling Charcoal Suit',
    description: 'A timeless classic crafted from pure Mongolian cashmere.',
    price: 1250.00,
    category: 'Outerwear',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Camel'],
    inStock: true
  },
  {
    _id: 'prod-2',
    name: 'Midnight Wool Blazer',
    description: 'Lightweight, breathable, and incredibly soft.',
    price: 890.00,
    category: 'Knitwear',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i87OVxxHmXunaf2nV6RiRdkzm0xIfz7Y08mMzSsDa_7UmulYg6nIlHDtegH4XL_-zONXUmzj1tN0WnJGcwc8kuUe-C4hpQobTA6QIMw0Ws8y-DnnCHcg04FeH7sie07O9ibl1mHmSxRSNDWlJhrw3qcNWLu6jJLeZJYdvhRWPsv7ta0uqjXcA8BK4Axsq8Q31Eqt2fDHkbtnTgGy8QNifJ3mhbogqXq_VTs7IG_8iXTeTBD-Z-IS-BroR1dC2AbCO671tI5pA1Q',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    inStock: true
  },
  {
    _id: 'prod-3',
    name: 'Egyptian Cotton Shirt',
    description: 'Precision cut for a modern, tapered silhouette.',
    price: 220.00,
    category: 'Shirts',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkp0y2C5sO1Kmu91TWIe7h52GvFcx0SmWm6yi-P4Q-C8fA1CzZqU4g5fguoaaXzb2x6tuCDAp5hhhQTzDTkFT83YMgOUUWv09T-BjnNNBEPSX8bz9zcvgq3jIgzzDckCKuB_vIouYoyZR7ECLCZR0703Rvs6Tavi0yJI5biQLzxTQ6W6m0ssRY2i3yR6LfpgkhUgtUs23Amzigrm7XQm_5M8rhY6Zf19HqelKZzSH8RkKcGGrBAmj7H07F10NsKCvjSdXxq0TvYq0',
    sizes: ['30', '32', '34', '36'],
    colors: ['White', 'Light Blue'],
    inStock: true
  },
  {
    _id: 'prod-4',
    name: 'Hand-Stitched Belt',
    description: 'Handcrafted in Italy using full-grain calf leather.',
    price: 180.00,
    category: 'Accessories',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3fvopJ4PhAVgkq5NfFoID5ynBIrdzvSVBtewp2HioS4M8Jn_5kO10K0n1P_OORiArGz567PAw-qwr3yHNCevPBF7mZ90E6iR2WkoCB8q28DuI9ufe50dRNic7Xu8WHEOO9pNyCW0soMPHCl4fXH0SlH49L-xqTzS3JPdA8nhYxTOCsOKfJJEH0lDnW0NjLKp6AM-bu7V4iSjw6St7fcmp2tvuOogG-F5M4oqME6tYpe8pxv8QjSppX3iqmSBC3yvCjVbAiB2fAQw',
    sizes: ['32', '34', '36', '38'],
    colors: ['Black', 'Brown'],
    inStock: true
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-slate-900">
        <img 
          alt="Cinematic tailored suit detail" 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJAJCi1iFk5Z1Q6oRQlyH-NeAhPLrnClaubd6IeWZP7dFgdMIdezERq6Q_yR6AJ9d3j7M8IdNc7riQCbon0i-6vb_dkF2nSga5ZzvRdUZngqjv2rMxuELLlW7OH1dKSIoIGx_DVVMEu6X4vj-NhYhNNOjuz2CWlI4UqK9fkAmC2hhHoEFjNgWMVukZ3JwQM1D95G1TyuxEs_-E5c8H8rwaEF36Dj8zlRWKnqz3n8xgDR7GpUT-r5oFhnFOOkbTxxZgRRnjpBkqFbM"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900/60"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-serif mb-8 max-w-4xl leading-tight">
            The Modern <br/> <span className="italic">Gentleman</span> Collection
          </h1>
          <div className="flex flex-col items-center space-y-6">
            <p className="text-white/80 text-lg font-light tracking-wide max-w-xl">
              Redefining luxury through architectural precision and sustainable craftsmanship.
            </p>
            <Link to="/shop" className="bg-blue-600 text-white px-12 py-4 text-sm uppercase tracking-[0.2em] font-medium hover:bg-blue-700 transition-all duration-500 shadow-xl">
              Shop Now
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
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-4 block">Our Heritage</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">Timeless Craftsmanship, Sustainably Sourced.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              At Aurelia Homme, every stitch tells a story of dedication. We believe that true luxury lies in the marriage of high-performance natural fibers and centuries-old tailoring techniques.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-2">Virgin Wool</h4>
                <p className="text-sm text-slate-500">Sourced from ethical farms in the Italian Highlands.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-2">Full Grain</h4>
                <p className="text-sm text-slate-500">Leather cured with natural extracts for longevity.</p>
              </div>
            </div>
            <Link to="/about" className="inline-block mt-12 border-b border-slate-900 pb-1 text-sm uppercase tracking-widest font-bold hover:text-blue-600 hover:border-blue-600 transition-all">
              Discover Our Process
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWRNnBcl2qXgHaw1jaN14NuGCjFXt3_cONYBcSXoEBb_YbkcY7RHUwAIZsxsvMe8DvuNZmykI73JkzMF7nQIF8vdMPn4K8atrpAztxCw6E5NVpdtQs2e6XxfJljxZ_Y-PvihJS0XNR3Sx38lPos35yZin3yrJRQAFsjfFM7f3JKvaN29YaVX_2-vykZlIMIjo7OME7JxYkaC8YY5FuKJwv4T6F5XIg60gJgqiqftxwqXCi5GuMtb5GatTPew3a5EMO8IFhcdhDnY"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Stylist Intro */}
      <section className="py-24 bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl font-serif mb-4">Meet Your Personal AI Grooming & Style Assistant</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Hyper-personalized styling advice based on your body shape, event type, and current wardrobe.</p>
          </div>
          
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">AH</div>
                <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 text-sm text-white/90 max-w-[80%]">
                  "Hello, Julian. Based on your athletic build and tonight's 'Creative Black Tie' event, I suggest the Midnight Navy Tuxedo."
                </div>
              </div>
              <div className="flex items-start flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white">ME</div>
                <div className="bg-blue-600/20 border border-blue-600/30 rounded-2xl rounded-tr-none p-4 text-sm text-white/90 max-w-[80%]">
                  "Show me some accessories to pair with that."
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="w-20 h-20 bg-slate-900 rounded-lg overflow-hidden border border-white/10">
                  <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv7nuZWjLmR1ENl_TiiJ6vF2Am1ocD3ig6x_SyVJl4-uvI3V8VhKkEVWjqgNmgolbyAU0rebFkrCNVcdUY8rLEs8MjO7SGqKAFG-elzLdklCBQTkIdXKr08832Cj0n3tv5nKKmCS7CedR05Wt9SVuOejcIIgK39rxII2P170qILpCrMtYJhFDPcvNE6tH5N5THYIMiZE0Ak10tNQ3iBSwxVEgvPWtoAUq6tYSXJg1r-LJDGfQUat5tDk3V3hdZLuvnAJbeva1-PiE" referrerPolicy="no-referrer" />
                </div>
                <div className="w-20 h-20 bg-slate-900 rounded-lg overflow-hidden border border-white/10">
                  <img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpeO8hFJv8ChrIB3DfP6n0NdIAElu-A1AUsYvjVluF-DwRn6fsBC7mYjckuEwJpYDutVL28umJK0Tjqm5E5WwKfxVFv8dNl2z1M98Wn6TPsiVbRkDEe5A3k0BJhBsTls7jcr6keA5CC4ZoSVpOZwngst7nsiWnQDYNyKBdk2pQMPl4sfAr70uZx-YhyhQ2PQza8i2CoNXfjdaSsp_pNE3GOuJzrjg-2olTV7zf69MKUB-pcCWgux96T0Tl6PHRNesjsMEIFXV-nk8" referrerPolicy="no-referrer" />
                </div>
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="text-white text-xs">+3 More</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col justify-center items-center text-center space-y-6 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
              <div className="w-24 h-24 rounded-full border-2 border-blue-600 flex items-center justify-center animate-pulse">
                <Bot className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">Live AI Analysis</p>
              <Link to="/ai-assistant" className="w-full py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all text-center block">
                Launch Stylist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[1000px]">
            {/* Tailored Suits */}
            <Link to="/shop?category=suits" className="md:col-span-8 relative group overflow-hidden h-[300px] md:h-auto block">
              <img 
                alt="Tailored Suits" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_zja9JwieBVbbrn67olX8hpr8lnJvT3FdXrlLvLN-XBTEiC9DvkUoacjcvK3dOPkJoCspLP82of4C3g5Lw7YBEL0F47a1QqeMOxKqEf8blwXd_nTZc6aaBLjC0HNUVSO3pyYwPjEdB6b8QtjT1bloKr6MKZmuMewm_glVgUEFOOELvrcwkPeBP4pZcLSDH5z631derB5OQymUvMEWb4X0fRcTPib_Jv0_LGlc8GDHIB4bSuN9ez7TFykiM9zIu39Bqg5vbZXjXI4"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif mb-2">Tailored Suits</h3>
                <p className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center">
                  Shop The Edit <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </div>
            </Link>
            
            {/* Urban Casual */}
            <Link to="/shop?category=casual" className="md:col-span-4 relative group overflow-hidden h-[300px] md:h-auto block">
              <img 
                alt="Urban Casual" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYTwHdDbZTA29tVB4azM_jwTmcdRONwWp6r4uNJDPg_QeuTmpy-T7PrTPBW8M8ebwfxLRaorvTHR01gSThr6NA3RObbnRM-bZf9vrJYnaEuyZChLjHKsE2xBX9DIvoe6OOa5YVMW6XYfBvtwslwZke5n_-CVhUX50PREGPV7wHm9D00i8cxXHULeTOUB05zpSw-EuHRH6PYELfBzUYEkIZPOB6zz4GeRwtXhOMOPEpykhk-F5AMojYEIlMTdSndBQgHlcHZCUibCk"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif mb-2">Urban Casual</h3>
                <p className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center">
                  Shop The Edit <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </div>
            </Link>
            
            {/* Classic Essentials */}
            <Link to="/shop?category=essentials" className="md:col-span-4 relative group overflow-hidden h-[300px] md:h-auto block">
              <img 
                alt="Classic Essentials" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTGLoS-X8bCeo8RGpzcFSk37za_-yNoRPQBUAeZet5XNrv_VBKqyni9ZMkzLZVVHOjbybXd9fJcLJi1S2tShJrTrreeUUCCLK7gkttLeIptapndRCwzfsPe7DET9nhMSJyPuEu4J4zXgOXN4REEe6Cx0HnfXFUeFnaTwzwfP_CuJjZ5MQCsNVyhmxcfEEGxPFeEncD_gn5Lgk2yqJ_JLwXDOtREenzE-SXeKeWLQ55DIplh5P5umgsmbGxmFFFGqvNVGJOdjDuEDc"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif mb-2">Classic Essentials</h3>
                <p className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center">
                  Shop The Edit <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </div>
            </Link>
            
            {/* Accessories */}
            <Link to="/shop?category=accessories" className="md:col-span-8 relative group overflow-hidden h-[300px] md:h-auto block">
              <img 
                alt="Accessories" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwiqXJ0vfE0DzCtdR-qycKocgVm6HWixIkCtQ2tNOX8SQ1h6VYLNsY3O7C9WACQGo8-_iDHUwodXElsdeuG-6DJtHvSkgYkkC6-GUl7WKqduLf0v1aqpOmwTnEIujXDq2gStHPR5540wpst6FpK3vfuGjQxYKsye1U5t6g8GTMvBU27wPyyn-_HJlBx0-Rfulmm0DKBFUqhFDrKMPRvClCRXmrSoN_BwldowKGkFae_xzjdEGCxyuTna63EO9k-sQdj4mJXLSiC7c"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif mb-2">Refined Accessories</h3>
                <p className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center">
                  Shop The Edit <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bestseller Carousel */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
          <div>
            <span className="text-blue-600 uppercase tracking-widest text-xs font-semibold mb-2 block">Our Finest</span>
            <h2 className="text-4xl font-serif text-slate-900">The Season's Bestsellers</h2>
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
          {mockBestsellers.map(product => (
            <div key={product._id} className="min-w-[300px] flex-shrink-0 group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-white">
                <img 
                  alt={product.name} 
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={product.imageUrl}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] uppercase px-2 py-1 tracking-widest">
                  New Entry
                </div>
                <Link 
                  to={`/product/${product._id}`} 
                  className="absolute bottom-0 left-0 w-full bg-slate-900 text-white py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs uppercase tracking-widest font-bold text-center block"
                >
                  Quick Add
                </Link>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">{product.name}</h4>
              <p className="text-slate-500 text-sm mt-1">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
