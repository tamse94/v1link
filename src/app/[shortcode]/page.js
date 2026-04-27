import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function ShortcodePage({ params }) {
  const { shortcode } = params;
  
  // Ambil URL tujuan dan pengaturan global sekaligus
  const [urlData, settingsData] = await Promise.all([
    supabase.from('urls').select('id, original_url, clicks').eq('short_code', shortcode).single(),
    supabase.from('settings').select('histats_code, fb_open_outside').eq('id', 1).single()
  ]);

  if (!urlData.data) notFound();

  const { original_url, id, clicks } = urlData.data;
  const histatsCode = settingsData.data?.histats_code || '';
  const isFbOutside = settingsData.data?.fb_open_outside || false;

  await supabase.from('urls').update({ clicks: (clicks || 0) + 1 }).eq('id', id);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <span className="material-symbols-outlined animate-spin text-5xl text-blue-500 mb-4">progress_activity</span>
      <h1 className="text-2xl font-bold mb-2">Mengarahkan...</h1>
      <p className="text-slate-400 text-sm">Tunggu sebentar, Anda sedang dialihkan.</p>
      
      {/* SCRIPT HISTATS DIRENDER DI SINI */}
      {histatsCode && (
        <div className="hidden" dangerouslySetInnerHTML={{ __html: histatsCode }} />
      )}

      {/* SCRIPT REDIRECT & FB ANTI IN-APP BROWSER */}
      <script dangerouslySetInnerHTML={{ 
        __html: `
          setTimeout(function() {
            var targetUrl = "${original_url}";
            var isFbOutside = ${isFbOutside};
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            
            // Cek apakah dibuka di dalam aplikasi Facebook / Instagram
            var isFacebookApp = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1);

            if (isFbOutside && isFacebookApp) {
               // Paksa buka di browser eksternal Chrome Android
               var intentUrl = "intent://" + targetUrl.replace(/^https?:\\/\\//i, "") + "#Intent;scheme=https;package=com.android.chrome;end;";
               window.location.replace(intentUrl);
            } else {
               // Redirect normal
               window.location.replace(targetUrl);
            }
          }, 2000);
        ` 
      }} />
    </div>
  );
}
