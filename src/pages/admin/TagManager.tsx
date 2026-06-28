import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function TagManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name_ar: '', name_en: '', slug: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await api.get('/api/tags');
      setTags(res.data || []);
    } catch (e) {
      console.error('Error fetching tags:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTags(); }, []);

  const resetForm = () => {
    setForm({ name_ar: '', name_en: '', slug: '' });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (tag: any) => {
    setForm({ name_ar: tag.name_ar, name_en: tag.name_en || '', slug: tag.slug || '' });
    setEditId(tag.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/api/tags/${editId}`, form);
      } else {
        await api.post('/api/tags', form);
      }
      resetForm();
      fetchTags();
    } catch (e) {
      console.error('Error saving tag:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذه العلامة؟' : 'Are you sure you want to delete this tag?')) return;
    try {
      await api.delete(`/api/tags/${id}`);
      fetchTags();
    } catch (e) {
      console.error('Error deleting tag:', e);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black">{isRtl ? 'إدارة العلامات' : 'Tag Manager'}</h2>
          <p className="text-slate-500 text-sm mt-1">{isRtl ? 'وسم المحتوى بكلمات مفتاحية' : 'Tag content with keywords'}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer">
          <Plus size={16} /> {isRtl ? 'إضافة علامة' : 'Add Tag'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">{isRtl ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">{isRtl ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Slug</label>
              <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer"><Check size={16} /> {isRtl ? 'حفظ' : 'Save'}</button>
            <button onClick={resetForm} className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"><X size={16} /> {isRtl ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-start px-6 py-3 font-bold text-slate-500">{isRtl ? 'الاسم' : 'Name'}</th>
              <th className="text-start px-6 py-3 font-bold text-slate-500">{isRtl ? 'الاسم (إنجليزي)' : 'Name (EN)'}</th>
              <th className="text-start px-6 py-3 font-bold text-slate-500">Slug</th>
              <th className="text-end px-6 py-3 font-bold text-slate-500">{isRtl ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tags.map((tag: any) => (
              <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold">{isRtl ? tag.name_ar : tag.name_en || tag.name_ar}</td>
                <td className="px-6 py-4 text-slate-500">{tag.name_en}</td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{tag.slug}</td>
                <td className="px-6 py-4 text-end">
                  <button onClick={() => openEdit(tag)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-colors cursor-pointer"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(tag.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">{isRtl ? 'لا توجد علامات بعد' : 'No tags yet'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <h3 className="font-bold text-indigo-800 text-sm mb-2">{isRtl ? 'استخدام العلامات' : 'Using Tags'}</h3>
        <p className="text-xs text-indigo-600 leading-relaxed">
          {isRtl ? 'يمكن ربط العلامات بالمقالات من خلال محرر المقالات. ستظهر العلامات في واجهة المستخدم كوسوم قابلة للنقر للتصفية.' : 'Tags can be linked to articles through the article editor. They appear as clickable badges for filtering.'}
        </p>
      </div>
    </div>
  );
}
