const path = require('path');
const fs = require('fs');

const IGNORED_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', 'coverage', '.next',
    '.cache', '.vscode', '.idea', 'target', 'bin', 'obj', 'vendor'
]);

const BINARY_EXTS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.mp4', '.mp3',
    '.mov', '.zip', '.rar', '.7z', '.exe', '.dll', '.pdf'
]);

const SOURCE_EXTS = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.java', '.kt', '.py', '.cpp', '.c',
    '.cs', '.go', '.php', '.rb', '.swift', '.rs', '.html', '.css', '.scss',
    '.json', '.yaml', '.yml', '.xml', '.sql'
]);

const SPECIAL_FILES = new Set([
    'dockerfile', '.env.example', 'package.json', 'pom.xml',
    'requirements.txt', 'composer.json', 'cargo.toml'
]);

const LANGUAGE_MAP = {
    '.js': 'javascript', '.jsx': 'javascript', '.ts': 'typescript',
    '.tsx': 'typescript', '.java': 'java', '.kt': 'kotlin', '.py': 'python',
    '.cpp': 'cpp', '.c': 'c', '.cs': 'csharp', '.go': 'go', '.php': 'php',
    '.rb': 'ruby', '.swift': 'swift', '.rs': 'rust', '.html': 'html',
    '.css': 'css', '.scss': 'scss', '.json': 'json', '.yaml': 'yaml',
    '.yml': 'yaml', '.xml': 'xml', '.sql': 'sql'
};

function scanDirectory(dirPath, basePath) {
    const files = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORED_DIRS.has(entry.name)) {
                files.push(...scanDirectory(fullPath, basePath));
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            const name = entry.name.toLowerCase();

            if (BINARY_EXTS.has(ext)) continue;

            if (SOURCE_EXTS.has(ext) || SPECIAL_FILES.has(name)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const relativePath = path.relative(basePath, fullPath);
                    const language = LANGUAGE_MAP[name] || LANGUAGE_MAP[ext] || 'plaintext';
                    files.push({ relativePath, content, language });
                } catch (e) {
                    // skip binary/unreadable files silently
                }
            }
        }
    }

    return files;
}

function detectProjectType(files) {
    const basenames = new Set(files.map(f =>
        path.basename(f.relativePath).toLowerCase()
    ));
    const allPaths = files.map(f => f.relativePath.toLowerCase());

    if (basenames.has('pom.xml') || basenames.has('build.gradle'))
        return 'Spring Boot / Java';
    if (basenames.has('package.json')) {
        const pkgFile = files.find(f =>
            path.basename(f.relativePath).toLowerCase() === 'package.json'
        );
        if (pkgFile) {
            try {
                const pkg = JSON.parse(pkgFile.content);
                const deps = {
                    ...(pkg.dependencies || {}),
                    ...(pkg.devDependencies || {})
                };
                const depNames = Object.keys(deps);
                if (depNames.some(d => /next/.test(d))) return 'Next.js';
                if (depNames.some(d => /react/.test(d))) return 'React';
                if (depNames.some(d => /express/.test(d))) return 'Express / Node.js';
                return 'Node.js';
            } catch (e) { /* ignore parse errors */ }
        }
        return 'Node.js';
    }
    if (basenames.has('requirements.txt') || basenames.has('manage.py'))
        return 'Django / Python';
    if (allPaths.some(p => p.includes('flask') || p.endsWith('app.py')))
        return 'Flask / Python';
    if (basenames.has('composer.json'))
        return 'Laravel / PHP';
    if (basenames.has('cargo.toml'))
        return 'Rust';
    if (basenames.has('program.cs') || allPaths.some(p => p.endsWith('.csproj')))
        return 'ASP.NET / C#';

    if (files.some(f => f.language === 'javascript' || f.language === 'typescript'))
        return 'JavaScript / TypeScript';
    if (files.some(f => f.language === 'python'))
        return 'Python';
    if (files.some(f => f.language === 'java'))
        return 'Java';

    return null;
}

function buildAggregatedText(files) {
    const parts = [];
    let totalLines = 0;

    for (const file of files) {
        const lineCount = file.content.split('\n').length;
        totalLines += lineCount;
        parts.push(`===== FILE: ${file.relativePath} =====`);
        parts.push(file.content);
    }

    return {
        aggregatedText: parts.join('\n'),
        totalLines,
        fileCount: files.length
    };
}

async function processZip(zipPath) {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    const tempDir = path.join(path.dirname(zipPath), 'temp_' + Date.now());

    zip.extractAllTo(tempDir, true);

    try {
        const sourceFiles = scanDirectory(tempDir, tempDir);
        const projectType = detectProjectType(sourceFiles);
        const result = buildAggregatedText(sourceFiles);
        return { ...result, projectType };
    } finally {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
}

module.exports = { processZip };
