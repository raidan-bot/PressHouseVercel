import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Terminal, 
  Key, 
  Play, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Globe, 
  Code, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';

interface ApiToken {
  id: number;
  token: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function ApiExplorer() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState<'endpoints' | 'tokens' | 'docs'>('endpoints');
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [newTokenName, setNewTokenName] = useState('');
  const [creatingToken, setCreatingToken] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  
  // API Test sandbox state
  const [testingPath, setTestingPath] = useState('/api/articles');
  const [testMethod, setTestMethod] = useState('GET');
  const [testing, setTesting] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Client snippet state
  const [selectedSnippet, setSelectedSnippet] = useState<'javascript' | 'curl' | 'python'>('curl');

  const systemEndpoints = [
    { method: 'GET', path: '/api/articles', desc: isRtl ? 'قراءة جميع المقالات والأخبار الصحفية المنشورة' : 'Retrieve all published articles & press releases' },
    { method: 'GET', path: '/api/projects', desc: isRtl ? 'قراءة جميع المشاريع والمبادرات النشطة' : 'Retrieve all active projects & civil initiatives' },
    { method: 'GET', path: '/api/events', desc: isRtl ? 'قراءة الأنشطة والفعاليات والندوات القادمة' : 'Retrieve all events, workshops & seminars' },
    { method: 'GET', path: '/api/courses', desc: isRtl ? 'قراءة الدورات التدريبية المتاحة للتسجيل' : 'Retrieve vocational and journalist training courses' },
    { method: 'GET', path: '/api/observatory/violations', desc: isRtl ? 'قراءة تقارير وبلاغات مرصد الانتهاكات الموثقة' : 'Retrieve all documented media freedom violations' },
    { method: 'GET', path: '/api/settings', desc: isRtl ? 'قراءة إعدادات الهوية والبصرية العامة للموقع' : 'Retrieve general visual settings and metadata' },
  ];

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoadingTokens(true);
    try {
      const res = await api.get('/api/developer/tokens');
      setTokens(res.data || []);
    } catch (err) {
      console.error('Failed to fetch API tokens:', err);
    } finally {
      setLoadingTokens(false);
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;
    setCreatingToken(true);
    try {
      await api.post('/api/developer/tokens', { name: newTokenName });
      setNewTokenName('');
      fetchTokens();
    } catch (err) {
      console.error('Failed to create API token:', err);
      alert(isRtl ? 'فشل إنشاء توكن برمجية جديد' : 'Failed to create token');
    } finally {
      setCreatingToken(false);
    }
  };

