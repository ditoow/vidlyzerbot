const { ActivityType } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`bot aktif ${client.user.tag}`);
        
        // Mapping tipe aktivitas (sama seperti di admin/status.js)
        const activityTypes = {
            'playing': ActivityType.Playing,
            'watching': ActivityType.Watching,
            'listening': ActivityType.Listening,
            'competing': ActivityType.Competing
        };
        
        // Set status default dari config
        if (config.defaultStatus) {
            const { type, activity } = config.defaultStatus;
            const activityType = activityTypes[type.toLowerCase()];
            
            if (activityType) {
                client.user.setActivity(activity, { type: activityType });
                console.log(`status bot ${type} ${activity}`);
            }
        }
    },
};