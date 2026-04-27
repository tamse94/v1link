import { supabase } from '@/lib/supabase';

export default async function robots() {
  // Tarik domain dari pengaturan
  const { data } = await supabase.from('settings').select('domain_name').eq('id', 1).single();
  
  let domainUrl = data?.domain_name || 'https://v1link.vercel.app';
  if (!domainUrl.startsWith('http')) {
    domainUrl = `https://${domainUrl}`;
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${domainUrl}/sitemap.xml`,
  };
}
