const axios = require('axios');
const path = require('path');
const fs = require('fs');

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

async function queryOllama(prompt, options = {}) {
    const { model, timeout = 120000 } = options;
    if (!model) throw new Error('Model is required for Ollama');

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model,
        prompt,
        stream: false
    }, { timeout });

    return response.data.response;
}

async function queryMistral(prompt, options = {}) {
    const { apiKey, temperature = 0.3, maxTokens = 4096, timeout = 120000 } = options;

    let key = apiKey;
    if (!key) {
        const keysPath = path.join(__dirname, '../data/keys.json');
        if (fs.existsSync(keysPath)) {
            const keys = JSON.parse(fs.readFileSync(keysPath, 'utf-8'));
            key = keys.mistral;
        }
    }

    if (!key) {
        throw new Error('Mistral API key is required. Please add it in Settings.');
    }

    const response = await axios.post(MISTRAL_API_URL, {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens
    }, {
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        },
        timeout
    });

    return response.data.choices[0]?.message?.content || '';
}

function createProvider(mode) {
    if (mode === 'offline') {
        return {
            type: 'ollama',
            query: (prompt, opts) => queryOllama(prompt, opts)
        };
    }
    return {
        type: 'mistral',
        query: (prompt, opts) => queryMistral(prompt, opts)
    };
}

module.exports = { createProvider, OLLAMA_BASE_URL };
