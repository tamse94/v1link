'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import ToastNotif from '@/components/ui/ToastNotif';

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // State untuk Modal Edit
  const [editModal, setEditModal] = useState({ isOpen: false, id: null, originalUrl: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const itemsPerPage = 5;

  const showNotif = (msg, type) => setToast({ message: msg, type });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: statsData } = await supabase.from('urls').select('clicks');
      if (statsData) {
        setTotalLinks(statsData.length);
        setTotalClicks(statsData.reduce((sum, row) => sum + (row.clicks || 0), 0));
      }

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, error } = await supabase
        .from('urls')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setUrls(data || []);
      setHasMore((data || []).length === itemsPerPage);
    } catch (error) {
      showNotif('Gagal mengambil data', 'error');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = async (shortCode) => {
    const url = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(url);
      showNotif('Tautan disalin!', 'success');
    } catch (err) {
      showNotif('Gagal menyalin', 'error');
    }
  };

  // Fungsi Edit
  const openEditModal = (id, currentUrl) => {
    setEditModal({ isOpen: true, id, originalUrl: currentUrl });
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('urls')
        .update({ original_url: editModal.originalUrl })
        .eq('id', editModal.id);

      if (error) throw error;
      showNotif('Link tujuan berhasil diubah', 'success');
      setEditModal({ isOpen: false, id: null, originalUrl: '' });
      fetchData(); // Refresh data
    } catch (err) {
      showNotif('Gagal mengubah link', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Fungsi Hapus Komplit (Cloudinary + Supabase)
  const handleDelete = async (id, thumbnailUrl) => {
    // Tambahan konfirmasi custom jika diperlukan, atau langsung hapus
    const confirmDelete = window.confirm("Yakin ingin menghapus tautan dan gambar ini secara permanen?");
    if (!confirmDelete) return;

    try {
      // 1. Hapus gambar dari Cloudinary jika ada
      if (thumbnailUrl) {
        const parts = thumbnailUrl.split('/');
        const fileWithExt = parts[parts.length - 1]; // contoh: "sample.jpg"
        const publicId = fileWithExt.split('.')[0]; // contoh: "sample"

        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: publicId })
        });
      }

      // 2. Hapus data dari Supabase
      const { error } = await supabase.from('urls').delete().eq('id', id);
      if (error) throw error;
      
      showNotif('Tautan dan gambar berhasil dihapus permanen', 'success');
      fetchData();
    } catch (err) {
      showNotif('Gagal menghapus data', 'error');
    }
  };

  return (
    <div className="w-full mt-10 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 flex-1 sm:flex-none text-center">
            <span className="block text-xs text-slate-400 font-semibold uppercase">Total Link</span>
            <span className="text-xl font-bold text-blue-400">{totalLinks}</span>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 flex-1 sm:flex-none text-center">
            <span className="block text-xs text-slate-400 font-semibold uppercase">Total Hitcount</span>
            <span className="text-xl font-bold text-green-400">{totalClicks}</span>
          </div>
        </div>
        <button onClick={fetchData} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold">
          <span className="material-symbols-outlined text-lg">refresh</span> Refresh Data
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 sm:rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                <th className="py-4 px-6 font-semibold w-16">Image</th>
                <th className="py-4 px-6 font-semibold">Tautan & Judul</th>
                <th className="py-4 px-6 font-semibold">Tanggal</th>
                <th className="py-4 px-6 font-semibold text-center">Hits</th>
                <th className="py-4 px-6 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-center text-slate-500">Memuat data...</td></tr>
              ) : urls.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-center text-slate-500">Belum ada tautan yang dibuat.</td></tr>
              ) : (
                urls.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 bg-slate-950 rounded border border-slate-700 overflow-hidden flex items-center justify-center">
                        {u.thumbnail_url ? (
                          <img src={u.thumbnail_url} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-600">image</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-3 px-6">
                      <div className="max-w-[180px] sm:max-w-[250px]">
                        <p className="text-white font-semibold truncate">{u.title || 'Tanpa Judul'}</p>
                        <a href={`/${u.short_code}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate block mt-0.5">
                          v1link.vercel.app/{u.short_code}
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-6 text-slate-400 text-sm">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="py-3 px-6 text-center">
                      <span className="bg-slate-950 border border-slate-700 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        {u.clicks || 0}
                      </span>
                    </td>

                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleCopy(u.short_code)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded transition-colors" title="Salin">
                          <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                        <button onClick={() => openEditModal(u.id, u.original_url)} className="bg-slate-800 hover:bg-blue-900/50 text-blue-400 p-2 rounded transition-colors" title="Edit Link Tujuan">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(u.id, u.thumbnail_url)} className="bg-slate-800 hover:bg-red-900/50 text-red-400 p-2 rounded transition-colors" title="Hapus Permanen">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-950/30 border-t border-slate-800 p-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Halaman {page}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors">Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT (Muncul menimpa layar, tidak pakai alert bawaan) */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xl font-bold text-white mb-4">Edit Link Tujuan</h3>
            <label className="block text-sm text-slate-400 mb-2">Masukkan URL / Penawaran Baru:</label>
            <input 
              type="url" 
              value={editModal.originalUrl} 
              onChange={e => setEditModal({...editModal, originalUrl: e.target.value})} 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-blue-500 outline-none transition-colors mb-6"
            />
            <div className="flex justify-end gap-3">
              <button disabled={savingEdit} onClick={() => setEditModal({isOpen: false, id: null, originalUrl: ''})} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors">Batal</button>
              <button disabled={savingEdit} onClick={handleSaveEdit} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2">
                {savingEdit ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : null}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
