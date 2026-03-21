import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import loginImage from '../assets/images/login.png';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applyAuthPayload } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const activeTitle = isLogin ? 'Chào mừng quay trở lại' : 'Tạo tài khoản mới';
  const activeSubtitle = isLogin
    ? 'Đăng nhập để quản lý đơn hàng, theo dõi ưu đãi và nhận gợi ý sản phẩm phù hợp phong cách của bạn.'
    : 'Đăng ký để nhận ưu đãi thành viên, cập nhật bộ sưu tập mới và trải nghiệm mua sắm nhanh hơn.';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);
      const payload = await api.login(loginForm);
      applyAuthPayload(payload);
      const from = (location.state as { from?: string } | null)?.from;
      // Redirect admins to the admin portal, customers to their profile
      navigate(from ?? (payload.user.role === 'admin' ? '/admin' : '/profile'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng nhập');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);
      const payload = await api.register(registerForm);
      applyAuthPayload(payload);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng ký');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[84vh] overflow-hidden bg-[#f3f1ed] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-[#1f3a5f]/12 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#b38a4c]/18 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-none bg-white/85 shadow-[0_30px_90px_-30px_rgba(18,27,38,0.45)] backdrop-blur-sm md:grid-cols-2">
        <section className="relative hidden min-h-[680px] p-10 md:flex md:flex-col md:justify-between">
          <img
            src={loginImage}
            alt="King Man Fashion"
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2238]/75 via-[#1a2e46]/65 to-[#8f6a35]/45" />

          <div className="relative z-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/85">King Man</p>
            <h2 className="max-w-sm font-serif text-4xl leading-tight text-white">Nâng tầm trải nghiệm mua sắm thời trang cao cấp.</h2>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 text-white/90">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
              <p className="text-2xl font-semibold">24/7</p>
              <p className="text-xs uppercase tracking-[0.16em]">Hỗ trợ khách hàng</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
              <p className="text-2xl font-semibold">500k+</p>
              <p className="text-xs uppercase tracking-[0.16em]">Thành viên đã đăng ký</p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 flex items-center justify-between rounded-full bg-slate-100/80 p-1.5">
            <button
              type="button"
              className={`w-1/2 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all ${
                isLogin ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`w-1/2 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all ${
                !isLogin ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </button>
          </div>

          <div className="mb-6">
            <h1 className="mb-2 font-serif text-3xl text-slate-900">{activeTitle}</h1>
            <p className="text-sm leading-relaxed text-slate-600">{activeSubtitle}</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-0 transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                  placeholder="you@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Mật khẩu
                  </label>
                  <button type="button" className="text-xs text-slate-500 transition hover:text-slate-800">
                    Quên mật khẩu?
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-0 transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-full bg-slate-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#b38a4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Họ
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                    placeholder="Nguyễn"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Tên
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                    placeholder="Văn A"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-email" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                  placeholder="you@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-password" className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Mật khẩu
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="h-12 w-full rounded-2xl bg-slate-100/80 px-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
                  placeholder="Ít nhất 8 ký tự"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-full bg-slate-900 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#b38a4c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Tiếp tục nghĩa là bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của King Man.
          </p>
        </section>
      </div>
    </div>
  );
}
