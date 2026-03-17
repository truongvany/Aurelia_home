import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { api } from '../lib/api';
import { CartPayload } from '../types';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [address, setAddress] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await api.getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cart?.total ?? 0;
  const shippingFee: number = 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please enter shipping address.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      await api.placeOrder({ shippingAddress: address });
      setIsPlaced(true);
      setCart(await api.getCart());
    } catch (error) {
      console.error(error);
      alert('Unable to place order. Please sign in and try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-charcoal font-bold mb-10 text-center">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-3/5">
          {!isPlaced ? (
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Shipping Address</h2>
              <textarea
                rows={5}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address"
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-charcoal resize-none"
              />
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-charcoal text-white py-4 font-medium uppercase tracking-widest hover:bg-gold transition-colors mt-8 disabled:opacity-60"
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-4">Order Placed</h2>
              <p className="text-gray-600">Your order has been created successfully.</p>
            </div>
          )}
        </div>

        <div className="lg:w-2/5">
          <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-serif font-bold text-charcoal mb-6">Order Summary</h2>

            <div className="space-y-6 mb-8">
              {(cart?.items ?? []).map((item) => (
                <div key={item._id} className="flex gap-4">
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-20 h-24 object-cover bg-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-1">{item.productName}</h3>
                    <p className="text-xs text-gray-500 mb-2">Size: {item.size} | Color: {item.color}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium text-charcoal">${item.unitPrice.toFixed(2)}</span>
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
                <span>{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
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
