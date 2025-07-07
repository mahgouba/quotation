# دليل النشر - Vehicle Quotation System

## تقسيم المشروع

تم تقسيم المشروع إلى قسمين منفصلين لسهولة النشر والإدارة:

### 📁 Backend (الباك إند)
- **المجلد:** `backend/`
- **التقنيات:** Node.js, Express, TypeScript, PostgreSQL
- **الغرض:** API server وإدارة قاعدة البيانات
- **منصة النشر المقترحة:** Render.com

### 📁 Frontend (الفرونت إند)  
- **المجلد:** `frontend/`
- **التقنيات:** React, TypeScript, Vite, Tailwind CSS
- **الغرض:** واجهة المستخدم
- **منصة النشر المقترحة:** GitHub Pages / Vercel / Netlify

---

## 🚀 نشر الباك إند على Render

### الخطوة 1: إعداد المستودع
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/yourusername/vehicle-quotation-backend.git
git push -u origin main
```

### الخطوة 2: إنشاء خدمة على Render
1. اذهب إلى [render.com](https://render.com)
2. انقر على "New +" ← "Web Service"
3. اربط مستودع GitHub الخاص بالباك إند
4. املأ الإعدادات:
   - **Name:** `vehicle-quotation-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` أو حسب الحاجة

### الخطوة 3: إعداد متغيرات البيئة
في Render Dashboard، أضف المتغيرات التالية:
```
DATABASE_URL=postgresql://your_neon_db_url
SESSION_SECRET=your-super-secret-key
FRONTEND_URL=https://yourusername.github.io/vehicle-quotation-frontend
NODE_ENV=production
PORT=5000
```

### الخطوة 4: النشر
- Render سيقوم بالنشر تلقائياً عند push إلى GitHub
- ستحصل على URL مثل: `https://vehicle-quotation-api.onrender.com`

---

## 🌐 نشر الفرونت إند على GitHub Pages

### الخطوة 1: إعداد المستودع
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/yourusername/vehicle-quotation-frontend.git
git push -u origin main
```

### الخطوة 2: إعداد متغيرات البيئة
أنشئ ملف `.env` في مجلد frontend:
```env
VITE_API_URL=https://vehicle-quotation-api.onrender.com
```

### الخطوة 3: إعداد GitHub Pages
1. اذهب إلى إعدادات المستودع في GitHub
2. انقر على "Pages" في القائمة الجانبية
3. اختر "GitHub Actions" كمصدر
4. أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: https://vehicle-quotation-api.onrender.com
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### الخطوة 4: النشر
- push التغييرات إلى GitHub
- سيتم النشر تلقائياً على: `https://yourusername.github.io/vehicle-quotation-frontend`

---

## 🔄 بديل: نشر الفرونت إند على Vercel

### الخطوة 1: ربط المستودع
1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على "New Project"
3. اربط مستودع GitHub الخاص بالفرونت إند

### الخطوة 2: إعداد متغيرات البيئة
في Vercel Dashboard:
```
VITE_API_URL=https://vehicle-quotation-api.onrender.com
```

### الخطوة 3: النشر
- Vercel سينشر تلقائياً عند push إلى GitHub
- ستحصل على URL مثل: `https://vehicle-quotation-frontend.vercel.app`

---

## 🔄 بديل: نشر الفرونت إند على Netlify

### الخطوة 1: ربط المستودع
1. اذهب إلى [netlify.com](https://netlify.com)
2. انقر على "New site from Git"
3. اربط مستودع GitHub الخاص بالفرونت إند

### الخطوة 2: إعدادات البناء
```
Build command: npm run build
Publish directory: dist
```

### الخطوة 3: إعداد متغيرات البيئة
```
VITE_API_URL=https://vehicle-quotation-api.onrender.com
```

---

## 📋 قائمة التحقق للنشر

### الباك إند ✅
- [ ] رفع الكود إلى GitHub
- [ ] إنشاء خدمة على Render
- [ ] إعداد متغيرات البيئة
- [ ] التأكد من عمل قاعدة البيانات
- [ ] اختبار API endpoints

### الفرونت إند ✅
- [ ] رفع الكود إلى GitHub
- [ ] إعداد متغيرات البيئة
- [ ] اختيار منصة النشر (GitHub Pages/Vercel/Netlify)
- [ ] إعداد CI/CD
- [ ] اختبار الواجهة مع API

### الاختبار النهائي ✅
- [ ] تجربة إنشاء عرض سعر
- [ ] تجربة حفظ البيانات
- [ ] تجربة تصدير PDF
- [ ] تجربة إدارة البيانات
- [ ] التأكد من عمل النظام على الأجهزة المختلفة

---

## 🛠️ الصيانة والتحديث

### تحديث الباك إند
```bash
cd backend
# إجراء التغييرات المطلوبة
git add .
git commit -m "Update: description"
git push origin main
# Render سيقوم بالنشر تلقائياً
```

### تحديث الفرونت إند
```bash
cd frontend
# إجراء التغييرات المطلوبة
git add .
git commit -m "Update: description"
git push origin main
# المنصة ستقوم بالنشر تلقائياً
```

---

## 🔗 روابط مفيدة

- [Render Documentation](https://render.com/docs)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## 🆘 حل المشاكل الشائعة

### مشكلة CORS
إذا واجهت مشاكل CORS، تأكد من:
- إعداد `FRONTEND_URL` في الباك إند بشكل صحيح
- استخدام `credentials: 'include'` في الفرونت إند

### مشكلة قاعدة البيانات
- تأكد من صحة `DATABASE_URL`
- تشغيل `npm run db:push` لتحديث Schema

### مشكلة البناء
- تأكد من وجود جميع المتغيرات البيئية
- فحص logs في منصة النشر