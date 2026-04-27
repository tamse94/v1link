'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ToastNotif from '@/components/ui/ToastNotif';

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [histatsCode, setHistatsCode] = useState('');
  const [fbOutside, setFbOutside] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotif = (msg, type) => setToast({ message: msg, type });

  // Ambil data pengaturan pas halaman dibuka
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setSiteName(data.site_name || '');
        setDomainName(data.domain_name || '');
        setHistatsCode(data.histats_code || '');
        setFbOutside(data.fb_open_outside || false);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  // Simpan data pengaturan
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        site_name: siteName,
        domain_name: domainName,
        histats_code: histatsCode,
        fb_open_outside: fbOutside
      });

      if (error) throw error;
      showNotif('Pengaturan berhasil disimpan!', 'success');
    } catch (err) {
      showNotif('Gagal menyimpan pengaturan', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500 mt-20">Memuat pengaturan...</div>;
  }

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="mb-8 px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pengaturan Sistem</h1>
        <p className="text-slate-400 text-sm sm:text-base">Atur identitas situs dan skrip pelacakan (Histats) di sini.</p>
      </div>

      {/* Form Pengaturan (Tanpa Box, langsung menyatu dengan background) */}
      <form onSubmit={handleSave} className="w-full">
        
        {/* Grup 1: Identitas Web */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 px-2 sm:px-0">Identitas Website</h2>
          <div className="flex flex-col gap-1">
            
            {/* Input Site Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 py-4 px-2 sm:px-4 hover:bg-slate-900/50 transition-colors">
              <label className="text-slate-300 font-semibold mb-2 sm:mb-0 w-1/3">Nama Situs (Site Name)</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} 
                className="w-full sm:w-2/3 bg-transparent text-white text-base focus:outline-none placeholder:text-slate-600" 
                placeholder="Contoh: V1Link Pro" />
            </div>

            {/* Input Domain */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 py-4 px-2 sm:px-4 hover:bg-slate-900/50 transition-colors">
              <label className="text-slate-300 font-semibold mb-2 sm:mb-0 w-1/3">Domain Utama</label>
              <input type="text" value={domainName} onChange={e => setDomainName(e.target.value)} 
                className="w-full sm:w-2/3 bg-transparent text-white text-base focus:outline-none placeholder:text-slate-600" 
                placeholder="Contoh: domain.com" />
            </div>

          </div>
        </div>

        {/* Grup 2: Integrasi (Histats & FB) */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 px-2 sm:px-0">Integrasi & Pelacakan</h2>
          <div className="flex flex-col gap-1">
            
            {/* FB Anti In-App Browser Toggle */}
            <div className="flex items-center justify-between border-b border-slate-800 py-4 px-2 sm:px-4 hover:bg-slate-900/50 transition-colors cursor-pointer" onClick={() => setFbOutside(!fbOutside)}>
              <div className="flex items-center gap-3">
                <span className="bg-[#1877F2] p-1.5 rounded-md text-white flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </span>
                <div>
                  <p className="text-slate-300 font-semibold">Buka Link di Luar Facebook</p>
                  <p className="text-xs text-slate-500">Paksa buka di Chrome/Browser default.</p>
                </div>
              </div>
              <button type="button" className={`flex items-center transition-colors ${fbOutside ? 'text-blue-500' : 'text-slate-600'}`}>
                <span className="material-symbols-outlined text-4xl">{fbOutside ? 'toggle_on' : 'toggle_off'}</span>
              </button>
            </div>

            {/* Input Histats Textarea */}
            <div className="flex flex-col border-b border-slate-800 py-4 px-2 sm:px-4 hover:bg-slate-900/50 transition-colors">
              <label className="text-slate-300 font-semibold mb-3">Kode Histats (Tampil di Halaman Redirect)</label>
              <textarea value={histatsCode} onChange={e => setHistatsCode(e.target.value)} rows="5"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-700" 
                placeholder="&#10;<script type='text/javascript'>..."></textarea>
            </div>

          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="px-2 sm:px-0">
          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-4 rounded-xl transition-colors disabled:opacity-60 flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20">
            {saving ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : <span className="material-symbols-outlined text-xl">save</span>}
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>

      </form>

      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
