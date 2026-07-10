const express = require('express');
const { analyzeProject } = require('../utils/projectAnalyzer');

const router = express.Router();

router.post('/analyze-project', async (req, res) => {
    try {
        const { chunks, model, mode, apiKey, projectType, fileName, totalFiles } = req.body;

        if (!chunks || !chunks.length) {
            return res.status(400).json({ error: 'No chunks provided for analysis' });
        }

        if (!model && mode === 'offline') {
            return res.status(400).json({ error: 'Model is required for offline analysis' });
        }

        req.setTimeout(600000);

        const result = await analyzeProject(
            chunks,
            projectType || null,
            fileName || 'unknown',
            totalFiles || chunks.length,
            model,
            mode || 'offline',
            apiKey
        );

        res.json(result);
    } catch (error) {
        console.error('Project analysis error:', error.message || error);
        if (error.code === 'ECONNREFUSED' || (error.cause && error.cause.code === 'ECONNREFUSED')) {
            return res.status(503).json({
                error: 'Ollama is not running. Please start Ollama and try again.'
            });
        }
        res.status(500).json({ error: 'Project analysis failed. Please try again.' });
    }
});

module.exports = router;
