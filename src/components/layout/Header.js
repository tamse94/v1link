import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 shadow-md transition-all">
      {/* Cekikan di Header juga udah dibuang, full width pake px-4 di HP */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-blue-500 text-2xl sm:text-3xl group-hover:rotate-12 transition-transform">link</span>
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            V1Link
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all">
            <span className="material-symbols-outlined text-lg sm:text-xl">home</span>
            <span className="hidden sm:block font-medium">Home</span>
          </Link>
          
          <Link href="/history" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all">
            <span className="material-symbols-outlined text-lg sm:text-xl">history</span>
            <span className="hidden sm:block font-medium">Liat</span>
          </Link>

          <Link href="/settings" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all">
            <span className="material-symbols-outlined text-lg sm:text-xl">settings</span>
            <span className="hidden sm:block font-medium">Setting</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
