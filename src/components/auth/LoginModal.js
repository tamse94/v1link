'use client';
import { useState, useEffect } from 'react';

export default function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil data dari Vercel Env
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Debugging otomatis: Lu bisa liat di Console Browser (F12) apakah datanya masuk atau 'undefined'
  useEffect(() => {
    if (!ADMIN_EMAIL || !ADMIN_PWD) {
      console.warn("Vercel Check: Environment Variables are missing! Make sure the Keys are EXACTLY: NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD");
    } else {
      console.log("Vercel Check: Admin credentials successfully loaded into the build.");
    }
  }, [ADMIN_EMAIL, ADMIN_PWD]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Gunakan trim() buat buang spasi gak sengaja pas lu copy-paste di Vercel
    const inputEmail = email.trim();
    const inputPass = password.trim();

    setTimeout(() => {
      if (inputEmail === ADMIN_EMAIL && inputPass === ADMIN_PWD) {
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please check your Vercel settings and redeploy.');
        setLoading(false);
      }
    }, 800;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"></div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
            <span className="material-symbols-outlined text-blue-500 text-3xl">lock</span>
          </div>
          <h2 className="text-2xl font-black text-white">System Login</h2>
          <p className="text-slate-400 text-sm mt-1">V1Link Protected Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 text-white outline-none focus:border-blue-600 text-sm"
            placeholder="Email Address"
          />
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 px-4 text-white outline-none focus:border-blue-600 text-sm"
            placeholder="Password"
          />
          {error && <div className="text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