  const handleDeleteToken = async (id: number) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من رغبتك في حذف مفتاح الـ API هذا؟' : 'Are you sure you want to delete this API Key?')) return;
    try {
      await api.delete(`/api/developer/tokens/${id}`);
      fetchTokens();
    } catch (err) {
      console.error('Failed to delete token:', err);
    }
  };

  const runApiTest = async () => {
    setTesting(true);
    setApiResponse(null);
    try {
      const res = await api({
        method: testMethod,
        url: testingPath
      });
      setApiResponse(res.data);
    } catch (err: any) {
      setApiResponse(err.response?.data || { error: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleCopyToken = (token: string, id: number) => {
    navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const codeSnippets = {
    curl: `curl -X ${testMethod} "${window.location.origin}${testingPath}" \\\n  -H "Authorization: Bearer YOUR_API_TOKEN" \\\n  -H "Content-Type: application/json"`,
    javascript: `fetch("${window.location.origin}${testingPath}", {\n  method: "${testMethod}",\n  headers: {\n    "Authorization": "Bearer YOUR_API_TOKEN",\n    "Content-Type": "application/json"\n  }\n})\n.then(response => response.json())\n.then(data => console.log(data));`,
    python: `import requests\n\nurl = "${window.location.origin}${testingPath}"\nheaders = {\n    "Authorization": "Bearer YOUR_API_TOKEN",\n    "Content-Type": "application/json"\n}\n\nresponse = requests.get(url, headers=headers)\nprint(response.json())`
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 text-start max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Terminal className="text-indigo-600 animate-pulse" size={28} />
            {isRtl ? 'مستودع المطورين وإدارة واجهات الـ API' : 'Developer Hub & API Explorer'}
          </h2>
          <p className="text-sm text-slate-500 font-bold mt-1">
            {isRtl 
              ? 'قم ببناء مفاتيح اتصال برمجية، وتجربة قراءة وإرسال المحتوى، والتحقق من الاستجابات الفورية.' 
              : 'Generate secure API authorization tokens, test endpoints and inspect formatted response JSON.'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'endpoints' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {isRtl ? 'مستكشف واجهات العمل' : 'API Playground'}
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'tokens' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {isRtl ? 'مفاتيح الـ API المؤمنة' : 'API Authorization Keys'}
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'docs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {isRtl ? 'دليل الربط الخارجي' : 'Integration SDKs'}
          </button>
        </div>
      </div>

      {/* Tab content area */}
      <div className="min-h-[400px]">

        {/* Tab 1: API Playground */}
        {activeTab === 'endpoints' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: endpoints list */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-2">{isRtl ? 'قائمة واجهات الخدمة المتوفرة' : 'System Public Endpoints'}</h3>
              
              <div className="space-y-3">
                {systemEndpoints.map((ep) => (
                  <button
                    key={ep.path}
                    onClick={() => {
                      setTestingPath(ep.path);
                      setTestMethod(ep.method);
                    }}
                    className={`w-full p-4 rounded-2xl border text-start transition-all cursor-pointer block ${testingPath === ep.path ? 'bg-indigo-50/50 border-indigo-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-350'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs text-indigo-600 font-bold truncate">
                        {ep.path}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold line-clamp-1">{ep.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: console and executor */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                <h3 className="font-black text-slate-800 text-sm">{isRtl ? 'منفذ الطلبات التفاعلي' : 'Interactive API Request Executor'}</h3>
                
                <div className="flex gap-2">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value)}
                    className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-black outline-none border border-slate-200"
                  >
                    <option value="GET">GET</option>
                  </select>

                  <input
                    type="text"
                    value={testingPath}
                    onChange={(e) => setTestingPath(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold outline-none"
                    placeholder="/api/..."
                  />

                  <button
                    onClick={runApiTest}
                    disabled={testing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {testing ? <Loader2 className="animate-spin" size={12} /> : <Play size={12} />}
                    {isRtl ? 'إرسال' : 'Send'}
                  </button>
                </div>

                {/* Headers Info */}
                <div className="text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-150 font-mono text-slate-500 space-y-1">
                  <p className="font-black uppercase text-[8px] text-slate-400">{isRtl ? 'الهيدرز الافتراضية' : 'Request Headers'}</p>
                  <p>Content-Type: application/json</p>
                  <p>Authorization: Bearer <span className="text-slate-400">&lt;YOUR_API_TOKEN&gt;</span></p>
                </div>
              </div>

              {/* Response Code Block */}
              <div className="bg-slate-950 text-white p-6 rounded-[32px] border border-slate-800 shadow-xl space-y-3 font-mono text-xs overflow-hidden flex flex-col h-[380px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Response Terminal</span>
                  </div>
                  {apiResponse && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      200 OK
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-auto scrollbar-thin">
                  {testing ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                      <Loader2 size={24} className="animate-spin text-indigo-400" />
                      <span className="text-[11px] font-bold">SYS_API_FETCHING...</span>
                    </div>
                  ) : apiResponse ? (
                    <pre className="text-[11px] leading-relaxed text-slate-300">{JSON.stringify(apiResponse, null, 2)}</pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                      <Terminal size={32} className="opacity-30 mb-2" />
                      <span className="text-[11px] font-bold">{isRtl ? 'انقر على "إرسال" لتنفيذ الطلب الفعلي' : 'Execute a request to see JSON outcomes'}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Token Management */}
        {activeTab === 'tokens' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Generator Form */}
            <form onSubmit={handleCreateToken} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 space-y-2 text-start w-full">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">{isRtl ? 'اسم مفتاح الـ API الجديد (مثال: Mobile Client)' : 'New API Token Name (e.g. Flutter Client)'}</label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-xl font-bold text-sm outline-none"
                  placeholder={isRtl ? 'مثال: تطبيق الجوال أو وكيل خارجي' : 'e.g. Web portal client'}
                  disabled={creatingToken}
                />
              </div>

              <button
                type="submit"
                disabled={creatingToken || !newTokenName.trim()}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
              >
                {creatingToken ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isRtl ? 'توليد مفتاح جديد' : 'Generate Token Key'}
              </button>
            </form>

            {/* Tokens table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Lock size={16} className="text-indigo-600" />
                  {isRtl ? 'المفاتيح النشطة المصرح لها' : 'Authorized Access Keys'}
                </h3>
                <span className="text-xs font-bold text-slate-400 font-mono">Live Session Keys</span>
              </div>

              {loadingTokens ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-indigo-600" size={24} />
                  <span className="text-xs font-bold">{isRtl ? 'جاري قراءة الرموز المعتمدة...' : 'Loading secure credentials...'}</span>
                </div>
              ) : tokens.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <AlertCircle className="mx-auto text-slate-300" size={32} />
                  <p className="font-extrabold text-slate-600 text-sm">{isRtl ? 'لا يوجد أي مفتاح API نشط حالياً' : 'No active API keys found'}</p>
                  <p className="text-xs text-slate-400">{isRtl ? 'قم بتوليد مفتاح في الأعلى لبدء الربط التلقائي الخارجي' : 'Generate a client key above to begin authentication integrations'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-150">
                        <th className="p-4 text-start">{isRtl ? 'الاسم المصنف' : 'Name / Client'}</th>
                        <th className="p-4 text-start">{isRtl ? 'رمز المفتاح (Secret)' : 'Secret Token'}</th>
                        <th className="p-4 text-start">{isRtl ? 'الصلاحية' : 'Scope'}</th>
                        <th className="p-4 text-start">{isRtl ? 'تاريخ التوليد' : 'Created At'}</th>
                        <th className="p-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {tokens.map((tok) => (
                        <tr key={tok.id} className="hover:bg-slate-50">
                          <td className="p-4 text-slate-900 font-extrabold">{tok.name}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 max-w-xs">
                              <span className="font-mono text-xs truncate max-w-[140px] text-slate-600">{tok.token}</span>
                              <button
                                onClick={() => handleCopyToken(tok.token, tok.id)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                              >
                                {copiedTokenId === tok.id ? <Check className="text-emerald-500" size={12} /> : <Copy size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                              <ShieldCheck size={10} />
                              {tok.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 text-xs font-mono">{new Date(tok.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteToken(tok.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title={isRtl ? 'إلغاء تنشيط المفتاح' : 'Revoke Key'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Integration SDKs & Code templates */}
        {activeTab === 'docs' && (
          <div className="max-w-4xl mx-auto space-y-6 text-start">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <Code className="text-indigo-600" size={18} />
                {isRtl ? 'أدلة التثبيت والنماذج البرمجية للشركاء' : 'Partner & Client SDK Snippets'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-bold">
                {isRtl 
                  ? 'اختر لغة البرمجة التي تفضلها للربط وسحب البيانات من الموقع مباشرة. تأكد من إدراج مفتاح الـ API المفعل في هيدر الطلب كـ Bearer Token.' 
                  : 'Select your preferred technology context. Ensure you replace YOUR_API_TOKEN with a secure key from the Credentials tab.'}
              </p>

              <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                {['curl', 'javascript', 'python'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedSnippet(lang as any)}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all capitalize cursor-pointer ${selectedSnippet === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="relative">
                <pre className="p-5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-850">
                  {codeSnippets[selectedSnippet]}
                </pre>
                
                <button
                  onClick={() => handleCopyCode(codeSnippets[selectedSnippet])}
                  className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-[10px] font-bold"
                >
                  {copiedCode ? <Check className="text-emerald-400" size={12} /> : <Copy size={12} />}
                  {copiedCode ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الكود' : 'Copy')}
                </button>
              </div>
            </div>

            {/* Quick response standards block */}
            <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-md flex items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm">{isRtl ? 'تريد ربط كلي شامل للبيانات والأنشطة؟' : 'Need comprehensive enterprise-level Sync?'}</h4>
                <p className="text-xs text-indigo-200 leading-relaxed font-bold">{isRtl ? 'جميع نهايات واجهات الـ API تتبع بروتوكول RESTful القياسي وترجع البيانات بصيغة JSON UTF-8.' : 'All endpoints are formatted strictly in standard UTF-8 JSON, matching headless standard conventions.'}</p>
              </div>
              <ArrowRight className="shrink-0 text-indigo-300" size={20} />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
