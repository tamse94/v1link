'use client';
import { useState, useEffect } from 'react';
import ShortenerForm from '@/components/form/ShortenerForm';
import UrlList from '@/components/list/UrlList';
import LoginModal from '@/components/auth/LoginModal';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Cek status login di local storage
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null; // Mencegah kedip saat refresh

  return (
    <div className="w-full flex flex-col pb-10">
      
      {/* Jika belum login, tampilkan Popup Modal */}
      {!isLoggedIn && (
        <LoginModal onLoginSuccess={() => setIsLoggedIn(true)} />
      )}

      {/* Konten Utama (Hanya bisa diakses jika sudah login) */}
      <div className={isLoggedIn ? 'block' : 'hidden'}>
        <ShortenerForm />
        
        <div className="w-full relative py-12">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-4 text-sm text-slate-500 font-semibold tracking-widest uppercase">
              Your Link Statistics
            </span>
          </div>
        </div>
        
        <UrlList />
      </div>
      
    </div>
  );
}
