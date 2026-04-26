import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function ShortcodeRedirect({ params }) {
  const { shortcode } = params;

  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('short_code', shortcode)
    .single();

  if (error || !data) {
    redirect('/404-not-found'); // Melempar ke halaman not-found.js
  }

  // Redirect ke URL tujuan
  redirect(data.original_url);
}
