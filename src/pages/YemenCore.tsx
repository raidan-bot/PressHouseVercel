import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Search, Network, User, Building2, MapPin } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { PageHero } from '../components/ui/PageHero';
import { Card } from '../components/ui/Card';

export default function YemenCore() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEntity, setActiveEntity] = useState(null);

  const entities = [
    { id: '1', name: 'Ahmed Ali', type: 'person', mentions: 245, sentiment: 0.8 },
    { id: '2', name: 'Sanaa', type: 'location', mentions: 892, sentiment: -0.3 },
    { id: '3', name: 'UNICEF', type: 'organization', mentions: 156, sentiment: 0.9 },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'person': return User;
      case 'location': return MapPin;
      case 'organization': return Building2;
      default: return User;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO title="YemenCore - Knowledge Graph" />
      
      <PageHero
        title={isRtl ? 'يمن كور' : 'YemenCore'}
        subtitle={isRtl ? 'رسم بياني للمعرفة' : 'Knowledge Graph'}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRtl ? 'بحث عن كيان...' : 'Search entities...'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </Card>

            {/* Entity List */}
            <div className="space-y-3">
              {entities.map((entity) => {
                const Icon = getIcon(entity.type);
                return (
                  <motion.div
                    key={entity.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveEntity(entity)}
                  >
                    <Card className={`p-4 cursor-pointer transition-colors ${activeEntity?.id === entity.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Icon size={20} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{entity.name}</p>
                          <p className="text-xs text-slate-500">{entity.mentions} mentions</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${entity.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Graph View */}
          <div className="lg:col-span-2">
            <Card className="p-8 min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Network size={64} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-medium">
                  {isRtl ? 'مخطط العلاقات' : 'Entity Network Graph'}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {isRtl ? 'اختر كياناً لعرض العلاقات' : 'Select an entity to view relationships'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}