import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { PieChart, BarChart, LineChart, Map, Upload, Text } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PageHero } from '../components/ui/PageHero';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function AutoViz() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [inputText, setInputText] = useState('');
  const [visualizations, setVisualizations] = useState([]);

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'map', label: 'Map', icon: Map },
  ];

  const generateViz = () => {
    // Simulate visualization generation
    setVisualizations([...visualizations, { id: Date.now(), type: 'bar', data: [] }]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="AutoViz - Data Visualization" />
      
      <PageHero
        title={isRtl ? 'تصوير ذاتي' : 'AutoViz'}
        subtitle={isRtl ? 'تحويل البيانات لرسوم بيانية' : 'Turn data into visuals'}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {isRtl ? 'المصدر' : 'Source'}
              </h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRtl ? 'اكتب أو الصق نصاً...' : 'Write or paste text...'}
                className="w-full h-40 p-4 rounded-xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={generateViz}>
                  <Text size={16} className="mr-2" />
                  {isRtl ? 'من نص' : 'From Text'}
                </Button>
                <Button variant="outline">
                  <Upload size={16} className="mr-2" />
                    {isRtl ? 'رفع ملف' : 'Upload File'}
                </Button>
              </div>
            </Card>

            {/* Chart Types */}
            <div className="grid grid-cols-2 gap-4">
              {chartTypes.map((type) => (
                <Card
                  key={type.id}
                  className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <type.icon size={24} className="text-blue-600 mb-2" />
                  <p className="font-medium text-slate-900">{type.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Output */}
          <div>
            <Card className="p-6 min-h-[400px] flex items-center justify-center">
              {visualizations.length === 0 ? (
                <div className="text-center">
                  <PieChart size={64} className="mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">
                    {isRtl ? 'لا توجد رسوم بيانية' : 'No visualizations yet'}
                  </p>
                </div>
              ) : null
              }
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}