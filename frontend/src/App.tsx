/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import PLP from './pages/PLP';
import PDP from './pages/PDP';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import About from './pages/About';
import Contact from './pages/Contact';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Oders';
import AdminCustomers from './pages/admin/Customers';
import AdminSettings from './pages/admin/Settings';
import ProductDetail from './pages/admin/ProductDetail';
import OrderDetail from './pages/admin/OrderDetail';
import CustomerDetail from './pages/admin/CustomerDetail';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<PLP />} />
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}> 
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductDetail />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <ChatWidget />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
