'use client';

export default function ImageUploader({ file, setFile, previewUrl, setPreviewUrl, mode, setMode, isBlur, setIsBlur, showPlay, setShowPlay }) {
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  };

  return (
    <div className="w-full mt-2">
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">Gambar Thumbnail (Opsional)</label>
      
      <input type="file" accept="image/*" onChange={handleFileChange} 
        className="w-full text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer border border-slate-700 rounded-lg bg-slate-950 p-1.5" 
      />

      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-2">Tipe Tampilan</label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={mode === 1} onChange={() => setMode(1)} className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
              <span className="text-sm text-slate-300">Normal</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={mode === 2} onChange={() => setMode(2)} className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
              <span className="text-sm text-slate-300">Efek Video</span>
            </label>
          </div>
        </div>

        {mode === 2 && (
          <div className="flex-1">
             <label className="block text-xs text-slate-400 mb-2">Pengaturan Efek Video</label>
             <div className="flex gap-2">
              <button type="button" onClick={() => setIsBlur(!isBlur)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isBlur ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Blur Latar: {isBlur ? 'On' : 'Off'}
              </button>
              <button type="button" onClick={() => setShowPlay(!showPlay)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${showPlay ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Tombol Play: {showPlay ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-5">
          <span className="block text-xs text-slate-400 mb-1.5">Pratinjau:</span>
          {/* Blur dikurangi menjadi blur-sm dan opacity-50 agar gambar belakang masih cukup terlihat */}
          <div className="w-full max-w-lg mx-auto aspect-video relative overflow-hidden bg-black rounded-lg border border-slate-700 flex items-center justify-center">
            
            {mode === 2 && isBlur && (
              <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm scale-110" alt="blur-bg" />
            )}
            
            <img src={previewUrl} className="relative z-10 h-full object-contain" alt="preview" />
            
            {/* SVG Tombol Play yang standar dan profesional (solid play button) */}
            {mode === 2 && showPlay && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none drop-shadow-xl">
                <svg viewBox="0 0 24 24" className="w-16 h-16 sm:w-20 sm:h-20 fill-white/90">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
