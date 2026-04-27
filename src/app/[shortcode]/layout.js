import { supabase } from '@/lib/supabase';

// Eksekusi Meta Tag di level Layout
export async function generateMetadata({ params }) {
  const { shortcode } = params;
  const { data } = await supabase.from('urls').select('title, description, thumbnail_url').eq('short_code', shortcode).single();
  
  if (!data) return { title: 'Tidak Ditemukan' };
  
  return {
    title: data.title || 'Tautan V1Link',
    description: data.description || 'Klik untuk membuka tautan ini.',
    openGraph: {
      title: data.title || 'Tautan V1Link',
      description: data.description || 'Klik untuk membuka tautan ini.',
      images: data.thumbnail_url ? [{ url: data.thumbnail_url }] : [],
      type: 'website',
    },
    twitter: { 
      card: 'summary_large_image',
      title: data.title || 'Tautan V1Link',
      description: data.description || 'Klik untuk membuka tautan ini.',
      images: data.thumbnail_url ? [data.thumbnail_url] : [],
    }
  };
}

export default function ShortcodeLayout({ children }) {
  // Hanya me-render isi halaman (page.js) di dalamnya
  return <>{children}</>;
}
