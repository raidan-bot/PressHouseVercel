import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { api } from '../services/api';

// UI Components
import {
  PageHero,
  Button,
  Card,
  CardBody,
  ScrollReveal,
} from '../components/ui';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/api/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(isRtl ? 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: isRtl ? 'البريد الإلكتروني' : 'Email',
      content: 'info@presshouse.org',
      href: 'mailto:info@presshouse.org',
    },
    {
      icon: <Phone size={24} />,
      title: isRtl ? 'الهاتف' : 'Phone',
      content: '+967 1 234 567',
      href: 'tel:+9671234567',
    },
    {
      icon: <MapPin size={24} />,
      title: isRtl ? 'العنوان' : 'Address',
      content: isRtl ? 'صنعاء، اليمن' : 'Sana\'a, Yemen',
      href: '#',
    },
    {
      icon: <Clock size={24} />,
      title: isRtl ? 'ساعات العمل' : 'Working Hours',
      content: isRtl ? 'السبت - الخميس: 9:00 - 17:00' : 'Sat - Thu: 9:00 AM - 5:00 PM',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title={isRtl ? 'تواصل معنا' : 'Contact Us'}
        description={isRtl ? 'تواصل مع بيت الصحافة للاستفسارات والاقتراحات' : 'Contact Press House for inquiries and suggestions'}
        type="website"
      />

      <PageHero
        title={isRtl ? 'تواصل معنا' : 'Contact Us'}
        subtitle={isRtl 
          ? 'نحن هنا للاستماع إليك. تواصل معنا لأي استفسار أو اقتراح.' 
          : 'We are here to listen. Contact us for any inquiry or suggestion.'}
        size="md"
        pattern="dots"
        className="mt-20"
      />

      <section className="container mx-auto px-4 py-12">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card variant="elevated" className="order-2 lg:order-1">
              <CardBody className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {isRtl ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent!'}
                    </h3>
                    <p className="text-slate-500">
                      {isRtl ? 'سنقوم بالرد عليك في أقرب وقت ممكن.' : 'We will get back to you as soon as possible.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {isRtl ? 'الاسم' : 'Name'}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {isRtl ? 'البريد الإلكتروني' : 'Email'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {isRtl ? 'الموضوع' : 'Subject'}
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {isRtl ? 'الرسالة' : 'Message'}
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={submitting}
                      icon={<Send size={18} />}
                      className="w-full"
                    >
                      {isRtl ? 'إرسال الرسالة' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>

            {/* Contact Info */}
            <div className="order-1 lg:order-2 space-y-6">
              {contactInfo.map((info, index) => (
                <ScrollReveal key={index} direction="right" delay={index * 0.1}>
                  <a
                    href={info.href}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{info.title}</h3>
                      <p className="text-slate-500">{info.content}</p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
