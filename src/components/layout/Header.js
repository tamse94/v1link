'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500 text-2xl">link</span>
          <span className="text-xl font-bold text-white tracking-wide">V1Link</span>
        </Link>

        {/* Tombol Hamburger (Hanya tampil di HP) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-slate-300 hover:text-white focus:outline-none"
        >
          <span className="material-symbols-outlined text-3xl">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">home</span> Beranda
          </Link>
          <Link href="/history" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">history</span> Riwayat
          </Link>
          <Link href="/settings" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">settings</span> Pengaturan
          </Link>
        </nav>

      </div>

      {/* Navigasi Mobile (Onclick Dropdown) */}
      {isMenuOpen && (
        <nav className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 flex flex-col gap-4 absolute w-full left-0 top-full shadow-xl">
          <Link onClick={() => setIsMenuOpen(false)} href="/" className="flex items-center gap-3 text-base font-medium text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-xl text-blue-500">home</span> Beranda
          </Link>
          <Link onClick={() => setIsMenuOpen(false)} href="/history" className="flex items-center gap-3 text-base font-medium text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-xl text-blue-500">history</span> Riwayat
          </Link>
          <Link onClick={() => setIsMenuOpen(false)} href="/settings" className="flex items-center gap-3 text-base font-medium text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-xl text-blue-500">settings</span> Pengaturan
          </Link>
        </nav>
      )}
    </header>
  );
}
