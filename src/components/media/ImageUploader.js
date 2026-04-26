'use client';

export default function ImageUploader({ file, setFile, previewUrl, setPreviewUrl, mode, setMode, isBlur, setIsBlur, showPlay, setShowPlay }) {
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreviewUrl(URL.createObjectURL(selected));
  };

  return (
    <div className="bg-slate-900 p-3 sm:p-4 md:p-6 lg:p-8 rounded-md sm:rounded-lg md:rounded-xl border border-slate-700 w-full">
      <label className="block text-xs sm:text-sm md:text-base text-slate-400 mb-1 sm:mb-2 md:mb-3">Upload Thumbnail</label>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm md:text-base text-slate-400 w-full" />

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm md:text-base">
        <label className="flex items-center space-x-1 sm:space-x-2 cursor-pointer">
          <input type="radio" checked={mode === 1} onChange={() => setMode(1)} className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
          <span>Mode 1 (Biasa)</span>
        </label>
        <label className="flex items-center space-x-1 sm:space-x-2 cursor-pointer">
          <input type="radio" checked={mode === 2} onChange={() => setMode(2)} className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
          <span>Mode 2 (Blur Kanan-Kiri)</span>
        </label>
      </div>

      {mode === 2 && (
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
          <button type="button" onClick={() => setIsBlur(!isBlur)} className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-bold transition-colors ${isBlur ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            Blur: {isBlur ? 'ON' : 'OFF'}
          </button>
          <button type="button" onClick={() => setShowPlay(!showPlay)} className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-bold transition-colors ${showPlay ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            Play Button: {showPlay ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="mt-2 sm:mt-3 md:mt-4 w-full sm:w-3/4 md:w-1/2 lg:w-2/3 mx-auto aspect-video relative overflow-hidden bg-black rounded-md sm:rounded-lg border border-slate-600 flex items-center justify-center">
          {mode === 2 && isBlur && (
            <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm sm:blur-md md:blur-lg scale-110" alt="blur-bg" />
          )}
          <img src={previewUrl} className="relative z-10 h-full object-contain shadow-lg sm:shadow-xl md:shadow-2xl" alt="preview" />
          {mode === 2 && showPlay && (
            <div className="absolute z-20 bg-black/60 rounded-full p-2 sm:p-3 md:p-4 lg:p-5">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
