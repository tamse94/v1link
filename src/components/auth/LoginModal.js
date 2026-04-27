'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState('V1Link'); // Default sementara

  // Ambil nama situs dari database pas form login muncul
  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('site_name').eq('id', 1).single();
      if (data && data.site_name) setSiteName(data.site_name);
    }
    fetchSettings();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: dbError } = await supabase
        .from('settings')
        .select('admin_email, admin_password')
        .eq('id', 1)
        .single();

      if (dbError || !data) {
        setError('Database connection failed.');
        setLoading(false);
        return;
      }

      if (email.trim() === data.admin_email && password.trim() === data.admin_password) {
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess();
      } else {
        setError('Access Denied: Invalid credentials.');
      }
    } catch (err) {
      setError('System error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed tanpa background dari wrapper ini karena efek blurnya udah diatur di AuthWrapper
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop semi transparan untuk memperkuat efek gelap */}
      <div className="absolute inset-0 bg-slate-950/60 animate-in fade-in duration-500"></div>

      {/* MODAL CARD */}
      <div className="relative w-full max-w-[380px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500">
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-500/20 blur-2xl rounded-full"></div>

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 mb-4 rotate-3">
            <span className="material-symbols-outlined text-white text-3xl">shield_person</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Login</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-widest">Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-sm shadow-inner"
              placeholder="Email address"
            />
          </div>

          <div className="space-y-1">
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-sm shadow-inner"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 p-3.5 rounded-xl border border-red-500/20">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 mt-4 active:scale-95"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            ) : (
              <>LOGIN TO SYSTEM <span className="material-symbols-outlined text-lg">arrow_forward</span></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center text-center">
           {/* TEXT DINAMIS SESUAI SITE NAME DI PENGATURAN */}
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">&copy; {siteName} CORE SYSTEM</p>
        </div>
      </div>
    </div>
  );
}
