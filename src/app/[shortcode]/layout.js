import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }) {
  const { shortcode } = params;
  
  // Ambil data URL dan Pengaturan (Settings) secara bersamaan biar loadingnya cepet
  const [urlRes, settingsRes] = await Promise.all([
    supabase.from('urls').select('title, description, thumbnail_url').eq('short_code', shortcode).single(),
    supabase.from('settings').select('site_name').eq('id', 1).single()
  ]);
  
  const urlData = urlRes.data;
  // Ambil nama situs dari pengaturan, kalau kosong defaultnya 'V1Link'
  const siteName = settingsRes.data?.site_name || 'V1Link'; 
  
  if (!urlData) return { title: 'Page Not Found' };
  
  // LOGIKA KOMBINASI (BAHASA INGGRIS)
  // Kalau title/deskripsi diisi, pakai yang diisi. Kalau kosong, pakai fallback bahasa Inggris + Nama Situs
  const finalTitle = urlData.title 
    ? urlData.title 
    : `Shared Link | ${siteName}`;
    
  const finalDesc = urlData.description 
    ? urlData.description 
    : `Check out this exclusive link shared via ${siteName}. Click to view more details and content.`;
  
  return {
    title: finalTitle,
    description: finalDesc,
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      // Ukuran 1280x720 (16:9) eksplisit agar FB Biru langsung merender gambar saat diposting
      images: urlData.thumbnail_url ? [{ 
        url: urlData.thumbnail_url,
        width: 1280,
        height: 720,
        type: 'image/jpeg',
        alt: finalTitle
      }] : [],
      type: 'website',
    },
    twitter: { 
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      images: urlData.thumbnail_url ? [urlData.thumbnail_url] : [],
    }
  };
}

export default function ShortcodeLayout({ children }) {
  return <>{children}</>;
}
