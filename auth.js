// 🔐 مدیریت احراز هویت

class Auth {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    // بررسی ورود کاربر
    if (!this.currentUser) {
      window.location.href = 'auth.html';
    }
  }

  // ثبت‌نام کاربر جدید
  register(name, email, password, passwordConfirm) {
    // اعتبارسنجی
    if (!Utils.isValidEmail(email)) {
      return { success: false, message: 'ایمیل نامعتبر' };
    }

    if (!Utils.isValidPassword(password)) {
      return { success: false, message: 'رمز عبور باید حداقل 6 کاراکتر باشد' };
    }

    if (password !== passwordConfirm) {
      return { success: false, message: 'رمز عبورها مطابقت ندارند' };
    }

    // بررسی تکراری
    if (db.getUserByEmail(email)) {
      return { success: false, message: 'این ایمیل قبلاً ثبت‌نام شده است' };
    }

    // ایجاد کاربر
    const user = db.createUser({
      name,
      email,
      password: Utils.hashPassword(password),
      role: 'user',
      createdAt: new Date(),
    });

    // ورود خودکار
    this.login(email, password);

    return { success: true, message: 'ثبت‌نام موفق', user };
  }

  // ورود کاربر
  login(email, password) {
    const user = db.getUserByEmail(email);

    if (!user) {
      return { success: false, message: 'کاربری با این ایمیل یافت نشد' };
    }

    if (!Utils.verifyPassword(password, user.password)) {
      return { success: false, message: 'رمز عبور نادرست' };
    }

    // ایجاد Session
    const session = {
      userId: user.id,
      email: user.email,
      token: Utils.generateToken(),
      loginTime: new Date(),
      lastActivity: new Date(),
    };

    localStorage.setItem(CONFIG.SESSION_KEY, Utils.toJSON(session));
    db.addAudit(`کاربر وارد شد: ${email}`, 'LOGIN', user.id);

    return { success: true, message: 'خوش‌آمدید', user };
  }

  // خروج کاربر
  logout() {
    const session = this.getCurrentSession();
    if (session) {
      db.addAudit(`کاربر خارج شد: ${session.email}`, 'LOGOUT', session.userId);
    }
    localStorage.removeItem(CONFIG.SESSION_KEY);
    window.location.href = 'auth.html';
  }

  // دریافت کاربر فعلی
  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;
    return db.getUserByEmail(session.email);
  }

  // دریافت Session
  getCurrentSession() {
    const session = localStorage.getItem(CONFIG.SESSION_KEY);
    return session ? Utils.parseJSON(session) : null;
  }

  // بررسی ورود
  isLoggedIn() {
    return !!this.getCurrentSession();
  }

  // تغییر رمز عبور
  changePassword(oldPassword, newPassword, newPasswordConfirm) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'کاربری وارد نشده' };

    if (!Utils.verifyPassword(oldPassword, user.password)) {
      return { success: false, message: 'رمز عبور فعلی نادرست' };
    }

    if (newPassword !== newPasswordConfirm) {
      return { success: false, message: 'رمز عبورهای جدید مطابقت ندارند' };
    }

    db.updateUser(user.id, {
      password: Utils.hashPassword(newPassword)
    });

    db.addAudit('رمز عبور تغییر یافت', 'CHANGE_PASSWORD', user.id);
    return { success: true, message: 'رمز عبور با موفقیت تغییر یافت' };
  }
}

const auth = new Auth();

// اگر در صفحه auth هستیم
if (window.location.pathname.includes('auth.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleBtn = document.getElementById('toggleBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    // تبدیل بین ورود و ثبت‌نام
    toggleBtn.addEventListener('click', () => {
      loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
      registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
      toggleBtn.textContent = loginForm.style.display === 'none' ? 'ورود کنید' : 'ثبت‌نام کنید';
      const p = toggleBtn.parentElement;
      p.innerHTML = loginForm.style.display === 'none' ? 
        'آیا حساب دارید؟ <a id="toggleBtn">ورود کنید</a>' : 
        'آیا حساب دارید؟ <a id="toggleBtn">ثبت‌نام کنید</a>';
      document.getElementById('toggleBtn').addEventListener('click', arguments.callee);
    });

    // فرم ورود
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const result = auth.login(email, password);
      if (result.success) {
        successMsg.textContent = '✅ ' + result.message;
        successMsg.style.display = 'block';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        errorMsg.textContent = '❌ ' + result.message;
        errorMsg.style.display = 'block';
      }
    });

    // فرم ثبت‌نام
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const passwordConfirm = document.getElementById('registerPassword2').value;
      
      const result = auth.register(name, email, password, passwordConfirm);
      if (result.success) {
        successMsg.textContent = '✅ ' + result.message;
        successMsg.style.display = 'block';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        errorMsg.textContent = '❌ ' + result.message;
        errorMsg.style.display = 'block';
      }
    });
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}