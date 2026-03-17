import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  const mockCart = [
    { id: '1', name: 'The Cashmere Overcoat', price: 1250.00, size: '48', color: 'Charcoal', qty: 1, image: 'https://picsum.photos/seed/coat/100/150' },
    { id: '2', name: 'Silk Blend Turtleneck', price: 345.00, size: 'M', color: 'Black', qty: 1, image: 'https://picsum.photos/seed/turtleneck/100/150' }
  ];

  const subtotal = mockCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping: number = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-charcoal font-bold mb-10 text-center">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <div className="lg:w-3/5">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gray-200 -z-10"></div>
            
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center bg-offwhite px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${
                  step > s.num ? 'bg-charcoal text-white' : 
                  step === s.num ? 'bg-gold text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={`text-xs uppercase tracking-wider ${step >= s.num ? 'text-charcoal font-medium' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Shipping Address</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Address</label>
                  <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">City</label>
                    <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Postal Code</label>
                    <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors mt-8"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment (Mock) */}
          {step === 2 && (
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Payment Details</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">CVV</label>
                    <input type="text" placeholder="123" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal" />
                  </div>
                </div>
                <div className="flex space-x-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 border border-gray-300 text-charcoal py-4 font-medium uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Order Ready to Place</h2>
              <p className="text-gray-600 mb-8">Please review your items and total before confirming.</p>
              
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-gray-300 text-charcoal py-4 font-medium uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Order Placed! (Mock)')}
                  className="w-2/3 bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {mockCart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-gray-100" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">Size: {item.size} | Color: {item.color}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                      <span className="text-sm font-medium text-charcoal">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-serif font-bold text-charcoal">Total</span>
                <span className="font-serif font-bold text-xl text-charcoal">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
