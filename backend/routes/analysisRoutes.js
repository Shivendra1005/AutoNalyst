const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');

const router = express.Router();

const { createProvider, OLLAMA_BASE_URL } = require('../utils/aiProvider');

// Get available Ollama models
router.get('/ollama-models', async (req, res) => {
    try {
        // First try using the API
        const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
        const models = response.data.models || [];
        res.json({
            success: true,
            models: models.map(m => ({
                name: m.name,
                size: m.size,
                modified: m.modified_at
            }))
        });
    } catch (apiError) {
        // Fallback to shell command
        exec('ollama list', (error, stdout, stderr) => {
            if (error) {
                return res.json({
                    success: false,
                    error: 'Ollama is not running or not installed. Please install Ollama and ensure it is running.',
                    models: []
                });
            }

            const lines = stdout.trim().split('\n').slice(1); // Skip header
            const models = lines.map(line => {
                const parts = line.split(/\s+/);
                return { name: parts[0], size: parts[2] || 'Unknown' };
            }).filter(m => m.name);

            res.json({ success: true, models });
        });
    }
});

// Analyze code with Ollama (offline)
router.post('/analyze-offline', async (req, res) => {
    try {
        const { model, code, chunkInfo } = req.body;

        if (!model || !code) {
            return res.status(400).json({ error: 'Model and code are required' });
        }

        const prompt = `You are a code analysis expert. Analyze the following code chunk for:
1. Syntax errors and bugs
2. Security vulnerabilities
3. Performance issues
4. Code optimization suggestions
5. Best practices violations

Provide line-by-line feedback where applicable. Format your response as:
- ERRORS (line number): description
- SECURITY (line number): vulnerability and fix
- OPTIMIZATION (line number): suggestion
- BEST PRACTICE (line number): recommendation

Code to analyze (${chunkInfo || 'unknown file'}):
\`\`\`
${code}
\`\`\`

Provide detailed, actionable feedback.`;

        const provider = createProvider('offline');
        const analysis = await provider.query(prompt, { model, timeout: 120000 });

        res.json({
            success: true,
            analysis,
            model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Ollama analysis error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Ollama is not running. Please start Ollama with: ollama serve'
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// Analyze code with Mistral (online)
router.post('/analyze-online', async (req, res) => {
    try {
        const { code, chunkInfo, apiKey } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        const provider = createProvider('online');
        const prompt = `You are a code analysis expert. Analyze the following code chunk for:
1. Syntax errors and bugs
2. Security vulnerabilities
3. Performance issues
4. Code optimization suggestions
5. Best practices violations

Provide line-by-line feedback where applicable. Format your response as:
- ERRORS (line number): description
- SECURITY (line number): vulnerability and fix
- OPTIMIZATION (line number): suggestion
- BEST PRACTICE (line number): recommendation

Code to analyze (${chunkInfo || 'unknown file'}):
\`\`\`
${code}
\`\`\`

Provide detailed, actionable feedback.`;

        const analysis = await provider.query(prompt, { apiKey, timeout: 120000 });

        res.json({
            success: true,
            analysis,
            model: 'mistral-small-latest',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Mistral analysis error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid Mistral API key' });
        }
        if (error.message && error.message.includes('Mistral API key is required')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
