import React, { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    console.log('Logging in...');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register logic
    console.log('Registering...');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-offwhite">
      <div className="max-w-4xl w-full bg-white shadow-xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Image Section */}
        <div className="md:w-1/2 relative hidden md:block">
          <img 
            src="https://picsum.photos/seed/auth-bg/800/1000" 
            alt="Aurelia Home Lifestyle" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center p-12">
            <div className="text-center">
              <h2 className="font-serif text-3xl text-white font-bold mb-4">Aurelia Home</h2>
              <p className="text-white/90 text-sm leading-relaxed">
                Join our exclusive community to access personalized styling, early access to collections, and complimentary shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="flex justify-center space-x-8 mb-10 border-b border-gray-200">
            <button 
              className={`pb-4 text-sm font-medium uppercase tracking-widest transition-colors relative ${
                isLogin ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
              {isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-charcoal"></span>}
            </button>
            <button 
              className={`pb-4 text-sm font-medium uppercase tracking-widest transition-colors relative ${
                !isLogin ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
              {!isLogin && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-charcoal"></span>}
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-gray-500 hover:text-charcoal">Forgot Password?</a>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors mt-8"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">First Name</label>
                  <input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
                  <input 
                    id="lastName" 
                    name="lastName" 
                    type="text" 
                    required 
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  id="reg-email" 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Password</label>
                <input 
                  id="reg-password" 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors mt-8"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
