import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Zap, AlertTriangle, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PageHero } from '../components/ui/PageHero';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { taqiService } from '../services/taqi';

export default function TAQIDashboard() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await taqiService.getNewsStream();
        setNews(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'News Analyzed', value: '1,234', icon: Activity, color: 'blue' },
    { label: 'Avg. Credibility', value: '78%', icon: CheckCircle, color: 'green' },
    { label: 'Critical Alerts', value: '12', icon: AlertTriangle, color: 'red' },
    { label: 'Trending Topics', value: '45', icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="TAQI - News Intelligence" description="AI-powered news analysis and intelligence" />
      
      <PageHero
        title={isRtl ? 'تقى - الذكاء الإخباري' : 'TAQI - News Intelligence'}
        subtitle={isRtl ? 'تحليل الأخبار بالذكاء الاصطناعي' : 'AI-powered news analysis'}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon size={24} className={`text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* News Stream */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900">
            {isRtl ? 'آخر الأخبار' : 'Recent News'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">{isRtl ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 Cooperative bg-white rounded-2xl border border-slate-200">
              <Zap size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">{isRtl ? 'لا توجد أخبار حاليا' : 'No news available'}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {news.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={item.urgency === 'critical' ? 'danger' : 'warning'}>
                            {item.urgency}
                          </Badge>
                          <span className="text-xs text-slate-400">{item.timestamp}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 text-sm mb-3">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Source: {item.source}</span>
                          <span>Credibility: {item.credibility}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}