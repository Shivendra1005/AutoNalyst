const axios = require('axios');
const path = require('path');
const fs = require('fs');

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const CHUNK_TIMEOUT = 180000;

const SEVERITY_WEIGHTS = { CRITICAL: 10, HIGH: 7, MEDIUM: 4, LOW: 1 };

function buildChunkPrompt(chunkCode, chunkInfo, projectType, totalFiles) {
    return `You are a professional security code auditor analyzing a ${projectType || 'software'} project with ${totalFiles} source files.

Below is an excerpt of the project. Each file is preceded by "===== FILE: path/to/file =====".

Analyze this code excerpt for:
1. Security vulnerabilities
2. Bugs and syntax errors
3. Performance issues
4. Best practice violations

For each issue, respond with a JSON object containing:
- "type": "SECURITY", "ERROR", "PERFORMANCE", or "BEST_PRACTICE"
- "severity": "CRITICAL", "HIGH", "MEDIUM", or "LOW"
- "file": the file path from the nearest "===== FILE:" marker above
- "line": approximate line number (0 if unknown)
- "description": clear description of the issue
- "recommendation": actionable fix recommendation

Respond ONLY with a JSON array. Example:
[
  {
    "type": "SECURITY",
    "severity": "HIGH",
    "file": "src/server.js",
    "line": 42,
    "description": "SQL injection vulnerability",
    "recommendation": "Use parameterized queries"
  }
]

If no issues found, return [].

Code excerpt (${chunkInfo}):
\`\`\`
${chunkCode}
\`\`\`

ONLY the JSON array. No other text.`;
}

function parseFindings(text) {
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return parsed;
    } catch (e) {}

    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (blockMatch) {
        try {
            const parsed = JSON.parse(blockMatch[1].trim());
            if (Array.isArray(parsed)) return parsed;
        } catch (e2) {}
    }

    const arrayMatch = text.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (arrayMatch) {
        try {
            const parsed = JSON.parse(arrayMatch[0]);
            if (Array.isArray(parsed)) return parsed;
        } catch (e3) {}
    }

    return [];
}

async function analyzeChunk(chunk, model, mode, apiKey, projectType, totalFiles) {
    const chunkInfo = `${chunk.metadata.fileName} - Lines ${chunk.startLine}-${chunk.endLine} (chunk ${chunk.chunkIndex + 1} of ${chunk.totalChunks})`;
    const prompt = buildChunkPrompt(chunk.code, chunkInfo, projectType, totalFiles);
    let responseText;

    if (mode === 'offline') {
        const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
            model,
            prompt,
            stream: false
        }, { timeout: CHUNK_TIMEOUT });
        responseText = response.data.response;
    } else {
        let key = apiKey;
        if (!key) {
            const keysPath = path.join(__dirname, '../data/keys.json');
            if (fs.existsSync(keysPath)) {
                const keys = JSON.parse(fs.readFileSync(keysPath, 'utf-8'));
                key = keys.mistral;
            }
        }
        const response = await axios.post(MISTRAL_API_URL, {
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 4096
        }, {
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            timeout: CHUNK_TIMEOUT
        });
        responseText = response.data.choices[0]?.message?.content || '[]';
    }

    return parseFindings(responseText);
}

function mergeFindings(allFindings) {
    const merged = [];
    const seen = new Set();

    for (const findings of allFindings) {
        for (const f of findings) {
            if (!f.type || !f.severity) continue;
            const key = `${f.type}|${f.file || ''}|${f.description || ''}`;
            if (!seen.has(key)) {
                seen.add(key);
                merged.push({
                    type: f.type,
                    severity: f.severity,
                    file: f.file || 'unknown',
                    line: f.line || 0,
                    description: f.description || 'No description',
                    recommendation: f.recommendation || 'No recommendation provided'
                });
            }
        }
    }

    return merged;
}

function calculateRiskScore(findings) {
    if (!findings.length) return { score: 100, level: 'low', label: 'Low Risk' };

    const totalWeight = findings.reduce((sum, f) => sum + (SEVERITY_WEIGHTS[f.severity] || 1), 0);
    const maxPossible = findings.length * 10;
    const score = Math.max(0, Math.round(100 - (totalWeight / maxPossible) * 100));

    let level, label;
    if (score >= 80) { level = 'low'; label = 'Low Risk'; }
    else if (score >= 50) { level = 'medium'; label = 'Medium Risk'; }
    else if (score >= 30) { level = 'high'; label = 'High Risk'; }
    else { level = 'critical'; label = 'Critical Risk'; }

    return { score, level, label };
}

