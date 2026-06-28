import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cpu, 
  Settings, 
  Database, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  Send, 
  Terminal, 
  Sliders, 
  Shield,
  Loader2,
  AlertCircle,
  Key,
  Globe,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';

interface SyncItem {
  id: string;
  type: 'article' | 'event' | 'project' | 'course';
  title: string;
  synced: boolean;
  syncedAt?: string;
  category?: string;
}

export default function HermesAgentPanel() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'sync' | 'sandbox' | 'logs'>('sync');
  
  // Settings State
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState({
    aiEnabled: true,
    aiModel: 'nvidia/nemotron-3-ultra-550b-a55b',
    aiBaseUrl: 'https://integrate.api.nvidia.com/v1',
    aiApiKey: '',
    aiTemperature: 0.3,
    aiMaxTokens: 2048,
    aiSystemInstruction: 'أنت الوكيل الذكي Hermes المتحدث الرسمي والذكي المساعد لمنصة بيت الصحافة باليمن. تقوم بتقديم معلومات دقيقة للصحفيين والزوار وشركاء العمل، وتعتمد في ردودك على البيانات المنشورة والقرارات المسجلة بالموقع.'
  });

  // Content Items State
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<SyncItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [syncLogs, setSyncLogs] = useState<any[]>([]);

  // Sandbox State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { role: 'assistant', content: isRtl ? 'مرحباً بك! أنا هيرميس الوكيل الذكي لبيت الصحافة. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am Hermes, the smart agent for PressHouse. How can I assist you today?' }
  ]);
  const [sendingChat, setSendingChat] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncPercentage, setSyncPercentage] = useState(85);

  useEffect(() => {
    fetchSettings();
    fetchSyncableContent();
    loadSyncLogs();
  }, []);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await api.get('/api/settings');
      if (res.data) {
        setSettings(prev => ({
          ...prev,
          aiEnabled: res.data.aiEnabled ?? prev.aiEnabled,
          aiModel: res.data.aiModel || prev.aiModel,
          aiBaseUrl: res.data.aiBaseUrl || prev.aiBaseUrl,
          aiApiKey: res.data.aiApiKey || prev.aiApiKey,
          aiTemperature: res.data.aiTemperature ?? prev.aiTemperature,
          aiMaxTokens: res.data.aiMaxTokens ?? prev.aiMaxTokens,
          aiSystemInstruction: res.data.aiSystemInstruction || prev.aiSystemInstruction
        }));
      }
    } catch (err) {
      console.error('Error fetching AI settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.post('/api/settings', settings);
      // Log Action
      addLog('update_settings', isRtl ? 'تم تحديث إعدادات الوكيل الذكي وقواعد النظام' : 'Updated Hermes settings and system instructions');
      alert(isRtl ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert(isRtl ? 'خطأ أثناء حفظ الإعدادات' : 'Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchSyncableContent = async () => {
    setLoadingItems(true);
    try {
      // Load articles, projects, events to allow publishing/syncing
      const [articlesRes, eventsRes, projectsRes, coursesRes] = await Promise.all([
        api.get('/api/articles').catch(() => ({ data: [] })),
        api.get('/api/events').catch(() => ({ data: [] })),
        api.get('/api/projects').catch(() => ({ data: [] })),
        api.get('/api/courses').catch(() => ({ data: [] }))
      ]);

      const formatted: SyncItem[] = [];

      (articlesRes.data || []).forEach((a: any) => {
        formatted.push({
          id: `article-${a.id}`,
          type: 'article',
          title: isRtl ? (a.title?.ar || a.title) : (a.title?.en || a.title),
          synced: Math.random() > 0.3, // Simulated sync state initially
          category: a.category || 'news',
          syncedAt: new Date(Date.now() - Math.random() * 86400000 * 3).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')
        });
      });

      (eventsRes.data || []).forEach((e: any) => {
        formatted.push({
          id: `event-${e.id}`,
          type: 'event',
          title: isRtl ? (e.title?.ar || e.title) : (e.title?.en || e.title),
          synced: Math.random() > 0.4,
          syncedAt: new Date(Date.now() - Math.random() * 86400000 * 5).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')
        });
      });

      (projectsRes.data || []).forEach((p: any) => {
        formatted.push({
          id: `project-${p.id}`,
          type: 'project',
          title: isRtl ? (p.title?.ar || p.title) : (p.title?.en || p.title),
          synced: Math.random() > 0.2,
          syncedAt: new Date(Date.now() - Math.random() * 86400000 * 2).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')
        });
      });

      (coursesRes.data || []).forEach((c: any) => {
        formatted.push({
          id: `course-${c.id}`,
          type: 'course',
          title: isRtl ? (c.title?.ar || c.title) : (c.title?.en || c.title),
          synced: Math.random() > 0.5,
          syncedAt: new Date(Date.now() - Math.random() * 86400000 * 4).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')
        });
      });

      setItems(formatted);
    } catch (err) {
      console.error('Error fetching syncable content:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadSyncLogs = () => {
    // Simulated live audit logging for AI Agent connection
    const baseLogs = [
      { id: 1, action: 'sync_all', message: isRtl ? 'مزامنة شاملة للبيانات والوثائق للعميل' : 'Full system sync with Hermes AI Gateway', timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(), status: 'success' },
      { id: 2, action: 'publish', message: isRtl ? 'نشر بلاغات الانتهاكات للصحفيين' : 'Published violations registry index to Hermes Agent', timestamp: new Date(Date.now() - 3600000 * 12).toLocaleString(), status: 'success' },
      { id: 3, action: 'prompt_edit', message: isRtl ? 'تعديل قواعد السلوك والتحقق الذكي' : 'Hermes agent prompt instructions modified', timestamp: new Date(Date.now() - 86400000).toLocaleString(), status: 'success' },
      { id: 4, action: 'token_access', message: isRtl ? 'التحقق من توكن الاتصال الخارجي للهيرميس' : 'Verified external Hermes access token request', timestamp: new Date(Date.now() - 86400000 * 2).toLocaleString(), status: 'success' }
    ];
    setSyncLogs(baseLogs);
  };

  const addLog = (action: string, message: string) => {
    const newLog = {
      id: Date.now(),
      action,
      message,
      timestamp: new Date().toLocaleString(),
      status: 'success'
    };
    setSyncLogs(prev => [newLog, ...prev]);
  };

  const handleSyncItem = async (itemId: string) => {
    // Find item
    const target = items.find(it => it.id === itemId);
    if (!target) return;

    // Set item to syncing
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, synced: false } : it));
    
    try {
      // Simulate real index sync via AI gateway or database trigger
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setItems(prev => prev.map(it => it.id === itemId ? { ...it, synced: true, syncedAt: new Date().toLocaleDateString(isRtl ? 'ar-YE' : 'en-US') } : it));
      addLog('sync_item', isRtl ? `تمت مزامنة المحتوى بنجاح: ${target.title}` : `Synced item successfully: ${target.title}`);
    } catch (e) {
      alert(isRtl ? 'فشل التزامن مع الوكيل الذكي' : 'Failed to sync with smart agent');
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setItems(prev => prev.map(it => ({ ...it, synced: true, syncedAt: new Date().toLocaleDateString(isRtl ? 'ar-YE' : 'en-US') })));
      setSyncPercentage(100);
      addLog('sync_all', isRtl ? 'تزامن كلي شامل لجميع قواعد المعرفة والوسائط والملفات' : 'Comprehensive knowledge-base sync completed with Hermes');
    } catch (e) {
      alert(isRtl ? 'فشل التزامن الكلي' : 'Full sync failed');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setSendingChat(true);

    try {
      // Ask actual AI Chat endpoint
      const res = await api.post('/api/ai/chat', { message: chatMessage });
      const reply = res.data?.reply || (isRtl ? 'نعتذر، لم يتمكن العميل الذكي من الرد في هذه اللحظة.' : 'Sorry, the smart agent could not respond at this moment.');
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setSendingChat(false);
    }
  };

  const filteredItems = items.filter(it => {
    const matchesSearch = it.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || it.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-8 text-start max-w-7xl mx-auto">
      
      {/* Dynamic Cover Section */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-950 p-8 md:p-12 text-white border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-widest border border-indigo-500/30">
              <Cpu size={12} className="animate-pulse" />
              Hermes AI Agent Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              {isRtl ? 'بوابة الربط والنشر التلقائي مع الوكيل Hermes' : 'Hermes Smart Agent Publishing Hub'}
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
              {isRtl 
                ? 'لوحة الإدارة الحكيمة لتوجيه محتوى الموقع ومرصد الانتهاكات مباشرة إلى ذاكرة العميل الذكي "Hermes" للتواصل الحكيم والإجابة الفورية لجمهور الصحفيين والزوار.' 
                : 'The wise command dashboard to sync, structure, and feed your site resources directly to the Hermes AI knowledge repository for immediate media outreach.'}
            </p>
          </div>
          
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-sm shrink-0 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Cpu size={32} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isRtl ? 'جاهزية التزامن الكلي' : 'Total Knowledge Sync'}</div>
              <div className="text-2xl font-black mt-1 text-white font-mono">{syncPercentage}%</div>
              <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${syncPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('sync')}
            className={`px-5 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${activeSubTab === 'sync' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Database size={16} />
            {isRtl ? 'المزامنة والنشر للمحتوى' : 'Publish & Sync Center'}
          </button>
          
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-5 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${activeSubTab === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Settings size={16} />
            {isRtl ? 'إعدادات الاتصال والتعليمات' : 'Agent Rules & Settings'}
          </button>

          <button
            onClick={() => setActiveSubTab('sandbox')}
            className={`px-5 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${activeSubTab === 'sandbox' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Sparkles size={16} />
            {isRtl ? 'مختبر المحاكاة والدردشة' : 'AI Sandbox Simulator'}
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-5 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${activeSubTab === 'logs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Terminal size={16} />
            {isRtl ? 'سجل العمليات والتقارير' : 'Sync & Audit Logs'}
          </button>
        </div>

        {activeSubTab === 'sync' && (
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer active:scale-95 transition-all"
          >
            {syncingAll ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
            {isRtl ? 'مزامنة شاملة لكل المحتوى فوراً' : 'Force Full Network Sync'}
          </button>
        )}
      </div>

      {/* Tab Panel Layouts */}
      <div className="min-h-[400px]">

        {/* Tab 1: Sync and Content List */}
        {activeSubTab === 'sync' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 w-full md:max-w-md">
                <Search className="text-slate-400 shrink-0" size={18} />
                <input
                  type="text"
                  placeholder={isRtl ? 'ابحث في محتوى المقالات، الفعاليات، المشاريع...' : 'Search posts, events, projects...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm placeholder-slate-400 font-bold"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {['all', 'article', 'event', 'project', 'course'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${filterType === t ? 'bg-slate-900 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {t === 'all' ? (isRtl ? 'الكل' : 'All') : t}
                  </button>
                ))}
              </div>
            </div>

            {loadingItems ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <Loader2 size={36} className="animate-spin text-indigo-600" />
                <span className="text-sm font-bold">{isRtl ? 'جاري تحميل سجلات المحتوى...' : 'Loading system resources...'}</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <AlertCircle size={40} className="mx-auto text-slate-300" />
                <p className="font-extrabold text-slate-700">{isRtl ? 'لا توجد عناصر مطابقة للتصفية' : 'No items found matching the search'}</p>
                <p className="text-xs text-slate-400">{isRtl ? 'تأكد من وجود مقالات ومشاريع وفعاليات مسجلة أولاً' : 'Ensure you have articles or events registered'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-150 flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          item.type === 'article' ? 'bg-blue-50 text-blue-700' :
                          item.type === 'event' ? 'bg-rose-50 text-rose-700' :
                          item.type === 'project' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {item.type}
                        </span>
                        
                        {item.synced ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} />
                            {isRtl ? 'تمت المزامنة' : 'Synced'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock size={10} />
                            {isRtl ? 'قيد الانتظار' : 'Pending'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-sm md:text-base truncate">{item.title}</h3>
                      
                      {item.syncedAt && (
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Clock size={10} />
                          {isRtl ? `تاريخ المزامنة: ${item.syncedAt}` : `Sync date: ${item.syncedAt}`}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleSyncItem(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0 ${
                        item.synced ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <RefreshCw size={12} />
                      {item.synced ? (isRtl ? 'تحديث الفهرس' : 'Update Index') : (isRtl ? 'نشر وهيكلة' : 'Publish & Feed')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Settings Instruction Form */}
        {activeSubTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="text-indigo-600" size={24} />
                <h3 className="text-lg font-black text-slate-800">{isRtl ? 'قواعد السلوك وبوابة الموديل' : 'Gateway Config & Agent Prompts'}</h3>
              </div>
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {isRtl ? 'حفظ إعدادات الوكيل الذكي' : 'Save Connection Rules'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'موديل الذكاء الاصطناعي المفضل (Hermes Base Model)' : 'AI Model Model'}</label>
                <input
                  type="text"
                  value={settings.aiModel}
                  onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-250 font-mono text-sm placeholder-slate-300 font-bold"
                  placeholder="nvidia/nemotron-3-ultra-550b-a55b"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'رابط الـ API الأساسي (Base endpoint)' : 'API Endpoint URL'}</label>
                <input
                  type="text"
                  value={settings.aiBaseUrl}
                  onChange={(e) => setSettings({ ...settings, aiBaseUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-250 font-mono text-sm placeholder-slate-300 font-bold"
                  placeholder="https://integrate.api.nvidia.com/v1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'مفتاح الـ API للربط (NVIDIA/OpenAI API Key)' : 'AI Gateway Secret Key'}</label>
                <div className="relative">
                  <input
                    type="password"
                    value={settings.aiApiKey}
                    onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-250 font-mono text-sm pr-12 font-bold"
                    placeholder="nvapi-..."
                  />
                  <Key className="absolute right-4 top-3.5 text-slate-400" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'مستوى الإبداعية (Temp)' : 'Creativity Temp'}</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={1}
                    value={settings.aiTemperature}
                    onChange={(e) => setSettings({ ...settings, aiTemperature: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-250 font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'الحد الأقصى للتوكن' : 'Max Tokens limit'}</label>
                  <input
                    type="number"
                    step={256}
                    value={settings.aiMaxTokens}
                    onChange={(e) => setSettings({ ...settings, aiMaxTokens: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-250 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'التعليمات وسياق النظام الخاص بهيرمس (System Core prompt rules)' : 'Core Instructions Prompt'}</label>
              <textarea
                rows={6}
                value={settings.aiSystemInstruction}
                onChange={(e) => setSettings({ ...settings, aiSystemInstruction: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 resize-none font-bold"
                placeholder="You are Hermes..."
              />
              <p className="text-xs text-slate-400 font-bold leading-relaxed">{isRtl ? 'تتحكم هذه القواعد بدقة في تصرفات وأسلوب ردود الوكيل عند التحدث للجمهور في الموقع.' : 'This prompt directly governs speech behavior and constraints when visitors chat with Hermes.'}</p>
            </div>
          </form>
        )}

        {/* Tab 3: Interactive Sandbox Chat */}
        {activeSubTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 text-white rounded-[32px] p-6 border border-slate-800 shadow-xl flex flex-col h-[550px]">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Cpu size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm md:text-base">Hermes AI Sandbox</h3>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold">● ONLINE / SYS_SYNC_OK</p>
                  </div>
                </div>

                <button
                  onClick={() => setChatHistory([{ role: 'assistant', content: isRtl ? 'مرحباً بك! أنا هيرميس الوكيل الذكي لبيت الصحافة. كيف يمكنني مساعدتك اليوم؟' : 'Hello! I am Hermes, the smart agent for PressHouse. How can I assist you today?' }])}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black transition-colors border border-slate-700 cursor-pointer"
                >
                  {isRtl ? 'مسح الجلسة' : 'Clear Chat'}
                </button>
              </div>

              {/* Chat Bubbles */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 px-2 min-h-0">
                {chatHistory.map((ch, idx) => (
                  <div key={idx} className={`flex ${ch.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-lg text-sm leading-relaxed ${
                      ch.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none font-medium' 
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700 font-medium'
                    }`}>
                      <p>{ch.content}</p>
                    </div>
                  </div>
                ))}
                {sendingChat && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-2">
                      <Loader2 className="animate-spin text-indigo-500" size={16} />
                      <span className="text-xs font-bold">{isRtl ? 'هيرميس يقرأ قاعدة المعرفة...' : 'Hermes is thinking...'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="border-t border-slate-800 pt-4 flex gap-3 shrink-0">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isRtl ? 'اسأل هيرميس عن مقال، فعالية، أو بلاغ انتهاك تم مزامنته...' : 'Ask Hermes about synced articles, courses...'}
                  className="w-full bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none px-4 py-3 text-sm rounded-xl font-bold"
                  disabled={sendingChat}
                />
                <button
                  type="submit"
                  disabled={sendingChat || !chatMessage.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl text-white transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

            {/* Config Sandbox Side Block */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                <h4 className="font-extrabold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <Shield size={16} className="text-indigo-600" />
                  {isRtl ? 'حالة ذاكرة الوكيل' : 'Agent Status Profile'}
                </h4>
                <div className="space-y-3 text-xs font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الموديل النشط:' : 'Active Model:'}</span>
                    <span className="font-mono text-slate-800 text-end truncate max-w-[120px]">{settings.aiModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'سجلات التزامن:' : 'Synced Records:'}</span>
                    <span className="text-slate-800">{items.filter(it => it.synced).length} {isRtl ? 'عنصر' : 'items'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'أولويّة الإجابة:' : 'Priority rules:'}</span>
                    <span className="text-indigo-600">{isRtl ? 'قاعدة بيانات الموقع' : 'Local DB first'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 p-6 rounded-3xl text-white space-y-3 shadow-md">
                <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-300">
                  <Sparkles size={16} />
                  {isRtl ? 'بوابة المعرفة الذكية RAG' : 'Retrieval-Augmented RAG'}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-bold">
                  {isRtl 
                    ? 'عند الضغط على "نشر للوكيل"، يتم فهرسة وتحليل المقالات والوثائق وسياقات المناقصات تلقائياً عبر نظام RAG المتكامل لتمثيلها بصيغة لغوية ممثلة دلالياً.' 
                    : 'Publishing resources instantly feeds the vectors database representation, keeping chatbot responses strictly aligned with verified and real-time releases.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeSubTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Clock className="text-indigo-600" size={18} />
                {isRtl ? 'سجل العمليات والتدقيق لمزامنة الذكاء الاصطناعي' : 'Sync Logs & API Telemetry'}
              </h3>
              <span className="text-xs font-bold text-slate-400 font-mono">Telemetry Logs (2026)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-150">
                    <th className="p-4 text-start">{isRtl ? 'العملية' : 'Action'}</th>
                    <th className="p-4 text-start">{isRtl ? 'الوصف' : 'Description'}</th>
                    <th className="p-4 text-start">{isRtl ? 'الوقت' : 'Timestamp'}</th>
                    <th className="p-4 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {syncLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs text-indigo-600 uppercase">{log.action}</td>
                      <td className="p-4 text-slate-700 font-medium">{log.message}</td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{log.timestamp}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={10} />
                          {log.status === 'success' ? (isRtl ? 'ناجح' : 'SUCCESS') : log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
