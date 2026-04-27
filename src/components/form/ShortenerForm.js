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
  const [shortUrlResult, setShortUrlResult] = useState('');

  const showNotif = (msg, type) => setToast({ message: msg, type });

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
    setShortUrlResult('');
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
    <div className="w-full max-w-4xl mx-auto mt-4 sm:mt-10 mb-10 px-3 sm:px-6">
      
      {/* Box Utama - Ujungnya dibikin normal di HP (rounded-xl) biar gak aneh */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl">
        
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Perpendek URL Lu Disini</h2>
          <p className="text-slate-400 font-medium text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bikin link lu lebih rapi, profesional, dan gampang di-share. Lengkap dengan pengaturan Custom Thumbnail.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* Input URL Tujuan */}
          <div className="relative group">
            <label className="block text-sm font-bold text-slate-300 mb-2">URL Tujuan (Wajib)</label>
            <div className="relative">
              <span className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-xl sm:text-2xl">public</span>
              <input type="url" required value={url} onChange={e => setUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-lg text-white font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600" 
                placeholder="https://link-panjang-banget.com/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Judul SEO */}
            <div className="relative group">
              <label className="block text-sm font-bold text-slate-300 mb-2">Judul Link (Opsional)</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-xl sm:text-2xl">title</span>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base text-white font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600" 
                  placeholder="Contoh: Video Viral 2026" />
              </div>
            </div>

            {/* Input Deskripsi - Padding dikurangin biar teks gak kegencet */}
            <div className="relative group">
              <label className="block text-sm font-bold text-slate-300 mb-2">Deskripsi Link (Opsional)</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-5 top-3 sm:top-4 material-symbols-outlined text-slate-500 group-focus-within:text-blue-500 transition-colors text-xl sm:text-2xl">description</span>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg sm:rounded-2xl py-3 sm:py-4 pl-10 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base text-white font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600 resize-none" 
                  placeholder="Ketik deskripsi singkat..."></textarea>
              </div>
            </div>
          </div>

          {/* Area Upload Thumbnail */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-sm font-bold text-slate-300 mb-4">Pengaturan Thumbnail</label>
            <ImageUploader file={file} setFile={setFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} mode={mode} setMode={setMode} isBlur={isBlur} setIsBlur={setIsBlur} showPlay={showPlay} setShowPlay={setShowPlay} />
          </div>

          {/* Tombol Submit Besar */}
          <button type="submit" disabled={loading} className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-black text-lg sm:text-xl py-4 sm:py-5 rounded-lg sm:rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            <span className="flex justify-center items-center gap-2 sm:gap-3 relative z-10">
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-2xl sm:text-3xl">progress_activity</span> Sedang Memproses...</>
              ) : (
                <><span className="material-symbols-outlined text-2xl sm:text-3xl">rocket_launch</span> Bikin Link Sekarang</>
              )}
            </span>
          </button>
        </form>

        {/* AREA HASIL */}
        {shortUrlResult && (
          <div className="mt-8 sm:mt-10 p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl sm:rounded-3xl animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-slate-950 rounded-lg sm:rounded-[22px] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col text-center md:text-left w-full overflow-hidden">
                <span className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest mb-1 sm:mb-2">Link Sukses Dibuat!</span>
                <span className="text-lg sm:text-2xl md:text-3xl text-white font-black truncate select-all">{shortUrlResult}</span>
              </div>
              <button onClick={handleCopy} className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all shadow-lg">
                <span className="material-symbols-outlined text-xl sm:text-2xl">content_copy</span>
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
