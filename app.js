// ==========================================
// مدیریت وضعیت (State Management)
// ==========================================

const ConfigState = {
    profile: {
        fullName: '',
        email: '',
        phone: '',
        bio: ''
    },
    security: {
        twoFactor: false,
        loginAlerts: true
    },
    system: {
        language: 'fa',
        theme: 'light',
        timezone: 'Asia/Tehran',
        autoUpdate: true,
        analytics: true
    },
    notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        notifyFrequency: 'instant',
        quietStart: '22:00',
        quietEnd: '08:00'
    }
};

// ==========================================
// توابع ذخیره‌سازی داده‌ها (LocalStorage)
// ==========================================

const Storage = {
    // ذخیره تمام داده‌ها
    saveAll: () => {
        localStorage.setItem('configPanelData', JSON.stringify(ConfigState));
    },

    // بارگذاری تمام داده‌ها
    loadAll: () => {
        const saved = localStorage.getItem('configPanelData');
        if (saved) {
            Object.assign(ConfigState, JSON.parse(saved));
        }
    },

    // ذخیره بخش خاص
    saveSection: (section, data) => {
        ConfigState[section] = data;
        Storage.saveAll();
    },

    // بارگذاری بخش خاص
    loadSection: (section) => {
        return ConfigState[section] || {};
    }
};

// ==========================================
// API Calls (شبیه‌سازی)
// ==========================================

const API = {
    // ذخیره داده‌ها در سرور (شبیه‌سازی)
    async saveConfig(section, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`✅ ${section} saved:`, data);
                resolve({ success: true, message: `${section} با موفقیت ذخیره شد` });
            }, 800);
        });
    },

    // بارگذاری داده‌ها از سرور (شبیه‌سازی)
    async loadConfig(section) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(ConfigState[section]);
            }, 500);
        });
    },

    // تغییر رمز عبور
    async changePassword(currentPassword, newPassword) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // شبیه‌سازی تایید رمز عبور
                if (currentPassword.length >= 6 && newPassword.length >= 6) {
                    resolve({ success: true, message: 'رمز عبور با موفقیت تغییر یافت' });
                } else {
                    reject({ success: false, message: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
                }
            }, 1000);
        });
    },

    // فعال‌سازی احراز هویت دو مرحله‌ای
    async enableTwoFactor() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    message: 'احراز هویت دو مرحله‌ای فعال شد',
                    qrCode: 'https://via.placeholder.com/200'
                });
            }, 1000);
        });
    }
};

// ==========================================
// مدیریت رابط کاربری (UI Management)
// ==========================================

const UI = {
    // نمایش بخش
    showSection: (sectionId) => {
        // پنهان کردن تمام بخش‌ها
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // نمایش بخش انتخابی
        document.getElementById(sectionId).classList.add('active');

        // به‌روزرسانی لینک‌های ناویگیشن
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // بارگذاری داده‌های بخش
        UI.loadFormData(sectionId);
    },

    // نمایش پیام موفقیت
    showSuccess: (message = 'تغییرات با موفقیت ذخیره شد!') => {
        const messageEl = document.getElementById('successMessage');
        messageEl.textContent = '✅ ' + message;
        messageEl.style.display = 'block';
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    },

    // نمایش پیام خطا
    showError: (message = 'خطا در ذخیره تغییرات!') => {
        const messageEl = document.getElementById('errorMessage');
        messageEl.textContent = '❌ ' + message;
        messageEl.style.display = 'block';
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    },

    // بارگذاری داده‌های فرم
    loadFormData: (sectionId) => {
        const form = document.getElementById(sectionId + 'Form');
        if (!form) return;

        const section = sectionId;
        const data = ConfigState[section];

        if (data) {
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = data[key];
                    } else {
                        field.value = data[key];
                    }
                }
            });
        }
    },

    // جمع‌آوری داده‌های فرم
    collectFormData: (form) => {
        const data = {};
        const formData = new FormData(form);

        for (let [key, value] of formData.entries()) {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && field.type === 'checkbox') {
                data[key] = field.checked;
            } else {
                data[key] = value;
            }
        }

        return data;
    },

    // به‌روزرسانی ظاهر رنگین
    setTheme: (theme) => {
        document.documentElement.style.setProperty('--primary-color', 
            theme === 'dark' ? '#818cf8' : '#6366f1'
        );
    }
};

