import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Wand2, Sparkles, FileText, Headline, Newspaper, Share2, Send } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PageHero } from '../components/ui/PageHero';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { pressAgentService } from '../services/pressAgent';

export default function PressAgent() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [activeTab, setActiveTab] = useState('generate');
  const [content, setContent] = useState('');
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'generate', label: isRtl ? 'توليد' : 'Generate', icon: Wand2 },
    { id: 'improve', label: isRtl ? 'تحسين' : 'Improve', icon: Sparkles },
    { id: 'translate', label: isRtl ? 'ترجمة' : 'Translate', icon: Share2 },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await pressAgentService.generateContent({
        type: 'b popup content', content: '', context: ''
      });
      setGenerated(prev => [...prev, result]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="PressAgent - AI Content Assistant" />
      
      <PageHero
        title={isRtl ? 'مساعد الصحافة' : 'PressAgent'}
        subtitle={isRtl ? 'مساعد ذكي لتوليد المحتوى' : 'AI-powered content assistant'}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon size={16} />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {isRtl ? 'النص المدخل' : 'Input'}
            </h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isRtl ? 'اكتب نصك هنا...' : 'Enter your text...'}
              className="w-full h-64 p-4 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <span>{isRtl ? 'جاري التوليد...' : 'Generating...'}</span>
                ) : (
                  <>
                    <Wand2 size={16} className="mr-2" />
                    {isRtl ? 'توليد' : 'Generate'}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {isRtl ? 'النتيجة' : 'Output'}
            </h3>
            <div className="h-64 bg-slate-100 rounded-xl p-4 overflow-y-auto">
              {generated.length === 0 ? (
                <p className="text-slate-500 text-center py-12">
                  {isRtl ? 'لا توجد نتائج بعد' : 'No results yet'}
                </p>
              ) : (
                <div className="space-y-4">
                  {generated.map((item, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg">
                      <p className="text-slate-900">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}