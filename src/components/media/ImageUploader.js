'use client';

export default function ImageUploader({ file, setFile, previewUrl, setPreviewUrl, mode, setMode, isBlur, setIsBlur, showPlay, setShowPlay }) {
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  };

  return (
    <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-700 w-full">
      
      {/* Tombol Upload Keren */}
      <div className="mb-8 flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-800 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <span className="material-symbols-outlined text-4xl sm:text-5xl text-slate-400 mb-2">cloud_upload</span>
            <p className="mb-2 text-sm sm:text-base text-slate-400"><span className="font-semibold text-blue-500">Klik untuk upload</span> atau seret file ke sini</p>
            <p className="text-xs sm:text-sm text-slate-500">PNG, JPG atau WEBP (Max. 5MB)</p>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {file && <p className="text-center text-sm sm:text-base text-green-400 font-medium mb-6">File terpilih: {file.name}</p>}

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Pilihan Mode Thumbnail */}
        <div className="flex-1 bg-slate-900 p-4 sm:p-5 md:p-6 rounded-xl border border-slate-800">
          <span className="block text-sm sm:text-base font-bold text-slate-400 mb-4">Pilih Mode Tampilan:</span>
          <div className="flex flex-col gap-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" checked={mode === 1} onChange={() => setMode(1)} className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-2" />
              <span className="text-sm sm:text-base text-slate-300 group-hover:text-white font-medium transition-colors">Mode 1 (Biasa/Normal)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="radio" checked={mode === 2} onChange={() => setMode(2)} className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500 focus:ring-2" />
              <span className="text-sm sm:text-base text-slate-300 group-hover:text-white font-medium transition-colors">Mode 2 (Efek Blur Kanan-Kiri)</span>
            </label>
          </div>
        </div>

        {/* Setting Khusus Mode 2 (Pake Google Icons) */}
        {mode === 2 && (
          <div className="flex-1 bg-slate-900 p-4 sm:p-5 md:p-6 rounded-xl border border-slate-800 flex flex-col justify-center gap-3 sm:gap-4">
             <span className="block text-sm sm:text-base font-bold text-slate-400 mb-1">Pengaturan Tambahan:</span>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              
              <button type="button" onClick={() => setIsBlur(!isBlur)} 
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base font-bold transition-all border ${isBlur ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                <span className="material-symbols-outlined text-2xl">{isBlur ? 'toggle_on' : 'toggle_off'}</span>
                Blur {isBlur ? 'ON' : 'OFF'}
              </button>

              <button type="button" onClick={() => setShowPlay(!showPlay)} 
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base font-bold transition-all border ${showPlay ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                <span className="material-symbols-outlined text-2xl">{showPlay ? 'toggle_on' : 'toggle_off'}</span>
                Play {showPlay ? 'ON' : 'OFF'}
              </button>

            </div>
          </div>
        )}
      </div>

      {/* Preview Gambar Area */}
      {previewUrl && (
        <div className="mt-8">
          <span className="block text-sm sm:text-base font-bold text-slate-400 mb-4 text-center">Live Preview:</span>
          <div className="w-full max-w-2xl mx-auto aspect-video relative overflow-hidden bg-black rounded-xl border-2 border-slate-700 flex items-center justify-center shadow-2xl">
            {mode === 2 && isBlur && (
              <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 blur-xl scale-125" alt="blur-bg" />
            )}
            <img src={previewUrl} className="relative z-10 h-full object-contain drop-shadow-2xl" alt="preview" />
            {mode === 2 && showPlay && (
              <div className="absolute z-20 bg-black/60 rounded-full p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-white/10 shadow-xl">
                <span className="material-symbols-outlined text-white text-4xl sm:text-5xl md:text-6xl pl-1 sm:pl-2">play_arrow</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
