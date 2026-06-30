import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Send, AlertCircle, CheckCircle2, Loader2, Paperclip } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export default function ViolationForm({ onSuccess }: { onSuccess: () => void }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    victimName: '',
    victimInstitution: '',
    governorate: '',
    district: '',
    date: '',
    perpetrator: '',
    type: '',
    description: '',
    evidenceLinks: [] as string[],
    status: 'pending',
  });

  const governorates = [
    'أمانة العاصمة صنعاء', 'عدن', 'تعز', 'الحديدة', 'مأرب', 'حضرموت', 'شبوة', 'إب', 'ذمار', 'لحج', 'الضالع', 'أبين', 'صعدة', 'عمران', 'حجة', 'البيضاء', 'المهرة', 'سقطرى', 'المحويت', 'ريمة', 'الجوف'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/violations', formData);
      setSubmitted(true);
      setTimeout(onSuccess, 3000);
    } catch (error) {
      console.error("Error submitting violation", error);
      alert(isRtl ? "حدث خطأ أثناء الإرسال" : "Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isRtl ? 'تم إرسال بلاغك بنجاح' : 'Report Submitted Successfully'}
        </h2>
        <p className="text-slate-500">
          {isRtl 
            ? 'شكراً لك على شجاعتك. سيقوم فريقنا بمراجعة البيانات والتواصل معك إذا لزم الأمر.' 
            : 'Thank you for your courage. Our team will review the data and contact you if necessary.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "w-8 h-2 rounded-full transition-all",
                  step >= s ? "bg-blue-600" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {isRtl ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Charter of Protection & Ethical Commitment */}
              <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-2xl space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h4 className="text-lg font-black text-red-600 mb-2">
                    {isRtl ? 'أولاً: ميثاق الحماية والالتزام الأخلاقي في "بيت الصحافة"' : 'First: Charter of Protection and Ethical Commitment at "Press House"'}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    {isRtl 
                      ? 'عزيزي الزميل/ة، في "بيت الصحافة"، ندرك أن تعبئة هذه الاستمارة في ظل الظروف الراهنة التي يمر بها اليمن هو عمل شجاع بحد ذاته. لذلك، فإننا لا نتعامل مع ما تكتبه هنا كبيانات إحصائية جامدة، بل كأمانة غليظة تمس أرواحاً ومصائر. نضع بين يديك التزاماتنا الصارمة تجاهك وتجاه كل معلومة تشاركنا إياها:'
                      : 'Dear Colleague, at "Press House", we recognize that filling out this form under the current circumstances in Yemen is a brave act in itself. Therefore, we do not treat what you write here as rigid statistical data, but as a heavy trust that affects lives and destinies. We place in your hands our strict commitments to you and to every piece of information you share with us:'}
                  </p>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-950">
                      {isRtl ? '1. مبدأ "لا ضرر ولا ضرار" (Do No Harm):' : '1. "Do No Harm" Principle:'}
                    </h5>
                    <p className="font-medium">
                      {isRtl 
                        ? 'سلامتكم هي أولويتنا المطلقة التي تسبق أي سبق صحفي أو تقرير حقوقي. نلتزم بعدم اتخاذ أي إجراء -مهما كان بسيطاً- قد يعرض حياتكم أو سلامتكم الجسدية أو أمن عائلاتكم للخطر. إذا كان النشر العلني للانتهاك سيسبب ضرراً إضافياً، فسنكتفي بالتوثيق السري لأغراض المحاسبة المستقبلية فقط.'
                        : 'Your safety is our absolute priority, which precedes any scoop or human rights report. We commit not to take any action - no matter how simple - that might endanger your life, physical safety, or the security of your family. If the public publication of the violation would cause additional harm, we will limit ourselves to confidential documentation for future accountability purposes only.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-950">
                      {isRtl ? '2. سيادة الضحية على قصتها:' : "2. Victim's Sovereignty Over Their Story:"}
                    </h5>
                    <p className="font-medium">
                      {isRtl 
                        ? 'أنت المالك الوحيد لقصتك. لن نقوم بنشر حرف واحد، أو مشاركة تفاصيل قضيتك مع أي جهة (سواء كانت منظمات أممية، أو وسائل إعلام، أو جهات قانونية) إلا بعد الحصول على "موافقة مستنيرة" وصريحة منك. لك الحق الكامل في تحديد مستوى النشر (بالاسم الصريح، باسم مستعار، أو سري للغاية)، ولك الحق في سحب هذه الموافقة في أي وقت.'
                        : 'You are the sole owner of your story. We will not publish a single letter, or share details of your case with any entity (be it UN organizations, media, or legal authorities) unless we obtain an explicit, informed consent from you. You have the full right to determine the level of publication (real name, pseudonym, or highly confidential), and you have the right to withdraw this consent at any time.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-950">
                      {isRtl ? '3. الخصوصية والأمن الرقمي:' : '3. Privacy and Cyber Security:'}
                    </h5>
                    <p className="font-medium">
                      {isRtl 
                        ? 'يتم التعامل مع البيانات الواردة في هذه الاستمارة وفق بروتوكولات أمان صارمة. تخزن المعلومات في خوادم مشفرة خارج نطاق سيطرة أي من أطراف النزاع في اليمن. تقتصر صلاحية الاطلاع على البيانات الحساسة (مثل أرقام الهواتف والعناوين) على فريق ضيق جداً من "وحدة الرصد والتوثيق" فقط، ولأغراض المتابعة المباشرة.'
                        : 'The data in this form is handled under strict security protocols. Information is stored on encrypted servers outside the control of any conflict parties in Yemen. Access to sensitive data (such as phone numbers and addresses) is strictly limited to a very narrow team of the "Monitoring and Documentation Unit" only, and for direct follow-up purposes.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-950">
                      {isRtl ? '4. الاستقلالية التامة:' : '4. Total Independence:'}
                    </h5>
                    <p className="font-medium">
                      {isRtl 
                        ? 'نقف في "بيت الصحافة" على مسافة واحدة من جميع أطراف الصراع في اليمن. انحيازنا الوحيد هو للحقيقة وللضحية، بغض النظر عن هوية الجهة المنتهكة (سلطات أمر واقع، تشكيلات عسكرية، أو جهات حكومية) وبغض النظر عن الانتماء السياسي للصحفي الضحية. نحن نوثق الانتهاك لأنه انتهاك، لا لخدمة أجندة سياسية.'
                        : 'We stand at "Press House" at an equal distance from all parties of the conflict in Yemen. Our only bias is to the truth and to the victim, regardless of the violating party (de facto authorities, military formations, or government bodies) and regardless of the political affiliation of the victim journalist. We document the violation because it is a violation, not to serve a political agenda.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-950">
                      {isRtl ? '5. الهدف هو العدالة لا مجرد الإحصاء:' : '5. Goal is Justice, Not Just Statistics:'}
                    </h5>
                    <p className="font-medium">
                      {isRtl 
                        ? 'هدفنا من هذا الرصد ليس مجرد إصدار تقارير سنوية، بل بناء ملفات قانونية متماسكة تمنع طمس الحقائق، وتساهم في تقديم الدعم القانوني، الطبي، والنفسي العاجل لكم، وضمان أن مرتكبي الانتهاكات بحق الصحافة اليمنية لن يفلتوا من العقاب، طال الزمن أو قصر.'
                        : 'Our goal of this monitoring is not to merely issue annual reports, but to build cohesive legal files that prevent the obliteration of facts, contribute to providing urgent legal, medical, and psychological support, and ensure that perpetrators of violations against the Yemeni press will not escape punishment, no matter how long it takes.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-center font-bold text-red-600 text-sm md:text-base animate-pulse">
                  {isRtl ? 'أنت لست وحدك، وصوتك في أمان.' : 'You are not alone, and your voice is safe.'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">{isRtl ? 'بيانات الُمَبِّلغ' : 'Reporter Information'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.reporterName}
                    onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'رقم الهاتف (واتساب)' : 'Phone (WhatsApp)'}</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-700 text-sm">
                <AlertCircle size={20} className="shrink-0" />
                <p>{isRtl ? 'سيتم التعامل مع بياناتك بسرية تامة ولن يتم نشرها.' : 'Your data will be handled with strict confidentiality and will not be published.'}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                {isRtl ? 'التالي' : 'Next'}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{isRtl ? 'بيانات الضحية والحدث' : 'Victim & Event Details'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'اسم الضحية' : 'Victim Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.victimName}
                    onChange={(e) => setFormData({...formData, victimName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'المؤسسة الإعلامية' : 'Media Institution'}</label>
                  <input 
                    type="text" 
                    value={formData.victimInstitution}
                    onChange={(e) => setFormData({...formData, victimInstitution: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'المحافظة' : 'Governorate'}</label>
                  <select 
                    required
                    value={formData.governorate}
                    onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">{isRtl ? 'اختر المحافظة' : 'Select Governorate'}</option>
                    {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{isRtl ? 'تاريخ الانتهاك' : 'Date of Violation'}</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
                >
                  {isRtl ? 'السابق' : 'Back'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
                >
                  {isRtl ? 'التالي' : 'Next'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{isRtl ? 'تفاصيل الانتهاك' : 'Violation Details'}</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{isRtl ? 'نوع الانتهاك' : 'Violation Type'}</label>
                <input 
                  type="text" 
                  required
                  placeholder={isRtl ? 'مثال: اعتقال، اعتداء، تهديد...' : 'e.g. Arrest, Assault, Threat...'}
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{isRtl ? 'الجهة المنتهكة' : 'Perpetrator'}</label>
                <input 
                  type="text" 
                  required
                  value={formData.perpetrator}
                  onChange={(e) => setFormData({...formData, perpetrator: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{isRtl ? 'سرد القصة الكاملة' : 'Full Story Description'}</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
                >
                  {isRtl ? 'السابق' : 'Back'}
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  {isRtl ? 'إرسال البلاغ' : 'Submit Report'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
