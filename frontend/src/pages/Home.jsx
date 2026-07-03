import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="page-container">
            <div className="home-hero">
                <h1 className="hero-title">
                    Welcome to <span>AutoNalyst</span>
                </h1>
                <p className="hero-subtitle">
                    AI-powered cybersecurity tool for code analysis, error detection, optimization,
                    and comprehensive website security testing.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link to="/code-analysis" className="btn btn-primary btn-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16,18 22,12 16,6"></polyline>
                            <polyline points="8,6 2,12 8,18"></polyline>
                        </svg>
                        Analyze Code
                    </Link>
                    <Link to="/website-testing" className="btn btn-secondary btn-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Test Website
                    </Link>
                </div>
            </div>

            <div className="feature-grid">
                <Link to="/code-analysis" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                    </div>
                    <h3 className="feature-title">Code Analysis</h3>
                    <p className="feature-desc">
                        Upload code files for AI-powered line-by-line error detection, security vulnerability
                        scanning, and optimization suggestions.
                    </p>
                </Link>

                <Link to="/code-analysis" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                    </div>
                    <h3 className="feature-title">Side-by-Side View</h3>
                    <p className="feature-desc">
                        View original code alongside annotated analysis with color-coded errors (red),
                        suggestions (green), and detailed explanations.
                    </p>
                </Link>

                <Link to="/code-analysis" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                        </svg>
                    </div>
                    <h3 className="feature-title">Offline & Online AI</h3>
                    <p className="feature-desc">
                        Choose between local Ollama models for offline analysis or Mistral API
                        for cloud-powered insights.
                    </p>
                </Link>

                <Link to="/website-testing" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <h3 className="feature-title">Security Testing</h3>
                    <p className="feature-desc">
                        Non-intrusive website security analysis including SSL certificates, headers,
                        exposed configs, and client-side vulnerabilities.
                    </p>
                </Link>

                <Link to="/website-testing" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22,4 12,14.01 9,11.01"></polyline>
                        </svg>
                    </div>
                    <h3 className="feature-title">Risk Scoring</h3>
                    <p className="feature-desc">
                        Get a comprehensive risk score (0-100) with detailed report cards showing
                        vulnerabilities and recommended fixes.
                    </p>
                </Link>

                <Link to="/settings" className="feature-card">
                    <div className="feature-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3 className="feature-title">Secure API Keys</h3>
                    <p className="feature-desc">
                        Safely store and manage your Mistral API keys locally for online code
                        analysis without exposing sensitive data.
                    </p>
                </Link>
            </div>
        </div>
    )
}

export default Home
