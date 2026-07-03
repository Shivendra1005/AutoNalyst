const express = require('express');
const axios = require('axios');
const https = require('https');
const dns = require('dns').promises;
const { URL } = require('url');

const router = express.Router();

// Security test configuration
const SECURITY_HEADERS = [
    'strict-transport-security',
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy'
];

const EXPOSED_PATHS = [
    '/.env',
    '/config.js',
    '/config.json',
    '/.git/config',
    '/wp-config.php',
    '/package.json',
    '/.htaccess',
    '/server.js',
    '/database.yml'
];

const DEFAULT_PAGES = [
    '/admin',
    '/administrator',
    '/wp-admin',
    '/login',
    '/phpmyadmin',
    '/cpanel',
    '/dashboard',
    '/.well-known/security.txt'
];

// Helper: Calculate risk score
function calculateRiskScore(results) {
    let score = 100;

    // SSL issues
    if (!results.ssl.valid) score -= 30;
    if (results.ssl.daysUntilExpiry < 30) score -= 10;

    // Missing security headers
    const missingHeaders = results.headers.missing.length;
    score -= missingHeaders * 5;

    // Exposed configurations
    score -= results.exposedConfigs.found.length * 15;

    // Default pages found
    score -= results.defaultPages.found.length * 5;

    // Client-side issues
    score -= results.clientSideIssues.length * 5;

    return Math.max(0, Math.min(100, score));
}

// Helper: Get severity color
function getSeverity(score) {
    if (score >= 80) return { level: 'low', color: 'green', label: 'Low Risk' };
    if (score >= 50) return { level: 'medium', color: 'orange', label: 'Medium Risk' };
    return { level: 'high', color: 'red', label: 'High Risk' };
}

