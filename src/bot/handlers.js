/**
 * Loads all handlers for the Discord client
 * @param {Client} client - Discord client instance
 */
function loadHandlers(client) {
    console.log('handler loaded (commandhandler.js, eventhandler.js)');
    require('../handlers/commandhandler')(client);
    require('../handlers/eventhandler')(client);
}

module.exports = { loadHandlers };