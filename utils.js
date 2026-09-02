// 🛠️ توابع کمکی

class Utils {
  // تولید ID منحصر
  static generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // فرمت‌کردن تاریخ
  static formatDate(date) {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(date).toLocaleString('fa-IR', options);
  }

  // تبدیل به JSON
  static toJSON(obj) {
    return JSON.stringify(obj, null, 2);
  }

  // پارس JSON
  static parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return null;
    }
  }

  // Hash رمز عبور (ساده)
  static hashPassword(password) {
    return btoa(password); // Base64 Encoding
  }

  // بررسی رمز عبور
  static verifyPassword(password, hash) {
    return btoa(password) === hash;
  }

  // تولید Token
  static generateToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
  }

  // اعتبارسنجی ایمیل
  static isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // اعتبارسنجی رمز عبور
  static isValidPassword(password) {
    return password.length >= 6;
  }

  // کپی به کلیپ‌بورد
  static copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('✅ کپی شد');
    }).catch(err => {
      console.error('❌ خطا در کپی:', err);
    });
  }

  // دانلود فایل
  static downloadFile(data, filename, type = 'application/json') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // اپلود فایل
  static uploadFile(accept = '.json') {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      };
      input.click();
    });
  }

  // تاخیر (Promise)
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // نمایش Alert
  static showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  }

  // محاسبه آمار
  static calculateStats(data) {
    return {
      total: data.length,
      lastUpdated: data.length > 0 ? data[data.length - 1].timestamp : null,
      average: data.reduce((a, b) => a + (b.value || 0), 0) / data.length
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}