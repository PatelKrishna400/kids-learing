/**
 * WonderKids Unified Gamification System
 * This module provides comprehensive gamification features for all 50 learning games
 * 
 * Features:
 * - XP (Experience Points) System
 * - Level Progression System (1-100)
 * - Achievement/Badge System
 * - Daily/Weekly Challenges
 * - Skill Category Tracking
 * - Streak System
 * - Rewards & Bonuses
 * - Progress Persistence
 */

class WonderKidsGamification {
    constructor() {
        // Core Stats
        this.stats = this.loadStats();

        // Initialize if first time
        if (!this.stats) {
            this.stats = this.getInitialStats();
            this.saveStats();
        }

        // Configuration
        this.config = {
            xpPerCorrect: 10,
            xpPerLevel: 100,
            xpBonusStreak: 5,
            coinRewardBase: 5,
            maxLevel: 100,
            streakMultiplier: 0.1
        };

        // Achievement definitions
        this.achievements = this.getAchievements();

        // Skill categories
        this.categories = {
            math: { name: 'Math Wizard', icon: 'fa-calculator', color: '#3498db', games: ['magic-table', 'math-racing', 'multiplication-monster', 'rocket-math', 'division-bowling', 'bridge-math', 'number-fishing', 'math-jump', 'pizza-fractions', 'money-shop'] },
            language: { name: 'Word Master', icon: 'fa-book', color: '#9b59b6', games: ['word-builder', 'sentence-builder', 'opposite-battle', 'grammar-ninja', 'word-search', 'alphabet-dance', 'alphabet-game', 'story-maker', 'story-adventure', 'emoji-match'] },
            science: { name: 'Science Explorer', icon: 'fa-flask', color: '#2ecc71', games: ['science-lab', 'solar-system', 'weather-maker', 'body-puzzle', 'plant-simulator', 'recycling-game', 'puzzle-map-india', 'flag-match'] },
            memory: { name: 'Brain Champion', icon: 'fa-brain', color: '#e74c3c', games: ['memory-game', 'brain-maze', 'pattern-detective', 'logic-escape', 'robot-coding', 'coding-robot', 'treasure-hunt', 'game-maker'] },
            creative: { name: 'Creative Genius', icon: 'fa-palette', color: '#f39c12', games: ['color-fill', 'garden-builder', 'shape-builder', 'city-builder', 'ar-shapes'] },
            social: { name: 'Life Skill Star', icon: 'fa-users', color: '#1abc9c', games: ['food-sorter', 'classroom-sim', 'tutor-pet'] },
            action: { name: 'Action Hero', icon: 'fa-bolt', color: '#e91e63', games: ['balloon-pop', 'quiz-tournament', 'count-stars'] }
        };

        // Initialize
        this.init();
    }

    getInitialStats() {
        return {
            xp: 0,
            level: 1,
            coins: 50,
            totalGamesPlayed: 0,
            totalCorrectAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastPlayedDate: null,
            achievements: [],
            categoryProgress: {},
            dailyChallenges: this.getDailyChallenges(),
            weeklyChallenges: this.getWeeklyChallenges(),
            gameHistory: {},
            createdAt: new Date().toISOString()
        };
    }

    getDailyChallenges() {
        return [
            { id: 'daily_math', title: 'Math Practice', description: 'Play 3 math games', type: 'category', target: 3, category: 'math', progress: 0, completed: false, reward: 30 },
            { id: 'daily_language', title: 'Word Warrior', description: 'Play 2 language games', type: 'category', target: 2, category: 'language', progress: 0, completed: false, reward: 25 },
            { id: 'daily_correct', title: 'Quick Learner', description: 'Get 20 correct answers', type: 'correct', target: 20, progress: 0, completed: false, reward: 20 },
            { id: 'daily_streak', title: 'On Fire!', description: 'Get a streak of 5', type: 'streak', target: 5, progress: 0, completed: false, reward: 15 }
        ];
    }

