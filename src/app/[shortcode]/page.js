import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { shortcode } = params;
  const { data } = await supabase.from('urls').select('*').eq('short_code', shortcode).single();
  
  if (!data) return { title: 'Tidak Ditemukan' };
  
  return {
    title: data.title || 'V1Link Shortener',
    description: data.description || 'Link telah diperpendek dengan V1Link',
    openGraph: {
      title: data.title || 'V1Link Shortener',
      description: data.description || 'Link telah diperpendek dengan V1Link',
      images: data.thumbnail_url ? [data.thumbnail_url] : [],
    },
    twitter: { card: 'summary_large_image' }
  };
}

export default async function ShortcodeRedirect({ params }) {
  const { shortcode } = params;
  // Ambil ID dan clicks juga buat di-update
  const { data } = await supabase.from('urls').select('id, original_url, clicks').eq('short_code', shortcode).single();

  if (!data) redirect('/404-not-found');

  // Proses nambahin angka Hitcount / Clicks
  await supabase.from('urls').update({ clicks: (data.clicks || 0) + 1 }).eq('id', data.id);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <meta httpEquiv="refresh" content={`0;url=${data.original_url}`} />
      <div className="text-center">
        <span className="material-symbols-outlined animate-spin text-4xl sm:text-5xl text-blue-500 mb-4">progress_activity</span>
        <h1 className="text-xl sm:text-2xl font-bold">Mengarahkan ke tujuan...</h1>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace("${data.original_url}");` }} />
    </div>
  );
}
