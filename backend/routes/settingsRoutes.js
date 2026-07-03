const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const KEYS_PATH = path.join(__dirname, '../data/keys.json');

// Ensure keys file exists
function ensureKeysFile() {
    if (!fs.existsSync(KEYS_PATH)) {
        fs.writeFileSync(KEYS_PATH, JSON.stringify({ mistral: null }, null, 2));
    }
}

// Save Mistral API key
router.post('/save-key', (req, res) => {
    try {
        const { provider, apiKey } = req.body;

        if (provider !== 'mistral') {
            return res.status(400).json({
                error: 'This feature is upcoming and will be available after the third project review at SLRTCE.'
            });
        }

        if (!apiKey || apiKey.trim().length === 0) {
            return res.status(400).json({ error: 'API key is required' });
        }

        ensureKeysFile();
        const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf-8'));
        keys.mistral = apiKey.trim();
        fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));

        res.json({ success: true, message: 'Mistral API key saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get key status (not the actual key)
router.get('/get-key-status', (req, res) => {
    try {
        ensureKeysFile();
        const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf-8'));

        res.json({
            mistral: keys.mistral ? {
                configured: true,
                preview: `${keys.mistral.substring(0, 8)}...${keys.mistral.slice(-4)}`
            } : { configured: false }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete API key
router.delete('/delete-key/:provider', (req, res) => {
    try {
        const { provider } = req.params;

        if (provider !== 'mistral') {
            return res.status(400).json({ error: 'Invalid provider' });
        }

        ensureKeysFile();
        const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf-8'));
        keys.mistral = null;
        fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));

        res.json({ success: true, message: 'API key deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
