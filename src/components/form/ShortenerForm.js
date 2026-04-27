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
      showNotif('Tautan berhasil disalin', 'success');
    } catch (err) {
      showNotif('Gagal menyalin tautan', 'error');
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
      let uploadedImgUrl = await uploadToCloudinary();
      
      // LOGIKA PEMBUATAN MODE 2 (BAKED INTO CLOUDINARY URL)
      if (uploadedImgUrl && mode === 2) {
        const urlParts = uploadedImgUrl.split('/upload/');
        let transformations = [];
        // Perintah resmi Cloudinary untuk efek Blur Background (16:9)
        if (isBlur) transformations.push('c_pad,w_1280,h_720,b_blurred:400');
        // Perintah resmi Cloudinary untuk overlay text Icon Play
        if (showPlay) transformations.push('l_text:Arial_200:%E2%96%B6,co_white,o_90/fl_layer_apply');
        
        if (transformations.length > 0) {
          uploadedImgUrl = `${urlParts[0]}/upload/${transformations.join('/')}/${urlParts[1]}`;
        }
      }

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
      
      showNotif('Tautan berhasil dibuat', 'success');
      setUrl(''); setTitle(''); setDesc(''); setFile(null); setPreviewUrl(null);
    } catch (err) {
      showNotif('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const encodedUrl = encodeURIComponent(shortUrlResult);
  const shareLinks = {
    wa: `https://wa.me/?text=${encodedUrl}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    tg: `https://t.me/share/url?url=${encodedUrl}`
  };

  return (
    <div className="w-full">
      <div className="mb-6 px-2 sm:px-0 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Perpendek Tautan</h1>
        <p className="text-slate-400 text-sm sm:text-base">Buat tautan rapi, lengkap dengan thumbnail custom.</p>
      </div>

      <div className="bg-slate-900 border-y sm:border border-slate-800 sm:rounded-xl p-4 sm:p-8 shadow-xl relative overflow-hidden w-full">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">URL Tujuan (Wajib)</label>
            <input type="url" required value={url} onChange={e => setUrl(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-sm focus:border-blue-500 outline-none" 
              placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Judul Tautan (Opsional)</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-sm focus:border-blue-500 outline-none" 
              placeholder="Judul untuk media sosial" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">Deskripsi Tautan (Opsional)</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="3"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-sm focus:border-blue-500 outline-none resize-none" 
              placeholder="Deskripsi singkat tautan..."></textarea>
          </div>

          <ImageUploader file={file} setFile={setFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} mode={mode} setMode={setMode} isBlur={isBlur} setIsBlur={setIsBlur} showPlay={showPlay} setShowPlay={setShowPlay} />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-lg transition-colors mt-2 disabled:opacity-60 flex justify-center items-center gap-2">
            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined">rocket_launch</span>}
            {loading ? 'Memproses...' : 'Buat Tautan Pendek'}
          </button>
        </form>

        {shortUrlResult && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <label className="block text-sm font-semibold text-green-400 mb-2">Tautan Berhasil Dibuat!</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input type="text" readOnly value={shortUrlResult} className="flex-1 bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none select-all" />
                <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded-lg flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-xl">content_copy</span>
                </button>
              </div>
              {/* Share Sosmed tetap ada, disingkat untuk keterbacaan instruksi ini */}
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-xs text-slate-400 font-medium mr-1">Bagikan:</span>
                 <a href={shareLinks.wa} target="_blank" className="bg-[#25D366] p-2 rounded-md text-white"><span className="text-xs font-bold">WA</span></a>
                 <a href={shareLinks.fb} target="_blank" className="bg-[#1877F2] p-2 rounded-md text-white"><span className="text-xs font-bold">FB</span></a>
                 <a href={shareLinks.tg} target="_blank" className="bg-[#0088cc] p-2 rounded-md text-white"><span className="text-xs font-bold">TG</span></a>
              </div>
            </div>
          </div>
        )}
      </div>
      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
