const axios = require('axios');

class GeminiAI {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.model = process.env.GEMINI_MODEL || 'gemini-pro';
        this.maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS) || 1000;
        this.temperature = parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7;
        
        // Conversation history storage (in memory - consider using database for persistence)
        this.conversations = new Map();
        this.maxHistoryLength = 10; // Keep last 10 messages per user
    }

    /**
     * Check if Gemini AI is properly configured
     * @returns {boolean} True if API key is available
     */
    isConfigured() {
        return !!this.apiKey;
    }

    /**
     * Get conversation history for a user
     * @param {string} userId - Discord user ID
     * @returns {Array} Array of message objects
     */
    getConversationHistory(userId) {
        return this.conversations.get(userId) || [];
    }

    /**
     * Add message to conversation history
     * @param {string} userId - Discord user ID
     * @param {string} role - 'user' or 'assistant'
     * @param {string} content - Message content
     */
    addToHistory(userId, role, content) {
        if (!this.conversations.has(userId)) {
            this.conversations.set(userId, []);
        }
        
        const history = this.conversations.get(userId);
        history.push({ role, content });
        
        // Keep only the last N messages to prevent token limit issues
        if (history.length > this.maxHistoryLength) {
            history.splice(0, history.length - this.maxHistoryLength);
        }
    }

    /**
     * Clear conversation history for a user
     * @param {string} userId - Discord user ID
     */
    clearHistory(userId) {
        this.conversations.delete(userId);
    }

    /**
     * Send message to Gemini AI API
     * @param {string} message - User message
     * @param {string} userId - Discord user ID for conversation context
     * @param {string} username - Discord username for context
     * @returns {Promise<string>} Gemini AI response
     */
    async sendMessage(message, userId, username = 'User') {
        if (!this.isConfigured()) {
            throw new Error('Gemini API key tidak dikonfigurasi. Silakan set GEMINI_API_KEY di environment variables.');
        }

        try {
            // Get conversation history
            const history = this.getConversationHistory(userId);
            
            // Build conversation context for Gemini
            let contextMessage = `Kamu adalah asisten AI yang membantu di server Discord. User yang sedang berbicara dengan kamu bernama ${username}. Jawab dengan ramah dan membantu dalam bahasa Indonesia.`;
            
            // Add conversation history to context
            if (history.length > 0) {
                contextMessage += '\n\nRiwayat percakapan sebelumnya:\n';
                history.forEach(msg => {
                    if (msg.role === 'user') {
                        contextMessage += `${username}: ${msg.content}\n`;
                    } else {
                        contextMessage += `AI: ${msg.content}\n`;
                    }
                });
            }
            
            contextMessage += `\n${username}: ${message}\nAI:`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: contextMessage
                    }]
                }],
                generationConfig: {
                    temperature: this.temperature,
                    maxOutputTokens: this.maxTokens,
                    topP: 0.8,
                    topK: 10
                }
            };

            const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            const aiResponse = response.data.candidates[0].content.parts[0].text.trim();
            
            // Add both user message and AI response to history
            this.addToHistory(userId, 'user', message);
            this.addToHistory(userId, 'assistant', aiResponse);
            
            return aiResponse;

        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            
            if (error.response?.status === 400) {
                throw new Error('Request tidak valid. Periksa format pesan.');
            } else if (error.response?.status === 403) {
                throw new Error('API key Gemini tidak valid atau tidak memiliki akses.');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit tercapai. Coba lagi nanti.');
            } else if (error.response?.status === 500) {
                throw new Error('Server Gemini sedang bermasalah. Coba lagi nanti.');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Gemini membutuhkan waktu terlalu lama untuk merespons.');
            } else {
                throw new Error('Terjadi kesalahan saat menghubungi Gemini API.');
            }
        }
    }

    /**
     * Get conversation statistics
     * @returns {Object} Statistics about active conversations
     */
    getStats() {
        return {
            activeConversations: this.conversations.size,
            totalMessages: Array.from(this.conversations.values()).reduce((total, history) => total + history.length, 0)
        };
    }
}

module.exports = GeminiAI;