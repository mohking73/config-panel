// 💾 مدیریت پایگاه داده محلی

class Database {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEY;
    this.usersKey = CONFIG.USERS_KEY;
    this.auditKey = CONFIG.AUDIT_KEY;
    this.init();
  }

  init() {
    if (!this.getAll()) {
      this.set({});
    }
  }

  // ذخیره داده
  set(data) {
    localStorage.setItem(this.storageKey, Utils.toJSON(data));
  }

  // بارگذاری داده
  getAll() {
    const data = localStorage.getItem(this.storageKey);
    return data ? Utils.parseJSON(data) : null;
  }

  // بارگذاری بخش خاص
  getSection(section) {
    const data = this.getAll();
    return data ? data[section] : null;
  }

  // ذخیره بخش
  setSection(section, value) {
    const data = this.getAll() || {};
    data[section] = value;
    this.set(data);
    this.addAudit(`بخش ${section} به‌روزرسانی شد`, 'UPDATE');
  }

  // حذف داده
  delete(key) {
    const data = this.getAll();
    delete data[key];
    this.set(data);
  }

  // مدیریت کاربران
  createUser(user) {
    let users = this.getUsers() || [];
    user.id = Utils.generateId();
    user.createdAt = new Date();
    users.push(user);
    localStorage.setItem(this.usersKey, Utils.toJSON(users));
    this.addAudit(`کاربر جدید: ${user.email}`, 'CREATE_USER');
    return user;
  }

  getUsers() {
    const users = localStorage.getItem(this.usersKey);
    return users ? Utils.parseJSON(users) : [];
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  updateUser(userId, updates) {
    let users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(this.usersKey, Utils.toJSON(users));
      this.addAudit(`کاربر به‌روزرسانی: ${userId}`, 'UPDATE_USER');
      return users[index];
    }
    return null;
  }

  deleteUser(userId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(this.usersKey, Utils.toJSON(users));
    this.addAudit(`کاربر حذف شد: ${userId}`, 'DELETE_USER');
  }

  // مدیریت Audit Log
  addAudit(message, action, userId = null) {
    let audits = this.getAudit() || [];
    audits.push({
      id: Utils.generateId(),
      message,
      action,
      userId,
      timestamp: new Date(),
      formattedTime: Utils.formatDate(new Date())
    });
    localStorage.setItem(this.auditKey, Utils.toJSON(audits));
  }

  getAudit() {
    const audit = localStorage.getItem(this.auditKey);
    return audit ? Utils.parseJSON(audit) : [];
  }

  clearAudit() {
    localStorage.setItem(this.auditKey, Utils.toJSON([]));
  }

  // Backup و Restore
  backup() {
    const backup = {
      data: this.getAll(),
      users: this.getUsers(),
      audit: this.getAudit(),
      timestamp: new Date(),
      version: CONFIG.VERSION
    };
    return backup;
  }

  restore(backup) {
    this.set(backup.data);
    localStorage.setItem(this.usersKey, Utils.toJSON(backup.users));
    localStorage.setItem(this.auditKey, Utils.toJSON(backup.audit));
    this.addAudit('Backup بازیابی شد', 'RESTORE');
  }

  // صادر کردن داده‌ها
  export() {
    return {
      version: CONFIG.VERSION,
      exportDate: new Date(),
      data: this.backup()
    };
  }

  // وارد کردن داده‌ها
  import(importData) {
    try {
      this.restore(importData.data);
      return { success: true, message: 'داده‌ها با موفقیت وارد شدند' };
    } catch (error) {
      return { success: false, message: 'خطا در واردکردن داده‌ها', error };
    }
  }

  // پاک‌کردن تمام داده‌ها
  clear() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.usersKey);
    localStorage.removeItem(this.auditKey);
    this.init();
  }
}

const db = new Database();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Database;
}