// 🎯 برنامه اصلی

class App {
    constructor() {
        this.user = auth.getCurrentUser();
        this.db = db;
        this.init();
    }

    init() {
        if (!this.user) {
            window.location.href = 'auth.html';
            return;
        }

        this.setupEventListeners();
        this.loadUserData();
        this.updateUI();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Forms
        document.getElementById('profileForm')?.addEventListener('submit', (e) => this.handleProfileSubmit(e));
        document.getElementById('securityForm')?.addEventListener('submit', (e) => this.handleSecuritySubmit(e));
        document.getElementById('systemForm')?.addEventListener('submit', (e) => this.handleSystemSubmit(e));
        document.getElementById('notificationsForm')?.addEventListener('submit', (e) => this.handleNotificationsSubmit(e));

        // Tools
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('importBtn')?.addEventListener('click', () => this.importData());
        document.getElementById('backupBtn')?.addEventListener('click', () => this.backup());
        document.getElementById('auditBtn')?.addEventListener('click', () => this.showAuditLog());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => auth.logout());

        // Preferences
        document.getElementById('primaryColor')?.addEventListener('change', (e) => this.applyTheme('primary', e.target.value));
        document.getElementById('secondaryColor')?.addEventListener('change', (e) => this.applyTheme('secondary', e.target.value));
        document.getElementById('density')?.addEventListener('change', (e) => this.setDensity(e.target.value));
        document.getElementById('soundToggle')?.addEventListener('change', (e) => this.toggleSound(e.target.checked));

        // Avatar upload
        document.getElementById('avatarInput')?.addEventListener('change', (e) => this.handleAvatarUpload(e));

