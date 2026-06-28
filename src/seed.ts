import pool from './db';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    // 1. Seed Site Settings
    const [settings] = await pool.query('SELECT COUNT(*) as count FROM site_settings');
    const settingsCount = (settings as any)[0]?.count || 0;
    
    if (settingsCount == 0) {
      await pool.query(`
        INSERT INTO site_settings (
          siteName, contactEmail, socialLinks, livestream,
          aiEnabled, aiModel, aiBaseUrl, aiApiKey, aiTemperature, aiMaxTokens, aiSystemInstruction,
          s3Enabled, s3Provider
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        JSON.stringify({ ar: 'بيت الصحافة - اليمن', en: 'Press House - Yemen' }),
        'info@ph-ye.org',
        JSON.stringify({ twitter: '', facebook: '', youtube: '', telegram: '', whatsapp: '' }),
        JSON.stringify({ enabled: false, platform: 'youtube', url: '' }),
        1,
        'nvidia/qwen-2.5-coder-32b-instruct',
        'https://integrate.api.nvidia.com/v1',
        '',
        0.3,
        1524,
        'أنت مساعد ذكي لمنصة بيت الصحافة، هدفك هو تقديم تحليلات وملخصات للمشاريع والفعاليات والأخبار والتنبيهات الأمنية لحماية الصحفيين اليمنيّين.',
        0,
        'custom'
      ]);
      console.log('Seeded site_settings.');
    }

    // 2. Seed Default Users
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const usersCount = (users as any)[0]?.count || 0;

    if (usersCount == 0) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'samah@2052024';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const defaultUsers = [
        { uid: 'root-uid-1', email: 'raidan@ph-ye.org', password_hash: hashedPassword, displayName: 'Root Administrator', role: 'root' },
        { uid: 'admin-uid-1', email: 'admin@ph-ye.org', password_hash: hashedPassword, displayName: 'System Admin', role: 'admin' },
        { uid: 'newsletter-uid', email: 'no-replay@ph-ye.org', password_hash: hashedPassword, displayName: 'Newsletter Sender', role: 'system' },
        { uid: 'register-uid', email: 'register@ph-ye.org', password_hash: hashedPassword, displayName: 'System Registration', role: 'system' },
        { uid: 'assistant-uid', email: 'assistant@ph-ye.org', password_hash: hashedPassword, displayName: 'AI Assistant', role: 'bot' }
      ];

      for (const u of defaultUsers) {
        await pool.query('INSERT INTO users (uid, email, password_hash, displayName, role) VALUES (?, ?, ?, ?, ?)', 
          [u.uid, u.email, u.password_hash, u.displayName, u.role]);
      }
      console.log('Seeded default users.');
    }

    // 3. Seed YemenJPT Watchlists
    const [watchlists] = await pool.query('SELECT COUNT(*) as count FROM jpt_watchlists');
    const watchlistsCount = (watchlists as any)[0]?.count || 0;

    if (watchlistsCount == 0) {
      const defaultWatchlist = [
        { id: 'wl-1', type: 'journalist', name: 'عدنان الراجحي', notes: 'صحفي مستقل - عدن' },
        { id: 'wl-2', type: 'journalist', name: 'نبيل الصصيصي', notes: 'مراسل ميداني - تعز' },
        { id: 'wl-3', type: 'journalist', name: 'أشواق اليمني', notes: 'صحفية وناشطة حقوقية' },
        { id: 'wl-4', type: 'organization', name: 'تلفزيون اليمن اليوم', notes: 'مؤسسة إعلامية محلية' },
        { id: 'wl-5', type: 'organization', name: 'صحيفة عدن الغد', notes: 'صحيفة وموقع إخباري مستقل' },
        { id: 'wl-6', type: 'keyword', name: 'اعتقال', notes: 'القبض والاحتجاز والاعتقال التعسفي' },
        { id: 'wl-7', type: 'keyword', name: 'اختطاف', notes: 'الاختطاف والإخفاء القسري والملاحقة' },
        { id: 'wl-8', type: 'keyword', name: 'اعتداء', notes: 'الضرب والاعتداء الجسدي والتهديد بالسلاح' },
        { id: 'wl-9', type: 'location', name: 'تعز', notes: 'منطقة ذات مخاطر رصد عالية' },
        { id: 'wl-10', type: 'location', name: 'عدن', notes: 'منطقة رصد رئيسية لانتهاك الحريات' }
      ];
      for (const item of defaultWatchlist) {
        await pool.query('INSERT INTO jpt_watchlists (id, type, name, notes) VALUES (?, ?, ?, ?)', [item.id, item.type, item.name, item.notes]);
      }
      console.log('Seeded YemenJPT default watchlists.');
    }

  } catch (error: any) {
    console.error('Database seeding error:', error.message);
  }
};
