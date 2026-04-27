'use client';

export default function ImageUploader({ file, setFile, previewUrl, setPreviewUrl, mode, setMode, isBlur, setIsBlur, showPlay, setShowPlay }) {
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  };

  return (
    <div className="w-full mt-2">
      <label className="block text-sm font-semibold text-slate-300 mb-2">Gambar Thumbnail (Opsional)</label>
      
      <input type="file" accept="image/*" onChange={handleFileChange} 
        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer border border-slate-700 rounded-lg bg-slate-950 p-2" 
      />

      <div className="mt-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm text-slate-400 mb-2">Tipe Tampilan Gambar</label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={mode === 1} onChange={() => setMode(1)} className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
              <span className="text-sm text-slate-300">Normal</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={mode === 2} onChange={() => setMode(2)} className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-700" />
              <span className="text-sm text-slate-300">Efek Video (Blur & Play)</span>
            </label>
          </div>
        </div>

        {mode === 2 && (
          <div className="flex-1">
             <label className="block text-sm text-slate-400 mb-2">Pengaturan Efek Video</label>
             <div className="flex gap-2">
              <button type="button" onClick={() => setIsBlur(!isBlur)} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${isBlur ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Latar Blur: {isBlur ? 'Nyala' : 'Mati'}
              </button>
              <button type="button" onClick={() => setShowPlay(!showPlay)} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${showPlay ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                Tombol Play: {showPlay ? 'Nyala' : 'Mati'}
              </button>
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="mt-6">
          <span className="block text-sm text-slate-400 mb-2">Pratinjau Gambar:</span>
          {/* Container gambar, blur-md agar background masih terlihat bentuknya */}
          <div className="w-full max-w-lg mx-auto aspect-video relative overflow-hidden bg-black rounded-lg border border-slate-700 flex items-center justify-center">
            
            {mode === 2 && isBlur && (
              <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-70 blur-md scale-110" alt="blur-bg" />
            )}
            
            <img src={previewUrl} className="relative z-10 h-full object-contain" alt="preview" />
            
            {mode === 2 && showPlay && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="bg-black/60 rounded-full w-14 h-14 flex items-center justify-center backdrop-blur-sm border border-white/20 pl-1">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
