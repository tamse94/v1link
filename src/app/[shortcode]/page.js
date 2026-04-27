import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function ShortcodePage({ params }) {
  const { shortcode } = params;
  
  const { data } = await supabase.from('urls').select('id, original_url, clicks').eq('short_code', shortcode).single();

  // FIX: Pakai notFound() bawaan Next.js, JANGAN pakai redirect('/404-not-found') biar gak looping!
  if (!data) notFound();

  await supabase.from('urls').update({ clicks: (data.clicks || 0) + 1 }).eq('id', data.id);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <span className="material-symbols-outlined animate-spin text-5xl text-blue-500 mb-4">progress_activity</span>
      <h1 className="text-2xl font-bold mb-2">Mengarahkan...</h1>
      <p className="text-slate-400 text-sm">Tunggu sebentar, Anda sedang dialihkan.</p>
      
      <script dangerouslySetInnerHTML={{ 
        __html: `
          setTimeout(function() {
            window.location.replace("${data.original_url}");
          }, 2000);
        ` 
      }} />
    </div>
  );
}
