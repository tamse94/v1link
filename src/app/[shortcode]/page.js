import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function ShortcodePage({ params }) {
  const { shortcode } = params;
  
  // Ambil user-agent dari header untuk mendeteksi siapa yang mengakses
  const headersList = (await import('next/headers')).headers();
  const userAgent = headersList.get('user-agent') || '';

  const [urlData, settingsData] = await Promise.all([
    supabase.from('urls').select('id, original_url, clicks').eq('short_code', shortcode).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  if (!urlData.data) notFound();

  const { original_url, id, clicks } = urlData.data;
  const settings = settingsData.data || {};

  // PENDETEKSI BOT KOMPLIT (Termasuk FB, WA, Telegram, Twitter, Google)
  const isBot = /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|telegrambot|twitterbot/i.test(userAgent);

  // LOGIKA ANTI-BOT (Blokir akses jika fitur dinyalakan dan yang datang adalah bot/crawler)
  if (settings.anti_bot_enabled && isBot) {
    notFound();
  }

  // UPDATE HITCOUNT: HANYA JIKA BUKAN BOT
  // Bot sosmed boleh baca halaman buat thumbnail, tapi nggak bakal ditambahkan ke angka klik!
  if (!isBot) {
    await supabase.from('urls').update({ clicks: (clicks || 0) + 1 }).eq('id', id);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
      <span className="material-symbols-outlined animate-spin text-4xl text-blue-500 mb-4">progress_activity</span>
      <h1 className="text-xl font-bold">Redirecting...</h1>
      
      {settings.histats_code && (
        <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.histats_code }} />
      )}

      <script dangerouslySetInnerHTML={{ 
        __html: `
          setTimeout(function() {
            var targetUrl = "${original_url}";
            var isFbOutside = ${settings.fb_open_outside};
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            var isFB = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf("Instagram") > -1);

            if (isFbOutside && isFB) {
               window.location.replace("intent://" + targetUrl.replace(/^https?:\\/\\//i, "") + "#Intent;scheme=https;package=com.android.chrome;end;");
            } else {
               window.location.replace(targetUrl);
            }
          }, 1500);
        ` 
      }} />
    </div>
  );
}
