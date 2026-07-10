const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { chunkCode } = require('../utils/codeChunker');
const { processZip } = require('../utils/projectScanner');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for ZIPs
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.java', '.c', '.cpp', '.go', '.rb', '.php', '.sql', '.sh', '.yml', '.yaml', '.xml', '.md', '.zip'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${ext} is not supported`));
        }
    }
});

// Upload file or ZIP project and return chunks
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileName = req.file.originalname;
        const ext = path.extname(fileName).toLowerCase();

        // Handle ZIP upload - extract, scan, aggregate, then chunk
        if (ext === '.zip') {
            const { aggregatedText, totalLines, fileCount, projectType } = await processZip(filePath);

            // Clean up the uploaded zip file
            fs.unlinkSync(filePath);

            const language = projectType || 'project';
            const chunks = chunkCode(aggregatedText, fileName, language);

            return res.json({
                success: true,
                fileName,
                language,
                totalLines,
                totalFiles: fileCount,
                projectType,
                isProject: true,
                uploadTime: new Date().toISOString(),
                chunks
            });
        }

        // Existing behavior for regular source files
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const languageMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.html': 'html',
            '.css': 'css',
            '.json': 'json',
            '.java': 'java',
            '.c': 'c',
            '.cpp': 'cpp',
            '.go': 'go',
            '.rb': 'ruby',
            '.php': 'php',
            '.sql': 'sql',
            '.sh': 'bash',
            '.yml': 'yaml',
            '.yaml': 'yaml',
            '.xml': 'xml',
            '.md': 'markdown'
        };

        const language = languageMap[ext] || 'plaintext';
        const chunks = chunkCode(fileContent, fileName, language);

        res.json({
            success: true,
            fileName,
            language,
            totalLines: fileContent.split('\n').length,
            uploadTime: new Date().toISOString(),
            chunks
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get uploaded files list
router.get('/files', (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads');
        const files = fs.readdirSync(uploadsDir).map(file => {
            const stats = fs.statSync(path.join(uploadsDir, file));
            return {
                name: file,
                size: stats.size,
                uploadedAt: stats.mtime
            };
        });
        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
