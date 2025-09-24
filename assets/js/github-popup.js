class GitHubFollowPopup {
    constructor() {
        this.isVisible = false;
        this.countdown = 10;
        this.countdownInterval = null;
        this.autoCloseTimeout = null;
        this.hasShownPopup = false;
        this.userEngagement = {
            timeSpent: 0,
            scrollDepth: 0,
            interactions: 0,
            hasScrolled: false,
            startTime: Date.now()
        };
        
        this.init();
    }

    init() {
        this.trackUserEngagement();
        this.startEngagementCheck();
    }

    trackUserEngagement() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                const newScrollDepth = (scrollTop + windowHeight) / documentHeight;
                
                this.userEngagement.scrollDepth = Math.max(
                    this.userEngagement.scrollDepth,
                    newScrollDepth
                );
                this.userEngagement.hasScrolled = true;
            }, 100);
        });

        ['click'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                this.userEngagement.interactions++;
            }, { passive: true });
        });

        setInterval(() => {
            this.userEngagement.timeSpent = Date.now() - this.userEngagement.startTime;
        }, 1000);
    }

    startEngagementCheck() {
        this.engagementCheckInterval = setInterval(() => {
            this.checkEngagementConditions();
        }, 2000);
    }

    checkEngagementConditions() {
        if (this.hasShownPopup) {
            clearInterval(this.engagementCheckInterval);
            return;
        }

        const timeSpentSeconds = this.userEngagement.timeSpent / 1000;
        const scrollDepthPercent = this.userEngagement.scrollDepth * 100;
        
        const conditions = {
            timeAndScroll: timeSpentSeconds >= 10 && scrollDepthPercent >= 25,
            deepScroll: scrollDepthPercent >= 90,
            activeEngagement: this.userEngagement.interactions >= 3 && timeSpentSeconds >= 5,
            longVisit: timeSpentSeconds >= 20
        };

        const shouldShow = Object.values(conditions).some(condition => condition);
        
        if (shouldShow) {
            this.show();
        }
    }

    async show() {
        if (this.isVisible || this.hasShownPopup) {
            return;
        }
        
        this.isVisible = true;
        this.hasShownPopup = true;
        
        if (this.engagementCheckInterval) {
            clearInterval(this.engagementCheckInterval);
        }
        
        await this.createPopupElement();
        this.startCountdown();
        
        this.autoCloseTimeout = setTimeout(() => {
            this.hide();
        }, 10000);
    }

    hide() {
        if (!this.isVisible) {
            return;
        }
        
        this.isVisible = false;
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
        }
        if (this.engagementCheckInterval) {
            clearInterval(this.engagementCheckInterval);
        }
        
        const popup = document.getElementById('github-follow-popup');
        if (popup) {
            popup.remove();
        }
    }

    startCountdown() {
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            
            const countdownElement = document.getElementById('countdown-timer');
            if (countdownElement) {
                countdownElement.textContent = `${this.countdown}s`;
            }
            
            if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
            }
        }, 1000);
    }

    async createPopupElement() {
        const popup = document.createElement('div');
        popup.id = 'github-follow-popup';
        popup.className = 'github-popup-overlay';

        try {
            const response = await fetch('/assets/github-popup.html');
            let html = await response.text();
            
            // Заменяем плейсхолдеры
            html = html.replace('${this.countdown}', this.countdown);
            
            popup.innerHTML = html;
        } catch (error) {
            console.error('Failed to load popup HTML:', error);
            return;
        }
        
        // Add click handler for overlay to close
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.hide();
            }
        });
        
        // Add click handler for GitHub button
        const followBtn = popup.querySelector('.github-follow-btn');
        followBtn.addEventListener('click', () => {
            // Track click for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'github_follow_popup_click', {
                    event_category: 'engagement',
                    event_label: 'popup_github_follow'
                });
            }
        });
        
        document.body.appendChild(popup);
        
        requestAnimationFrame(() => {
            popup.classList.add('github-popup-show');
        });
    }
}

// Load CSS file
function loadPopupStyles() {
    if (!document.getElementById('github-popup-styles')) {
        const link = document.createElement('link');
        link.id = 'github-popup-styles';
        link.rel = 'stylesheet';
        link.href = '/assets/css/github-popup.css';
        document.head.appendChild(link);
    }
}

// Initialize popup on page load
let githubPopup;

document.addEventListener('DOMContentLoaded', () => {
    loadPopupStyles();
    githubPopup = new GitHubFollowPopup();
    window.githubPopup = githubPopup;
});

window.GitHubFollowPopup = GitHubFollowPopup;