// ==========================================
// مدیریت فرم‌ها (Form Handlers)
// ==========================================

const FormHandlers = {
    // ذخیره پروفایل کاربر
    handleProfileSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = UI.collectFormData(form);

        try {
            await API.saveConfig('profile', data);
            Storage.saveSection('profile', data);
            UI.showSuccess('پروفایل با موفقیت به‌روزرسانی شد');
        } catch (error) {
            UI.showError('خطا در به‌روزرسانی پروفایل');
        }
    },

    // ذخیره تنظیمات امنیتی
    handleSecuritySubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const currentPassword = form.querySelector('#currentPassword').value;
        const newPassword = form.querySelector('#newPassword').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;

        // بررسی تطابق رمز عبور
        if (newPassword !== confirmPassword) {
            UI.showError('رمز عبورها مطابقت ندارند');
            return;
        }

        try {
            // اگر رمز عبور جدید وارد شده باشد
            if (newPassword) {
                await API.changePassword(currentPassword, newPassword);
            }

            const data = UI.collectFormData(form);
            delete data.currentPassword;
            delete data.newPassword;
            delete data.confirmPassword;

            await API.saveConfig('security', data);
            Storage.saveSection('security', data);
            UI.showSuccess('تنظیمات امنیتی با موفقیت به‌روزرسانی شد');
            
            // پاک کردن فیلدهای رمز عبور
            form.reset();
        } catch (error) {
            UI.showError(error.message || 'خطا در به‌روزرسانی تنظیمات امنیتی');
        }
    },

    // ذخیره تنظیمات سیستم
    handleSystemSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = UI.collectFormData(form);

        try {
            // اعمال تم
            if (data.theme) {
                UI.setTheme(data.theme);
            }

            await API.saveConfig('system', data);
            Storage.saveSection('system', data);
            UI.showSuccess('تنظیمات سیستم با موفقیت ذخیره شد');
        } catch (error) {
            UI.showError('خطا در ذخیره تنظیمات سیستم');
        }
    },

    // ذخیره تنظیمات اطلاعات رسانی
    handleNotificationsSubmit: async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = UI.collectFormData(form);

        try {
            await API.saveConfig('notifications', data);
            Storage.saveSection('notifications', data);
            UI.showSuccess('تنظیمات اطلاعات رسانی با موفقیت ذخیره شد');
        } catch (error) {
            UI.showError('خطا در ذخیره تنظیمات اطلاعات رسانی');
        }
    }
};

// ==========================================
// مقداردهی اولیه (Initialization)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // بارگذاری داده‌های ذخیره‌شده
    Storage.loadAll();

    // تنظیم مدیریت‌کنندگان فرم‌ها
    const profileForm = document.getElementById('profileForm');
    const securityForm = document.getElementById('securityForm');
    const systemForm = document.getElementById('systemForm');
    const notificationsForm = document.getElementById('notificationsForm');

    if (profileForm) {
        profileForm.addEventListener('submit', FormHandlers.handleProfileSubmit);
    }
    if (securityForm) {
        securityForm.addEventListener('submit', FormHandlers.handleSecuritySubmit);
    }
    if (systemForm) {
        systemForm.addEventListener('submit', FormHandlers.handleSystemSubmit);
    }
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', FormHandlers.handleNotificationsSubmit);
    }

    // تنظیم مدیریت‌کنندگان ناویگیشن
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            UI.showSection(section);
        });
    });

    // نمایش بخش پروفایل به طور پیش‌فرض
    UI.showSection('profile');

    // اعمال تنظیمات سیستم
    if (ConfigState.system.theme) {
        UI.setTheme(ConfigState.system.theme);
    }
});

// ==========================================
// توابع کمکی (Utility Functions)
// ==========================================

// تایید خروج اگر تغییرات ذخیره نشده باشند
window.addEventListener('beforeunload', (e) => {
    // می‌تواند به وسیله ردیابی تغییرات بهتر شود
});

// خروجی برای مقاصد debugging
console.log('🔧 Panel Konfigurasi Loaded');
console.log('💾 Data State:', ConfigState);