function generateFinalReport(findings, projectFileName, projectType, totalFiles, riskScore) {
    const critical = findings.filter(f => f.severity === 'CRITICAL');
    const high = findings.filter(f => f.severity === 'HIGH');
    const medium = findings.filter(f => f.severity === 'MEDIUM');
    const low = findings.filter(f => f.severity === 'LOW');

    const affectedFiles = [...new Set(findings.map(f => f.file))].sort();
    const allRecs = findings.map(f => f.recommendation).filter(Boolean);
    const uniqueRecs = [...new Set(allRecs)];

    const lines = [];

    lines.push('# Project Security Report');
    lines.push('');
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`A comprehensive security analysis was performed on the project **"${projectFileName}"**.`);
    if (projectType) {
        lines.push('');
        lines.push(`- **Project Type:** ${projectType}`);
    }
    lines.push(`- **Source Files Analyzed:** ${totalFiles}`);
    lines.push(`- **Total Issues Found:** ${findings.length}`);
    lines.push(`- **Risk Score:** ${riskScore.score}/100 (${riskScore.label})`);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(`## Overall Risk Score: ${riskScore.score}/100`);
    lines.push('');
    lines.push(`**${riskScore.label}**`);
    lines.push('');
    lines.push('---');
    lines.push('');

    const sections = [
        { title: 'Critical Vulnerabilities', items: critical },
        { title: 'High Vulnerabilities', items: high },
        { title: 'Medium Vulnerabilities', items: medium },
        { title: 'Low Vulnerabilities', items: low }
    ];

    for (const section of sections) {
        if (section.items.length > 0) {
            lines.push(`## ${section.title} (${section.items.length})`);
            lines.push('');
            for (const f of section.items) {
                const location = f.file ? ` (${f.file}${f.line ? `:${f.line}` : ''})` : '';
                lines.push(`- **${f.type}**${location}: ${f.description}`);
                lines.push(`  - *Recommendation:* ${f.recommendation}`);
            }
            lines.push('');
        }
    }

    lines.push('## Affected Files');
    lines.push('');
    if (affectedFiles.length > 0) {
        for (const file of affectedFiles) {
            lines.push(`- ${file}`);
        }
    } else {
        lines.push('No specific files identified.');
    }
    lines.push('');

    lines.push('## Recommendations');
    lines.push('');
    if (uniqueRecs.length > 0) {
        uniqueRecs.forEach((rec, i) => {
            lines.push(`${i + 1}. ${rec}`);
        });
    } else {
        lines.push('No specific recommendations generated.');
    }
    lines.push('');

    lines.push('## Final Security Assessment');
    lines.push('');
    if (riskScore.level === 'low') {
        lines.push('The project demonstrates good security practices. The few issues found are minor and should be addressed during regular maintenance cycles.');
    } else if (riskScore.level === 'medium') {
        lines.push('The project has several security concerns that should be addressed. Prioritize fixing critical and high-severity issues before deploying to production. Regular security reviews are recommended.');
    } else if (riskScore.level === 'high') {
        lines.push('The project has significant security vulnerabilities that require immediate attention. It is strongly recommended to address all critical and high issues before deployment. A thorough security review is advised.');
    } else {
        lines.push('The project has critical security vulnerabilities that pose an immediate risk. Do not deploy the application until all issues are resolved. Immediate remediation is required.');
    }
    lines.push('');

    return lines.join('\n');
}

async function analyzeProject(chunks, projectType, fileName, totalFiles, model, mode, apiKey) {
    const allRawFindings = [];

    for (let i = 0; i < chunks.length; i++) {
        const findings = await analyzeChunk(chunks[i], model, mode, apiKey, projectType, totalFiles);
        allRawFindings.push(findings);
    }

    const mergedFindings = mergeFindings(allRawFindings);
    const riskScore = calculateRiskScore(mergedFindings);
    const report = generateFinalReport(mergedFindings, fileName, projectType, totalFiles, riskScore);

    return {
        success: true,
        analysis: report,
        model,
        timestamp: new Date().toISOString(),
        riskScore,
        totalFindings: mergedFindings.length
    };
}

module.exports = { analyzeProject };
