import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [settings, setSettings] = useState<any>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        if (response.data && Object.keys(response.data).length > 0) {
          const s = response.data;
          setSettings({
            ...s,
            siteName: typeof s.siteName === 'string' ? JSON.parse(s.siteName) : s.siteName,
            socialLinks: typeof s.socialLinks === 'string' ? JSON.parse(s.socialLinks) : s.socialLinks,
            address: typeof s.address === 'string' ? JSON.parse(s.address) : s.address,
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="fixed top-6 left-0 right-0 z-[100] flex justify-between items-start px-6 pointer-events-none">
      <div className="flex-1 flex justify-start">
        {/* Left side empty or could have another component */}
      </div>
      
      <div className="flex-1 flex justify-end items-start gap-4">
        {userId && (
          <div className="pointer-events-auto bg-white/40 backdrop-blur-xl border border-white/40 rounded-full p-2 shadow-2xl shadow-black/5 mt-2">
            <NotificationBell />
          </div>
        )}
        <div className="pointer-events-auto hidden lg:flex flex-col items-center justify-center">
          {settings?.logo ? (
            <img src={settings.logo} alt="Organization Logo" className="w-16 h-16 object-contain mb-1" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-1">
              <span className="font-black text-slate-900 text-lg">PH</span>
            </div>
          )}
          <div className="text-center">
            <div className="font-black text-slate-900 text-[10px] leading-tight">بيت الصحافة</div>
            <div className="font-black text-slate-900 text-[10px] leading-tight tracking-wide">Press House</div>
          </div>
        </div>
      </div>
    </header>
  );
}
