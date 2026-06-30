import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Share2, Video, Clock, ArrowRight, ExternalLink, Image as ImageIcon, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { api } from '../services/api';
import { ShareModal } from '../components/ShareModal';
import { SEO } from '../components/common/SEO';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { CardGridSkeleton } from '../components/common/Skeleton';
// UI Components
import {
  PageHero,
  Button,
  Card,
  CardBody,
  Badge,
  Pagination as UIPagination,
  EmptyState as UIEmptyState,
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
} from '../components/ui';

const PAGE_SIZE = 6;

export default function Events() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [shareEvent, setShareEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        const fetchedEvents = (response.data || []).map((doc: any) => ({
          ...doc,
          date: doc.event_date ? new Date(doc.event_date).toISOString().split('T')[0] : '',
          title: typeof doc.title === 'string' ? JSON.parse(doc.title) : doc.title,
          description: typeof doc.description === 'string' ? JSON.parse(doc.description) : doc.description,
          location: typeof doc.location === 'string' ? JSON.parse(doc.location) : doc.location,
          media: typeof doc.media === 'string' ? JSON.parse(doc.media) : doc.media
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => filter === 'all' || e.status === filter);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const ongoingEvent = events.find(e => e.isLive && e.liveStreamUrl);

  const handleShare = (event: Event) => {
    setShareEvent(event);
  };

  const seoTitle = isRtl ? 'فعاليات بيت الصحافة' : 'Press House Events';
  const seoDescription = isRtl 
    ? 'تابع أحدث الفعاليات، الندوات، والمؤتمرات التي ننظمها لتعزيز المشهد الإعلامي.' 
    : 'Follow the latest events, seminars, and conferences we organize to enhance the media landscape.';

  const filterOptions = [
    { value: 'all', label: isRtl ? 'الكل' : 'All' },
    { value: 'upcoming', label: isRtl ? 'القادمة' : 'Upcoming' },
    { value: 'ongoing', label: isRtl ? 'الحالية' : 'Ongoing' },
    { value: 'completed', label: isRtl ? 'السابقة' : 'Past' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={isRtl ? 'فعاليات اليمن, مؤتمرات الصحافة, ندوات حريات الإعلام' : 'yemen events, press conferences, media freedom seminars'}
        type="website"
      />
      <ShareModal 
        isOpen={!!shareEvent}
        onClose={() => setShareEvent(null)}
        title={shareEvent?.title[isRtl ? 'ar' : 'en'] || ''}
        url={window.location.origin + '/events/' + shareEvent?.id}
        description={shareEvent?.description[isRtl ? 'ar' : 'en']}
      />

      <PageHero
        title={isRtl ? 'فعاليات بيت الصحافة' : 'Press House Events'}
        subtitle={isRtl 
          ? 'تابع أحدث الفعاليات، الندوات، والمؤتمرات التي ننظمها لتعزيز المشهد الإعلامي.' 
          : 'Follow the latest events, seminars, and conferences we organize to enhance the media landscape.'}
        size="md"
        pattern="dots"
        className="mt-20"
      >
        <Badge variant="primary" size="lg" className="inline-flex items-center gap-2">
          <Calendar size={14} />
          {isRtl ? 'الفعاليات والمؤتمرات' : 'Events & Conferences'}
        </Badge>
      </PageHero>

      {/* Live Stream Section (Happening Now) */}
      <AnimatePresence>
        {ongoingEvent && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-600 py-12 relative overflow-hidden"
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest">
                    <Radio size={14} className="animate-pulse" />
                    {isRtl ? 'يحدث الآن' : 'Happening Now'}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    {ongoingEvent.title[isRtl ? 'ar' : 'en']}
                  </h2>
                  <p className="text-rose-100 text-lg">
                    {ongoingEvent.description[isRtl ? 'ar' : 'en']}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm font-bold">
                    <div className="flex items-center gap-2"><MapPin size={18} /> {ongoingEvent.location[isRtl ? 'ar' : 'en']}</div>
                    <div className="flex items-center gap-2"><Clock size={18} /> {new Date(ongoingEvent.date).toLocaleTimeString()}</div>
                  </div>
                  <div className="pt-4">
                    <Link 
                      to={`/events/${ongoingEvent.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all"
                    >
                      {isRtl ? 'عرض التفاصيل' : 'View Details'}
                      <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10 relative group">
                  {ongoingEvent.liveStreamUrl ? (
                    <iframe 
                      src={ongoingEvent.liveStreamUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={ongoingEvent.title[isRtl ? 'ar' : 'en']}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                      <Video size={64} />
                      <p className="font-bold">{isRtl ? 'البث المباشر سيبدأ قريباً' : 'Live stream starting soon'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filters */}
      <section className="container mx-auto px-4 py-12">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white rounded-2xl md:rounded-[32px] shadow-2xl shadow-slate-200/50 p-5 md:p-8 border border-slate-100">
            <SearchFilterBar
              filters={[{
                value: filter,
                onChange: (v) => { setFilter(v as any); setCurrentPage(1); },
                options: filterOptions,
              }]}
            />
          </div>
        </ScrollReveal>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : paginatedEvents.length > 0 ? (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedEvents.map((event) => (
                <StaggerItem key={event.id} direction="up">
                  <Card as="article" variant="elevated" padding="none" className="group h-full overflow-hidden rounded-3xl md:rounded-[40px]">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800'} 
                        alt={event.title[isRtl ? 'ar' : 'en']}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant={
                            event.status === 'upcoming' ? 'info' :
                            event.status === 'ongoing' ? 'danger' :
                            'neutral'
                          }
                          size="sm"
                          className="backdrop-blur-md"
                        >
                          {event.status === 'upcoming' ? (isRtl ? 'قادمة' : 'Upcoming') :
                           event.status === 'ongoing' ? (isRtl ? 'مباشر' : 'Live') :
                           (isRtl ? 'منتهية' : 'Completed')}
                        </Badge>
                      </div>
                    </div>

                    <CardBody className="p-8 space-y-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-600" />
                          {new Date(event.date).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-blue-600" />
                          {event.location[isRtl ? 'ar' : 'en']}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.title[isRtl ? 'ar' : 'en']}
                      </h3>

                      <p className="text-slate-500 line-clamp-3 text-sm leading-relaxed">
                        {event.description[isRtl ? 'ar' : 'en']}
                      </p>

                      <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Share2 size={16} />}
                          onClick={() => handleShare(event)}
                          className="rounded-xl"
                        />
                        <Link 
                          to={`/events/${event.id}`}
                          className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                        >
                          {isRtl ? 'التفاصيل' : 'Details'}
                          <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-12">
              <UIPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <UIEmptyState
            title={isRtl ? 'لا توجد فعاليات حالياً' : 'No Events Found'}
            description={isRtl ? 'يرجى مراجعة الصفحة لاحقاً لمتابعة أحدث فعالياتنا.' : 'Please check back later to follow our latest events.'}
            icon={<Calendar className="w-8 h-8" />}
          />
        )}
      </section>

      {/* Media Highlights Section */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 space-y-12">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  {isRtl ? 'المواد الإعلامية للفعاليات' : 'Event Media Highlights'}
                </h2>
                <p className="text-xl text-slate-500">
                  {isRtl ? 'لقطات وصور من أبرز فعالياتنا السابقة.' : 'Snapshots and photos from our most prominent past events.'}
                </p>
              </div>
              <Button variant="primary" size="md" icon={<ExternalLink size={20} />} iconPosition="right">
                {isRtl ? 'مشاهدة الكل' : 'View All Media'}
              </Button>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <StaggerItem key={i} direction="up">
                <div className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer">
                  <img 
                    src={`https://images.unsplash.com/photo-${[
                      '1504711434969-e33886168f5c',
                      '1495020689067-958852a7765e',
                      '1585829365294-bb7520c35c7a',
                      '1504711434969-e33886168f5c',
                      '1495020689067-958852a7765e',
                      '1585829365294-bb7520c35c7a',
                      '1504711434969-e33886168f5c',
                      '1495020689067-958852a7765e'
                    ][i-1]}?auto=format&fit=crop&q=80&w=600&h=600`} 
                    alt="Media" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {i % 3 === 0 ? <Video size={32} className="text-white" /> : <ImageIcon size={32} className="text-white" />}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