    getWeeklyChallenges() {
        return [
            { id: 'weekly_explorer', title: 'Explorer', description: 'Try 5 different game categories', type: 'categories', target: 5, progress: 0, completed: false, reward: 100 },
            { id: 'weekly_master', title: 'Category Master', description: 'Reach level 5 in any category', type: 'category_level', target: 5, progress: 0, completed: false, reward: 150 },
            { id: 'weekly_games', title: 'Dedicated Learner', description: 'Play 20 total games', type: 'games', target: 20, progress: 0, completed: false, reward: 75 },
            { id: 'weekly_streak', title: 'Week Champion', description: 'Maintain a 7-day streak', type: 'streak_total', target: 7, progress: 0, completed: false, reward: 200 }
        ];
    }

    getAchievements() {
        return [
            // Beginner achievements
            { id: 'first_game', title: 'First Steps', description: 'Play your first game', icon: 'fa-star', xp: 10, rarity: 'common', condition: (s) => s.totalGamesPlayed >= 1 },
            { id: 'first_correct', title: 'Quick Thinker', description: 'Get your first correct answer', icon: 'fa-brain', xp: 10, rarity: 'common', condition: (s) => s.totalCorrectAnswers >= 1 },
            { id: 'first_coin', title: 'Coin Collector', description: 'Earn your first coin', icon: 'fa-coins', xp: 10, rarity: 'common', condition: (s) => s.coins >= 1 },

            // Streak achievements
            { id: 'streak_5', title: 'On Fire!', description: 'Get a 5 answer streak', icon: 'fa-fire', xp: 25, rarity: 'common', condition: (s) => s.bestStreak >= 5 },
            { id: 'streak_10', title: 'Unstoppable', description: 'Get a 10 answer streak', icon: 'fa-bolt', xp: 50, rarity: 'rare', condition: (s) => s.bestStreak >= 10 },
            { id: 'streak_25', title: 'Legendary', description: 'Get a 25 answer streak', icon: 'fa-crown', xp: 100, rarity: 'epic', condition: (s) => s.bestStreak >= 25 },
            { id: 'streak_50', title: 'Math Master', description: 'Get a 50 answer streak', icon: 'fa-trophy', xp: 250, rarity: 'legendary', condition: (s) => s.bestStreak >= 50 },

            // Games played achievements
            { id: 'games_10', title: 'Regular Player', description: 'Play 10 games', icon: 'fa-gamepad', xp: 30, rarity: 'common', condition: (s) => s.totalGamesPlayed >= 10 },
            { id: 'games_50', title: 'Dedicated Learner', description: 'Play 50 games', icon: 'fa-graduation-cap', xp: 75, rarity: 'rare', condition: (s) => s.totalGamesPlayed >= 50 },
            { id: 'games_100', title: 'Knowledge Seeker', description: 'Play 100 games', icon: 'fa-book-open', xp: 150, rarity: 'epic', condition: (s) => s.totalGamesPlayed >= 100 },
            { id: 'games_500', title: 'WonderKid Expert', description: 'Play 500 games', icon: 'fa-medal', xp: 500, rarity: 'legendary', condition: (s) => s.totalGamesPlayed >= 500 },

            // Correct answers achievements
            { id: 'correct_100', title: 'Smart Cookie', description: 'Get 100 correct answers', icon: 'fa-lightbulb', xp: 50, rarity: 'common', condition: (s) => s.totalCorrectAnswers >= 100 },
            { id: 'correct_500', title: 'Brain Power', description: 'Get 500 correct answers', icon: 'fa-rocket', xp: 150, rarity: 'rare', condition: (s) => s.totalCorrectAnswers >= 500 },
            { id: 'correct_1000', title: 'Genius Level', description: 'Get 1000 correct answers', icon: 'fa-gem', xp: 300, rarity: 'epic', condition: (s) => s.totalCorrectAnswers >= 1000 },
            { id: 'correct_5000', title: 'Ultimate Scholar', description: 'Get 5000 correct answers', icon: 'fa-crown', xp: 1000, rarity: 'legendary', condition: (s) => s.totalCorrectAnswers >= 5000 },

            // Level achievements
            { id: 'level_5', title: 'Rising Star', description: 'Reach level 5', icon: 'fa-arrow-up', xp: 25, rarity: 'common', condition: (s) => s.level >= 5 },
            { id: 'level_10', title: 'Quick Learner', description: 'Reach level 10', icon: 'fa-star-half-stroke', xp: 50, rarity: 'common', condition: (s) => s.level >= 10 },
            { id: 'level_25', title: 'Knowledge Hunter', description: 'Reach level 25', icon: 'fa-medal', xp: 100, rarity: 'rare', condition: (s) => s.level >= 25 },
            { id: 'level_50', title: 'Expert Explorer', description: 'Reach level 50', icon: 'fa-award', xp: 250, rarity: 'epic', condition: (s) => s.level >= 50 },
            { id: 'level_100', title: 'WonderKid Legend', description: 'Reach level 100', icon: 'fa-crown', xp: 1000, rarity: 'legendary', condition: (s) => s.level >= 100 },

            // Category achievements
            { id: 'math_novice', title: 'Math Novice', description: 'Complete 10 math problems', icon: 'fa-calculator', xp: 20, rarity: 'common', category: 'math', condition: (s) => (s.categoryProgress?.math?.correct || 0) >= 10 },
            { id: 'math_master', title: 'Math Master', description: 'Complete 100 math problems', icon: 'fa-square-root-variable', xp: 100, rarity: 'rare', category: 'math', condition: (s) => (s.categoryProgress?.math?.correct || 0) >= 100 },
            { id: 'word_novice', title: 'Word Novice', description: 'Complete 10 word challenges', icon: 'fa-spell-check', xp: 20, rarity: 'common', category: 'language', condition: (s) => (s.categoryProgress?.language?.correct || 0) >= 10 },
            { id: 'word_master', title: 'Vocabulary Master', description: 'Complete 100 word challenges', icon: 'fa-book', xp: 100, rarity: 'rare', category: 'language', condition: (s) => (s.categoryProgress?.language?.correct || 0) >= 100 },

            // Special achievements
            { id: 'all_categories', title: 'Well Rounded', description: 'Play all 7 categories', icon: 'fa-globe', xp: 200, rarity: 'epic', condition: (s) => Object.keys(s.categoryProgress || {}).length >= 7 },
            { id: 'perfect_game', title: 'Perfect!', description: 'Get 100% in any game', icon: 'fa-check-circle', xp: 50, rarity: 'rare', condition: (s) => s.gameHistory && Object.values(s.gameHistory).some(g => g.perfect) },
            { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a game in under 30 seconds', icon: 'fa-stopwatch', xp: 75, rarity: 'rare', condition: () => false }, // Handled per-game
            { id: 'daily_7', title: 'Daily Champion', description: 'Complete daily challenges for 7 days', icon: 'fa-calendar-check', xp: 150, rarity: 'epic', condition: () => false } // Tracked separately
        ];
    }

    loadStats() {
        const saved = localStorage.getItem('wonderkids_gamification');
        return saved ? JSON.parse(saved) : null;
    }

    saveStats() {
        localStorage.setItem('wonderkids_gamification', JSON.stringify(this.stats));
    }

    init() {
        // Check and update daily challenges
        this.checkDailyChallenges();

        // Check streak
        this.updateStreak();

        // Check achievements
        this.checkAchievements();

        // Save stats
        this.saveStats();
    }

    checkDailyChallenges() {
        const lastDate = this.stats.lastPlayedDate;
        const today = new Date().toDateString();

        if (lastDate !== today) {
            // Reset daily challenges
            this.stats.dailyChallenges = this.getDailyChallenges();
            this.stats.lastPlayedDate = today;
        }
    }

    updateStreak() {
        const lastDate = this.stats.lastPlayedDate;
        const today = new Date();

        if (lastDate) {
            const lastPlayed = new Date(lastDate);
            const diffDays = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                // Streak broken
                this.stats.currentStreak = 0;
            }
        }
    }

