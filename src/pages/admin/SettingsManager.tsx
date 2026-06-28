import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, Save, Palette, Type, Globe, 
  Image as ImageIcon, Mail, Phone, MapPin,
  Facebook, Twitter, Instagram, Youtube,
  Loader2, CheckCircle2, RefreshCw, Shield, Key, Terminal, Upload,
  Plus, Trash2, Cloud
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { MediaLibraryModal } from '../../components/media/MediaLibraryModal';
import { api } from '../../services/api';
import PartnerManager from './PartnerManager';
import InstitutionIdentityManager from './InstitutionIdentityManager';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: { ar: '', en: '' },
  logo: '',
  favicon: '',
  primaryColor: '#2563eb',
  secondaryColor: '#e11d48',
  fontFamily: 'Inter',
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/presshoue' },
    { platform: 'twitter', url: 'https://twitter.com/presshoue' },
    { platform: 'instagram', url: 'https://instagram.com/presshoue' },
    { platform: 'youtube', url: 'https://youtube.com/@presshoue' }
  ],
  contactEmail: '',
  contactPhone: '',
  address: { ar: '', en: '' },
  seoTitle: { ar: '', en: '' },
  seoDescription: { ar: '', en: '' },
  seoKeywords: { ar: '', en: '' },
  ogDefaultImage: '',
  ogSiteName: '',
  ogType: 'website',
  googleVerification: '',
  bingVerification: '',
  aiEnabled: true,
  aiModel: 'nvidia/qwen-2.5-coder-32b-instruct',
  aiBaseUrl: 'https://integrate.api.nvidia.com/v1',
  aiApiKey: '',
  aiTemperature: 0.3,
  aiMaxTokens: 1524,
  aiSystemInstruction: '',
  s3Provider: 'aws',
  s3AccessKeyId: '',
  s3SecretAccessKey: '',
  s3Region: 'us-east-1',
  s3Bucket: '',
  s3Endpoint: '',
  s3Enabled: false,
  fbAppId: '',
  fbAppSecret: '',
  fbCharityId: '',
  fbAccessToken: '',
  fbWebhookVerifyToken: '',
  fbSandboxMode: true
};

