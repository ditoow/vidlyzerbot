const axios = require('axios');

class GeminiAI {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
        this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
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
            
            // Build simple prompt for Gemini
            let prompt = `Kamu adalah asisten AI yang membantu di server Discord. User yang sedang berbicara dengan kamu bernama ${username}. Jawab dengan ramah dan membantu dalam bahasa Indonesia.\n\n`;
            
            // Add conversation history to context
            if (history.length > 0) {
                prompt += 'Riwayat percakapan:\n';
                history.forEach(msg => {
                    if (msg.role === 'user') {
                        prompt += `${username}: ${msg.content}\n`;
                    } else {
                        prompt += `AI: ${msg.content}\n`;
                    }
                });
                prompt += '\n';
            }
            
            prompt += `${username}: ${message}`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: this.temperature,
                    maxOutputTokens: this.maxTokens,
                    topP: 0.95,
                    topK: 64
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            const response = await axios.post(`${this.apiUrl}?key=${this.apiKey}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            // Check if response has candidates
            if (!response.data.candidates || response.data.candidates.length === 0) {
                throw new Error('Tidak ada respons dari Gemini AI. Mungkin konten diblokir oleh safety filter.');
            }

            const candidate = response.data.candidates[0];
            
            // Check if candidate has content
            if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                throw new Error('Respons Gemini AI kosong. Mungkin konten diblokir oleh safety filter.');
            }

            const aiResponse = candidate.content.parts[0].text.trim();
            
            // Add both user message and AI response to history
            this.addToHistory(userId, 'user', message);
            this.addToHistory(userId, 'assistant', aiResponse);
            
            return aiResponse;

        } catch (error) {
            console.error('Gemini API Error Details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData?.error?.message) {
                    throw new Error(`API Error: ${errorData.error.message}`);
                }
                throw new Error('Request tidak valid. Periksa format pesan atau API key.');
            } else if (error.response?.status === 403) {
                throw new Error('API key Gemini tidak valid atau tidak memiliki akses. Periksa API key Anda.');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit tercapai. Coba lagi nanti.');
            } else if (error.response?.status === 500) {
                throw new Error('Server Gemini sedang bermasalah. Coba lagi nanti.');
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Gemini membutuhkan waktu terlalu lama untuk merespons.');
            } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                throw new Error('Tidak dapat terhubung ke server Gemini. Periksa koneksi internet.');
            } else {
                throw new Error(`Gemini API Error: ${error.message}`);
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