        // Modals
        document.getElementById('closeAuditModal')?.addEventListener('click', () => this.closeAuditModal());
    }

    loadUserData() {
        const profile = this.db.getSection('profile') || {};
        const security = this.db.getSection('security') || {};
        const system = this.db.getSection('system') || {};
        const notifications = this.db.getSection('notifications') || {};

        // Load profile
        if (document.getElementById('profileForm')) {
            document.querySelector('[name="fullName"]').value = profile.fullName || this.user.name || '';
            document.querySelector('[name="username"]').value = profile.username || '';
            document.querySelector('[name="email"]').value = this.user.email || '';
            document.querySelector('[name="phone"]').value = profile.phone || '';
            document.querySelector('[name="city"]').value = profile.city || '';
            document.querySelector('[name="country"]').value = profile.country || '';
            document.querySelector('[name="bio"]').value = profile.bio || '';
        }

        // Load security
        if (document.getElementById('securityForm')) {
            document.querySelector('[name="twoFactorAuth"]').checked = security.twoFactorAuth || false;
            document.querySelector('[name="loginAlerts"]').checked = security.loginAlerts !== false;
        }

        // Load system
        if (document.getElementById('systemForm')) {
            document.querySelector('[name="language"]').value = system.language || 'fa';
            document.querySelector('[name="theme"]').value = system.theme || 'light';
            document.querySelector('[name="timezone"]').value = system.timezone || 'Asia/Tehran';
            document.querySelector('[name="fontSize"]').value = system.fontSize || 'medium';
            document.querySelector('[name="autoUpdate"]').checked = system.autoUpdate !== false;
            document.querySelector('[name="analytics"]').checked = system.analytics !== false;
        }

        // Load notifications
        if (document.getElementById('notificationsForm')) {
            document.querySelector('[name="emailNotifications"]').checked = notifications.emailNotifications !== false;
            document.querySelector('[name="emailNewsletter"]').checked = notifications.emailNewsletter !== false;
            document.querySelector('[name="emailUpdates"]').checked = notifications.emailUpdates !== false;
            document.querySelector('[name="smsNotifications"]').checked = notifications.smsNotifications || false;
            document.querySelector('[name="pushNotifications"]').checked = notifications.pushNotifications !== false;
            document.querySelector('[name="notifyFrequency"]').value = notifications.notifyFrequency || 'instant';
            document.querySelector('[name="quietStart"]').value = notifications.quietStart || '22:00';
            document.querySelector('[name="quietEnd"]').value = notifications.quietEnd || '08:00';
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.getAttribute('data-section');
        this.showSection(section);
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.config-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

        // Show selected section
        const sectionEl = document.getElementById(section);
        if (sectionEl) {
            sectionEl.classList.add('active');
            document.querySelector(`[data-section="${section}"]`).classList.add('active');
        }
    }

    handleProfileSubmit(e) {
        e.preventDefault();

        const profile = {
            fullName: document.querySelector('[name="fullName"]').value,
            username: document.querySelector('[name="username"]').value,
            phone: document.querySelector('[name="phone"]').value,
            city: document.querySelector('[name="city"]').value,
            country: document.querySelector('[name="country"]').value,
            bio: document.querySelector('[name="bio"]').value,
        };

        this.db.setSection('profile', profile);
        this.showAlert('✅ پروفایل با موفقیت ذخیره شد', 'success');
    }

    handleSecuritySubmit(e) {
        e.preventDefault();

        const currentPassword = document.querySelector('[name="currentPassword"]').value;
        const newPassword = document.querySelector('[name="newPassword"]').value;
        const confirmPassword = document.querySelector('[name="confirmPassword"]').value;

        if (newPassword && currentPassword) {
            const result = auth.changePassword(currentPassword, newPassword, confirmPassword);
            if (result.success) {
                this.showAlert(result.message, 'success');
                e.target.reset();
            } else {
                this.showAlert(result.message, 'error');
            }
        }

        const security = {
            twoFactorAuth: document.querySelector('[name="twoFactorAuth"]').checked,
            loginAlerts: document.querySelector('[name="loginAlerts"]').checked,
        };

        this.db.setSection('security', security);
    }

    handleSystemSubmit(e) {
        e.preventDefault();

        const system = {
            language: document.querySelector('[name="language"]').value,
            theme: document.querySelector('[name="theme"]').value,
            timezone: document.querySelector('[name="timezone"]').value,
            fontSize: document.querySelector('[name="fontSize"]').value,
            autoUpdate: document.querySelector('[name="autoUpdate"]').checked,
            analytics: document.querySelector('[name="analytics"]').checked,
        };

        this.db.setSection('system', system);
        this.applySystemSettings(system);
        this.showAlert('✅ تنظیمات سیستم ذخیره شد', 'success');
    }

    handleNotificationsSubmit(e) {
        e.preventDefault();

        const notifications = {
            emailNotifications: document.querySelector('[name="emailNotifications"]').checked,
            emailNewsletter: document.querySelector('[name="emailNewsletter"]').checked,
            emailUpdates: document.querySelector('[name="emailUpdates"]').checked,
            smsNotifications: document.querySelector('[name="smsNotifications"]').checked,
            pushNotifications: document.querySelector('[name="pushNotifications"]').checked,
            notifyFrequency: document.querySelector('[name="notifyFrequency"]').value,
            quietStart: document.querySelector('[name="quietStart"]').value,
            quietEnd: document.querySelector('[name="quietEnd"]').value,
        };

        this.db.setSection('notifications', notifications);
        this.showAlert('✅ تنظیمات اطلاعات رسانی ذخیره شد', 'success');
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const profile = this.db.getSection('profile') || {};
                profile.avatar = event.target.result;
                this.db.setSection('profile', profile);
                this.showAlert('✅ تصویر پروفایل ذخیره شد', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    exportData() {
        const backup = this.db.backup();
        const json = Utils.toJSON(backup);
        const filename = `config-panel-backup-${new Date().toISOString().split('T')[0]}.json`;
        Utils.downloadFile(json, filename);
        this.showAlert('✅ داده‌ها با موفقیت صادر شدند', 'success');
    }

    async importData() {
        try {
            const fileContent = await Utils.uploadFile('.json');
            const importData = Utils.parseJSON(fileContent);
            const result = this.db.import(importData);
            if (result.success) {
                this.showAlert('✅ ' + result.message, 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                this.showAlert('❌ ' + result.message, 'error');
            }
        } catch (error) {
            this.showAlert('❌ خطا در وارد کردن فایل', 'error');
        }
    }

    backup() {
        const backup = this.db.backup();
        const json = Utils.toJSON(backup);
        const filename = `config-panel-backup-${new Date().toISOString().split('T')[0]}.json`;
        Utils.downloadFile(json, filename);
        this.showAlert('✅ Backup ایجاد شد', 'success');
    }

    showAuditLog() {
        const auditModal = document.getElementById('auditModal');
        const auditList = document.getElementById('auditList');
        const audits = this.db.getAudit();

        auditList.innerHTML = '';
        if (audits.length === 0) {
            auditList.innerHTML = '<p style="text-align: center; color: #6b7280;">هیچ تغییری ثبت نشده است</p>';
        } else {
            audits.reverse().forEach(audit => {
                const auditEl = document.createElement('div');
                auditEl.className = 'audit-item';
                auditEl.innerHTML = `
                    <span class="audit-action">${audit.action}</span>
                    <p class="audit-time">${audit.formattedTime}</p>
                    <p class="audit-item-message">${audit.message}</p>
                `;
                auditList.appendChild(auditEl);
            });
        }

        auditModal.classList.add('show');
    }

    closeAuditModal() {
        document.getElementById('auditModal').classList.remove('show');
    }

    applyTheme(type, color) {
        const root = document.documentElement;
        if (type === 'primary') {
            root.style.setProperty('--color-primary', color);
        } else if (type === 'secondary') {
            root.style.setProperty('--color-secondary', color);
        }
    }

    setDensity(density) {
        const root = document.documentElement;
        if (density === 'compact') {
            root.style.setProperty('--spacing', '0.5rem');
        } else if (density === 'spacious') {
            root.style.setProperty('--spacing', '2rem');
        } else {
            root.style.setProperty('--spacing', '1rem');
        }
    }

    toggleSound(enabled) {
        localStorage.setItem('soundEnabled', enabled);
    }

    applySystemSettings(system) {
        document.documentElement.lang = system.language;
        document.documentElement.setAttribute('data-theme', system.theme);
    }

    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    updateUI() {
        // Update user info
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        if (userNameEl) userNameEl.textContent = this.user.name || 'کاربر';
        if (userEmailEl) userEmailEl.textContent = this.user.email;
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
    });
} else {
    const app = new App();
}
