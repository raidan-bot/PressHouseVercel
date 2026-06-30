import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, ShieldAlert, CheckCircle, Search, Calendar, Loader2, FileCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Card, Button, Badge } from '../components/ui';
import { api } from '../services/api';

export default function VerifyCertificate() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [certIdQuery, setCertIdQuery] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(!!id);
  const [certificate, setCertificate] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const lookupCertificate = async (certificateId: string) => {
    if (!certificateId.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setCertificate(null);
    setSearchTriggered(true);

    try {
      const response = await api.get(`/api/academy/certificates/${certificateId.trim().toUpperCase()}`);
      setCertificate(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setErrorMsg(isRtl 
          ? 'عذراً، لم يتم العثور على شهادة بهذا الرقم المرجعي. يرجى التحقق وإعادة المحاولة.' 
          : 'Certificate with this reference ID could not be found. Please double check and try again.');
      } else {
        setErrorMsg(isRtl 
          ? 'حدث خطأ غير متوقع أثناء معالجة الطلب، يرجى المحاولة لاحقاً.' 
          : 'An unexpected connection error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      lookupCertificate(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCertificate(certIdQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <SEO 
        title={isRtl ? 'التحقق من الشهادات والاعتمادات | أكاديمية بيت الصحافة' : 'Verify Academy Credentials | Press House'} 
        description={isRtl ? 'بوابة التحقق الفوري والعلني من صحة ومستندات شهادات التدريب الصادرة عن أكاديمية بيت الصحافة.' : 'Instant public validation server for Press House training certificates.'}
      />
      
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Page title and design framework header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-2xl mx-auto">
            <Award size={36} className="stroke-[1.5]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isRtl ? 'منصة التحقق الرقمي من الشهادات' : 'Public Credentials Verification'}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {isRtl 
              ? 'أدخل الرقم المرجعي للشهادة للتحقق من صحتها وتاريخ إصدارها والتوقيع الرقمي للمستلم.' 
              : 'Enter the reference certificate ID below to verify legitimacy, recipient data, and issue stamp.'}
          </p>
        </div>

        {/* Searching box form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
          <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={certIdQuery}
                onChange={(e) => setCertIdQuery(e.target.value)}
                placeholder={isRtl ? 'مثال: CERT-AW9821LO' : 'e.g. CERT-AW9821LO'} 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs outline-none font-mono uppercase tracking-widest transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
            <Button 
              type="submit" 
              variant="secondary"
              size="md"
              className="shrink-0"
            >
              {isRtl ? 'تحقق الآن' : 'Validate'}
            </Button>
          </form>
        </div>

        {/* Loading display */}
        {loading && (
          <Card padding="lg" className="text-center border rounded-3xl">
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-xs font-bold text-slate-400">{isRtl ? 'جاري مطابقة القيد وفحص التوقيع الرقمي...' : 'Connecting lookup matrix and verifying digital stamp...'}</p>
            </div>
          </Card>
        )}

        {/* Results layout */}
        {!loading && searchTriggered && (
          <div className="space-y-6">
            
            {certificate ? (
              <Card variant="bordered" padding="lg" className="border-2 border-emerald-500 rounded-[32px] shadow-xl space-y-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                {/* Secure Badge stamp */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="text-emerald-500 shrink-0" size={32} />
                    <div>
                      <Badge variant="success" size="sm" className="uppercase tracking-wider">
                        {isRtl ? 'وثيقة أصلية معتمدة' : 'VERIFIED / AUDITED'}
                      </Badge>
                      <p className="text-xs text-slate-400 font-mono font-bold tracking-tight mt-1">ID: {certificate.id}</p>
                    </div>
                  </div>
                  <Badge variant="neutral" size="sm" className="font-mono">
                    {isRtl ? 'حالة التوقيع: آمن' : 'Signing Node: SECURE'}
                  </Badge>
                </div>

                {/* Main credential presentation */}
                <div className="space-y-4 text-center py-4 relative z-10">
                  <span className="text-slate-400 font-bold tracking-wide uppercase text-[10px]">
                    {isRtl ? 'تشهد أكاديمية بيت الصحافة بأن' : 'THIS IS TO OFFICIALLY CERTIFY THAT'}
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                    {certificate.recipient_name}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    {isRtl 
                      ? `قد أتم/ت بنجاح وتفوق متطلبات البرنامج التدريبي التخصصي ومقرراته وحل فرضياته المقررة.` 
                      : `has successfully completed the capacity building curriculum prerequisites and final assignments evaluation for:`}
                  </p>
                  
                  {/* Title Box */}
                  <div className="p-4 bg-slate-50 border rounded-2xl max-w-md mx-auto">
                    <p className="text-xs md:text-sm font-black text-slate-900 leading-snug">
                      {isRtl ? 'دبلوم الاستقصاء الميداني وتتبع المصادر المفتوحة' : 'Master Diploma in Digital Investigative Journalism'}
                    </p>
                  </div>
                </div>

                {/* Metadata and stamps footer block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs">
                  <div className="space-y-1.5 font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{isRtl ? 'تاريخ الإصدار والترخيص:' : 'Cred Issued date:'}</span>
                      <span className="text-slate-800 font-mono">{certificate.issue_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileCheck size={14} className="text-slate-400" />
                      <span>{isRtl ? 'فئة الكفاءة الممنوحة:' : 'Performance Level:'}</span>
                      <span className="text-slate-800 font-black tracking-wide uppercase">{certificate.type}</span>
                    </div>
                  </div>

                  {/* QR Stamp */}
                  <div className="flex items-center gap-3 bg-slate-50 border p-3 rounded-2xl md:justify-end">
                    <div className="space-y-0.5 md:text-end">
                      <p className="text-[10px] font-black text-slate-800">{isRtl ? 'رمز الاستجابة للوثيقة' : 'Auditable QR stamp'}</p>
                      <p className="text-[9px] text-slate-400 leading-snug">{isRtl ? 'مستضاف بشكل دائم ومؤمن' : 'Hosted securely on PH Ledger'}</p>
                    </div>
                    <div className="w-12 h-12 bg-white p-1 border rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} 
                        alt="Verification QR" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

              </Card>
            ) : (
              <Card variant="bordered" padding="lg" className="border-2 border-rose-200 rounded-[32px] shadow-md">
                <div className="text-center space-y-4 py-4">
                  <ShieldAlert className="text-rose-500 mx-auto" size={48} />
                  <h3 className="text-base font-black text-slate-900">{isRtl ? 'التحقق غير مرخص / فشل الفحص' : 'Unlicensed Credential Scan'}</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {errorMsg}
                  </p>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTriggered(false)}
                  >
                    {isRtl ? 'إعادة المحاولة والتحقق' : 'Clear and try again'}
                  </Button>
                </div>
              </Card>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
