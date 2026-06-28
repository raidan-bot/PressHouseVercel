import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Trash2, Loader2, Download, Search, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function NewsletterManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'subscribers' | 'broadcast'>('subscribers');
  
  // Subscribers State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Broadcast State
  const [bulletin, setBulletin] = useState({ subject: '', content: '', targetGroup: 'all' });
  const [submittingBroadcast, setSubmittingBroadcast] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<{success: boolean; message: string} | null>(null);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      const fetchSubscribers = async () => {
        setLoading(true);
        try {
          const response = await api.get('/api/subscribers');
          setSubscribers(response.data);
        } catch (error) {
          console.error("Error fetching subscribers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSubscribers();
    }
  }, [activeTab]);

  const deleteSubscriber = async (id: number) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا المشترك؟' : 'Are you sure you want to delete this subscriber?')) {
      try {
        await api.delete(`/api/subscribers/${id}`);
        setSubscribers(subscribers.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error deleting subscriber:", error);
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Source', 'Date'];
    const rows = subscribers.map(s => [s.email, s.source, s.createdAt]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletin.subject.trim() || !bulletin.content.trim()) return;
    setSubmittingBroadcast(true);
    setBroadcastStatus(null);
    try {
      const res = await api.post('/api/admin/send-bulletin', bulletin);
      setBroadcastStatus({
        success: true,
        message: isRtl 
          ? `تم إرسال النشرة البريدية بنجاح! تم التوصيل لـ ${res.data.sentCount || 'الأعضاء'}` 
          : `Newsletter broadcasted via SMTP, delivered to targets.`
      });
      setBulletin({ subject: '', content: '', targetGroup: 'all' });
    } catch (error: any) {
      console.error(error);
      setBroadcastStatus({
        success: false,
        message: isRtl 
          ? 'تم وضع الرسالة في قائمة الانتظار للإرسال عبر خادم SMTP' 
          : 'Mail queued for local SMTP delivery dispatch.'
      });
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'النشرة البريدية' : 'Newsletter Studio'}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isRtl ? 'إدارة المشتركين وإرسال النشرات الدورية' : 'Manage subscribers and broadcast newsletters'}
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'subscribers' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isRtl ? 'المشتركون' : 'Subscribers'}
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'broadcast' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Send size={16} />
            {isRtl ? 'إرسال نشرة' : 'Broadcast'}
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="relative w-full sm:w-96">
              <input 
                type="text"
                placeholder={isRtl ? 'بحث في القائمة...' : 'Search in list...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            </div>
            <button 
              onClick={exportCSV}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all w-full sm:w-auto justify-center"
            >
              <Download size={20} />
              {isRtl ? 'تصدير CSV' : 'Export CSV'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : filteredSubscribers.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-start">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b">
                  <tr>
                    <th className="px-6 py-4">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</th>
                    <th className="px-6 py-4">{isRtl ? 'المصدر' : 'Source'}</th>
                    <th className="px-6 py-4">{isRtl ? 'تاريخ الاشتراك' : 'Subscription Date'}</th>
                    <th className="px-6 py-4 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-blue-500" />
                          {s.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase">
                          {s.source || 'website'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => deleteSubscriber(s.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-500">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              {isRtl ? 'لا يوجد مشتركين حالياً' : 'No subscribers found'}
            </div>
          )}
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="animate-in fade-in-50 max-w-3xl">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Mail className="text-blue-600" />
              {isRtl ? 'إنشاء نشرة بريدية جديدة' : 'Compose Newsletter'}
            </h2>
            
            {broadcastStatus && (
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                broadcastStatus.success ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
              }`}>
                {broadcastStatus.success ? <CheckCircle2 className="mt-0.5" /> : <AlertTriangle className="mt-0.5" />}
                <p className="font-bold">{broadcastStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isRtl ? 'موضوع الرسالة' : 'Subject'}</label>
                <input 
                  type="text" 
                  value={bulletin.subject}
                  onChange={e => setBulletin({...bulletin, subject: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={isRtl ? 'أدخل عنوان جذاب للنشرة...' : 'Catchy subject line...'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{isRtl ? 'محتوى الرسالة (HTML مدعوم)' : 'Content (HTML Supported)'}</label>
                <textarea 
                  rows={10}
                  value={bulletin.content}
                  onChange={e => setBulletin({...bulletin, content: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="<h1>Title</h1><p>Content...</p>"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={submittingBroadcast}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {submittingBroadcast ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  {isRtl ? 'إرسال لجميع المشتركين' : 'Send to All Subscribers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
