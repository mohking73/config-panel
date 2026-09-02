# 🔧 Panel Config Pro v2.0

**یک پنل کانفیگ جامع، حرفه‌ای و مدرن برای مدیریت تنظیمات سیستم، پروفایل کاربر و امنیت**

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## ✨ ویژگی‌های اصلی

### 👤 مدیریت پروفایل
- ✅ ویرایش اطلاعات شخصی (نام، ایمیل، تلفن، شهر، کشور)
- ✅ آپلود تصویر پروفایل
- ✅ بیوگرافی و معلومات فردی
- ✅ نام کاربری منحصر به فرد

### 🔒 امنیت پیشرفته
- ✅ تغییر رمز عبور امن
- ✅ احراز هویت دو مرحله‌ای (2FA)
- ✅ هشدارهای ورود
- ✅ تاریخ ورود‌ها
- ✅ Audit Log کامل

### ⚙️ تنظیمات سیستم
- ✅ تغییر زبان (فارسی، انگلیسی، عربی، فرانسوی)
- ✅ انتخاب تم (روشن، تاریک، خودکار)
- ✅ منطقه زمانی سفارشی
- ✅ سایز فونت قابل تنظیم
- ✅ بروز‌رسانی خودکار
- ✅ آمار و تجزیه‌وتحلیل

### 🔔 اطلاعات رسانی
- ✅ اطلاعات ایمیل، پیامک و پوش
- ✅ خبرنامه و بروز‌رسانی‌ها
- ✅ ساعات بی‌سروصدا (Quiet Hours)
- ✅ فرکانس اطلاعات قابل تنظیم

### 🎨 تخصیص‌دهی (Preferences)
- ✅ انتخاب رنگ اصلی و فرعی
- ✅ تراکم رابط (Density)
- ✅ کنترل صدا
- ✅ تم‌های سفارشی

### 🛠️ ابزارهای کارآمد
- ✅ **Export** - دانلود تمام داده‌ها به JSON
- ✅ **Import** - بارگذاری داده‌های قبلی
- ✅ **Backup** - ایجاد نسخه پشتیبان
- ✅ **Audit Log** - تاریخ تمام تغییرات

### 📊 Dashboard مدیریتی
- ✅ آمار کاربران و فعالیت‌ها
- ✅ نمودارهای تعاملی (Chart.js)
- ✅ لیست کاربران با جزئیات
- ✅ تاریخ اخیر فعالیت‌ها
- ✅ مدیریت کاربران

### 🔐 احراز هویت
- ✅ سیستم ورود/ثبت‌نام
- ✅ رمزگذاری رمز عبور
- ✅ Session Management
- ✅ بررسی اعتبار ایمیل و رمز عبور

---

## 🚀 شروع سریع

### پیش‌نیازها
- مرورگر مدرن (Chrome, Firefox, Safari, Edge)
- اتصال اینترنت
- JavaScript فعال

### نصب

```bash
# کلون کردن
git clone https://github.com/mohking73/config-panel.git
cd config-panel

# باز کردن
py -m http.server 8000

# یا
python -m http.server 8000
```

### استفاده

1. **ثبت‌نام**
   - به صفحه ثبت‌نام بروید
   - نام، ایمیل، رمز عبور وارد کنید
   - روی "ثبت‌نام" کلیک کنید

2. **ورود**
   - ایمیل و رمز عبور وارد کنید
   - روی "ورود" کلیک کنید

3. **پروفایل**
   - اطلاعات شخصی خود را تکمیل کنید
   - تصویر پروفایل آپلود کنید
   - "ذخیره تغییرات" را بزنید

4. **امنیت**
   - رمز عبور قدیمی و جدید وارد کنید
   - 2FA را فعال کنید
   - تنظیمات هشدار را مدیریت کنید

5. **تنظیمات**
   - زبان، تم، منطقه زمانی را انتخاب کنید
   - سایز فونت و دیگر گزینه‌ها را تنظیم کنید

6. **اطلاعات**
   - روش‌های اطلاع‌رسانی را فعال/غیرفعال کنید
   - ساعات بی‌سروصدا را تعیین کنید

7. **Dashboard**
   - آمار و نمودارها را مشاهده کنید
   - لیست کاربران را ببینید
   - فعالیت‌ها را دنبال کنید

---

