'use client';
import { useEffect } from 'react';

export default function ToastNotif({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div className={`fixed bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-md sm:rounded-lg md:rounded-xl text-white text-xs sm:text-sm md:text-base lg:text-lg shadow-lg sm:shadow-xl md:shadow-2xl z-50 ${bgColor} animate-bounce transition-all`}>
      {message}
    </div>
  );
}
