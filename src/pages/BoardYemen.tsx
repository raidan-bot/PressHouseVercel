import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MapPin, Layers } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PageHero } from '../components/ui/PageHero';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { boardYemenService } from '../services/boardYemen';

export default function BoardYemen() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [activeLayer, setActiveLayer] = useState('all');
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const data = await boardYemenService.getMarkers();
        setMarkers(data);
      } catch (error) {
        console.error('Error loading map:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkers();
  }, []);

  const layers = [
    { id: 'all', label: isRtl ? 'الكل' : 'All', color: 'bg-blue-600' },
    { id: 'conflict', label: isRtl ? 'نزاع' : 'Conflict', color: 'bg-red-600' },
    { id: 'humanitarian', label: isRtl ? 'إنساني' : 'Humanitarian', color: 'bg-amber-600' },
    { id: 'development', label: isRtl ? 'تنمية' : 'Development', color: 'bg-green-600' },
    { id: 'environmental', label: isRtl ? 'بيئي' : 'Environmental', color: 'bg-cyan-600' },
  ];

  const filteredMarkers = activeLayer === 'all' 
    ? markers 
    : markers.filter(m => m.type === activeLayer);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="BoardYemen - Interactive Map" />
      
      <PageHero
        title={isRtl ? 'خارطة اليمن' : 'BoardYemen'}
        subtitle={isRtl ? 'خريطة تفاعلية للأحداث' : 'Interactive Map of Yemen'}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Layer Controls */}
        <div className="flex flex-wrap gap-2 mb-8">
          {layers.map((layer) => (
            <Button
              key={layer.id}
              variant={activeLayer === layer.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveLayer(layer.id)}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${layer.color}`} />
              {layer.label}
            </Button>
          ))}
        </div>

        {/* Map Container */}
        <Card className="relative overflow-hidden min-h-[600px] bg-slate-100">
          {loading ? (
            <div className="flex items-center justify-center h-full py-32">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative w-full h-[600px] bg-slate-200 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-500 font-medium">
                    {isRtl ? 'الخريطة التفاعلية' : 'Interactive Map'}
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    {filteredMarkers.length} {isRtl ? 'علامة' : 'markers'}
                  </p>
                </div>
              </div>

              {filteredMarkers.slice(0, 5).map((marker, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"
                  style={{
                    top: `${20 + (index * 15)}%`,
                    left: `${20 + (index * 10)}%`,
                  }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {layers.slice(1).map((layer) => {
            const count = markers.filter(m => m.type === layer.id).length;
            return (
              <Card key={layer.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                  <div>
                    <p className="text-2xl font-black text-slate-900">{count}</p>
                    <p className="text-sm text-slate-500">{layer.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}