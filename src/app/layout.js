import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
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