    // Main methods for games to use

    /**
     * Called when player gets a correct answer
     * @param {string} category - Category of the game
     * @param {number} xpBonus - Additional XP from game
     * @param {boolean} isCorrect - Whether answer was correct
     */
    recordAnswer(category, xpBonus = 0, isCorrect = true) {
        if (!isCorrect) {
            // Reset streak on wrong answer
            this.stats.currentStreak = 0;
            this.saveStats();
            return null;
        }

        // Update stats
        this.stats.totalCorrectAnswers++;

        // Calculate XP
        let xpEarned = this.config.xpPerCorrect;
        if (this.stats.currentStreak >= 5) {
            xpEarned += Math.floor(this.stats.currentStreak * this.config.streakMultiplier);
        }
        xpEarned += xpBonus;

        // Update streak
        this.stats.currentStreak++;
        if (this.stats.currentStreak > this.stats.bestStreak) {
            this.stats.bestStreak = this.stats.currentStreak;
        }

        // Update category progress
        if (category && this.categories[category]) {
            if (!this.stats.categoryProgress[category]) {
                this.stats.categoryProgress[category] = {
                    gamesPlayed: 0,
                    correct: 0,
                    level: 1,
                    xp: 0
                };
            }
            this.stats.categoryProgress[category].correct++;
            this.stats.categoryProgress[category].xp += xpEarned;

            // Check category level up
            const catXp = this.stats.categoryProgress[category].xp;
            const catLevel = Math.floor(catXp / 200) + 1;
            this.stats.categoryProgress[category].level = catLevel;
        }

        // Add XP
        this.stats.xp += xpEarned;

        // Check level up
        this.checkLevelUp();

        // Update daily challenges
        this.updateDailyChallenges('correct', 1);
        this.updateDailyChallenges('streak', this.stats.currentStreak);
        if (category) {
            this.updateDailyChallenges('category', 1, category);
        }

        // Check achievements
        const newAchievements = this.checkAchievements();

        // Save
        this.saveStats();

        return {
            xpEarned,
            newStreak: this.stats.currentStreak,
            level: this.stats.level,
            newAchievements
        };
    }