## 📁 ساختار پروژه

```
config-panel/
├── index.html          # صفحه اصلی
├── auth.html          # صفحه ورود/ثبت‌نام
├── dashboard.html     # صفحه مدیریت
├── styles.css         # طراحی کامل
├── config.js          # تنظیمات
├── utils.js           # توابع کمکی
├── database.js        # مدیریت داده‌ها (LocalStorage)
├── auth.js            # سیستم احراز هویت
├── app.js             # منطق اصلی
├── dashboard.js       # منطق Dashboard
├── export.js          # Export/Import
├── .gitignore         # فایل‌های نادیده
├── package.json       # متادیتا پروژه
├── _config.yml        # تنظیمات GitHub Pages
└── README.md          # این فایل
```

---

## 🛠️ تکنولوژی‌های استفاده شده

- **HTML5** - نشانه‌گذاری
- **CSS3** - طراحی و انیمیشن
- **Vanilla JavaScript** - منطق و تعامل
- **Chart.js** - نمودارهای تعاملی
- **LocalStorage** - ذخیره‌سازی محلی
- **GitHub Pages** - میزبانی رایگان

---

## 📊 نمودارها و آمار

### Dashboard شامل:
- 📈 نمودار خطی فعالیت‌ها
- 🍰 نمودار دایره‌ای انواع عملیات
- 📋 لیست فعالیت‌های اخیر
- 👥 لیست و مدیریت کاربران
- 📊 آمار استفاده و ذخیره‌سازی

---

## 🔐 امنیت

### رمزگذاری
- رمز عبور با Base64 encoding ذخیره می‌شود
- Session Token برای احراز هویت
- بررسی اعتبار هر دسترسی

### خصوصی‌سازی
- داده‌ها فقط در LocalStorage محلی ذخیره می‌شود
- هیچ داده‌ای به سرور ارسال نمی‌شود
- هر کاربر فقط داده‌های خود را می‌بیند

---

## 💾 Backup و Restore

### Backup ایجاد کردن:
1. به بخش "ابزارها" بروید
2. روی "Backup" کلیک کنید
3. فایل JSON دانلود می‌شود

### Restore کردن:
1. روی "وارد کردن داده‌ها" کلیک کنید
2. فایل JSON را انتخاب کنید
3. داده‌ها بازیابی می‌شود

---

## 🎯 نقشه راه (Roadmap)

- [ ] Native Mobile App
- [ ] Cloud Sync (Firebase)
- [ ] Multi-device Support
- [ ] API REST
- [ ] Role-Based Access Control
- [ ] Advanced Audit Reports
- [ ] Integration with Third-party Services
- [ ] Dark Mode Toggle
- [ ] PWA Support

---

## 🐛 گزارش مشکلات

اگر مشکل یا باگی پیدا کردید، لطفاً [Issue](https://github.com/mohking73/config-panel/issues) ایجاد کنید.

---

## 🤝 همکاری

واگذاری‌های خوش‌آمدند! لطفاً:

1. Repo را Fork کنید
2. Branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را Commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. Pull Request باز کنید

---

## 📝 لایسنس

این پروژه تحت لایسنس [MIT](LICENSE) است.

---

## 👤 نویسنده

**mohking73**

- GitHub: [@mohking73](https://github.com/mohking73)
- Email: anasnji39@gmail.com

---

## 🙏 تشکر و قدردانی

تشکر از استفاده از Panel Config Pro!

---

## 📱 لینک‌های مهم

| موضوع | لینک |
|------|------|
| 🌐 پنل آنلاین | [https://mohking73.github.io/config-panel/](https://mohking73.github.io/config-panel/) |
| 📁 Repository | [https://github.com/mohking73/config-panel](https://github.com/mohking73/config-panel) |
| 📚 مستندات | [README.md](README.md) |
| 🐛 مشکلات | [Issues](https://github.com/mohking73/config-panel/issues) |
| ⭐ Stars | [به ستاره دادن](https://github.com/mohking73/config-panel/stargazers) |

---

## 📈 آمار پروژه

```
Language: JavaScript, HTML, CSS
Total Lines: 3500+
Files: 12
Functions: 150+
Status: Active Development
```

---

**ساخته شده با ❤️ توسط mohking73**

*آخرین بروز‌رسانی: 2026-09-02*
