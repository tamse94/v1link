import './globals.css';
import { supabase } from '@/lib/supabase';

// FUNGSI GENERATE METADATA DINAMIS (SEO SUPER LENGKAP)
export async function generateMetadata() {
  // Narik data pengaturan dari Supabase
  const { data } = await supabase.from('settings').select('site_name, domain_name').eq('id', 1).single();

  const siteName = data?.site_name || 'V1Link Pro';
  
  // Pastikan domain diformat bener pakai https:// buat metadataBase
  let domainUrl = data?.domain_name || 'https://v1link.vercel.app';
  if (!domainUrl.startsWith('http')) {
    domainUrl = `https://${domainUrl}`;
  }

  const description = `The most advanced and professional URL shortener. Shorten your long links, customize thumbnails, and track clicks easily with ${siteName}.`;

  return {
    metadataBase: new URL(domainUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`, // Format ntar kalau ada halaman lain misal: "Settings | V1Link Pro"
    },
    description: description,
    openGraph: {
      title: siteName,
      description: description,
      url: domainUrl,
      siteName: siteName,
      images: [
        {
          url: '/og-image.jpg', // Ngambil otomatis dari folder public
          width: 1200,
          height: 630,
          alt: `${siteName} Official Preview`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: ['/og-image.jpg'], // Ngambil dari folder public
    },
    icons: {
      icon: '/icon.webp', // Ngambil dari folder public
      shortcut: '/icon.webp',
      apple: '/icon.webp', // Buat icon kalau di-save ke Homescreen iPhone
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default function RootLayout({ children }) {
  return (
    // Lang diganti jadi 'en' karena lu minta bahasa Inggris
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        {/* Google Material Icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      {/* Set font default ke Jost di body */}
      <body style={{ fontFamily: "'Jost', sans-serif" }} className="bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
