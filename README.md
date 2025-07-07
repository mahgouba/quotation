# نظام عرض الأسعار - Vehicle Quotation System

نظام شامل لإدارة عروض أسعار السيارات مع دعم كامل للغة العربية وإنتاج ملفات PDF احترافية.

## 🌟 المميزات الرئيسية

- 🚗 **إدارة عروض الأسعار**: إنشاء وحفظ وتعديل عروض أسعار شاملة للسيارات
- 📄 **إنتاج PDF احترافي**: تصدير عروض الأسعار بتصميم احترافي مع دعم كامل للعربية
- 🏢 **إدارة الشركات**: إدارة بيانات الشركات مع الشعارات والألوان والأختام
- 👥 **إدارة المندوبين**: تنظيم بيانات مندوبي المبيعات
- 🎨 **تخصيص PDF**: تحكم كامل في تصميم وألوان وخطوط ملفات PDF
- 🔍 **البحث المتقدم**: بحث وفلترة متقدمة للعروض المحفوظة
- 📱 **تصميم متجاوب**: يعمل بسلاسة على جميع الأجهزة
- 🌐 **دعم RTL**: دعم كامل للغة العربية وتخطيط من اليمين لليسار

## 🏗️ هيكل المشروع

تم تقسيم المشروع إلى قسمين منفصلين لسهولة النشر والإدارة:

### 📁 Backend (الباك إند)
```
backend/
├── src/
│   ├── index.ts         # نقطة بداية الخادم
│   ├── db.ts           # إعداد قاعدة البيانات
│   ├── schema.ts       # مخطط قاعدة البيانات
│   ├── storage.ts      # طبقة التخزين
│   └── routes.ts       # مسارات API
├── package.json        # إعدادات وحزم الباك إند
├── tsconfig.json       # إعدادات TypeScript
├── drizzle.config.ts   # إعدادات قاعدة البيانات
└── README.md          # دليل الباك إند
```

### 📁 Frontend (الفرونت إند)
```
frontend/
├── src/
│   ├── components/     # مكونات واجهة المستخدم
│   ├── pages/         # صفحات التطبيق
│   ├── lib/           # مساعدات ووظائف مساعدة
│   ├── hooks/         # React hooks مخصصة
│   └── data/          # بيانات ثابتة ومواصفات
├── package.json       # إعدادات وحزم الفرونت إند
├── vite.config.ts     # إعدادات Vite
├── tailwind.config.ts # إعدادات Tailwind CSS
└── README.md         # دليل الفرونت إند
```

## 🚀 التشغيل السريع

### المتطلبات الأساسية
- Node.js 18+ 
- PostgreSQL قاعدة بيانات (أو Neon Database)
- Git

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd vehicle-quotation-system
```

### 2. إعداد الباك إند
```bash
cd backend
npm install
cp .env.example .env
# قم بتحرير .env وإدخال بيانات قاعدة البيانات
npm run db:push
npm run dev
```

### 3. إعداد الفرونت إند
```bash
cd frontend
npm install
cp .env.example .env
# قم بتحرير .env وإدخال رابط الباك إند
npm run dev
```

### 4. فتح التطبيق
- الفرونت إند: http://localhost:3000
- الباك إند API: http://localhost:5000

## 🌐 النشر للإنتاج

للحصول على دليل شامل للنشر، راجع ملف [DEPLOYMENT.md](./DEPLOYMENT.md)

### نشر الباك إند على Render
1. رفع مجلد `backend/` إلى GitHub
2. ربطه بـ Render.com
3. إعداد متغيرات البيئة
4. النشر التلقائي

### نشر الفرونت إند على GitHub Pages/Vercel
1. رفع مجلد `frontend/` إلى GitHub  
2. إعداد CI/CD للنشر التلقائي
3. تحديث رابط API في متغيرات البيئة

## 🛠️ التقنيات المستخدمة

### الباك إند
- **Node.js & Express**: خادم API
- **TypeScript**: أمان الأنواع
- **Drizzle ORM**: إدارة قاعدة البيانات
- **PostgreSQL**: قاعدة البيانات
- **Passport.js**: المصادقة
- **Zod**: التحقق من صحة البيانات

### الفرونت إند
- **React 18**: مكتبة واجهة المستخدم
- **TypeScript**: أمان الأنواع
- **Vite**: أداة البناء
- **Tailwind CSS**: تصميم سريع
- **shadcn/ui**: مكونات عالية الجودة
- **TanStack Query**: إدارة حالة الخادم
- **jsPDF**: إنتاج ملفات PDF
- **React Hook Form**: إدارة النماذج

## 📊 قاعدة البيانات

النظام يستخدم PostgreSQL مع الجداول التالية:
- `companies` - بيانات الشركات
- `sales_representatives` - المندوبين
- `customers` - العملاء
- `vehicles` - السيارات
- `quotations` - عروض الأسعار
- `vehicle_specifications` - مواصفات السيارات
- `terms_and_conditions` - الشروط والأحكام
- `pdf_customization` - إعدادات تخصيص PDF

## 🔧 الإعدادات

### متغيرات البيئة للباك إند
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### متغيرات البيئة للفرونت إند
```env
VITE_API_URL=http://localhost:5000
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. تنفيذ التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. رفع التغييرات (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

إذا واجهت أي مشاكل أو كان لديك أسئلة:
1. تحقق من [DEPLOYMENT.md](./DEPLOYMENT.md) لحل المشاكل الشائعة
2. راجع ملفات README الخاصة بكل قسم
3. فتح issue في GitHub

---

**تم بناء هذا النظام خصيصاً للأسواق العربية مع دعم كامل للغة العربية وأفضل الممارسات في تطوير التطبيقات الحديثة.**