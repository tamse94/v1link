import ShortenerForm from '@/components/form/ShortenerForm';
import UrlList from '@/components/list/UrlList';

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-8 pb-10">
      {/* Form bagian atas */}
      <ShortenerForm />
      
      {/* List tabel bagian bawah */}
      <UrlList />
    </div>
  );
}
