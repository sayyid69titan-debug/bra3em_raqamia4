# براعم رقمية — نسخة جاهزة لـ Vercel

هذه النسخة حُوّلت إلى موقع Static يعمل على Vercel بدون Express أو SQLite.

## التشغيل المحلي
npm run dev

## الرفع على Vercel
ارفع المجلد كما هو. Vercel سيستخدم:
- Build Command: `npm run build`
- Output Directory: `public`

تم تحويل حفظ التقدم إلى LocalStorage داخل المتصفح حتى يعمل على الاستضافة المجانية بدون قاعدة بيانات.
