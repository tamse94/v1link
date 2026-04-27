import Header from '@/components/layout/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-950">
      <Header />
      {/* Cekikannya (max-w-xs) udah gua buang, sekarang w-full di HP */}
      <main className="flex-grow w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 lg:py-10 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
