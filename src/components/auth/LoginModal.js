'use client';
import { useState } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mengambil kredensial dari Vercel Env
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    setTimeout(() => {
      if (email === adminEmail && password === adminPass) {
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop Blur Super Halus */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"></div>

      {/* Card Login */}
      <div className="relative w-full max-w-sm animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
            <span className="material-symbols-outlined text-blue-500 text-3xl">lock</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Protected Area</h2>
          <p className="text-slate-400 text-sm mt-1">Please sign in to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>Sign In <span className="material-symbols-outlined text-sm">arrow_forward</span></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest font-medium">
          &copy; {new Date().getFullYear()} V1Link Management System
        </p>
      </div>
    </div>
  );
}
