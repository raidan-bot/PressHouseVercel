import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { FileText, Calendar, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export default function Terms() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const seoTitle = isRtl ? 'شروط الخدمة | بيت الصحافة' : 'Terms of Service | Press House';
  const seoDescription = isRtl 
    ? 'شروط الخدمة والقوانين المنظمة لاستخدام منصة بيت الصحافة وخدماتها الرقمية.' 
    : 'Terms of service and governing rules for using Press House platform and digital services.';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO title={seoTitle} description={seoDescription} type="website" />
      
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-blue-600 transition-colors">{isRtl ? 'الرئيسية' : 'Home'}</Link>
          <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-slate-900">{isRtl ? 'شروط الخدمة' : 'Terms of Service'}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-slate-900 rounded-[40px] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-black uppercase tracking-widest">
              <FileText size={14} />
              {isRtl ? 'وثيقة تنظيمية' : 'Regulatory Document'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {isRtl ? 'شروط الخدمة لموقع بيت الصحافة' : 'Terms of Service for Press House'}
            </h1>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{isRtl ? 'آخر تحديث: يونيو 2026' : 'Last Updated: June 2026'}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Shield size={14} />
                <span>{isRtl ? 'مؤسسة معتمدة' : 'Verified Institution'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Content Card */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-16 shadow-sm space-y-10 text-slate-700 leading-relaxed text-base font-medium">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              1. مقدمة
            </h2>
            <p>
              مرحباً بكم في منصة بيت الصحافة ("المنصة"، "الموقع"، "نحن"، "لنا"). باستخدامكم لهذا الموقع أو أي من خدماته الرقمية، فإنكم توافقون على الالتزام بشروط الخدمة هذه وجميع السياسات المرتبطة بها، بما في ذلك سياسة الخصوصية وسياسات النشر والاستخدام المقبول.
            </p>
            <p>
              إذا كنتم لا توافقون على هذه الشروط، يرجى عدم استخدام الموقع أو أي من خدماته.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              2. طبيعة المؤسسة والخدمات
            </h2>
            <p>
              بيت الصحافة مؤسسة إعلامية وتنموية مستقلة وغير ربحية تعمل على دعم الصحافة المهنية، وتعزيز الوصول إلى المعلومات، وبناء القدرات الإعلامية، وتطوير المعرفة والبحوث، ودعم حرية التعبير والمساءلة المجتمعية.
            </p>
            <p>قد تشمل خدماتنا:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>النشر الإعلامي والصحفي.</li>
              <li>قواعد المعرفة والمكتبات الرقمية.</li>
              <li>البرامج التدريبية والتأهيلية.</li>
              <li>مراكز البلاغات والرصد الإعلامي.</li>
              <li>منصات الذكاء الاصطناعي والأدوات البحثية.</li>
              <li>المشاريع البحثية والأكاديمية.</li>
              <li>خدمات العضوية والمجتمعات المهنية.</li>
              <li>الفعاليات والمؤتمرات وورش العمل.</li>
              <li>الخدمات الرقمية المقدمة للشركاء والمؤسسات.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              3. أهلية الاستخدام
            </h2>
            <p>يحق لكم استخدام الموقع إذا:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>كنتم قادرين قانونياً على إبرام اتفاقيات ملزمة وفق القوانين المعمول بها.</li>
              <li>استخدمتم الخدمات لأغراض مشروعة فقط.</li>
              <li>قدمتم معلومات صحيحة ودقيقة عند إنشاء الحسابات أو التسجيل في البرامج والخدمات.</li>
            </ul>
            <p>
              يحتفظ بيت الصحافة بحق رفض أو تعليق أو إنهاء أي حساب في حال وجود انتهاك لهذه الشروط.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              4. الحسابات والمستخدمون
            </h2>
            <p>يتحمل المستخدم المسؤولية الكاملة عن:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>حماية بيانات الدخول وكلمات المرور.</li>
              <li>جميع الأنشطة التي تتم من خلال حسابه.</li>
              <li>تحديث بياناته عند الحاجة.</li>
            </ul>
            <p>
              ويجب إخطار إدارة المنصة فوراً عند الاشتباه بأي استخدام غير مصرح به للحساب.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              5. المحتوى المقدم من المستخدمين
            </h2>
            <p>
              يحتفظ المستخدم بملكية المحتوى الذي يقوم برفعه أو نشره أو مشاركته عبر المنصة. وبتقديم هذا المحتوى، يمنح المستخدم بيت الصحافة ترخيصاً غير حصري ومحدوداً لاستخدام المحتوى بالقدر اللازم لتشغيل الخدمات وتقديمها وتحسينها وحفظها وأرشفتها وفق أهداف المؤسسة.
            </p>
            <p>يقر المستخدم بأنه:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>يمتلك الحقوق القانونية للمحتوى المقدم.</li>
              <li>لا ينتهك حقوق الملكية الفكرية أو الخصوصية أو أي حقوق قانونية أخرى.</li>
              <li>يتحمل المسؤولية الكاملة عن المحتوى الذي ينشره.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              6. الاستخدام المقبول
            </h2>
            <p>يُمنع استخدام المنصة لأي من الأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>نشر المعلومات الكاذبة أو المضللة عمداً.</li>
              <li>التحريض على العنف أو الكراهية أو التمييز.</li>
              <li>التهديد أو المضايقة أو الإساءة للأفراد أو المؤسسات.</li>
              <li>انتهاك الخصوصية أو نشر البيانات الشخصية دون سند قانوني.</li>
              <li>القرصنة أو الهجمات الإلكترونية أو محاولات الوصول غير المصرح به.</li>
              <li>نشر البرمجيات الضارة أو الأكواد الخبيثة.</li>
              <li>انتحال الشخصية أو تزوير الهوية.</li>
              <li>استخدام المنصة في أنشطة مخالفة للقوانين المحلية أو الدولية.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              7. النزاهة الصحفية والمهنية
            </h2>
            <p>يُشجع بيت الصحافة على الالتزام بالمبادئ المهنية التالية:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>الدقة والتحقق من المعلومات.</li>
              <li>احترام المعايير الأخلاقية للصحافة.</li>
              <li>الشفافية في مصادر المعلومات متى أمكن.</li>
              <li>احترام حقوق الإنسان والكرامة الإنسانية.</li>
              <li>تجنب خطاب الكراهية والتحريض.</li>
            </ul>
            <p>
              ولا تتحمل المؤسسة المسؤولية عن الآراء أو المواد المنشورة من قبل المستخدمين أو الجهات الخارجية.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              8. خدمات الذكاء الاصطناعي
            </h2>
            <p>قد توفر المنصة أدوات تعتمد على تقنيات الذكاء الاصطناعي. ويقر المستخدم بأن:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>مخرجات الذكاء الاصطناعي قد تحتوي على أخطاء أو معلومات غير مكتملة.</li>
              <li>لا تشكل المخرجات استشارة قانونية أو مالية أو طبية أو مهنية.</li>
              <li>يتحمل المستخدم مسؤولية التحقق من النتائج قبل الاعتماد عليها أو نشرها.</li>
            </ul>
            <p>
              ويحتفظ بيت الصحافة بحق تحسين أو تعديل أو إيقاف أي خدمة تعتمد على الذكاء الاصطناعي في أي وقت.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              9. الملكية الفكرية
            </h2>
            <p>
              جميع الحقوق المتعلقة بالموقع، بما في ذلك التصميمات، الشعارات، قواعد البيانات، البرمجيات، المحتوى المؤسسي، والعلامات التجارية، مملوكة لبيت الصحافة أو لأصحاب الحقوق المرخصين لها، وتحميها القوانين الوطنية والدولية المتعلقة بالملكية الفكرية.
            </p>
            <p>
              ولا يجوز نسخ أو إعادة إنتاج أو توزيع أي جزء من المنصة دون موافقة خطية مسبقة.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              10. المحتوى والروابط الخارجية
            </h2>
            <p>
              قد تحتوي المنصة على روابط أو خدمات مقدمة من أطراف ثالثة. لا يتحمل بيت الصحافة أي مسؤولية عن محتوى المواقع الخارجية، سياسات الخصوصية الخاصة بالأطراف الثالثة، أو الخدمات أو المنتجات المقدمة من جهات خارجية. ويكون استخدام تلك الخدمات على مسؤولية المستخدم الخاصة.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              11. حماية البيانات والخصوصية
            </h2>
            <p>
              تتم معالجة البيانات الشخصية وفق سياسة الخصوصية الخاصة بالمؤسسة. يلتزم بيت الصحافة باتخاذ تدابير تقنية وتنظيمية معقولة لحماية البيانات، مع الإقرار بأن أي نظام إلكتروني لا يمكن ضمان أمنه بشكل مطلق.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              12. إيقاف أو تعليق الخدمات
            </h2>
            <p>
              يحق للمؤسسة تعليق الحسابات المخالفة، إزالة المحتوى المخالف، تقييد الوصول إلى بعض الخدمات، أو إنهاء استخدام أي مستخدم عند الضرورة. ويتم ذلك وفق تقدير المؤسسة وبما يحقق سلامة المنصة ومستخدميها.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              13. إخلاء المسؤولية
            </h2>
            <p>
              يتم توفير الموقع والخدمات على أساس "كما هي" (As Is) و"حسب التوفر" (As Available). ولا تقدم المؤسسة أي ضمانات صريحة أو ضمنية بشأن استمرارية الخدمة دون انقطاع، خلو الخدمات من الأخطاء، أو دقة أو اكتمال جميع المعلومات المنشورة.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              14. حدود المسؤولية
            </h2>
            <p>
              إلى الحد المسموح به قانوناً، لا يتحمل بيت الصحافة أو موظفوه أو شركاؤه أو ممثلوه أي مسؤولية عن الأضرار المباشرة أو غير المباشرة أو العرضية أو التبعية الناتجة عن استخدام الموقع أو عدم القدرة على استخدامه.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              15. التعويض
            </h2>
            <p>
              يوافق المستخدم على تعويض وحماية بيت الصحافة وموظفيه وشركائه من أي مطالبات أو خسائر أو مسؤوليات أو تكاليف تنشأ نتيجة انتهاك هذه الشروط، إساءة استخدام الخدمات، أو انتهاك حقوق الغير.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              16. التعديلات على الشروط
            </h2>
            <p>
              يجوز للمؤسسة تعديل هذه الشروط في أي وقت. وسيتم نشر النسخة المحدثة عبر الموقع مع تحديث تاريخ السريان، ويُعد استمرار استخدام الخدمات بعد التعديل موافقة على الشروط الجديدة.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              17. القانون الواجب التطبيق
            </h2>
            <p>
              تُفسر هذه الشروط وفق القوانين والاتفاقيات ذات الصلة التي تنظم عمل المؤسسة، مع مراعاة المعايير الدولية لحرية التعبير وحقوق الإنسان وحماية البيانات كلما كان ذلك مناسباً.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              18. التواصل
            </h2>
            <p>
              للاستفسارات المتعلقة بشروط الخدمة أو الحقوق القانونية أو الإبلاغ عن الانتهاكات، يمكن التواصل عبر القنوات الرسمية المعلنة على موقع بيت الصحافة.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
            باستخدامكم لمنصة بيت الصحافة، فإنكم تقرون بقراءة وفهم وقبول شروط الخدمة هذه بالكامل.
          </div>

        </div>
      </div>
    </div>
  );
}
