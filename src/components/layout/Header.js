import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 shadow-sm sm:shadow-md md:shadow-lg lg:shadow-xl transition-all">
      <div className="max-w-xs sm:max-w-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 sm:gap-2 md:gap-3 group">
          <span className="material-symbols-outlined text-blue-500 text-xl sm:text-2xl md:text-3xl lg:text-4xl group-hover:rotate-12 transition-transform">link</span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
            V1Link
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 hover:text-white hover:bg-slate-800/50 px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-2.5 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl transition-all">
            <span className="material-symbols-outlined text-sm sm:text-base md:text-lg lg:text-xl">home</span>
            <span className="hidden sm:block font-medium">Home</span>
          </Link>
          
          <Link href="/history" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 hover:text-white hover:bg-slate-800/50 px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-2.5 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl transition-all">
            <span className="material-symbols-outlined text-sm sm:text-base md:text-lg lg:text-xl">history</span>
            <span className="hidden sm:block font-medium">Liat</span>
          </Link>

          <Link href="/settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 hover:text-white hover:bg-slate-800/50 px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 lg:py-2.5 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl transition-all">
            <span className="material-symbols-outlined text-sm sm:text-base md:text-lg lg:text-xl">settings</span>
            <span className="hidden sm:block font-medium">Setting</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
