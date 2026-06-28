import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function CategoryManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name_ar: '', name_en: '', slug: '', type: 'article', sort_order: 0, isActive: true });
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ name_ar: '', name_en: '', slug: '', type: 'article', sort_order: 0, isActive: true });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (cat: any) => {
    setForm({ name_ar: cat.name_ar, name_en: cat.name_en || '', slug: cat.slug || '', type: cat.type || 'article', sort_order: cat.sort_order || 0, isActive: cat.isActive !== false });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await api.put(`/api/categories/${editId}`, form);
      } else {
        await api.post('/api/categories', form);
      }
      resetForm();
      fetchCategories();
    } catch (e) {
      console.error('Error saving category:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (e) {
      console.error('Error deleting category:', e);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black">{isRtl ? 'إدارة التصنيفات' : 'Category Manager'}</h2>
          <p className="text-slate-500 text-sm mt-1">{isRtl ? 'تصنيف المحتوى حسب الأقسام' : 'Organize content by sections'}</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer">
          <Plus size={16} /> {isRtl ? 'إضافة تصنيف' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">{isRtl ? 'النوع' : 'Type'}</label>
              <select className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="article">{isRtl ? 'مقالات' : 'Articles'}</option>
                <option value="project">{isRtl ? 'مشاريع' : 'Projects'}</option>
                <option value="event">{isRtl ? 'فعاليات' : 'Events'}</option>
                <option value="course">{isRtl ? 'دورات' : 'Courses'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">{isRtl ? 'ترتيب الفرز' : 'Sort Order'}</label>
              <input type="number" className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                <span className="text-sm font-bold text-slate-600">{isRtl ? 'نشط' : 'Active'}</span>
              </label>
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
              <th className="text-start px-6 py-3 font-bold text-slate-500">{isRtl ? 'النوع' : 'Type'}</th>
              <th className="text-start px-6 py-3 font-bold text-slate-500">Slug</th>
              <th className="text-start px-6 py-3 font-bold text-slate-500">{isRtl ? 'الترتيب' : 'Order'}</th>
              <th className="text-start px-6 py-3 font-bold text-slate-500">{isRtl ? 'الحالة' : 'Status'}</th>
              <th className="text-end px-6 py-3 font-bold text-slate-500">{isRtl ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold">{isRtl ? cat.name_ar : cat.name_en || cat.name_ar}</td>
                <td className="px-6 py-4 text-slate-500">{cat.type}</td>
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-slate-500">{cat.sort_order}</td>
                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{cat.isActive ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'غير نشط' : 'Inactive')}</span></td>
                <td className="px-6 py-4 text-end">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-colors cursor-pointer"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">{isRtl ? 'لا توجد تصنيفات بعد' : 'No categories yet'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