    /**
     * Called when a game is played
     * @param {string} gameId - The game identifier
     * @param {string} category - Category of the game
     * @param {object} gameResult - Result object from game
     */
    recordGamePlay(gameId, category, gameResult = {}) {
        this.stats.totalGamesPlayed++;

        // Update category progress
        if (category && this.categories[category]) {
            if (!this.stats.categoryProgress[category]) {
                this.stats.categoryProgress[category] = {
                    gamesPlayed: 0,
                    correct: 0,
                    level: 1,
                    xp: 0
                };
            }
            this.stats.categoryProgress[category].gamesPlayed++;
        }

        // Record game in history
        if (!this.stats.gameHistory[gameId]) {
            this.stats.gameHistory[gameId] = {
                plays: 0,
                bestScore: 0,
                totalCorrect: 0,
                perfect: false
            };
        }

        const gameHistory = this.stats.gameHistory[gameId];
        gameHistory.plays++;
        if (gameResult.score && gameResult.score > gameHistory.bestScore) {
            gameHistory.bestScore = gameResult.score;
        }
        if (gameResult.correct) {
            gameHistory.totalCorrect += gameResult.correct;
        }
        if (gameResult.perfect) {
            gameHistory.perfect = true;
        }

        // Award coins
        const coinsEarned = this.calculateCoinReward(gameResult);
        this.stats.coins += coinsEarned;

        // Award XP for playing
        const playXp = 15; // Base XP for playing
        this.stats.xp += playXp;

        // Update daily challenges
        this.updateDailyChallenges('games', 1);
        if (category) {
            this.updateDailyChallenges('category', 1, category);
        }

        // Check level up
        this.checkLevelUp();

        // Check achievements
        this.checkAchievements();

        // Save
        this.saveStats();

        return {
            coinsEarned,
            xpEarned: playXp,
            level: this.stats.level,
            categoryLevel: category ? this.stats.categoryProgress[category]?.level : null
        };
    }

    calculateCoinReward(gameResult) {
        let coins = this.config.coinRewardBase;

        // Bonus for good performance
        if (gameResult.accuracy >= 90) {
            coins += 5;
        } else if (gameResult.accuracy >= 70) {
            coins += 3;
        }

        // Bonus for perfect game
        if (gameResult.perfect) {
            coins += 10;
        }

        // Streak bonus
        if (this.stats.currentStreak >= 10) {
            coins += 5;
        } else if (this.stats.currentStreak >= 5) {
            coins += 2;
        }

        return coins;
    }

