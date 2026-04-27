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

  const itemsPerPage = 5; // Jumlah data per halaman

  const showNotif = (msg, type) => setToast({ message: msg, type });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Ambil total statistik (Link & Clicks)
      const { data: statsData } = await supabase.from('urls').select('clicks');
      if (statsData) {
        setTotalLinks(statsData.length);
        setTotalClicks(statsData.reduce((sum, row) => sum + (row.clicks || 0), 0));
      }

      // 2. Ambil data tabel untuk halaman saat ini
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

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('urls').delete().eq('id', id);
      if (error) throw error;
      showNotif('Tautan berhasil dihapus', 'success');
      fetchData(); // Refresh data setelah hapus
    } catch (err) {
      showNotif('Gagal menghapus tautan', 'error');
    }
  };

  return (
    <div className="w-full mt-10">
      
      {/* Area Statistik & Tombol Refresh */}
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

      {/* Area Tabel (Bisa digeser ke samping di HP) */}
      <div className="bg-slate-900 border border-slate-800 sm:rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
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
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : urls.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500">Belum ada tautan yang dibuat.</td>
                </tr>
              ) : (
                urls.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                    {/* Thumbnail */}
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 bg-slate-950 rounded border border-slate-700 overflow-hidden flex items-center justify-center">
                        {u.thumbnail_url ? (
                          <img src={u.thumbnail_url} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-600">image</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Judul & Link (Pencegah kepanjangan) */}
                    <td className="py-3 px-6">
                      <div className="max-w-[200px] sm:max-w-[250px]">
                        <p className="text-white font-semibold truncate">{u.title || 'Tanpa Judul'}</p>
                        <a href={`/${u.short_code}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate block mt-0.5">
                          v1link.vercel.app/{u.short_code}
                        </a>
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3 px-6 text-slate-400 text-sm">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Hitcount */}
                    <td className="py-3 px-6 text-center">
                      <span className="bg-slate-950 border border-slate-700 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        {u.clicks || 0}
                      </span>
                    </td>

                    {/* Aksi (Copy & Delete) */}
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleCopy(u.short_code)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-2 rounded transition-colors" title="Salin">
                          <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="bg-slate-800 hover:bg-red-900/50 text-red-400 p-2 rounded transition-colors" title="Hapus">
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
        
        {/* Paginasi Prev & Next */}
        <div className="bg-slate-950/30 border-t border-slate-800 p-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Halaman {page}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1} 
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors">
              Prev
            </button>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={!hasMore} 
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
