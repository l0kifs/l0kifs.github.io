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

    show() {
        if (this.isVisible || this.hasShownPopup) {
            return;
        }
        
        this.isVisible = true;
        this.hasShownPopup = true;
        
        if (this.engagementCheckInterval) {
            clearInterval(this.engagementCheckInterval);
        }
        
        this.createPopupElement();
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

    createPopupElement() {
        const popup = document.createElement('div');
        popup.id = 'github-follow-popup';
        popup.className = 'github-popup-overlay';
        
        popup.innerHTML = `
            <div class="github-popup-content">
                <div class="github-popup-card">
                    <div class="github-popup-header">
                        <div class="github-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="github-popup-body">
                        <h3 class="github-popup-title">Thanks for visiting!</h3>
                        <p class="github-popup-text">
                            If you liked my portfolio, please follow me on GitHub — it'd make my day! 
                        </p>
                    </div>
                    
                    <div class="github-popup-footer">
                        <a href="https://github.com/l0kifs" target="_blank" rel="noopener noreferrer" 
                           class="github-follow-btn" onclick="gtag('event', 'click', {'event_category': 'popup', 'event_label': 'github_follow'});">
                            Follow on GitHub
                        </a>
                        
                        <div class="github-popup-timer">
                            <span>Closing in</span>
                            <span id="countdown-timer" class="countdown-number">${this.countdown}s</span>
                        </div>
                    </div>
                    
                    <button class="github-popup-close" onclick="githubPopup.hide();" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6L18 18"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Добавляем обработчик клика по overlay для закрытия
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.hide();
            }
        });
        
        // Добавляем обработчик клика по кнопке GitHub
        const followBtn = popup.querySelector('.github-follow-btn');
        followBtn.addEventListener('click', () => {
            // Отслеживаем клик для аналитики
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

// CSS стили встроенные
const popupStyles = `
.github-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
}

.github-popup-overlay.github-popup-show {
    opacity: 1;
}

.github-popup-content {
    width: 100%;
    max-width: 400px;
    position: relative;
}

.github-popup-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    border-radius: 16px;
    padding: 32px 28px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    transform: scale(0.9) translateY(20px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.github-popup-show .github-popup-card {
    transform: scale(1) translateY(0);
}

.github-popup-header {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
}

.github-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
    position: relative;
}

.github-icon::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.5;
    filter: blur(8px);
}

.github-icon svg {
    width: 28px;
    height: 28px;
    color: white;
    display: block;
}

.github-popup-body {
    text-align: center;
    margin-bottom: 28px;
}

.github-popup-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 16px 0;
    background: linear-gradient(135deg, #ffffff, #e5e7eb);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.3;
}

.github-popup-text {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.5;
}

.github-popup-footer {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
}

.github-follow-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 32px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    position: relative;
    overflow: hidden;
    min-width: 200px;
}

.github-follow-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
}

.github-follow-btn:active {
    transform: translateY(0);
}

.github-popup-timer {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
}

.countdown-number {
    font-weight: 700;
    font-family: 'Courier New', monospace;
    color: white;
    min-width: 24px;
    text-align: center;
}

.github-popup-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.github-popup-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.github-popup-close svg {
    width: 16px;
    height: 16px;
}

/* Адаптив для мобильных */
@media (max-width: 480px) {
    .github-popup-overlay {
        padding: 16px;
    }
    
    .github-popup-card {
        padding: 24px 20px;
    }
    
    .github-popup-title {
        font-size: 1.25rem;
    }
    
    .github-popup-text {
        font-size: 0.9rem;
    }
    
    .github-follow-btn {
        padding: 12px 24px;
        font-size: 0.9rem;
        min-width: 180px;
    }
}

/* Анимация пульсации для иконки */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.github-icon {
    animation: pulse 2s infinite ease-in-out;
}

/* Темная тема */
@media (prefers-color-scheme: light) {
    .github-popup-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        color: #1f2937;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .github-popup-title {
        background: linear-gradient(135deg, #1f2937, #4b5563);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .github-popup-text {
        color: rgba(31, 41, 55, 0.8);
    }
    
    .github-popup-timer {
        color: rgba(31, 41, 55, 0.6);
    }
    
    .countdown-number {
        color: #1f2937;
    }
    
    .github-popup-close {
        background: rgba(0, 0, 0, 0.05);
        color: rgba(31, 41, 55, 0.6);
    }
    
    .github-popup-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #1f2937;
    }
}
`;

// Добавляем стили в head
function injectPopupStyles() {
    if (!document.getElementById('github-popup-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'github-popup-styles';
        styleSheet.textContent = popupStyles;
        document.head.appendChild(styleSheet);
    }
}

// Инициализация попапа при загрузке страницы
let githubPopup;

document.addEventListener('DOMContentLoaded', () => {
    injectPopupStyles();
    githubPopup = new GitHubFollowPopup();
    window.githubPopup = githubPopup;
});

window.GitHubFollowPopup = GitHubFollowPopup;