export default function SettingsManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'contact' | 'social' | 'seo' | 'slider' | 'ai' | 's3' | 'partners' | 'about' | 'facebook' | 'broadcast'>('general');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<'logo' | 'favicon' | null>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestAiConnection = async () => {
    if (!settings.aiBaseUrl || !settings.aiApiKey || !settings.aiModel) {
      alert(isRtl ? 'الرجاء إدخال رابط الـ API، ومفتاح الـ API، واسم الموديل أولاً.' : 'Please enter the Base URL, API Key, and Model name first.');
      return;
    }
    setTestingAi(true);
    setAiTestResult(null);
    try {
      const response = await api.post('/api/ai/test-connection', {
        aiBaseUrl: settings.aiBaseUrl,
        aiApiKey: settings.aiApiKey,
        aiModel: settings.aiModel,
      });
      if (response.data?.success) {
        setAiTestResult({ success: true, message: response.data.message });
      } else {
        setAiTestResult({ success: false, message: response.data?.error || 'Unknown error' });
      }
    } catch (error: any) {
      console.error("AI connection test failed:", error);
      const errMsg = error.response?.data?.error || error.message || 'Connection failed';
      setAiTestResult({ success: false, message: errMsg });
    } finally {
      setTestingAi(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        if (response.data && Object.keys(response.data).length > 0) {
          const s = response.data;
          setSettings({
            ...DEFAULT_SETTINGS,
            ...s,
            siteName: typeof s.siteName === 'string' ? JSON.parse(s.siteName) : s.siteName,
            socialLinks: typeof s.socialLinks === 'string' ? JSON.parse(s.socialLinks) : s.socialLinks,
            address: typeof s.address === 'string' ? JSON.parse(s.address) : s.address,
            seoTitle: typeof s.seoTitle === 'string' ? JSON.parse(s.seoTitle) : (s.seoTitle || DEFAULT_SETTINGS.seoTitle),
            seoDescription: typeof s.seoDescription === 'string' ? JSON.parse(s.seoDescription) : (s.seoDescription || DEFAULT_SETTINGS.seoDescription),
            seoKeywords: typeof s.seoKeywords === 'string' ? JSON.parse(s.seoKeywords) : (s.seoKeywords || DEFAULT_SETTINGS.seoKeywords),
            s3Enabled: s.s3Enabled === 1 || s.s3Enabled === true,
            aiEnabled: s.aiEnabled === 1 || s.aiEnabled === true,
            fbSandboxMode: s.fbSandboxMode === 1 || s.fbSandboxMode === true,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/settings', {
        ...settings,
        id: undefined, // Let the backend handle the ID or insert if not exists
      });
      alert(isRtl ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(isRtl ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'إعدادات الموقع' : 'Site Settings'}</h1>
          <p className="text-slate-500 text-sm mt-1">{isRtl ? 'تخصيص الهوية، المظهر، ومعلومات الاتصال' : 'Customize identity, appearance, and contact info'}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 space-y-1">
          {[
            { id: 'general', label: isRtl ? 'عام' : 'General', icon: <Settings size={18} /> },
            { id: 'appearance', label: isRtl ? 'المظهر' : 'Appearance', icon: <Palette size={18} /> },
            { id: 'contact', label: isRtl ? 'الاتصال' : 'Contact', icon: <Mail size={18} /> },
            { id: 'social', label: isRtl ? 'التواصل الاجتماعي' : 'Social Media', icon: <Globe size={18} /> },
            { id: 'seo', label: isRtl ? 'محركات البحث SEO' : 'SEO Settings', icon: <Shield size={18} /> },
            { id: 'slider', label: isRtl ? 'إعدادات السلايدر' : 'Slider Settings', icon: <RefreshCw size={18} /> },
            { id: 'partners', label: isRtl ? 'شركاء النجاح' : 'Partners', icon: <Globe size={18} /> },
            { id: 'about', label: isRtl ? 'عن المؤسسة' : 'About Us', icon: <Globe size={18} /> },
            { id: 'ai', label: isRtl ? 'المساعد الذكي (Hermes)' : 'Hermes AI Assistant', icon: <Terminal size={18} /> },
            { id: 's3', label: isRtl ? 'مخزن الـ S3' : 'S3 Cloud Storage', icon: <Cloud size={18} /> },
            { id: 'facebook', label: isRtl ? 'بوابة التبرعات وفيسبوك' : 'Facebook & Charities', icon: <Facebook size={18} /> },
            { id: 'broadcast', label: isRtl ? 'البث المباشر واليوتيوب' : 'Livestream & YouTube', icon: <Youtube size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <MediaLibraryModal 
            isOpen={isMediaModalOpen}
            onClose={() => setIsMediaModalOpen(false)}
            onSelect={(url) => {
              if (activeMediaField === 'logo') setSettings({ ...settings, logo: url });
              if (activeMediaField === 'favicon') setSettings({ ...settings, favicon: url });
              setIsMediaModalOpen(false);
            }}
          />
          {activeTab === 'general' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="text-blue-600" size={24} />
                {isRtl ? 'الإعدادات العامة' : 'General Settings'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'اسم الموقع (بالعربية)' : 'Site Name (Arabic)'}</label>
                  <input 
                    type="text"
                    value={settings.siteName.ar}
                    onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, ar: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'اسم الموقع (بالإنجليزية)' : 'Site Name (English)'}</label>
                  <input 
                    type="text"
                    value={settings.siteName.en}
                    onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, en: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الشعار (Logo)' : 'Logo'}</label>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      value={settings.logo}
                      onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => {
                        setActiveMediaField('logo');
                        setIsMediaModalOpen(true);
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <Upload size={20} />
                      {isRtl ? 'اختر صورة' : 'Select Image'}
                    </button>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.logo ? <img src={settings.logo} alt="" className="w-full h-full object-contain" /> : <ImageIcon size={20} className="text-slate-300" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الأيقونة (Favicon)' : 'Favicon'}</label>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      value={settings.favicon}
                      onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => {
                        setActiveMediaField('favicon');
                        setIsMediaModalOpen(true);
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <Upload size={20} />
                      {isRtl ? 'اختر صورة' : 'Select Image'}
                    </button>
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {settings.favicon ? <img src={settings.favicon} alt="" className="w-full h-full object-contain" /> : <ImageIcon size={20} className="text-slate-300" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Palette className="text-blue-600" size={24} />
                {isRtl ? 'المظهر والألوان' : 'Appearance & Colors'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'اللون الأساسي' : 'Primary Color'}</label>
                  <div className="flex gap-4">
                    <input 
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 p-0 cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'اللون الثانوي' : 'Secondary Color'}</label>
                  <div className="flex gap-4">
                    <input 
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl border-0 p-0 cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الخط الأساسي' : 'Font Family'}</label>
                  <select 
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  >
                    <option value="Inter">Inter (Modern Sans)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech)</option>
                    <option value="Playfair Display">Playfair Display (Editorial)</option>
                    <option value="Cairo">Cairo (Arabic Optimized)</option>
                    <option value="Tajawal">Tajawal (Elegant Arabic)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Mail className="text-blue-600" size={24} />
                {isRtl ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'البريد الإلكتروني' : 'Contact Email'}</label>
                  <input 
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رقم الهاتف' : 'Contact Phone'}</label>
                  <input 
                    type="text"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'العنوان (بالعربية)' : 'Address (Arabic)'}</label>
                  <input 
                    type="text"
                    value={settings.address.ar}
                    onChange={(e) => setSettings({ ...settings, address: { ...settings.address, ar: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'العنوان (بالإنجليزية)' : 'Address (English)'}</label>
                  <input 
                    type="text"
                    value={settings.address.en}
                    onChange={(e) => setSettings({ ...settings, address: { ...settings.address, en: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Globe className="text-blue-600" size={24} />
                {isRtl ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <h4 className="font-bold text-slate-900">{isRtl ? 'إعدادات يوتيوب' : 'YouTube Settings'}</h4>
                  <div className="space-y-4">
                    <input 
                      type="text"
                      placeholder={isRtl ? 'معرف القناة (Channel ID)' : 'Channel ID'}
                      value={settings.youtubeChannelId || ''}
                      onChange={(e) => setSettings({ ...settings, youtubeChannelId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                      type="text"
                      placeholder={isRtl ? 'رابط قائمة التشغيل' : 'Playlist URL'}
                      value={settings.youtubePlaylistUrl || ''}
                      onChange={(e) => setSettings({ ...settings, youtubePlaylistUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                {settings.socialLinks.map((link, index) => (
                  <div key={link.platform} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                      {link.platform === 'facebook' && <Facebook size={20} />}
                      {link.platform === 'twitter' && <Twitter size={20} />}
                      {link.platform === 'instagram' && <Instagram size={20} />}
                      {link.platform === 'youtube' && <Youtube size={20} />}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text"
                        placeholder={`https://${link.platform}.com/your-profile`}
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...settings.socialLinks];
                          newLinks[index].url = e.target.value;
                          setSettings({ ...settings, socialLinks: newLinks });
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'seo' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="text-blue-600" size={24} />
                {isRtl ? 'إعدادات محركات البحث و Metadata' : 'SEO & Metadata Settings'}
              </h3>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'عنوان الصفحة SEO (بالعربية)' : 'SEO Title (Arabic)'}</label>
                    <input 
                      type="text"
                      value={settings.seoTitle?.ar || ''}
                      onChange={(e) => setSettings({ ...settings, seoTitle: { ...settings.seoTitle!, ar: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'عنوان الصفحة SEO (بالإنجليزية)' : 'SEO Title (English)'}</label>
                    <input 
                      type="text"
                      value={settings.seoTitle?.en || ''}
                      onChange={(e) => setSettings({ ...settings, seoTitle: { ...settings.seoTitle!, en: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'وصف الميتا (بالعربية)' : 'Meta Description (Arabic)'}</label>
                    <textarea 
                      rows={3}
                      value={settings.seoDescription?.ar || ''}
                      onChange={(e) => setSettings({ ...settings, seoDescription: { ...settings.seoDescription!, ar: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'وصف الميتا (بالإنجليزية)' : 'Meta Description (English)'}</label>
                    <textarea 
                      rows={3}
                      value={settings.seoDescription?.en || ''}
                      onChange={(e) => setSettings({ ...settings, seoDescription: { ...settings.seoDescription!, en: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الكلمات المفتاحية (بالعربية)' : 'Keywords (Arabic)'}</label>
                    <input 
                      type="text"
                      value={settings.seoKeywords?.ar || ''}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: { ...settings.seoKeywords!, ar: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="كلمة1, كلمة2..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الكلمات المفتاحية (بالإنجليزية)' : 'Keywords (English)'}</label>
                    <input 
                      type="text"
                      value={settings.seoKeywords?.en || ''}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: { ...settings.seoKeywords!, en: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="keyword1, keyword2..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 border-b pb-2">{isRtl ? 'روابط التواصل الاجتماعي (OpenGraph)' : 'Social SEO (OpenGraph)'}</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{isRtl ? 'صورة المشاركة الافتراضية' : 'Default Sharing Image'}</label>
                        <input 
                          type="text"
                          value={settings.ogDefaultImage || ''}
                          onChange={(e) => setSettings({ ...settings, ogDefaultImage: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{isRtl ? 'اسم الموقع في OG' : 'OG Site Name'}</label>
                        <input 
                          type="text"
                          value={settings.ogSiteName || ''}
                          onChange={(e) => setSettings({ ...settings, ogSiteName: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{isRtl ? 'نوع الموقع' : 'Site Type'}</label>
                        <select 
                          value={settings.ogType || 'website'}
                          onChange={(e) => setSettings({ ...settings, ogType: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
                        >
                          <option value="website">Website</option>
                          <option value="article">Article</option>
                          <option value="organization">Organization</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 border-b pb-2">{isRtl ? 'أدوات التحقق' : 'Verification Tools'}</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{isRtl ? 'كود التحقق من Google' : 'Google Site Verification'}</label>
                        <input 
                          type="text"
                          value={settings.googleVerification || ''}
                          onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                          placeholder="google-site-verification=..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{isRtl ? 'كود التحقق من Bing' : 'Bing Site Verification'}</label>
                        <input 
                          type="text"
                          value={settings.bingVerification || ''}
                          onChange={(e) => setSettings({ ...settings, bingVerification: e.target.value })}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                          placeholder="msvalidate.01=..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="text-blue-600" size={24} />
                  {isRtl ? 'إعدادات المساعد الذكي (Hermes)' : 'Hermes AI Assistant Settings'}
                </h3>
                <div className="flex items-center gap-2">
                   <label className="text-sm font-bold text-slate-600">{isRtl ? 'تفعيل الذكاء الاصطناعي' : 'Enable AI'}</label>
                   <button 
                    type="button"
                    onClick={() => setSettings({ ...settings, aiEnabled: !settings.aiEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.aiEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.aiEnabled ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'الموديل المفضل' : 'AI Model'}</label>
                  <input 
                    type="text"
                    value={settings.aiModel || ''}
                    onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="nvidia/qwen-2.5-coder-32b-instruct"
                  />
                  <p className="text-xs text-slate-400">
                    {isRtl ? 'اسم الموديل من NVIDIA API أو أي مزود متوافق مع OpenAI API.' : 'Model identifier from NVIDIA API or any OpenAI-compatible provider.'}
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رابط الـ API الأساسي' : 'API Base URL'}</label>
                  <input 
                    type="text"
                    value={settings.aiBaseUrl || ''}
                    onChange={(e) => setSettings({ ...settings, aiBaseUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="https://integrate.api.nvidia.com/v1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{isRtl ? 'مفتاح الـ API (Secret Token)' : 'API Key'}</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={settings.aiApiKey || ''}
                    onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm pr-12"
                    placeholder="nvapi-..."
                  />
                  <Key className="absolute right-4 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'درجة الحرارة (Temperature)' : 'Temperature'}</label>
                  <input 
                    type="number"
                    step={0.1}
                    min={0}
                    max={1}
                    value={settings.aiTemperature || 0.3}
                    onChange={(e) => setSettings({ ...settings, aiTemperature: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'أقصى عدد للتوكنات' : 'Max Tokens'}</label>
                  <input 
                    type="number"
                    step={100}
                    value={settings.aiMaxTokens || 1524}
                    onChange={(e) => setSettings({ ...settings, aiMaxTokens: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{isRtl ? 'تعليمات النظام المخصصة (System Instruction)' : 'Custom System Instruction'}</label>
                <textarea 
                  rows={4}
                  value={settings.aiSystemInstruction || ''}
                  onChange={(e) => setSettings({ ...settings, aiSystemInstruction: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder={isRtl ? 'أنت مساعد ذكي متخصص في...' : 'You are an AI assistant specializing in...'}
                />
                <p className="text-xs text-slate-400">
                  {isRtl ? 'هذه التعليمات ستضاف إلى التعليمات الأساسية المدمجة في النظام.' : 'These instructions will be appended to the core system instructions.'}
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex gap-4">
                  <Terminal className="text-blue-600 shrink-0" size={24} />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900">{isRtl ? 'ملاحظة للمطورين' : 'Developer Note'}</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {isRtl 
                        ? 'يستخدم الموقع بوابة Hermes AI بشكل أساسي لتوليد الردود وترجمة المحتوى وتنسيق المنشورات. يمكنك تغيير الموديل والرابط ليشمل أي مزود يدعم بروتوكول OpenAI.' 
                        : 'The site uses Hermes AI Gateway primarily for generating responses, translating content, and formatting posts. You can change the model and URL to any provider supporting the OpenAI protocol.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestAiConnection}
                  disabled={testingAi}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md self-start disabled:opacity-50"
                >
                  {testingAi ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                  {isRtl ? 'اختبار اتصال بوابة الذكاء الاصطناعي' : 'Test AI Gateway Connection'}
                </button>

                {aiTestResult && (
                  <div className={`p-5 rounded-2xl border text-sm flex gap-3 items-start transition-all ${aiTestResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    <CheckCircle2 className={`shrink-0 mt-0.5 ${aiTestResult.success ? 'text-emerald-600' : 'text-rose-600'}`} size={18} />
                    <div>
                      <p className="font-bold">{aiTestResult.success ? (isRtl ? 'تم الاتصال بنجاح!' : 'Connected successfully!') : (isRtl ? 'خطأ في الاتصال!' : 'Connection error!')}</p>
                      <p className="mt-1 font-mono text-xs leading-relaxed">{aiTestResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'slider' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="text-blue-600" size={24} />
                {isRtl ? 'إعدادات السلايدر الرئيسي' : 'Hero Slider Configuration'}
              </h3>
              
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-8 max-w-2xl">
                <p className="text-sm text-amber-800 font-bold mb-1">{isRtl ? 'إعدادات الحركة التلقائية' : 'Autoplay Configuration'}</p>
                <p className="text-xs text-amber-600 leading-relaxed">
                  {isRtl ? 'تحكم في سرعة تبديل الشرائح والوقت المستغرق للحركة الانتقالية بين كل شريحة وأخرى.' : 'Control slide switching speed and transition duration between slides.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    {isRtl ? 'وقت بقاء الشريحة (بالملي ثانية)' : 'Slide Autoplay Delay (ms)'}
                  </label>
                  <input 
                    type="number"
                    step={500}
                    min={1000}
                    value={settings.sliderAutoplayDelay || 8000}
                    onChange={(e) => setSettings({ ...settings, sliderAutoplayDelay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                  <p className="text-xs text-slate-400">{isRtl ? 'مثال: 8000 تعني 8 ثواني' : 'Example: 8000 means 8 seconds'}</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    {isRtl ? 'سرعة الانتقال (بالملي ثانية)' : 'Transition Speed (ms)'}
                  </label>
                  <input 
                    type="number"
                    step={100}
                    min={100}
                    value={settings.sliderTransitionSpeed || 1000}
                    onChange={(e) => setSettings({ ...settings, sliderTransitionSpeed: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                  <p className="text-xs text-slate-400">{isRtl ? 'وقت حركة التلاشي أو الانزلاق' : 'Duration of fade or slide animation'}</p>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'partners' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <PartnerManager />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <InstitutionIdentityManager />
            </div>
          )}

          {activeTab === 's3' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Cloud className="text-blue-600" size={24} />
                  {isRtl ? 'إعدادات التخزين السحابي S3' : 'S3 Cloud Storage Settings'}
                </h3>
                <div className="flex items-center gap-2">
                   <label className="text-sm font-bold text-slate-600">{isRtl ? 'تفعيل التخزين السحابي' : 'Enable S3 Storage'}</label>
                   <button 
                    type="button"
                    onClick={() => setSettings({ ...settings, s3Enabled: !settings.s3Enabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.s3Enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.s3Enabled ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-sm text-slate-700 font-medium">
                  {isRtl 
                    ? 'يسمح لك نظام التخزين السحابي S3 برفع وحفظ الملفات والوسائط والمستندات على خوادم سحابية خارجية متوافقة مع بروتوكول S3 لزيادة سرعة التصفح وتوفير مساحة السيرفر المحلي.' 
                    : 'The S3 Cloud Storage system allows you to upload and store files, media, and documents on external cloud servers compatible with S3 protocol to optimize speed and save local disk space.'}
                </p>
                <p className="text-xs text-slate-400">
                  {isRtl 
                    ? 'يدعم النظام Amazon S3، و Cloudflare R2، و DigitalOcean Spaces، و Backblaze B2، و MinIO ذاتية الاستضافة.' 
                    : 'The system supports Amazon S3, Cloudflare R2, DigitalOcean Spaces, Backblaze B2, and self-hosted MinIO.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Provider */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'مزود الخدمة (S3 Provider)' : 'Storage Provider'}</label>
                  <select 
                    value={settings.s3Provider || 'aws'}
                    onChange={(e) => setSettings({ ...settings, s3Provider: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-white"
                  >
                    <option value="aws">Amazon Web Services (S3)</option>
                    <option value="cloudflare">Cloudflare R2</option>
                    <option value="digitalocean">DigitalOcean Spaces</option>
                    <option value="backblaze">Backblaze B2</option>
                    <option value="minio">MinIO (Self-hosted)</option>
                  </select>
                </div>

                {/* Bucket */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'اسم الحاوية (Bucket Name)' : 'Bucket Name'}</label>
                  <input 
                    type="text"
                    value={settings.s3Bucket || ''}
                    onChange={(e) => setSettings({ ...settings, s3Bucket: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="presshouse-media-vault"
                  />
                </div>

                {/* Access Key */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'مفتاح الوصول (Access Key ID)' : 'Access Key ID'}</label>
                  <input 
                    type="text"
                    value={settings.s3AccessKeyId || ''}
                    onChange={(e) => setSettings({ ...settings, s3AccessKeyId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                  />
                </div>

                {/* Secret Key */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'المفتاح السري (Secret Access Key)' : 'Secret Access Key'}</label>
                  <input 
                    type="password"
                    value={settings.s3SecretAccessKey || ''}
                    onChange={(e) => setSettings({ ...settings, s3SecretAccessKey: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  />
                </div>

                {/* Region */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'المنطقة الجغرافية (Region)' : 'Region'}</label>
                  <input 
                    type="text"
                    value={settings.s3Region || ''}
                    onChange={(e) => setSettings({ ...settings, s3Region: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="us-east-1"
                  />
                </div>

                {/* Endpoint (Optional / S3 Compatible) */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    {isRtl ? 'رابط خادم مخصص (Endpoint) - اختياري' : 'Endpoint URL (Optional for S3 Compatible)'}
                  </label>
                  <input 
                    type="text"
                    value={settings.s3Endpoint || ''}
                    onChange={(e) => setSettings({ ...settings, s3Endpoint: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="https://<account-id>.r2.cloudflarestorage.com"
                  />
                  <p className="text-xs text-slate-400">
                    {isRtl 
                      ? 'مطلوب للمزودين مثل Cloudflare R2 و DigitalOcean Spaces.' 
                      : 'Required for non-AWS providers like Cloudflare R2 and DigitalOcean Spaces.'}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex gap-4">
                <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-900">{isRtl ? 'جاهز للتكامل' : 'Ready for Integration'}</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {isRtl 
                      ? 'بمجرد تفعيل السحابة وحفظ الإعدادات، سيقوم الموقع تلقائياً برفع كافة الملفات والصور والوسائط الجديدة بشكل مباشر إلى المخزن السحابي المختار دون الحاجة لأي إعدادات إضافية.' 
                      : 'Once S3 is enabled and settings are saved, the platform will automatically route and upload all future files, media, and images directly to your configured cloud storage bucket without needing any manual code alterations.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'facebook' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Facebook className="text-blue-600" size={24} />
                  {isRtl ? 'إعدادات تكامل فيسبوك وبوابات التبرعات' : 'Facebook & Charity Integration'}
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold text-slate-600">{isRtl ? 'بيئة الاختبار (Sandbox)' : 'Sandbox Mode'}</label>
                  <button 
                    type="button"
                    onClick={() => setSettings({ ...settings, fbSandboxMode: !settings.fbSandboxMode })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.fbSandboxMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.fbSandboxMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-sm text-slate-700 font-medium">
                  {isRtl 
                    ? 'يرتبط هذا القسم بتكامل حملات تبرعات فيسبوك (Facebook Giving / Fundraisers) لدعم قضايا الصحفيين وحقوق الإنسان في اليمن.' 
                    : 'This section configures integration with Facebook Giving and Fundraisers API to support journalism advocacy and human rights projects.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'معرف تطبيق فيسبوك (App ID)' : 'Facebook App ID'}</label>
                  <input 
                    type="text"
                    value={settings.fbAppId || ''}
                    onChange={(e) => setSettings({ ...settings, fbAppId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="123456789012345"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رمز التطبيق السري (App Secret)' : 'Facebook App Secret'}</label>
                  <input 
                    type="password"
                    value={settings.fbAppSecret || ''}
                    onChange={(e) => setSettings({ ...settings, fbAppSecret: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="••••••••••••••••••••••••••••••••"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'معرف المؤسسة الخيرية في فيسبوك' : 'Facebook Charity ID'}</label>
                  <input 
                    type="text"
                    value={settings.fbCharityId || ''}
                    onChange={(e) => setSettings({ ...settings, fbCharityId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="987654321012"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رمز التحقق للويب هوك (Webhook Token)' : 'Webhook Verify Token'}</label>
                  <input 
                    type="text"
                    value={settings.fbWebhookVerifyToken || ''}
                    onChange={(e) => setSettings({ ...settings, fbWebhookVerifyToken: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="ph_webhook_verify_secure_2026"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رمز الوصول الطويل (Page Access Token)' : 'Page Access Token'}</label>
                <textarea 
                  rows={2}
                  value={settings.fbAccessToken || ''}
                  onChange={(e) => setSettings({ ...settings, fbAccessToken: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="EAACW..."
                />
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Youtube className="text-rose-600" size={24} />
                {isRtl ? 'البث المباشر وقنوات التلفزة الرقمية' : 'Livestream & Broadcast Settings'}
              </h3>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-sm text-slate-700 font-medium">
                  {isRtl 
                    ? 'اضبط روابط البث المباشر للمؤتمرات الصحفية، والندوات، وورش عمل أكاديمية الإعلام.' 
                    : 'Manage active stream sources for press conferences, seminars, and academy workshops.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'معرف قناة اليوتيوب (Channel ID)' : 'YouTube Channel ID'}</label>
                  <input 
                    type="text"
                    value={settings.youtubeChannelId || ''}
                    onChange={(e) => setSettings({ ...settings, youtubeChannelId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="UC..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">{isRtl ? 'رابط قائمة تشغيل الفعاليات' : 'YouTube Playlist ID'}</label>
                  <input 
                    type="text"
                    value={settings.youtubePlaylistUrl || ''}
                    onChange={(e) => setSettings({ ...settings, youtubePlaylistUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="PL..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
