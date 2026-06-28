import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image as ImageIcon, 
  Eye, 
  Code, 
  Sparkles, 
  Loader2, 
  Undo, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isRtl?: boolean;
}

export default function RichTextEditor({ value = '', onChange, placeholder = '', isRtl = true }: RichTextEditorProps) {
  const { i18n } = useTranslation();
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiHelper, setShowAiHelper] = useState(false);

  // Simple, highly robust formatting insertion helper
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-text-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = before + (selected || '') + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newValue);

    // Refocus & select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const handleAiEnhance = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const res = await api.post('/api/ai/chat', { 
        message: `قم بتحسين أو كتابة الفقرة التالية بالأسلوب الصحفي بناء على التوجيه: "${aiPrompt}". الكود الأصلي أو المحتوى الحالي هو: "${value}". يرجى إرجاع المحتوى الصحفي النهائي المنسق فقط.` 
      });
      if (res.data?.reply) {
        onChange(value ? `${value}\n\n${res.data.reply}` : res.data.reply);
        setAiPrompt('');
        setShowAiHelper(false);
      }
    } catch (err) {
      console.error('AI enhance error:', err);
      alert(i18n.language === 'ar' ? 'حدث خطأ أثناء الاتصال بالوكيل Hermes' : 'Error communicating with Hermes AI');
    } finally {
      setAiGenerating(false);
    }
  };

  const formatButtons = [
    { label: 'Bold', icon: <Bold size={16} />, action: () => insertText('**', '**'), tooltip: isRtl ? 'عريض' : 'Bold' },
    { label: 'Italic', icon: <Italic size={16} />, action: () => insertText('*', '*'), tooltip: isRtl ? 'مائل' : 'Italic' },
    { label: 'H1', icon: <Heading1 size={16} />, action: () => insertText('\n# ', '\n'), tooltip: isRtl ? 'عنوان رئيسي' : 'Heading 1' },
    { label: 'H2', icon: <Heading2 size={16} />, action: () => insertText('\n## ', '\n'), tooltip: isRtl ? 'عنوان فرعي' : 'Heading 2' },
    { label: 'Bullet List', icon: <List size={16} />, action: () => insertText('\n* ', '\n'), tooltip: isRtl ? 'قائمة منقطة' : 'Bullet List' },
    { label: 'Number List', icon: <ListOrdered size={16} />, action: () => insertText('\n1. ', '\n'), tooltip: isRtl ? 'قائمة مرقمة' : 'Numbered List' },
    { label: 'Quote', icon: <Quote size={16} />, action: () => insertText('\n> ', '\n'), tooltip: isRtl ? 'اقتباس' : 'Blockquote' },
    { label: 'Link', icon: <Link size={16} />, action: () => {
      const url = prompt(isRtl ? 'أدخل رابط الويب (URL):' : 'Enter link URL:');
      if (url) insertText('[', `](${url})`);
    }, tooltip: isRtl ? 'إدراج رابط' : 'Insert Link' },
    { label: 'Image', icon: <ImageIcon size={16} />, action: () => {
      const url = prompt(isRtl ? 'أدخل رابط الصورة أو مسارها في مكتبة الوسائط:' : 'Enter image URL or path:');
      if (url) insertText('![', `](${url})`);
    }, tooltip: isRtl ? 'إدراج صورة' : 'Insert Image' },
    { label: 'Code', icon: <Code size={16} />, action: () => insertText('`', '`'), tooltip: isRtl ? 'شفرة برمجية' : 'Code block' },
  ];

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col min-h-[400px]" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          {formatButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all active:scale-95 cursor-pointer"
              title={btn.tooltip}
            >
              {btn.icon}
            </button>
          ))}
          
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />

          {/* Hermes AI assistant trigger */}
          <button
            type="button"
            onClick={() => setShowAiHelper(!showAiHelper)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${showAiHelper ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50'}`}
          >
            <Sparkles size={14} className={aiGenerating ? 'animate-spin' : ''} />
            {isRtl ? 'الوكيل Hermes الذكي' : 'Hermes Writer'}
          </button>
        </div>

        {/* View Switchers */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPreviewMode('edit')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${previewMode === 'edit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {isRtl ? 'تعديل مرئي' : 'Write'}
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${previewMode === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {isRtl ? 'معاينة المظهر' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('split')}
            className={`hidden md:block px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${previewMode === 'split' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            {isRtl ? 'شاشة منقسمة' : 'Split'}
          </button>
        </div>

      </div>

      {/* AI helper drawer/panel inside the editor */}
      {showAiHelper && (
        <div className="bg-indigo-900 p-4 border-b border-indigo-950 text-white animate-fadeIn flex flex-col md:flex-row items-end gap-3 shrink-0">
          <div className="flex-1 space-y-1.5 text-start w-full">
            <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
              <Sparkles size={12} />
              {isRtl ? 'اطلب من مساعد Hermes كتابة أو صياغة المقال' : 'Command Hermes to draft or format content'}
            </h4>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={isRtl ? 'اكتب مثلاً: "صغ فقرة ترحيبية بالصحفيين الشبان لبيت الصحافة باليمن"...' : 'Command e.g. "Draft an elegant introduction for youth journalists event"...'}
              className="w-full bg-indigo-950 border border-indigo-800/80 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-400"
              disabled={aiGenerating}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={handleAiEnhance}
              disabled={aiGenerating || !aiPrompt.trim()}
              className="flex-1 md:flex-none px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 disabled:opacity-50 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {aiGenerating ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle2 size={12} />}
              {isRtl ? 'توليد وإدراج' : 'Generate'}
            </button>
            <button
              type="button"
              onClick={() => setShowAiHelper(false)}
              className="px-4 py-2.5 bg-indigo-850 hover:bg-indigo-800 text-indigo-300 text-xs font-black rounded-xl cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 flex min-h-[300px]">
        
        {/* Editing Screen */}
        {(previewMode === 'edit' || previewMode === 'split') && (
          <textarea
            id="rich-text-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || (isRtl ? 'اكتب أو انسخ محتوى المقال والخبر الصحفي هنا...' : 'Write beautifully formatted markdown here...')}
            className={`flex-1 p-6 resize-none outline-none text-slate-800 font-medium text-sm md:text-base leading-relaxed border-0 bg-transparent placeholder-slate-350 min-h-full ${previewMode === 'split' ? 'border-r border-slate-200' : ''}`}
            style={{ minHeight: '300px' }}
          />
        )}

        {/* Live Preview Screen */}
        {(previewMode === 'preview' || previewMode === 'split') && (
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto text-start prose max-w-none text-slate-800 select-text" style={{ minHeight: '300px' }}>
            {value ? (
              <div className="space-y-4">
                {/* Visual rendering fallback for markdown headings, lists, quotes, images */}
                {value.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('# ')) {
                    return <h1 key={idx} className="text-xl md:text-2xl font-black text-slate-900 border-b pb-1 mt-4">{trimmed.substring(2)}</h1>;
                  }
                  if (trimmed.startsWith('## ')) {
                    return <h2 key={idx} className="text-lg md:text-xl font-extrabold text-slate-800 mt-3">{trimmed.substring(3)}</h2>;
                  }
                  if (trimmed.startsWith('> ')) {
                    return <blockquote key={idx} className="border-r-4 border-indigo-500 pr-4 italic text-slate-600 bg-indigo-50/30 p-3 rounded-r-lg my-2 rtl:border-l-4 rtl:border-r-0 rtl:pl-4 rtl:pr-0">{trimmed.substring(2)}</blockquote>;
                  }
                  if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                    return <li key={idx} className="list-disc list-inside pr-2 text-slate-700 font-medium">{trimmed.substring(2)}</li>;
                  }
                  if (trimmed.match(/^\d+\.\s/)) {
                    return <li key={idx} className="list-decimal list-inside pr-2 text-slate-700 font-medium">{trimmed.replace(/^\d+\.\s/, '')}</li>;
                  }
                  if (trimmed.startsWith('![') && trimmed.includes('](')) {
                    const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      return (
                        <div key={idx} className="my-4 rounded-xl overflow-hidden shadow-md max-w-lg mx-auto">
                          <img src={match[2]} alt={match[1]} className="w-full object-cover max-h-64" referrerPolicy="no-referrer" />
                          {match[1] && <p className="text-xs text-center text-slate-400 p-2 bg-slate-100 font-bold">{match[1]}</p>}
                        </div>
                      );
                    }
                  }
                  return trimmed ? <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-700 my-1">{trimmed}</p> : <div key={idx} className="h-2" />;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-10">
                <FileText size={32} className="opacity-30 animate-pulse" />
                <span className="text-xs font-bold">{isRtl ? 'لا يوجد محتوى للمعاينة حتى الآن' : 'Nothing to preview yet'}</span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
