# براعم رقمية

npm install
npm start

## الرفع على Vercel

المشروع جاهز للرفع على Vercel كتطبيق Express مع ملفات ثابتة داخل `public`.

### الطريقة الأسهل

1. ارفع مجلد المشروع إلى GitHub.
2. افتح Vercel واختر `Add New Project`.
3. اختر مستودع المشروع.
4. اترك الإعدادات الافتراضية كما هي.
5. اضغط `Deploy`.

### أو من Vercel CLI

```bash
npm install
npm i -g vercel
vercel
vercel --prod
```

ملاحظة: حفظ التقدم على Vercel يستخدم مساحة مؤقتة في الخادم مع حفظ احتياطي داخل متصفح المستخدم. إذا احتاج صاحب المشروع حفظًا دائمًا لكل الطلاب لاحقًا، اربط المشروع بقاعدة بيانات مثل Vercel Postgres أو Supabase.
