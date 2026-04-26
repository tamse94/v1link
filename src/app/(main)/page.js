import ShortenerForm from '@/components/form/ShortenerForm';

export default function Home() {
  return (
    <div className="w-full">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center text-blue-400">Buat URL Pendek</h1>
      <ShortenerForm />
    </div>
  );
}
