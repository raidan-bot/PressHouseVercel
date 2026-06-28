import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export default function Privacy() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const seoTitle = isRtl ? 'سياسة الخصوصية وحماية البيانات | بيت الصحافة' : 'Privacy Policy & Data Protection | Press House';
  const seoDescription = isRtl 
    ? 'ميثاق الحماية والالتزام الأخلاقي وسياسة الخصوصية والاستخدام المقبول لدى مؤسسة بيت الصحافة.' 
    : 'Protection charter, ethical commitment, privacy policy, and acceptable use policy at Press House Foundation.';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO title={seoTitle} description={seoDescription} type="website" />
      
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-blue-600 transition-colors">{isRtl ? 'الرئيسية' : 'Home'}</Link>
          <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
          <span className="text-slate-900">{isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
        </div>

        {/* Hero Header */}
        <div className="bg-slate-900 rounded-[40px] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-slate-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} />
              {isRtl ? 'السيادة والأمان' : 'Security & Sovereignty'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {isRtl ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-medium">
              {isRtl 
                ? 'وسياسة الاستخدام المقبول وسياسة الملكية الفكرية والترخيص المفتوح لبيت الصحافة (Press House).'
                : 'And acceptable use policy, intellectual property policy, and open licensing for Press House.'}
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{isRtl ? 'آخر تحديث: يونيو 2026' : 'Last Updated: June 2026'}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Lock size={14} />
                <span>{isRtl ? 'حماية مشددة للمصادر' : 'High Source Protection'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-16 shadow-sm space-y-12 text-slate-700 leading-relaxed text-base font-medium">
          
          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              مقدمة
            </h2>
            <p>
              يؤمن بيت الصحافة بأن حرية التعبير والصحافة المستقلة لا يمكن أن تزدهر دون حماية حقيقية للخصوصية والأمن الرقمي وحقوق الأفراد.
            </p>
            <p>
              تلتزم المؤسسة بتطبيق أعلى المعايير المهنية والأخلاقية والقانونية في جمع البيانات ومعالجتها وحفظها واستخدامها، مع الاسترشاد بمبادئ اللائحة العامة لحماية البيانات الأوروبية (GDPR)، والمعايير الدولية لحقوق الإنسان، وأفضل الممارسات المتبعة في المؤسسات الإعلامية والحقوقية الدولية.
            </p>
            <p>
              إن استخدامكم لمنصة بيت الصحافة أو أي من خدماتها يعني اطلاعكم على هذه السياسة وموافقتكم عليها.
            </p>
          </div>

          {/* Part 1 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              أولاً: ميثاق الحماية والالتزام الأخلاقي
            </h2>
            
            <div className="space-y-3 pl-4 border-l-2 border-slate-100">
              <h3 className="text-lg font-black text-slate-800">1. مبدأ عدم التسبب بالضرر (Do No Harm)</h3>
              <p>
                سلامة الأفراد والمصادر والصحفيين والمبلغين والشهود تأتي قبل أي مصلحة إعلامية أو بحثية أو حقوقية. يلتزم بيت الصحافة بعدم نشر أو مشاركة أي معلومات قد تؤدي بشكل مباشر أو غير مباشر إلى:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
                <li>تعريض الأفراد للخطر.</li>
                <li>كشف هويات المصادر المحمية.</li>
                <li>تهديد السلامة الجسدية أو النفسية.</li>
                <li>الإضرار بالوضع القانوني أو المهني للأفراد.</li>
              </ul>
              <p>
                يجوز للمؤسسة حجب أو تأجيل أو إلغاء نشر أي محتوى إذا تبين أن النشر قد يؤدي إلى مخاطر أمنية أو إنسانية.
              </p>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-slate-100">
              <h3 className="text-lg font-black text-slate-800">2. سيادة صاحب البيانات على معلوماته</h3>
              <p>يحتفظ أصحاب البيانات بالحق الكامل في:</p>
              <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
                <li>معرفة البيانات التي يتم جمعها.</li>
                <li>طلب تصحيح البيانات.</li>
                <li>طلب حذف البيانات متى كان ذلك ممكناً قانونياً.</li>
                <li>سحب الموافقة الممنوحة سابقاً.</li>
                <li>طلب تقييد المعالجة.</li>
                <li>طلب نسخة من البيانات الشخصية الخاصة بهم.</li>
              </ul>
              <p>
                لا يتم نشر أو مشاركة المعلومات الحساسة إلا بناءً على موافقة مستنيرة وصريحة من صاحبها أو وفق مقتضيات قانونية ملزمة.
              </p>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-slate-100">
              <h3 className="text-lg font-black text-slate-800">3. الحماية الخاصة للضحايا والمبلغين</h3>
              <p>
                يتعامل بيت الصحافة مع الصحفيين المهددين، ضحايا الانتهاكات، المبلغين عن الفساد، الشهود، والمصادر الحساسة، كفئات تتطلب حماية إضافية. ولهذا يتم تطبيق تدابير تقنية وتنظيمية مضاعفة لحماية هوياتهم وبياناتهم.
              </p>
            </div>
          </div>

          {/* Part 2 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              ثانياً: البيانات التي نجمعها
            </h2>
            <p>قد نقوم بجمع البيانات التالية:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-black text-slate-900 text-sm">بيانات الهوية</h4>
                <p className="text-xs text-slate-500">الاسم، البريد الإلكتروني، رقم الهاتف، المؤسسة أو جهة العمل.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-black text-slate-900 text-sm">بيانات الاستخدام</h4>
                <p className="text-xs text-slate-500">عنوان IP، نوع المتصفح، نظام التشغيل، سجلات الدخول، ونشاط المستخدم داخل المنصة.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-black text-slate-900 text-sm">البيانات الصحفية والبحثية</h4>
                <p className="text-xs text-slate-500">البلاغات، الشهادات، الوثائق، الصور، التسجيلات الصوتية، الفيديوهات، وملفات التحقيقات.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-black text-slate-900 text-sm">البيانات التقنية</h4>
                <p className="text-xs text-slate-500">ملفات تعريف الارتباط Cookies، سجلات الأمان، وبيانات مكافحة الاحتيال والهجمات الإلكترونية.</p>
              </div>
            </div>
          </div>

          {/* Part 3 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              ثالثاً: الأساس القانوني للمعالجة
            </h2>
            <p>نعالج البيانات بناءً على واحد أو أكثر من الأسس التالية:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>موافقة المستخدم.</li>
              <li>تنفيذ خدمة أو عقد.</li>
              <li>الامتثال للالتزامات القانونية.</li>
              <li>حماية المصالح الحيوية للأفراد.</li>
              <li>المصلحة العامة المتعلقة بحرية التعبير والصحافة والبحث.</li>
              <li>المصالح المشروعة للمؤسسة مع عدم المساس بحقوق الأفراد.</li>
            </ul>
          </div>

          {/* Part 4 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              رابعاً: كيف نستخدم البيانات
            </h2>
            <p>تستخدم البيانات من أجل:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>تشغيل المنصة وتطوير خدماتها الأمنية والبحثية.</li>
              <li>إدارة العضويات والحسابات والبرامج التدريبية.</li>
              <li>استقبال البلاغات والشكاوى المتعلقة بسلامة وحماية الصحفيين.</li>
              <li>التوثيق والرصد الحقوقي وتقديم الدعم الإنساني والقانوني.</li>
              <li>إعداد الدراسات والتقارير الصحفية الاستقصائية الرصينة.</li>
            </ul>
            <p className="text-blue-600 font-bold">
              ولا يتم بيع البيانات الشخصية لأي طرف ثالث تحت أي ظرف.
            </p>
          </div>

          {/* Part 5 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              خامساً: تخزين البيانات وأمنها
            </h2>
            <p>
              يعتمد بيت الصحافة سياسة أمن معلومات متعددة الطبقات تشمل تشفير البيانات أثناء النقل والتخزين، التحكم الصارم في صلاحيات الوصول، التوثيق متعدد العوامل، النسخ الاحتياطي المشفر، سجلات التدقيق والمراقبة الأمنية، والمراجعات السيبرانية الدورية للأنظمة والبرمجيات.
            </p>
            <p>
              تقتصر صلاحية الوصول إلى البيانات الحساسة على الموظفين المخولين فقط وفق مبدأ أقل صلاحية لازمة لأداء المهمة (Least Privilege Access).
            </p>
          </div>

          {/* Part 6 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              سادساً: مشاركة البيانات مع أطراف ثالثة
            </h2>
            <p>لا تتم مشاركة البيانات إلا في الحالات التالية:</p>
            <ul className="list-disc list-inside space-y-1.5 pr-4 text-sm text-slate-600">
              <li>موافقة صريحة ومستنيرة من صاحب البيانات.</li>
              <li>متطلبات قانونية ملزمة وشفافة.</li>
              <li>شراكات بحثية أو إعلامية بعد إزالة كامل المعلومات التعريفية.</li>
              <li>حماية حياة أو سلامة شخص معرض لخطر وشيك.</li>
            </ul>
          </div>

          {/* Part 7 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              سابعاً: حقوق المستخدمين
            </h2>
            <p>
              يحق لكم الوصول إلى بياناتكم، تصحيحها، طلب حذفها بشكل نهائي، الاعتراض على معالجتها، تقييد المعالجة، نقل البيانات، وسحب موافقتكم في أي وقت. يمكن تقديم هذه الطلبات عبر قنوات التواصل الرسمية للمؤسسة.
            </p>
          </div>

          {/* Part 8 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              ثامناً: سياسة الاستخدام المقبول (AUP)
            </h2>
            <p>يجب استخدام المنصة بصورة قانونية ومهنية وأخلاقية. يُحظر تماماً:</p>
            <ul className="list-disc list-inside space-y-2 pr-4 text-sm text-slate-600">
              <li><strong>المحتوى غير المشروع:</strong> التحريض على العنف، الكراهية، التمييز، والجرائم الإلكترونية.</li>
              <li><strong>التضليل الإعلامي:</strong> نشر معلومات مزيفة عن علم، تزوير الوثائق، أو انتحال الشخصيات.</li>
              <li><strong>انتهاك الخصوصية:</strong> نشر البيانات الشخصية للآخرين دون إذنهم، أو كشف المصادر السرية والمبلغين.</li>
              <li><strong>إساءة استخدام المنصة:</strong> محاولات الاختراق، تعطيل الخدمات، أو جمع البيانات بطريقة غير مصرح بها.</li>
            </ul>
          </div>

          {/* Part 9 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              تاسعاً: سياسة استخدام الذكاء الاصطناعي
            </h2>
            <p>
              قد توفر المنصة أدوات ذكاء اصطناعي لأغراض البحث، التحليل، الترجمة، والتصنيف. ويلتزم المستخدمون بالتحقق من النتائج قبل النشر، الإفصاح عن استخدام الذكاء الاصطناعي عند الحاجة المهنية، عدم إنتاج حملات تأثير أو تضليل ممنهج، وعدم إساءة استخدام هذه الأدوات. وتحتفظ المؤسسة بحق مراجعة أو حظر أي استخدام ضار.
            </p>
          </div>

          {/* Part 10 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              عاشراً: الملكية الفكرية والترخيص المفتوح
            </h2>
            <p><strong>ملكية المؤسسة:</strong> تعود ملكية التصميمات، البرمجيات، قواعد البيانات، المنهجيات، العلامات التجارية والمحتوى المؤسسي لبيت الصحافة ما لم يذكر خلاف ذلك.</p>
            <p><strong>ملكية المؤلفين والباحثين:</strong> يحتفظ المؤلفون والباحثون والصحفيون بحقوقهم الفكرية الأصلية في أعمالهم ما لم تنص الاتفاقيات الخاصة بالمشروعات على غير ذلك.</p>
            <p>
              <strong>الترخيص المفتوح للمحتوى المعرفي:</strong> يجوز للمؤسسة نشر أجزاء من إنتاجها المعرفي تحت رخصة Creative Commons Attribution 4.0 (CC BY 4.0) أو أي ترخيص مفتوح مشابه يحقق أهداف الوصول الحر للمعرفة، بشرط الإشارة للمصدر وعدم تحريف المحتوى.
            </p>
          </div>

          {/* Part 11 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              الحادي عشر: الاحتفاظ بالبيانات
            </h2>
            <p>
              تحتفظ المؤسسة بالبيانات فقط للفترة اللازمة لتحقيق الأغراض المشروعة أو للامتثال للالتزامات القانونية أو الأرشيفية. وعند انتهاء الحاجة إليها، يتم حذفها بشكل آمن أو إخفاء هويتها أو أرشفتها وفق ضوابط الحفظ المؤسسي.
            </p>
          </div>

          {/* Part 12 & 13 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              الثاني عشر والثالث عشر: التعديلات والتواصل
            </h2>
            <p>
              يجوز لبيت الصحافة تحديث هذه السياسة عند الحاجة، وسيتم نشر النسخة المحدثة عبر الموقع مع بيان تاريخ النفاذ. للاستفسارات المتعلقة بالخصوصية وحماية البيانات أو تقديم طلبات الوصول والحذف، يرجى التواصل عبر القنوات الرسمية المعلنة في موقع بيت الصحافة.
            </p>
          </div>

          {/* Mission Statement Seal */}
          <div className="p-8 rounded-3xl bg-blue-50 border border-blue-100 space-y-4">
            <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              رسالة المؤسسة
            </h3>
            <p className="text-blue-900 text-sm leading-relaxed">
              في بيت الصحافة، لا ننظر إلى البيانات باعتبارها مجرد معلومات، بل باعتبارها مسؤولية أخلاقية وقانونية ومهنية. نؤمن بأن حماية الصحفيين والمصادر والباحثين والضحايا ليست إجراءً تقنياً فحسب، بل جزءاً من رسالتنا في الدفاع عن الحقيقة والعدالة وحق المجتمع في المعرفة.
            </p>
            <p className="text-blue-950 text-xs font-black">
              أنت لست مجرد مستخدم للمنصة، بل شريك في بناء ذاكرة اليمن وحماية حقه في رواية قصته بنفسه.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
