const fs = require('fs');
const path = require('path');

class AFKManager {
    constructor() {
        this.afkDataPath = path.join(__dirname, '../data/afk-data.json');
        this.afkUsers = new Map();
        this.loadAFKData();
    }

    // Load AFK data from file
    loadAFKData() {
        try {
            // Create data directory if it doesn't exist
            const dataDir = path.dirname(this.afkDataPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            if (fs.existsSync(this.afkDataPath)) {
                const data = JSON.parse(fs.readFileSync(this.afkDataPath, 'utf8'));
                this.afkUsers = new Map(Object.entries(data));
            }
        } catch (error) {
            // Error loading AFK data, start with empty map
            this.afkUsers = new Map();
        }
    }

    // Save AFK data to file
    saveAFKData() {
        try {
            const dataDir = path.dirname(this.afkDataPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const data = Object.fromEntries(this.afkUsers);
            fs.writeFileSync(this.afkDataPath, JSON.stringify(data, null, 2));
        } catch (error) {
            // Error saving AFK data
        }
    }

    // Set user as AFK
    setAFK(userId, originalNickname, reason = 'AFK') {
        const afkData = {
            originalNickname: originalNickname,
            reason: reason,
            timestamp: Date.now()
        };
        
        this.afkUsers.set(userId, afkData);
        this.saveAFKData();
    }

    // Remove user from AFK
    removeAFK(userId) {
        const afkData = this.afkUsers.get(userId);
        this.afkUsers.delete(userId);
        this.saveAFKData();
        return afkData;
    }

    // Check if user is AFK
    isAFK(userId) {
        return this.afkUsers.has(userId);
    }

    // Get AFK data for user
    getAFKData(userId) {
        return this.afkUsers.get(userId);
    }

    // Get all AFK users
    getAllAFKUsers() {
        return Array.from(this.afkUsers.keys());
    }

    // Clean up old AFK data (older than 7 days)
    cleanupOldAFK() {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        let cleaned = 0;

        for (const [userId, afkData] of this.afkUsers.entries()) {
            if (afkData.timestamp < sevenDaysAgo) {
                this.afkUsers.delete(userId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            this.saveAFKData();
        }

        return cleaned;
    }
}

module.exports = AFKManager;