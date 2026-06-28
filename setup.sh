#!/bin/bash

# =========================================================================
# PressHouse CMS - بيت الصحافة - خطوة التهيئة والتشغيل والربط السحابي (2026)
# =========================================================================
# يدعم هذا السكربت الإعداد السريع للتشغيل المحلي والنشر على Vercel و Railway.
# =========================================================================

set -e

# الألوان للتنسيق البصري
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}   بيت الصحافة - نظام إدارة المحتوى والأنشطة الرائدة   ${NC}"
echo -e "${GREEN}        PressHouse CMS - Setup & Diagnostics       ${NC}"
echo -e "${BLUE}===================================================${NC}"

# 1. التحقق من وجود Node.js و npm
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}[!] بيئة تشغيل Node.js غير موجودة. يرجى تثبيتها أولاً.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}[✓] تم العثور على Node.js: ${NODE_VERSION}${NC}"

# 2. تثبيت الحزم
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}[~] جاري تثبيت حزم الاعتمادات البرمجية (NPM packages)...${NC}"
    npm install
else
    echo -e "${GREEN}[✓] الحزم البرمجية مثبتة بالفعل.${NC}"
fi

# 3. إعداد ملف متغيرات البيئة .env
if [ ! -f ".env" ]; then
    echo -e "${BLUE}[~] إنشاء ملف البيئة الافتراضي .env من القالب...${NC}"
    cp .env.example .env
    echo -e "${GREEN}[✓] تم إنشاء ملف .env بنجاح. يرجى ضبط المفاتيح فيه.${NC}"
else
    echo -e "${GREEN}[✓] ملف .env موجود ومثبت بالفعل.${NC}"
fi

# 4. تهيئة مجلد الرفع ومكتبة الوسائط
echo -e "${BLUE}[~] جاري إنشاء مجلدات التخزين ومكتبة الوسائط الذاتية...${NC}"
mkdir -p uploads/images
mkdir -p uploads/videos
mkdir -p uploads/audio
mkdir -p uploads/documents
chmod -R 755 uploads

echo -e "${GREEN}[✓] تم إعداد مجلدات التخزين بنجاح.${NC}"

# 5. بناء المشروع للتحقق النهائي
echo -e "${BLUE}[~] جاري بناء النظام والتأكد من عدم وجود أي فجوات تجميعية...${NC}"
npm run build

echo -e "${GREEN}===================================================${NC}"
echo -e "${GREEN}  تمت التهيئة بنجاح! جاهز للتشغيل والربط السحابي.    ${NC}"
echo -e "${GREEN}===================================================${NC}"
echo -e "للشروع في التشغيل المحلي (Development):"
echo -e "   ${BLUE}npm run dev${NC}"
echo -e ""
echo -e "للنشر السحابي على ${GREEN}Railway${NC}:"
echo -e "   1. قم بربط مستودع GitHub بـ Railway."
echo -e "   2. أضف متغيرات البيئة من .env.example في صفحة إعدادات Railway."
echo -e "   3. سيقوم Railway ببناء وتشغيل النظام تلقائياً عبر منفذ PORT: 3000 الداخلي."
echo -e ""
echo -e "للنشر السحابي على ${GREEN}Vercel${NC}:"
echo -e "   1. قم بتثبيت Vercel CLI أو ربط حساب GitHub بـ Vercel."
echo -e "   2. أضف المتغير POSTGRES_URL من قاعدة بيانات Supabase أو Neon."
echo -e "   3. نفذ الأمر: vercel --prod"
echo -e "==================================================="
