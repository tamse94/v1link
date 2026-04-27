import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-sm border-b border-slate-700 shadow-sm">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500 text-2xl">link</span>
          <span className="text-xl font-bold text-white tracking-wide">
            V1Link
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Beranda
          </Link>
          <Link href="/history" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Riwayat
          </Link>
          <Link href="/settings" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Pengaturan
          </Link>
        </nav>
      </div>
    </header>
  );
}
