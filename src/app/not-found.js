import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-center px-4 sm:px-6 md:px-8 lg:px-12 w-full">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-700 mb-2 sm:mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-300 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-500 mb-6 sm:mb-8 md:mb-10 lg:mb-12">URL yang kamu tuju mungkin salah atau sudah dihapus.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg py-2 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 rounded-full transition-all">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
