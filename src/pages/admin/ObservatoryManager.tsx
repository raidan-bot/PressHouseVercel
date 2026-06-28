import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Trash2, CheckCircle2, XCircle, FileText, Search, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function ObservatoryManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/violations');
      setViolations(response.data || []);
    } catch (error) {
      console.error("Error fetching violations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/violations/${id}`, { status });
      setViolations(violations.map(v => v.id === id ? { ...v, status } : v));
    } catch (error) {
      console.error("Error updating violation status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا البلاغ؟' : 'Are you sure you want to delete this report?')) {
      try {
        await api.delete(`/api/violations/${id}`);
        setViolations(violations.filter(v => v.id !== id));
      } catch (error) {
        console.error("Error deleting violation:", error);
      }
    }
  };

  const filteredViolations = violations.filter(v => 
    v.victimName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.governorate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isRtl ? 'إدارة مرصد الانتهاكات' : 'Observatory Manager'}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isRtl 
              ? 'مراجعة وتوثيق البلاغات الواردة من نموذج الإبلاغ عن الانتهاكات.' 
              : 'Review and document reports from the violations reporting form.'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'ابحث عن ضحية، محافظة، نوع الانتهاك...' : 'Search victim, governorate, type...'}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-[32px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-mono tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-start">{isRtl ? 'الضحية' : 'Victim'}</th>
                  <th className="px-6 py-5 text-start">{isRtl ? 'النوع والمكان' : 'Type & Location'}</th>
                  <th className="px-6 py-5 text-start">{isRtl ? 'الوصف' : 'Description'}</th>
                  <th className="px-6 py-5 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-5 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredViolations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                      {isRtl ? 'لا توجد بلاغات' : 'No reports found'}
                    </td>
                  </tr>
                ) : (
                  filteredViolations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{v.victimName}</div>
                        <div className="text-xs text-slate-500 mt-1">{v.organization || (isRtl ? 'مستقل' : 'Freelance')}</div>
                        <div className="text-xs text-slate-400 mt-1 font-mono">{v.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold block w-fit mb-2">
                          {v.type}
                        </span>
                        <div className="text-xs text-slate-500">{v.governorate}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 line-clamp-3" title={v.description}>{v.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        {v.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 size={14} /> {isRtl ? 'مؤكد' : 'Verified'}
                          </span>
                        ) : v.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                            <XCircle size={14} /> {isRtl ? 'مرفوض' : 'Rejected'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            <ShieldAlert size={14} /> {isRtl ? 'قيد المراجعة' : 'Pending'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {v.status !== 'verified' && (
                            <button 
                              onClick={() => handleUpdateStatus(v.id, 'verified')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title={isRtl ? 'اعتماد كمؤكد' : 'Verify'}
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          {v.status !== 'rejected' && (
                            <button 
                              onClick={() => handleUpdateStatus(v.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title={isRtl ? 'رفض' : 'Reject'}
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(v.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title={isRtl ? 'حذف نهائي' : 'Delete'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
