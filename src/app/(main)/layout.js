import Header from '@/components/layout/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-950">
      <Header />
      <main className="flex-grow w-full px-1 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto">
        {children}
      </main>
    </div>
  );
}
