/**
 * Notifications System
 * Manages notifications display and interactions
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 20;
        this.init();
    }

    init() {
        this.loadNotifications();
        this.setupEventListeners();
        this.updateBadge();
        
        // Add some welcome notifications
        if (this.notifications.length === 0) {
            this.addNotification(
                'Welcome!',
                'Welcome to Ehacking School. Check out our courses and start learning!',
                'success'
            );
        }
    }

    setupEventListeners() {
        const notificationBtn = document.getElementById('notificationBtn');
        const clearBtn = document.getElementById('clearNotifications');
        const dropdown = document.getElementById('notificationDropdown');

        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllNotifications();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdown && !dropdown.contains(e.target) && !notificationBtn?.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Listen for notification events from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'notifications') {
                this.loadNotifications();
                this.renderNotifications();
                this.updateBadge();
            }
        });
    }

    addNotification(title, message, type = 'info', icon = null) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type, // 'info', 'success', 'warning', 'error'
            icon,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(notification);

        // Keep only recent notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        this.saveNotifications();
        this.renderNotifications();
        this.updateBadge();

        // Show toast notification
        this.showToast(title, message, type);

        return notification;
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveNotifications();
        this.renderNotifications();
        this.updateBadge();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.renderNotifications();
            this.updateBadge();
        }
    }

    clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            this.notifications = [];
            this.saveNotifications();
            this.renderNotifications();
            this.updateBadge();
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        this.notifications = saved ? JSON.parse(saved) : [];
    }

    updateBadge() {
        const badge = document.getElementById('notificationCount');
        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.textContent = '';
                badge.style.display = 'none';
            }
        }
    }

    renderNotifications() {
        const list = document.getElementById('notificationsList');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<p class="empty-message">No notifications</p>';
            return;
        }

        list.innerHTML = this.notifications.map(notif => {
            const timeAgo = this.getTimeAgo(new Date(notif.timestamp));
            const icon = this.getIconForType(notif.type);
            const readClass = notif.read ? '' : 'unread';

            return `
                <div class="notification-item ${readClass}" data-id="${notif.id}">
                    <div class="notification-item-title">
                        ${icon} ${notif.title}
                    </div>
                    <div class="notification-item-message">
                        ${notif.message}
                    </div>
                    <div class="notification-item-time">
                        ${timeAgo}
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
            });
        });
    }

    getTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return date.toLocaleDateString();
    }

    getIconForType(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    toggleDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
            
            // Mark all visible notifications as read when opened
            if (dropdown.classList.contains('show')) {
                this.notifications.forEach(n => n.read = true);
                this.saveNotifications();
                this.updateBadge();
                this.renderNotifications();
            }
        }
    }

    closeDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    showToast(title, message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${this.getToastBgColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 350px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;

        toast.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
        `;

        // Add animation
        const style = document.createElement('style');
        if (!document.querySelector('style[data-toast-animations]')) {
            style.setAttribute('data-toast-animations', 'true');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    getToastBgColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }

    // Public methods for external use
    success(title, message) {
        return this.addNotification(title, message, 'success');
    }

    error(title, message) {
        return this.addNotification(title, message, 'error');
    }

    warning(title, message) {
        return this.addNotification(title, message, 'warning');
    }

    info(title, message) {
        return this.addNotification(title, message, 'info');
    }
}

// Initialize notifications system when DOM is ready
let notificationSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationSystem = new NotificationSystem();
    });
} else {
    notificationSystem = new NotificationSystem();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
