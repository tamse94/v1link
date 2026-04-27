'use client';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

export default function AuthWrapper({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null; 

  return (
    <>
      {/* KONTEN UTAMA: Kalau belum login, dibikin blur, agak transparan, dan gak bisa diklik */}
      <div className={`transition-all duration-700 ${!isLoggedIn ? 'blur-md opacity-30 pointer-events-none select-none' : ''}`}>
        {children}
      </div>

      {/* POPUP LOGIN: Muncul menimpa di atasnya */}
      {!isLoggedIn && <LoginModal onLoginSuccess={() => setIsLoggedIn(true)} />}
    </>
  );
}
