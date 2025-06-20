class Logger {
    constructor(module = 'Bot') {
        this.module = module;
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m'
        };
    }

    getTimestamp() {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    formatMessage(level, message, data = null) {
        const timestamp = this.getTimestamp();
        const moduleTag = `[${this.module}]`;
        const levelTag = `[${level.toUpperCase()}]`;
        
        let formattedMessage = `${timestamp} ${moduleTag} ${levelTag} ${message}`;
        
        if (data) {
            if (typeof data === 'object') {
                formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
            } else {
                formattedMessage += ` ${data}`;
            }
        }
        
        return formattedMessage;
    }

    colorize(text, color) {
        if (!this.colors[color]) return text;
        return `${this.colors[color]}${text}${this.colors.reset}`;
    }

    info(message, data = null) {
        const formatted = this.formatMessage('info', message, data);
        console.log(this.colorize(formatted, 'blue'));
    }

    success(message, data = null) {
        const formatted = this.formatMessage('success', message, data);
        console.log(this.colorize(formatted, 'green'));
    }

    warn(message, data = null) {
        const formatted = this.formatMessage('warn', message, data);
        console.warn(this.colorize(formatted, 'yellow'));
    }

    error(message, data = null) {
        const formatted = this.formatMessage('error', message, data);
        console.error(this.colorize(formatted, 'red'));
    }

    debug(message, data = null) {
        if (process.env.DEBUG_MODE !== 'true') return;
        const formatted = this.formatMessage('debug', message, data);
        console.log(this.colorize(formatted, 'dim'));
    }
}

module.exports = Logger;