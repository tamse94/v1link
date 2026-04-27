import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

// 1. Fungsi ini buat ngasih tau WhatsApp/FB/Telegram soal Thumbnail & Deskripsi lu
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
    twitter: {
      card: 'summary_large_image',
    }
  };
}

// 2. Halaman penahannya
export default async function ShortcodeRedirect({ params }) {
  const { shortcode } = params;
  const { data } = await supabase.from('urls').select('original_url').eq('short_code', shortcode).single();

  if (!data) redirect('/404-not-found');

  // Kita nahan user di sini sepersekian detik biar thumbnail ke-load, lalu redirect pake meta refresh & JS
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      {/* Meta tag ini yang bakal nge-redirect secara otomatis ke original_url */}
      <meta httpEquiv="refresh" content={`0;url=${data.original_url}`} />
      
      <div className="text-center">
        <span className="material-symbols-outlined animate-spin text-4xl sm:text-5xl md:text-6xl text-blue-500 mb-4">progress_activity</span>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Mengarahkan ke tujuan...</h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-400 mt-2">Tunggu sebentar ya.</p>
      </div>

      {/* Backup redirect pake JavaScript */}
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace("${data.original_url}");` }} />
    </div>
  );
}
