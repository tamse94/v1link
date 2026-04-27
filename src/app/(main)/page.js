import ShortenerForm from '@/components/form/ShortenerForm';
import UrlList from '@/components/list/UrlList';

export default function Home() {
  return (
    <div className="w-full flex flex-col pb-10">
      
      {/* Form Pembuatan URL */}
      <ShortenerForm />
      
      {/* Pemisah Elegan */}
      <div className="w-full relative py-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-800"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-950 px-4 text-sm text-slate-500 font-semibold tracking-widest uppercase text-center">
            Your Link Statistics
          </span>
        </div>
      </div>
      
      {/* Tabel Data URL */}
      <UrlList />
      
    </div>
  );
}
