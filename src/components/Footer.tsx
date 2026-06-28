import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Globe, ArrowUpRight, Heart, Newspaper, ShieldAlert, GraduationCap, Briefcase, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import NewsletterSubscription from './NewsletterSubscription';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const quickLinks = [
    { name: isRtl ? 'شروط الخدمة' : 'Terms of Service', path: '/terms', icon: FileText },
    { name: isRtl ? 'سياسة الخصوصية' : 'Privacy Policy', path: '/privacy', icon: ShieldCheck }
  ];

  const socialLinks = [
    { icon: Facebook, color: 'hover:text-blue-500', path: 'https://facebook.com/presshoue' },
    { icon: Twitter, color: 'hover:text-sky-400', path: 'https://twitter.com/presshoue' },
    { icon: Instagram, color: 'hover:text-pink-500', path: 'https://instagram.com/presshoue' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-32 md:pb-12 overflow-hidden relative border-t border-white/5">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-600/20">
                P
              </div>
              <div>
                <h2 className="text-white font-extrabold text-lg tracking-tight">بيت الصحافة</h2>
                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Press House Foundation</p>
              </div>
            </div>
            
            <p className="text-xs md:text-sm leading-relaxed text-slate-400/90 max-w-sm">
              {isRtl 
                ? "مؤسسة مجتمع مدني تهدف إلى تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين والصحفيات، وتبني قضاياهم والعمل على تطوير ودعم الصحافة في اليمن."
                : "A civil society organization aiming to promote media freedom and create a professional space for journalists, adopting their causes and supporting journalism in Yemen."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">{isRtl ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group flex items-center gap-2 hover:text-white transition-colors">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <link.icon size={10} />
                    </div>
                    <span className="text-xs md:text-sm font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">{isRtl ? "اتصل بنا" : "Contact Us"}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500 shrink-0">
                      <Mail size={14} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Email</div>
                      <a href="mailto:info@phye.org" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">info@phye.org</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500 shrink-0">
                      <Phone size={14} />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Phone</div>
                        <a href="tel:04210613" className="text-xs font-bold text-slate-300 hover:text-white transition-colors" dir="ltr">04-210613</a>
                      </div>
                      
                      <div className="flex gap-2">
                        {socialLinks.map((social, i) => (
                          <a 
                            key={i} 
                            href={social.path} 
                            className={`w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:bg-white/10 hover:scale-105`}
                          >
                            <social.icon size={12} />
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">{isRtl ? "النشرة البريدية" : "Newsletter"}</h3>
                <div className="scale-95 origin-top-left rtl:origin-top-right">
                  <NewsletterSubscription />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Press House. All rights reserved.</p>
            <div className="flex gap-3">
              <Link to="/terms" className="hover:text-white transition-colors">{isRtl ? 'شروط الخدمة' : 'Terms'}</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">{isRtl ? 'سياسة الخصوصية' : 'Privacy'}</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <p className="flex items-center gap-1">
              Powered by 
              <a href="https://raidan.pro" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">RaidanPro</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
