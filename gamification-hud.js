/**
 * WonderKids Gamification HUD
 * A unified UI component that displays player stats across all games
 */

class GamificationHUD {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            showXP: true,
            showCoins: true,
            showStreak: true,
            showLevel: true,
            showAchievements: true,
            showDailyChallenges: false,
            compact: false,
            ...options
        };

        this.gamification = window.wonderKidsGamification;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const stats = this.gamification.getStats();
        const level = this.gamification.getLevel();
        const xpProgress = this.gamification.getProgressPercent();
        const xpToNext = this.gamification.getXPToNextLevel();

        const rarityColors = {
            common: '#95a5a6',
            rare: '#3498db',
            epic: '#9b59b6',
            legendary: '#f39c12'
        };

        const html = `
            <div class="g HUD-container ${this.options.compact ? 'compact' : ''}">
                ${this.options.showLevel ? `
                <div class="g-hud-level">
                    <div class="level-ring">
                        <span class="level-number">${level}</span>
                        <svg class="progress-ring" viewBox="0 0 36 36">
                            <circle class="progress-bg" cx="18" cy="18" r="15.5" fill="none" stroke="#eee" stroke-width="3"/>
                            <circle class="progress-fill" cx="18" cy="18" r="15.5" fill="none" stroke="url(#levelGradient)" stroke-width="3"
                                stroke-dasharray="${xpProgress}, 100" stroke-linecap="round"/>
                            <defs>
                                <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#6c5ce7"/>
                                    <stop offset="100%" stop-color="#00cec9"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div class="level-info">
                        <span class="xp-text">${xpToNext} XP to Level ${level + 1}</span>
                        <div class="xp-bar-mini">
                            <div class="xp-fill" style="width: ${xpProgress}%"></div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <div class="g-hud-stats">
                    ${this.options.showXP ? `
                    <div class="stat-item xp-stat">
                        <i class="fa-solid fa-star"></i>
                        <span>${stats.xp} XP</span>
                    </div>
                    ` : ''}
                    
                    ${this.options.showCoins ? `
                    <div class="stat-item coin-stat">
                        <i class="fa-solid fa-coins"></i>
                        <span>${stats.coins}</span>
                    </div>
                    ` : ''}
                    
                    ${this.options.showStreak ? `
                    <div class="stat-item streak-stat ${stats.currentStreak >= 5 ? 'hot' : ''}">
                        <i class="fa-solid fa-fire"></i>
                        <span>${stats.currentStreak}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${this.options.showAchievements ? `
                <div class="g-hud-badges">
                    <button class="badge-btn" onclick="window.gamificationHUD?.showAchievementsModal()">
                        <i class="fa-solid fa-trophy"></i>
                        <span class="badge-count">${stats.achievements.length}</span>
                    </button>
                </div>
                ` : ''}
            </div>
            
            <!-- Achievements Modal -->
            <div class="g-modal-overlay" id="achievementsModal">
                <div class="g-modal">
                    <div class="g-modal-header">
                        <h2><i class="fa-solid fa-trophy"></i> Achievements</h2>
                        <button class="g-modal-close" onclick="window.gamificationHUD?.hideAchievementsModal()">&times;</button>
                    </div>
                    <div class="g-modal-body">
                        <div class="achievements-grid" id="achievementsGrid"></div>
                    </div>
                </div>
            </div>
            
            <!-- Daily Challenges Modal -->
            <div class="g-modal-overlay" id="challengesModal">
                <div class="g-modal">
                    <div class="g-modal-header">
                        <h2><i class="fa-solid fa-calendar-day"></i> Daily Challenges</h2>
                        <button class="g-modal-close" onclick="window.gamificationHUD?.hideChallengesModal()">&times;</button>
                    </div>
                    <div class="g-modal-body">
                        <div class="challenges-list" id="challengesList"></div>
                    </div>
                </div>
            </div>
            
            <!-- Level Up Modal -->
            <div class="g-modal-overlay" id="levelUpModal">
                <div class="g-modal g-level-up-modal">
                    <div class="level-up-content">
                        <div class="level-up-icon">🎉</div>
                        <h2>LEVEL UP!</h2>
                        <div class="new-level" id="newLevelDisplay">5</div>
                        <p>Keep up the great work!</p>
                        <button class="g-btn-primary" onclick="document.getElementById('levelUpModal').classList.remove('active')">Awesome!</button>
                    </div>
                </div>
            </div>
            
            <!-- Achievement Unlock Modal -->
            <div class="g-modal-overlay" id="achievementUnlockModal">
                <div class="g-modal g-achievement-modal">
                    <div class="achievement-unlock-content">
                        <div class="achievement-icon" id="unlockAchievementIcon">🏆</div>
                        <h3>Achievement Unlocked!</h3>
                        <div class="achievement-name" id="unlockAchievementName">First Steps</div>
                        <div class="achievement-xp">+25 XP</div>
                        <button class="g-btn-primary" onclick="document.getElementById('achievementUnlockModal').classList.remove('active')">Cool!</button>
                    </div>
                </div>
            </div>
        `;

        // Inject styles
        this.injectStyles();

        // Render HTML
        if (this.container) {
            this.container.innerHTML = html;
        }
    }

    injectStyles() {
        if (document.getElementById('gamification-hud-styles')) return;

        const styles = `
            .g-hud-container {
                display: flex;
                align-items: center;
                gap: 15px;
                background: white;
                padding: 8px 15px;
                border-radius: 50px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                font-family: 'Nunito', sans-serif;
            }
            
            .g-hud-container.compact {
                padding: 5px 12px;
                gap: 10px;
            }
            
            .g-hud-level {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .level-ring {
                position: relative;
                width: 45px;
                height: 45px;
            }
            
            .compact .level-ring {
                width: 35px;
                height: 35px;
            }
            
            .level-number {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-weight: 800;
                font-size: 1rem;
                color: #6c5ce7;
            }
            
            .compact .level-number {
                font-size: 0.8rem;
            }
            
            .progress-ring {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .level-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .compact .level-info {
                display: none;
            }
            
            .xp-text {
                font-size: 0.7rem;
                font-weight: 700;
                color: #636e72;
            }
            
            .xp-bar-mini {
                width: 60px;
                height: 4px;
                background: #eee;
                border-radius: 2px;
                overflow: hidden;
            }
            
            .xp-fill {
                height: 100%;
                background: linear-gradient(90deg, #6c5ce7, #00cec9);
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            
            .g-hud-stats {
                display: flex;
                gap: 10px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 5px 10px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 0.85rem;
            }
            
            .compact .stat-item {
                padding: 3px 8px;
                font-size: 0.75rem;
                gap: 3px;
            }
            
            .xp-stat {
                background: #fff8e1;
                color: #f39c12;
            }
            
            .coin-stat {
                background: #fff3e0;
                color: #e67e22;
            }
            
            .coin-stat i {
                color: #f1c40f;
            }
            
            .streak-stat {
                background: #fce4ec;
                color: #e91e63;
            }
            
            .streak-stat.hot {
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
                animation: pulse-glow 1s infinite;
            }
            
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 5px rgba(233, 30, 99, 0.3); }
                50% { box-shadow: 0 0 15px rgba(233, 30, 99, 0.6); }
            }
            
            .g-hud-badges {
                display: flex;
                gap: 5px;
            }
            
            .badge-btn {
                position: relative;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                color: white;
                cursor: pointer;
                font-size: 1rem;
                transition: transform 0.2s;
            }
            
            .badge-btn:hover {
                transform: scale(1.1);
            }
            
            .badge-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #e74c3c;
                color: white;
                font-size: 0.65rem;
                font-weight: 800;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            /* Modal Styles */
            .g-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .g-modal-overlay.active {
                display: flex;
            }
            
            .g-modal {
                background: white;
                border-radius: 25px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .g-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                color: white;
            }
            
            .g-modal-header h2 {
                margin: 0;
                font-size: 1.3rem;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .g-modal-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-size: 1.3rem;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .g-modal-close:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .g-modal-body {
                padding: 20px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .g-btn-primary {
                background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .g-btn-primary:hover {
                transform: scale(1.05);
            }
            
            /* Achievements Grid */
            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 15px;
            }
            
            .achievement-card {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 15px;
                text-align: center;
                transition: transform 0.2s;
                border: 2px solid transparent;
            }
            
            .achievement-card:hover {
                transform: translateY(-3px);
            }
            
            .achievement-card.earned {
                background: linear-gradient(135deg, #fff8e1, #fff3e0);
                border-color: #f1c40f;
            }
            
            .achievement-card.locked {
                opacity: 0.5;
            }
            
            .achievement-card-icon {
                font-size: 2rem;
                margin-bottom: 8px;
            }
            
            .achievement-card-title {
                font-weight: 700;
                font-size: 0.85rem;
                margin-bottom: 3px;
            }
            
            .achievement-card-desc {
                font-size: 0.7rem;
                color: #636e72;
                margin-bottom: 5px;
            }
            
            .achievement-card-xp {
                font-size: 0.75rem;
                color: #f39c12;
                font-weight: 700;
            }
            
            /* Challenges List */
            .challenges-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .challenge-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 15px;
                border: 2px solid #eee;
            }
            
            .challenge-item.completed {
                background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
                border-color: #2ecc71;
            }
            
            .challenge-icon {
                font-size: 1.5rem;
                width: 45px;
                height: 45px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 12px;
            }
            
            .challenge-info {
                flex: 1;
            }
            
            .challenge-title {
                font-weight: 700;
                margin-bottom: 3px;
            }
            
            .challenge-desc {
                font-size: 0.8rem;
                color: #636e72;
            }
            
            .challenge-progress {
                margin-top: 8px;
                height: 6px;
                background: #ddd;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .challenge-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #6c5ce7, #00cec9);
                transition: width 0.3s;
            }
            
            .challenge-reward {
                background: #fff3e0;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: 700;
                color: #e67e22;
                font-size: 0.9rem;
            }
            
            /* Level Up Modal */
            .g-level-up-modal {
                text-align: center;
                padding: 40px;
            }
            
            .level-up-content {
                animation: levelUpBounce 0.5s ease;
            }
            
            @keyframes levelUpBounce {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .level-up-icon {
                font-size: 4rem;
                margin-bottom: 15px;
            }
            
            .level-up-content h2 {
                color: #6c5ce7;
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .new-level {
                font-size: 5rem;
                font-weight: 900;
                background: linear-gradient(135deg, #6c5ce7, #00cec9);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 15px 0;
            }
            
            /* Achievement Unlock Modal */
            .g-achievement-modal {
                text-align: center;
                padding: 30px;
            }
            
            .achievement-unlock-content {
                animation: achievementPop 0.5s ease;
            }
            
            @keyframes achievementPop {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .achievement-unlock-content .achievement-icon {
                font-size: 4rem;
                margin-bottom: 15px;
            }
            
            .achievement-unlock-content h3 {
                color: #f39c12;
                margin-bottom: 10px;
            }
            
            .achievement-name {
                font-size: 1.5rem;
                font-weight: 800;
                color: #2d3436;
                margin-bottom: 10px;
            }
            
            .achievement-xp {
                font-size: 1.2rem;
                color: #f39c12;
                font-weight: 700;
                margin-bottom: 20px;
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = 'gamification-hud-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    attachEventListeners() {
        // Click outside to close modals
        document.querySelectorAll('.g-modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    showAchievementsModal() {
        const achievements = this.gamification.getAchievementsList();
        const grid = document.getElementById('achievementsGrid');

        grid.innerHTML = achievements.map(a => `
            <div class="achievement-card ${a.earned ? 'earned' : 'locked'}">
                <div class="achievement-card-icon">${a.earned ? a.icon : '🔒'}</div>
                <div class="achievement-card-title">${a.title}</div>
                <div class="achievement-card-desc">${a.description}</div>
                <div class="achievement-card-xp">+${a.xp} XP</div>
            </div>
        `).join('');

        document.getElementById('achievementsModal').classList.add('active');
    }

    hideAchievementsModal() {
        document.getElementById('achievementsModal').classList.remove('active');
    }

    showChallengesModal() {
        const challenges = this.gamification.getDailyChallengesStatus();
        const list = document.getElementById('challengesList');

        list.innerHTML = challenges.map(c => `
            <div class="challenge-item ${c.completed ? 'completed' : ''}">
                <div class="challenge-icon">${c.completed ? '✅' : '🎯'}</div>
                <div class="challenge-info">
                    <div class="challenge-title">${c.title}</div>
                    <div class="challenge-desc">${c.description}</div>
                    <div class="challenge-progress">
                        <div class="challenge-progress-fill" style="width: ${Math.min(100, (c.progress / c.target) * 100)}%"></div>
                    </div>
                </div>
                <div class="challenge-reward">+${c.reward} 🪙</div>
            </div>
        `).join('');

        document.getElementById('challengesModal').classList.add('active');
    }

    hideChallengesModal() {
        document.getElementById('challengesModal').classList.remove('active');
    }

    showLevelUp(newLevel) {
        document.getElementById('newLevelDisplay').textContent = newLevel;
        document.getElementById('levelUpModal').classList.add('active');
    }

    showAchievementUnlock(achievement) {
        document.getElementById('unlockAchievementIcon').textContent = achievement.icon;
        document.getElementById('unlockAchievementName').textContent = achievement.title;
        document.getElementById('unlockAchievementXPReward').textContent = `+${achievement.xp} XP`;
        document.getElementById('achievementUnlockModal').classList.add('active');
    }

    update() {
        this.render();
    }
}

// Helper function to initialize HUD
window.initGamificationHUD = function (container, options) {
    window.gamificationHUD = new GamificationHUD(container, options);
    return window.gamificationHUD;
};