// Main website security test endpoint
router.post('/test-website', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const results = {
            url: baseUrl,
            timestamp: new Date().toISOString(),
            ssl: { valid: false, issuer: null, daysUntilExpiry: null, errors: [] },
            headers: { present: [], missing: [], details: {} },
            exposedConfigs: { found: [], checked: EXPOSED_PATHS },
            defaultPages: { found: [], checked: DEFAULT_PAGES },
            robotsTxt: { exists: false, content: null, issues: [] },
            sitemapXml: { exists: false, urls: 0 },
            clientSideIssues: [],
            dns: { records: null }
        };

        // 1. SSL Certificate Check
        try {
            const sslPromise = new Promise((resolve, reject) => {
                const req = https.request(parsedUrl, { method: 'HEAD', timeout: 10000 }, (response) => {
                    const cert = response.socket.getPeerCertificate();
                    if (cert && Object.keys(cert).length > 0) {
                        const validTo = new Date(cert.valid_to);
                        const now = new Date();
                        const daysUntilExpiry = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));

                        resolve({
                            valid: true,
                            issuer: cert.issuer?.O || 'Unknown',
                            validFrom: cert.valid_from,
                            validTo: cert.valid_to,
                            daysUntilExpiry,
                            subject: cert.subject?.CN
                        });
                    } else {
                        resolve({ valid: false, errors: ['No certificate found'] });
                    }
                });
                req.on('error', (e) => resolve({ valid: false, errors: [e.message] }));
                req.on('timeout', () => {
                    req.destroy();
                    resolve({ valid: false, errors: ['Connection timeout'] });
                });
                req.end();
            });
            results.ssl = await sslPromise;
        } catch (e) {
            results.ssl.errors.push(e.message);
        }

        // 2. Security Headers Check
        try {
            const headResponse = await axios.get(baseUrl, {
                timeout: 10000,
                validateStatus: () => true,
                maxRedirects: 5
            });

            const headers = headResponse.headers;
            SECURITY_HEADERS.forEach(header => {
                if (headers[header]) {
                    results.headers.present.push(header);
                    results.headers.details[header] = headers[header];
                } else {
                    results.headers.missing.push(header);
                }
            });

            // Check CORS
            if (headers['access-control-allow-origin'] === '*') {
                results.headers.details['cors-warning'] = 'Permissive CORS policy detected';
            }
        } catch (e) {
            results.headers.error = e.message;
        }

        // 3. Exposed Configuration Check (non-intrusive)
        const configChecks = EXPOSED_PATHS.map(async (configPath) => {
            try {
                const response = await axios.get(`${baseUrl}${configPath}`, {
                    timeout: 5000,
                    validateStatus: (status) => status < 500
                });
                if (response.status === 200 && response.data) {
                    return { path: configPath, accessible: true };
                }
            } catch {
                // Path not accessible - good
            }
            return null;
        });

        const configResults = await Promise.all(configChecks);
        results.exposedConfigs.found = configResults.filter(r => r !== null);

        // 4. Default Pages Check
        const pageChecks = DEFAULT_PAGES.map(async (pagePath) => {
            try {
                const response = await axios.get(`${baseUrl}${pagePath}`, {
                    timeout: 5000,
                    validateStatus: (status) => status < 500
                });
                if (response.status === 200) {
                    return { path: pagePath, status: response.status };
                }
            } catch {
                // Page not accessible
            }
            return null;
        });

        const pageResults = await Promise.all(pageChecks);
        results.defaultPages.found = pageResults.filter(r => r !== null);

        // 5. robots.txt Analysis
        try {
            const robotsResponse = await axios.get(`${baseUrl}/robots.txt`, { timeout: 5000 });
            if (robotsResponse.status === 200) {
                results.robotsTxt.exists = true;
                results.robotsTxt.content = robotsResponse.data.substring(0, 1000);

                // Check for concerning patterns
                const content = robotsResponse.data.toLowerCase();
                if (content.includes('disallow: /admin') || content.includes('disallow: /api')) {
                    results.robotsTxt.issues.push('Sensitive paths disclosed in robots.txt');
                }
            }
        } catch {
            results.robotsTxt.exists = false;
        }

        // 6. sitemap.xml Check
        try {
            const sitemapResponse = await axios.get(`${baseUrl}/sitemap.xml`, { timeout: 5000 });
            if (sitemapResponse.status === 200) {
                results.sitemapXml.exists = true;
                const urlMatches = sitemapResponse.data.match(/<loc>/g);
                results.sitemapXml.urls = urlMatches ? urlMatches.length : 0;
            }
        } catch {
            results.sitemapXml.exists = false;
        }

        // 7. Client-Side Code Analysis (fetch main page and analyze)
        try {
            const mainPage = await axios.get(baseUrl, { timeout: 10000 });
            const html = mainPage.data;

            // Check for inline scripts
            const inlineScripts = (html.match(/<script[^>]*>[^<]+<\/script>/gi) || []).length;
            if (inlineScripts > 5) {
                results.clientSideIssues.push(`${inlineScripts} inline scripts detected - consider using external files`);
            }

            // Check for dangerous patterns
            if (html.includes('eval(') || html.includes('document.write(')) {
                results.clientSideIssues.push('Potentially dangerous JavaScript patterns detected (eval/document.write)');
            }

            // Check for exposed API keys patterns
            if (/["']sk-[a-zA-Z0-9]{20,}["']/i.test(html) || /["']api[_-]?key["']\s*[:=]\s*["'][^"']+["']/i.test(html)) {
                results.clientSideIssues.push('Potential API key exposure in client-side code');
            }

            // Check for mixed content
            if (parsedUrl.protocol === 'https:' && html.includes('http://')) {
                results.clientSideIssues.push('Mixed content detected (HTTP resources on HTTPS page)');
            }
        } catch (e) {
            results.clientSideIssues.push(`Could not analyze page content: ${e.message}`);
        }

        // 8. DNS Records
        try {
            const records = await dns.resolveAny(parsedUrl.hostname);
            results.dns.records = records.slice(0, 10); // Limit results
        } catch {
            results.dns.records = null;
        }

        // Calculate final risk score
        const riskScore = calculateRiskScore(results);
        const severity = getSeverity(riskScore);

        res.json({
            success: true,
            riskScore,
            severity,
            results,
            recommendations: generateRecommendations(results)
        });

    } catch (error) {
        console.error('Security test error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate recommendations based on results
function generateRecommendations(results) {
    const recommendations = [];

    if (!results.ssl.valid) {
        recommendations.push({
            priority: 'high',
            category: 'SSL',
            message: 'Install a valid SSL certificate to encrypt traffic'
        });
    } else if (results.ssl.daysUntilExpiry < 30) {
        recommendations.push({
            priority: 'medium',
            category: 'SSL',
            message: `SSL certificate expires in ${results.ssl.daysUntilExpiry} days - renew soon`
        });
    }

    results.headers.missing.forEach(header => {
        recommendations.push({
            priority: header === 'strict-transport-security' || header === 'content-security-policy' ? 'high' : 'medium',
            category: 'Headers',
            message: `Add ${header} header for improved security`
        });
    });

    results.exposedConfigs.found.forEach(config => {
        recommendations.push({
            priority: 'high',
            category: 'Configuration',
            message: `Block access to ${config.path} - sensitive file exposed`
        });
    });

    results.clientSideIssues.forEach(issue => {
        recommendations.push({
            priority: 'medium',
            category: 'Client-Side',
            message: issue
        });
    });

    return recommendations;
}

module.exports = router;
