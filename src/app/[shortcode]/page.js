import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function ShortcodePage({ params }) {
  const { shortcode } = params;
  const userAgent = (await import('next/headers')).headers().get('user-agent') || '';

  const [urlData, settingsData] = await Promise.all([
    supabase.from('urls').select('id, original_url, clicks').eq('short_code', shortcode).single(),
    supabase.from('settings').select('*').eq('id', 1).single()
  ]);

  if (!urlData.data) notFound();

  const { original_url, id, clicks } = urlData.data;
  const settings = settingsData.data || {};

  // ANTI-BOT LOGIC
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
  if (settings.anti_bot_enabled && isBot) {
    // Jika bot, jangan tampilkan apa-apa atau lari ke 404
    notFound();
  }

  await supabase.from('urls').update({ clicks: (clicks || 0) + 1 }).eq('id', id);

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
