// 📊 Dashboard

class Dashboard {
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
        this.loadDashboardData();
        this.initCharts();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
    }

    setupEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => auth.logout());
        document.getElementById('clearAuditBtn')?.addEventListener('click', () => this.clearAudit());
        document.getElementById('closeAuditModal')?.addEventListener('click', () => this.closeModal('auditModal'));
        document.getElementById('closeUserModal')?.addEventListener('click', () => this.closeModal('userModal'));
        document.getElementById('deleteUserBtn')?.addEventListener('click', () => this.deleteUser());
    }

    loadDashboardData() {
        const users = this.db.getUsers();
        const audits = this.db.getAudit();
        const data = this.db.getAll();

        // Update stats
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalAudit').textContent = audits.length;

        // Storage size
        const storageSize = JSON.stringify(data).length / 1024; // KB
        document.getElementById('storageUsed').textContent = storageSize.toFixed(2) + ' KB';

        // Last activity
        const lastAudit = audits[audits.length - 1];
        const lastActivityEl = document.getElementById('lastActivity');
        if (lastAudit) {
            lastActivityEl.textContent = Utils.formatDate(new Date(lastAudit.timestamp));
        }

        // Load users table
        this.loadUsersTable(users);

        // Load activities
        this.loadActivities(audits);
    }

    loadUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">هیچ کاربری ثبت‌نام نشده است</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name || '-'}</td>
                <td>${user.email}</td>
                <td><span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">${user.role || 'user'}</span></td>
                <td>${Utils.formatDate(new Date(user.createdAt))}</td>
                <td><button class="action-btn" onclick="dashboard.viewUser('${user.id}')">مشاهده</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    loadActivities(audits) {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';

        if (audits.length === 0) {
            activityList.innerHTML = '<p style="text-align: center; color: #6b7280;">هیچ فعالیتی ثبت نشده است</p>';
            return;
        }

        audits.slice(-10).reverse().forEach(audit => {
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-item';
            activityEl.innerHTML = `
                <div class="activity-item-time">${audit.formattedTime}</div>
                <div class="activity-item-message">${audit.message}</div>
            `;
            activityList.appendChild(activityEl);
        });
    }

    initCharts() {
        const audits = this.db.getAudit();

        // Activity Chart
        const activityCtx = document.getElementById('activityChart')?.getContext('2d');
        if (activityCtx) {
            const last7Days = this.getLast7Days();
            const activityData = last7Days.map(date => {
                const count = audits.filter(a => 
                    new Date(a.timestamp).toDateString() === new Date(date).toDateString()
                ).length;
                return count;
            });

            new Chart(activityCtx, {
                type: 'line',
                data: {
                    labels: last7Days.map(d => Utils.formatDate(new Date(d)).split(' ')[0]),
                    datasets: [{
                        label: 'فعالیت‌ها',
                        data: activityData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Action Chart
        const actionCtx = document.getElementById('actionChart')?.getContext('2d');
        if (actionCtx) {
            const actions = {};
            audits.forEach(audit => {
                actions[audit.action] = (actions[audit.action] || 0) + 1;
            });

            new Chart(actionCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(actions),
                    datasets: [{
                        data: Object.values(actions),
                        backgroundColor: [
                            '#6366f1',
                            '#8b5cf6',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#3b82f6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }
    }

    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }

    updateTime() {
        const now = new Date();
        document.getElementById('dashboardTime').textContent = Utils.formatDate(now);
    }

    viewUser(userId) {
        const users = this.db.getUsers();
        const user = users.find(u => u.id === userId);

        if (user) {
            const modal = document.getElementById('userModal');
            const content = document.getElementById('userModalContent');

            content.innerHTML = `
                <div style="padding: 0;">
                    <h3>${user.name}</h3>
                    <p><strong>ایمیل:</strong> ${user.email}</p>
                    <p><strong>نقش:</strong> ${user.role}</p>
                    <p><strong>تاریخ ثبت:</strong> ${Utils.formatDate(new Date(user.createdAt))}</p>
                    <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
                    <details>
                        <summary style="cursor: pointer; font-weight: 600; color: #6366f1;">جزئیات بیشتر</summary>
                        <pre style="margin-top: 1rem; background: #f9fafb; padding: 1rem; border-radius: 6px; overflow: auto;">${JSON.stringify(user, null, 2)}</pre>
                    </details>
                </div>
            `;

            this.currentUserId = userId;
            modal.classList.add('show');
        }
    }

    deleteUser() {
        if (confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
            this.db.deleteUser(this.currentUserId);
            this.closeModal('userModal');
            this.loadDashboardData();
            this.showAlert('✅ کاربر حذف شد', 'success');
        }
    }

    clearAudit() {
        if (confirm('آیا مطمئن هستید؟ این عمل قابل بازگشت نیست!')) {
            this.db.clearAudit();
            this.loadDashboardData();
            this.showAlert('✅ لیست تاریخ تغییرات خالی شد', 'success');
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer') || document.body;
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = 'position: fixed; top: 100px; left: 2rem; right: 2rem; padding: 1rem 1.5rem; border-radius: 6px; z-index: 999;';
        alert.textContent = message;
        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Initialize dashboard
const dashboard = new Dashboard();
