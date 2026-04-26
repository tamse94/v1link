import Header from '@/components/layout/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-grow p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
