'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ToastNotif from '@/components/ui/ToastNotif';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    site_name: '',
    domain_name: '',
    histats_code: '',
    fb_open_outside: false,
    cloudinary_cloud_name: '',
    cloudinary_api_key: '',
    cloudinary_api_secret: '',
    cloudinary_upload_preset: '',
    anti_bot_enabled: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) setFormData({ ...data });
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({ id: 1, ...formData });
      if (error) throw error;
      setToast({ message: 'Settings updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center text-slate-500 mt-20 text-sm">Loading settings...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      <div className="mb-10 px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">System Configuration</h1>
        <p className="text-slate-500 text-xs sm:text-sm">Manage your website identity, security, and cloud storage.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        
        {/* SECTION 1: IDENTITY */}
        <section>
          <div className="flex items-center gap-2 px-4 mb-4 border-l-2 border-blue-600">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Website Identity</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            <div className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-medium text-slate-300">Site Name</label>
              <input type="text" value={formData.site_name} onChange={e => setFormData({...formData, site_name: e.target.value})} 
                className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full sm:w-1/2 placeholder:text-slate-700" placeholder="e.g. V1Link Pro" />
            </div>
            <div className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-medium text-slate-300">Domain URL</label>
              <input type="text" value={formData.domain_name} onChange={e => setFormData({...formData, domain_name: e.target.value})} 
                className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full sm:w-1/2 placeholder:text-slate-700" placeholder="domain.com" />
            </div>
          </div>
        </section>

        {/* SECTION 2: CLOUDINARY CONFIG */}
        <section>
          <div className="flex items-center gap-2 px-4 mb-4 border-l-2 border-orange-500">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Cloudinary Storage</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {['cloud_name', 'api_key', 'api_secret', 'upload_preset'].map((key) => (
              <div key={key} className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-medium text-slate-300 capitalize">{key.replace('_', ' ')}</label>
                <input type={key === 'api_secret' ? 'password' : 'text'} 
                  value={formData[`cloudinary_${key}`]} 
                  onChange={e => setFormData({...formData, [`cloudinary_${key}`]: e.target.value})} 
                  className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full sm:w-1/2 placeholder:text-slate-700" placeholder={`Your ${key}`} />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SECURITY & TOOLS */}
        <section>
          <div className="flex items-center gap-2 px-4 mb-4 border-l-2 border-green-500">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Security & Scripts</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {/* Toggle Anti-Bot */}
            <div className="py-4 px-4 flex items-center justify-between group cursor-pointer" onClick={() => setFormData({...formData, anti_bot_enabled: !formData.anti_bot_enabled})}>
              <div>
                <p className="text-sm font-medium text-slate-300">Anti-Bot Protection</p>
                <p className="text-[10px] text-slate-500">Block automated crawlers and suspicious bots.</p>
              </div>
              <span className={`material-symbols-outlined text-3xl transition-colors ${formData.anti_bot_enabled ? 'text-green-500' : 'text-slate-700'}`}>
                {formData.anti_bot_enabled ? 'toggle_on' : 'toggle_off'}
              </span>
            </div>
            
            {/* Toggle FB Outside */}
            <div className="py-4 px-4 flex items-center justify-between group cursor-pointer" onClick={() => setFormData({...formData, fb_open_outside: !formData.fb_open_outside})}>
              <div>
                <p className="text-sm font-medium text-slate-300">Force Open Outside FB</p>
                <p className="text-[10px] text-slate-500">Bypass Facebook's In-App Browser.</p>
              </div>
              <span className={`material-symbols-outlined text-3xl transition-colors ${formData.fb_open_outside ? 'text-blue-500' : 'text-slate-700'}`}>
                {formData.fb_open_outside ? 'toggle_on' : 'toggle_off'}
              </span>
            </div>

            {/* Histats Textarea */}
            <div className="py-6 px-4">
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Tracking Script (Histats/Analytics)</label>
              <textarea value={formData.histats_code} onChange={e => setFormData({...formData, histats_code: e.target.value})} rows="4"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-400 focus:border-blue-500 outline-none resize-none" 
                placeholder="Paste your script here..."></textarea>
            </div>
          </div>
        </section>

        <div className="px-4">
          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      {toast && <ToastNotif message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
