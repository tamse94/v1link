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

  if (!isLoggedIn) {
    return <LoginModal onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <>{children}</>;
}
