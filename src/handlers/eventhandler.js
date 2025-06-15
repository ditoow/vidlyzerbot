const fs = require('fs');
const path = require('path');

function loadEventsFromDirectory(client, directory, prefix = '') {
    if (!fs.existsSync(directory)) return;
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            // Recursively load events from subdirectories
            loadEventsFromDirectory(client, itemPath, `${prefix}${item}/`);
        } else if (item.endsWith('.js')) {
            try {
                const event = require(itemPath);
                
                if (event.name && event.execute) {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    console.log(`events loaded (${prefix}${item})`);
                } else {
                    console.warn(`Event file ${prefix}${item} is missing name or execute function`);
                }
            } catch (error) {
                console.error(`Error loading event ${prefix}${item}:`, error);
            }
        }
    }
}

module.exports = (client) => {
    // Load events from main events directory
    const eventsPath = path.join(__dirname, '../events');
    loadEventsFromDirectory(client, eventsPath);
    
    // Load events from features directory
    const featuresPath = path.join(__dirname, '../features');
    if (fs.existsSync(featuresPath)) {
        const featureDirectories = fs.readdirSync(featuresPath);
        
        for (const featureDir of featureDirectories) {
            const featurePath = path.join(featuresPath, featureDir);
            const featureEventsPath = path.join(featurePath, 'events');
            
            if (fs.existsSync(featureEventsPath)) {
                loadEventsFromDirectory(client, featureEventsPath, `features/${featureDir}/events/`);
            }
        }
    }
};