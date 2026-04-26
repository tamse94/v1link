'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { generateShortCode } from '@/lib/utils';
import ImageUploader from '@/components/media/ImageUploader';
import ToastNotif from '@/components/ui/ToastNotif';

export default function ShortenerForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mode, setMode] = useState(1);
  const [isBlur, setIsBlur] = useState(true);
  const [showPlay, setShowPlay] = useState(true);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // State baru buat nampilin hasil link setelah sukses
  const [shortUrlResult, setShortUrlResult] = useState('');

  const showNotif = (msg, type) => setToast({ message: msg, type });

  // Fungsi Copy text
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrlResult);
      showNotif('Link berhasil disalin!', 'success');
    } catch (err) {
      showNotif('Gagal menyalin link', 'error');
    }
  };

  const uploadToCloudinary = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShortUrlResult(''); // reset result
    try {
      const uploadedImgUrl = await uploadToCloudinary();
      const shortCode = generateShortCode();

      const { error } = await supabase.from('urls').insert([{
        original_url: url,
        short_code: shortCode,
        title, description: desc, thumbnail_url: uploadedImgUrl,
        mode, blur_active: isBlur, play_active: showPlay,
      }]);

      if (error) throw error;
      
      // Bikin full URL-nya buat ditampilin (asumsi domain vercel lu)
      const fullShortUrl = `${window.location.origin}/${shortCode}`;
      setShortUrlResult(fullShortUrl);
      
      showNotif(`Berhasil! Link siap disalin.`, 'success');
      setUrl(''); setTitle(''); setDesc(''); setFile(null); setPreviewUrl(null);
    } catch (err) {
      showNotif('Gagal: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_0_40px_-15px_rgba(59,130,246,0.2)]">
        
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 tracking-tight">Perpendek URL Lu Disini</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 font-medium">Bikin link lebih rapi, gampang di-share, lengkap sama custom thumbnail.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          
          {/* Input URL */}
          <div className="relative group">
            <span className="absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-lg sm:text-xl md:text-2xl lg:text-3xl">public</span>
            <input type="url" required value={url} onChange={e => setUrl(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl py-3 sm:py-4 md:py-5 lg:py-6 pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-5 lg:pr-6 text-xs sm:text-sm md:text-base lg:text-lg text-white font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600" 
              placeholder="Masukkan link panjang lu di sini..." />
          </div>

          {/* Input SEO */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <div className="w-full sm:w-1/2 relative group">
              <span className="absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-lg sm:text-xl md:text-2xl lg:text-3xl">title</span>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl py-3 sm:py-4 md:py-5 lg:py-6 pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-5 lg:pr-6 text-xs sm:text-sm md:text-base lg:text-lg text-white font-medium focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                placeholder="Judul SEO (Opsional)" />
            </div>
            <div className="w-full sm:w-1/2 relative group">
              <span className="absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-lg sm:text-xl md:text-2xl lg:text-3xl">description</span>
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl py-3 sm:py-4 md:py-5 lg:py-6 pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-5 lg:pr-6 text-xs sm:text-sm md:text-base lg:text-lg text-white font-medium focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                placeholder="Deskripsi (Opsional)" />
            </div>
          </div>

          <ImageUploader file={file} setFile={setFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} mode={mode} setMode={setMode} isBlur={isBlur} setIsBlur={setIsBlur} showPlay={showPlay} setShowPlay={setShowPlay} />

          <button type="submit" disabled={loading} className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)]">
            <span className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-lg sm:text-xl md:text-2xl lg:text-3xl">progress_activity</span> Memproses...</>
              ) : (
                <><span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl lg:text-3xl">rocket_launch</span> Generate Short URL</>
              )}
            </span>
          </button>
        </form>

        {/* AREA HASIL (Muncul pas sukses aja) */}
        {shortUrlResult && (
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 p-1 sm:p-1.5 md:p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-slate-950 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div className="flex flex-col flex-grow w-full text-center sm:text-left overflow-hidden">
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-400 font-medium mb-1 sm:mb-2 uppercase tracking-wider">Link Berhasil Dibuat!</span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white font-bold truncate select-all">{shortUrlResult}</span>
              </div>
              <button onClick={handleCopy} className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-1 sm:gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-10 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl transition-all border border-slate-700 hover:border-slate-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                <span className="material-symbols-outlined text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">content_copy</span>
                Salin Link
              </button>
            </div>
          </div>
        )}

      </div>
      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
