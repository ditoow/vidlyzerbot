const { ActivityType } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot siap! Login sebagai ${client.user.tag}`);
        
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
                console.log(`Status bot diatur: ${type.charAt(0).toUpperCase() + type.slice(1)} ${activity}`);
            } else {
                console.log('Tipe aktivitas tidak valid di config, menggunakan status default');
            }
        } else {
            console.log('Tidak ada status default yang diatur di config');
        }
    },
};
