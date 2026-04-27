import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      
      {/* Efek Cahaya Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Teks 404 Estetik */}
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-2 tracking-tighter drop-shadow-lg">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Oops! The link you clicked might be broken, expired, or has been permanently removed by the owner.
        </p>
        
        <Link href="/" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base py-3.5 px-8 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.7)] hover:-translate-y-1">
          <span className="material-symbols-outlined text-xl">home</span>
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
