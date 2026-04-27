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
      
      showNotif('Tautan berhasil dibuat', 'success');
      setUrl(''); setTitle(''); setDesc(''); setFile(null); setPreviewUrl(null);
    } catch (err) {
      showNotif('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Perpendek Tautan Anda</h1>
        <p className="text-slate-400 text-sm sm:text-base">Buat tautan menjadi lebih singkat, rapi, dan mudah dibagikan ke media sosial.</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 sm:p-8 shadow-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">URL Tujuan (Wajib)</label>
            <input type="url" required value={url} onChange={e => setUrl(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:border-blue-500 outline-none transition-colors" 
              placeholder="Masukkan URL panjang di sini..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Judul Tautan (Opsional)</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:border-blue-500 outline-none transition-colors" 
              placeholder="Judul yang akan tampil di media sosial" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Deskripsi Tautan (Opsional)</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="3"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:border-blue-500 outline-none transition-colors resize-none" 
              placeholder="Penjelasan singkat mengenai tautan ini"></textarea>
          </div>

          <ImageUploader file={file} setFile={setFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} mode={mode} setMode={setMode} isBlur={isBlur} setIsBlur={setIsBlur} showPlay={showPlay} setShowPlay={setShowPlay} />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-3.5 rounded-lg transition-colors mt-4 disabled:opacity-60">
            {loading ? 'Memproses...' : 'Buat Tautan Pendek'}
          </button>
        </form>

        {shortUrlResult && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <label className="block text-sm font-semibold text-green-400 mb-2">Tautan Berhasil Dibuat!</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" readOnly value={shortUrlResult} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white text-base focus:outline-none select-all" />
              <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Salin Tautan
              </button>
            </div>
          </div>
        )}
      </div>
      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
