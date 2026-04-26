import Link from 'next/link';

export default function Header() {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 tracking-wide">
          ShortURL
        </Link>
        <div className="flex space-x-3 sm:space-x-4 md:space-x-6 text-sm sm:text-base md:text-lg">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors duration-200">Beranda</Link>
        </div>
      </div>
    </nav>
  );
}