    checkLevelUp() {
        const oldLevel = this.stats.level;
        const newLevel = Math.floor(this.stats.xp / this.config.xpPerLevel) + 1;

        if (newLevel > this.config.maxLevel) {
            this.stats.level = this.config.maxLevel;
        } else {
            this.stats.level = newLevel;
        }

        return this.stats.level > oldLevel;
    }

    updateDailyChallenges(type, amount, category = null) {
        this.stats.dailyChallenges.forEach(challenge => {
            if (challenge.completed) return;

            if (challenge.type === type) {
                if (type === 'category' && category === challenge.category) {
                    challenge.progress += amount;
                } else if (type !== 'category') {
                    challenge.progress += amount;
                }

                if (challenge.progress >= challenge.target) {
                    challenge.completed = true;
                    this.stats.coins += challenge.reward;
                }
            }
        });
    }

    checkAchievements() {
        const newAchievements = [];

        this.achievements.forEach(achievement => {
            if (!this.stats.achievements.includes(achievement.id)) {
                if (achievement.condition(this.stats)) {
                    this.stats.achievements.push(achievement.id);
                    this.stats.xp += achievement.xp;
                    newAchievements.push(achievement);
                }
            }
        });

        return newAchievements;
    }

    // Getters for UI

    getStats() {
        return this.stats;
    }

    getLevel() {
        return this.stats.level;
    }

    getXP() {
        return this.stats.xp;
    }

    getXPToNextLevel() {
        return this.config.xpPerLevel - (this.stats.xp % this.config.xpPerLevel);
    }

    getProgressPercent() {
        return (this.stats.xp % this.config.xpPerLevel) / this.config.xpPerLevel * 100;
    }

    getCoins() {
        return this.stats.coins;
    }

    getStreak() {
        return this.stats.currentStreak;
    }

    getBestStreak() {
        return this.stats.bestStreak;
    }

    getAchievementsList() {
        return this.achievements.map(a => ({
            ...a,
            earned: this.stats.achievements.includes(a.id)
        }));
    }

    getUnlockedAchievements() {
        return this.achievements.filter(a => this.stats.achievements.includes(a.id));
    }

    getDailyChallengesStatus() {
        return this.stats.dailyChallenges;
    }

    getCategoryProgress(category) {
        return this.stats.categoryProgress[category] || { gamesPlayed: 0, correct: 0, level: 1, xp: 0 };
    }

    getAllCategoryProgress() {
        const progress = {};
        Object.keys(this.categories).forEach(cat => {
            progress[cat] = {
                ...this.categories[cat],
                ...this.getCategoryProgress(cat)
            };
        });
        return progress;
    }

    // Daily bonus
    claimDailyBonus() {
        const today = new Date().toDateString();

        if (this.stats.lastPlayedDate !== today) {
            // Check streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let bonusMultiplier = 1;
            if (this.stats.lastPlayedDate === yesterday.toDateString()) {
                // Consecutive day
                this.stats.currentStreak++;
                if (this.stats.currentStreak > this.stats.bestStreak) {
                    this.stats.bestStreak = this.stats.currentStreak;
                }
                bonusMultiplier = Math.min(1 + (this.stats.currentStreak * 0.1), 2);
            } else if (this.stats.lastPlayedDate) {
                // Streak broken
                this.stats.currentStreak = 1;
            } else {
                this.stats.currentStreak = 1;
            }

            const baseBonus = 20;
            const bonus = Math.floor(baseBonus * bonusMultiplier);

            this.stats.coins += bonus;
            this.stats.lastPlayedDate = today;
            this.saveStats();

            return {
                coins: bonus,
                streak: this.stats.currentStreak,
                multiplier: bonusMultiplier
            };
        }

        return null;
    }

    // Reset (for testing)
    reset() {
        localStorage.removeItem('wonderkids_gamification');
        this.stats = this.getInitialStats();
        this.saveStats();
    }
}

// Create global instance
window.wonderKidsGamification = new WonderKidsGamification();
