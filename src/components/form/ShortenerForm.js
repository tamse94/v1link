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

  const showNotif = (msg, type) => setToast({ message: msg, type });

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
      showNotif(`Sukses! Link: /${shortCode}`, 'success');
      setUrl(''); setTitle(''); setDesc(''); setFile(null); setPreviewUrl(null);
    } catch (err) {
      showNotif('Gagal: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-800 p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl lg:shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        <div>
          <label className="block text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 mb-1 sm:mb-2 md:mb-3">URL Tujuan</label>
          <input type="url" required value={url} onChange={e => setUrl(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 outline-none" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 mb-1 sm:mb-2 md:mb-3">Judul SEO</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 outline-none" />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 mb-1 sm:mb-2 md:mb-3">Deskripsi</label>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 outline-none" />
          </div>
        </div>

        <ImageUploader file={file} setFile={setFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} mode={mode} setMode={setMode} isBlur={isBlur} setIsBlur={setIsBlur} showPlay={showPlay} setShowPlay={setShowPlay} />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg py-3 sm:py-4 md:py-5 rounded-md sm:rounded-xl md:rounded-2xl transition duration-300 disabled:opacity-50">
          {loading ? 'Memproses...' : 'Generate Short URL'}
        </button>
      </form>
      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
