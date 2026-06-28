# 🚀 دليل النشر والتهيئة السحابية لمنصة بيت الصحافة (Production Deployment Guide)

يرشدك هذا الدليل لكيفية نشر نظام **بيت الصحافة** لمرصد الحريات الصحفية على الخوادم والمنصات السحابية الإنتاجية لضمان الاستقرار التام، والسرعة الفائقة، وتفعيل الأمان السيادي لجميع الخدمات وبوابات المدخلات.

---

## 🗺️ خيارات الهندسة السحابية ونماذج النشر (Deployment Models)
تمت هندسة البنية الخلفية بدقة لتدعم نمطين أساسيين من النشر السحابي بموثوقية كاملة:

### الخيار الأول: النشر السحابي الهجين (Cloud Run / VPS Host) - *الخيار الموصى به*
في هذا النمط، يعمل الخادم بوضعية Full-Stack (الواجهات وبوابة الـ API في خادم موحد متكامل)، وهو الخيار الأفضل لإدارة الاتصالات الفورية لبوت تلغرام الرصد، ومكتبة الوسائط، وعمليات رفع المستندات الكبيرة لرفع البلاغات والمناقصات.

### الخيار الثاني: النشر السحابي الموزع (Vercel Serverless + Supabase Database)
نمط نشر فائق السرعة وخالٍ من الخوادم الثابتة (Serverless Architecture)، حيث يتم نشر الواجهة الأمامية (Vite Client SPA) مباشرة على شبكة توزيع كوكب فيرسل (Vercel Edge Network)، ويتم توجيه بوابة الـ API لتستجيب لخدمات الحوسبة السحابية المؤقتة، مع ربطها بـ Supabase كقاعدة بيانات PostgreSQL سحابية.

---

## 📦 أولاً: التثبيت والنشر على خادم VPS مستقل (Ubuntu Server + Nginx)

### 1. المتطلبات الأولية لخادم الـ VPS:
* خادم يعمل بنظام **Ubuntu 22.04 LTS** أو **Ubuntu 24.04 LTS** فما فوق.
* عنوان IP ثابت وموجه (Public IP Address).
* نطاق إنترنت (Domain Name) موجه بنجاح للعنوان الخاص بالخادم عبر سجلات DNS (A Record).

### 2. تثبيت الحزم والمتطلبات على نظام Ubuntu:
قم بتسجيل الدخول للخادم عبر SSH ونفذ الأوامر التالية كمسؤول لتحديث وتثبيت محركات التشغيل الأساسية:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx build-essential sqlite3 certbot python3-certbot-nginx
```

تثبيت بيئة تشغيل **Node.js LTS (إصدار 20)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
```

### 3. تكوين مجلد الإنتاج وسحب الكود (Deploy Codebase):
أنشئ مجلداً مخصصاً للموقع تحت المسار القياسي لـ Nginx، واسحب كود المنصة:
```bash
sudo mkdir -p /var/www/presshouse
sudo chown -R $USER:$USER /var/www/presshouse
cd /var/www/presshouse
git clone https://github.com/presshouse-ye/presshouse-cms.git .
```

### 4. تثبيت حزم الـ Node وبناء ملفات الإنتاج (Build Assets):
قم بتهيئة الحزم وبناء الواجهات السحابية السريعة بكود الإنتاج النظيف:
```bash
npm install
npm run build
```

### 5. إعداد ملف البيئة السحابية للإنتاج:
انسخ ملف الإرشاد الافتراضي وعين مفاتيح التشغيل والـ JWT والمخازن السحابية بشكل محمي ومغلق:
```bash
cp .env.example .env
nano .env
```
*تأكد من ضبط `NODE_ENV=production` لضمان ضغط الواجهات، وسرعة معالجة الملفات والطلب.*

### 6. إعداد خادم Nginx كوكيل عكسي (Reverse Proxy):
أنشئ ملف تكوين مخصص لـ Nginx ليوجه حركة الويب القادمة على النطاق الخارجي للنظام الداخلي العامل على منفذ 3000:
```bash
sudo nano /etc/nginx/sites-available/presshouse
```

انسخ التكوين التالي مع استبدال `yourdomain.com` بنطاقك الفعلي:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 100M;
    }
}
```

قم بتنشيط التكوين واختبار جودة Nginx قبل إعادة تحميل الخدمة:
```bash
sudo ln -s /etc/nginx/sites-available/presshouse /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 7. تهيئة وخدمة تشغيل الـ Systemd لضمان استمرار العمل:
لضمان عمل النظام بالخلفية بشكل مستمر ودائم، وإعادة تشغيله تلقائياً حتى في حالة انقطاع الطاقة أو إعادة تشغيل الخادم، قم بتكوين ملف الخدمة:
```bash
sudo nano /etc/systemd/system/presshouse.service
```

أضف الإعدادات التالية بدقة:
```ini
[Unit]
Description=PressHouse Media System and Safety Observatory
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/presshouse
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/var/www/presshouse/.env

[Install]
WantedBy=multi-user.target
```

قم بتحديث مدير الخدمات السحابية وبدء تشغيل الخدمة ومراقبة الحالة:
```bash
sudo systemctl daemon-reload
sudo systemctl enable presshouse
sudo systemctl start presshouse
sudo systemctl status presshouse
```

### 8. تأمين الموقع وإصدار شهادة SSL مجانية (Enable HTTPS):
استخدم أداة Certbot لإصدار وتثبيت شهادة أمان مجانية وتوجيه حركة الويب للتشفير التلقائي:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
*سيقوم Certbot بتعديل ملف Nginx تلقائياً وضبط الـ SSL وتنشيط النشر الآمن.*

---

## ☁️ ثانياً: النشر والربط بقاعدة بيانات PostgreSQL (Supabase / Neon)
إذا أردت ربط النظام بقاعدة بيانات PostgreSQL سحابية متقدمة بدلاً من SQLite المحلية:

1. افتح حسابك على [Supabase](https://supabase.com) أو [Neon](https://neon.tech) وأنشئ مشروعاً جديداً.
2. انتقل لصفحة الإعدادات سريعة الربط (Database Connections) وانسخ رابط الاتصال (Connection String) المخصص للـ URI.
3. افتح ملف الكواليس `.env` على خادمك وعيّن المتغير `POSTGRES_URL` بالرابط المنسوخ:
   ```env
   POSTGRES_URL=postgresql://postgres:your_secure_password@db.supabase.co:5432/postgres?sslmode=require
   ```
4. أعد تشغيل خدمة بيت الصحافة لتبدأ طبقة الاتصال برصد توفر Postgres وبدء إنشاء جداول الإنتاج بشكل آلي فوري:
   ```bash
   sudo systemctl restart presshouse
   ```

---

## 🛠️ أوامر الصيانة والمراقبة للإنتاج (Maintenance CLI Commands)
* **لمتابعة سجلات تشغيل النظام بشكل مباشر**:
  ```bash
  sudo journalctl -u presshouse -f
  ```
* **لإعادة تشغيل النظام يدوياً بعد إجراء أي تعديلات برمجية**:
  ```bash
  sudo systemctl restart presshouse
  ```
* **لمراقبة استهلاك الموارد للخادم**:
  ```bash
  top
  ```

---

*تحديث وتأمين: قسم تكنولوجيا المعلومات والأمن السحابي - بيت الصحافة اليمني 2026م.*
