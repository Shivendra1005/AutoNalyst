const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const uploadRoutes = require('./routes/uploadRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const securityRoutes = require('./routes/securityRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize keys.json if it doesn't exist
const keysPath = path.join(dataDir, 'keys.json');
if (!fs.existsSync(keysPath)) {
  fs.writeFileSync(keysPath, JSON.stringify({ mistral: null }, null, 2));
}

// Routes
app.use('/api', uploadRoutes);
app.use('/api', analysisRoutes);
app.use('/api', securityRoutes);
app.use('/api', settingsRoutes);
app.use('/api', projectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AutoNalyst Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 AutoNalyst Backend running on http://localhost:${PORT}`);
});
