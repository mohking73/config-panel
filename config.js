// ⚙️ تنظیمات پروژه
const CONFIG = {
  APP_NAME: 'Panel Config Pro',
  VERSION: '2.0.0',
  STORAGE_KEY: 'configPanelData',
  USERS_KEY: 'configPanelUsers',
  AUDIT_KEY: 'configPanelAudit',
  SESSION_KEY: 'configPanelSession',
  
  // تنظیمات
  SETTINGS: {
    maxUsers: Infinity,
    maxStorage: 'unlimited',
    autoBackup: true,
    backupInterval: 24 * 60 * 60 * 1000, // هر 24 ساعت
    sessionTimeout: 30 * 60 * 1000, // 30 دقیقه
  },
  
  // رنگ‌های طراحی
  COLORS: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    dark: '#1f2937',
    light: '#f9fafb',
  },
  
  // صفحات
  PAGES: {
    HOME: 'index.html',
    DASHBOARD: 'dashboard.html',
    AUTH: 'auth.html',
  }
};

// صادرات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}