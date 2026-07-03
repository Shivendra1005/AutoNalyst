import { useState } from 'react'
import axios from 'axios'

function WebsiteTesting() {
    const [url, setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null)

    const handleTest = async (e) => {
        e.preventDefault()

        if (!url.trim()) {
            setError('Please enter a URL')
            return
        }

        setIsLoading(true)
        setError(null)
        setResults(null)

        try {
            const response = await axios.post('/api/test-website', { url: url.trim() })

            if (response.data.success) {
                setResults(response.data)
            } else {
                setError(response.data.error || 'Security test failed')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to test website. Please check the URL and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const getSeverityClass = (score) => {
        if (score >= 80) return 'low'
        if (score >= 50) return 'medium'
        return 'high'
    }

    const getStatusClass = (status) => {
        if (status === 'pass') return 'pass'
        if (status === 'warn') return 'warn'
        return 'fail'
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Website Security Testing</h1>
                <p className="page-subtitle">
                    Perform non-intrusive security analysis on any website to identify vulnerabilities and misconfigurations.
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* URL Input */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                    <form onSubmit={handleTest}>
                        <div className="input-group" style={{ marginBottom: '16px' }}>
                            <label className="input-label">Website URL</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    Run Security Test
                                </>
                            )}
                        </button>
                    </form>

                    <div className="alert alert-info" style={{ marginTop: '16px', marginBottom: 0 }}>
                        <strong>Non-intrusive testing only:</strong> We only perform passive analysis using standard HTTP requests.
                        No brute force, authentication bypass, SQL injection, or aggressive scanning is performed.
                    </div>
                </div>
            </div>

            {/* Results */}
            {isLoading && (
                <div className="card">
                    <div className="card-body">
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <p className="loading-text">Running security checks...</p>
                        </div>
                    </div>
                </div>
            )}

            {results && (
                <div className="security-report">
                    {/* Risk Score */}
                    <div className="risk-score-card">
                        <div className={`risk-score ${getSeverityClass(results.riskScore)}`}>
                            {results.riskScore}
                        </div>
                        <div className="risk-label">{results.severity.label}</div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '14px' }}>
                            Security Score for {results.results.url}
                        </p>
                    </div>

                    {/* SSL Certificate */}
                    <div className="security-section">
                        <div className="security-section-header">
                            <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span className="security-section-title">SSL Certificate</span>
                        </div>
                        <div className="security-section-body">
                            <div className="security-item">
                                <div className={`security-status ${results.results.ssl.valid ? 'pass' : 'fail'}`}></div>
                                <div className="security-item-content">
                                    <div className="security-item-title">
                                        {results.results.ssl.valid ? 'Valid SSL Certificate' : 'SSL Certificate Issue'}
                                    </div>
                                    <div className="security-item-desc">
                                        {results.results.ssl.valid ? (
                                            <>
                                                Issued by: {results.results.ssl.issuer || 'Unknown'}<br />
                                                Expires in: {results.results.ssl.daysUntilExpiry} days
                                            </>
                                        ) : (
                                            results.results.ssl.errors?.join(', ') || 'Certificate validation failed'
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Headers */}
                    <div className="security-section">
                        <div className="security-section-header">
                            <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span className="security-section-title">Security Headers</span>
                        </div>
                        <div className="security-section-body">
                            {results.results.headers.present.map((header) => (
                                <div key={header} className="security-item">
                                    <div className="security-status pass"></div>
                                    <div className="security-item-content">
                                        <div className="security-item-title">{header}</div>
                                        <div className="security-item-desc">
                                            {results.results.headers.details[header]?.substring(0, 100) || 'Present'}
                                            {results.results.headers.details[header]?.length > 100 && '...'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {results.results.headers.missing.map((header) => (
                                <div key={header} className="security-item">
                                    <div className="security-status warn"></div>
                                    <div className="security-item-content">
                                        <div className="security-item-title">{header}</div>
                                        <div className="security-item-desc">Missing - Consider adding this header for improved security</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exposed Configurations */}
                    <div className="security-section">
                        <div className="security-section-header">
                            <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                            <span className="security-section-title">Exposed Configurations</span>
                        </div>
                        <div className="security-section-body">
                            {results.results.exposedConfigs.found.length === 0 ? (
                                <div className="security-item">
                                    <div className="security-status pass"></div>
                                    <div className="security-item-content">
                                        <div className="security-item-title">No exposed configuration files found</div>
                                        <div className="security-item-desc">Checked: {results.results.exposedConfigs.checked.join(', ')}</div>
                                    </div>
                                </div>
                            ) : (
                                results.results.exposedConfigs.found.map((config) => (
                                    <div key={config.path} className="security-item">
                                        <div className="security-status fail"></div>
                                        <div className="security-item-content">
                                            <div className="security-item-title">{config.path} is accessible</div>
                                            <div className="security-item-desc">This configuration file should not be publicly accessible</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Default Pages */}
                    <div className="security-section">
                        <div className="security-section-header">
                            <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                            </svg>
                            <span className="security-section-title">Default Pages</span>
                        </div>
                        <div className="security-section-body">
                            {results.results.defaultPages.found.length === 0 ? (
                                <div className="security-item">
                                    <div className="security-status pass"></div>
                                    <div className="security-item-content">
                                        <div className="security-item-title">No default admin pages found</div>
                                        <div className="security-item-desc">Checked common admin paths</div>
                                    </div>
                                </div>
                            ) : (
                                results.results.defaultPages.found.map((page) => (
                                    <div key={page.path} className="security-item">
                                        <div className="security-status warn"></div>
                                        <div className="security-item-content">
                                            <div className="security-item-title">{page.path} (Status: {page.status})</div>
                                            <div className="security-item-desc">Consider restricting access to this page</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* robots.txt & sitemap */}
                    <div className="security-section">
                        <div className="security-section-header">
                            <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            <span className="security-section-title">Metadata Files</span>
                        </div>
                        <div className="security-section-body">
                            <div className="security-item">
                                <div className={`security-status ${results.results.robotsTxt.exists ? 'pass' : 'warn'}`}></div>
                                <div className="security-item-content">
                                    <div className="security-item-title">robots.txt</div>
                                    <div className="security-item-desc">
                                        {results.results.robotsTxt.exists
                                            ? 'Present' + (results.results.robotsTxt.issues.length > 0 ? ` - ${results.results.robotsTxt.issues.join(', ')}` : '')
                                            : 'Not found'
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="security-item">
                                <div className={`security-status ${results.results.sitemapXml.exists ? 'pass' : 'warn'}`}></div>
                                <div className="security-item-content">
                                    <div className="security-item-title">sitemap.xml</div>
                                    <div className="security-item-desc">
                                        {results.results.sitemapXml.exists
                                            ? `Present - ${results.results.sitemapXml.urls} URLs indexed`
                                            : 'Not found'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client-Side Issues */}
                    {results.results.clientSideIssues.length > 0 && (
                        <div className="security-section">
                            <div className="security-section-header">
                                <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16,18 22,12 16,6"></polyline>
                                    <polyline points="8,6 2,12 8,18"></polyline>
                                </svg>
                                <span className="security-section-title">Client-Side Issues</span>
                            </div>
                            <div className="security-section-body">
                                {results.results.clientSideIssues.map((issue, index) => (
                                    <div key={index} className="security-item">
                                        <div className="security-status warn"></div>
                                        <div className="security-item-content">
                                            <div className="security-item-title">Issue Detected</div>
                                            <div className="security-item-desc">{issue}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {results.recommendations && results.recommendations.length > 0 && (
                        <div className="security-section">
                            <div className="security-section-header">
                                <svg className="security-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <span className="security-section-title">Recommendations</span>
                            </div>
                            <div className="security-section-body">
                                {results.recommendations.map((rec, index) => (
                                    <div key={index} className="security-item">
                                        <div className={`security-status ${rec.priority === 'high' ? 'fail' : 'warn'}`}></div>
                                        <div className="security-item-content">
                                            <div className="security-item-title">[{rec.category}] {rec.priority.toUpperCase()}</div>
                                            <div className="security-item-desc">{rec.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isLoading && !results && (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <h3 className="empty-state-title">No Security Scan Results</h3>
                            <p className="empty-state-desc">
                                Enter a website URL above and click "Run Security Test" to analyze the site's security posture.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WebsiteTesting
