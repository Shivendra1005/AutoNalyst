import { useState } from "react";
import api from "../api";

import {
    ShieldCheck,
    Globe,
    Search,
    Lock,
    CheckCircle2,
    TriangleAlert,
    FileWarning,
    Server,
    Globe2,
} from "lucide-react";

function WebsiteTesting() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleTest = async (e) => {
        e.preventDefault();

        if (!url.trim()) {
            setError("Please enter a website URL.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await api.post("/test-website", {
                url: url.trim(),
            });

            if (response.data.success) {
                setResults(response.data);
            } else {
                setError(response.data.error || "Security scan failed.");
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to scan website. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getSeverityClass = (score) => {
        if (score >= 80) return "low";
        if (score >= 50) return "medium";
        return "high";
    };

    const getStatusClass = (status) => {
        if (status === "pass") return "pass";
        if (status === "warn") return "warn";
        return "fail";
    };

    return (
        <div className="page-container">

            <div className="page-header">

                <div className="hero-badge">

                    <ShieldCheck size={16} />

                    AI Website Security Scanner

                </div>

                <h1 className="page-title">

                    Scan websites for vulnerabilities

                </h1>

                <p className="page-subtitle">

                    Passive security analysis including SSL,
                    security headers, exposed configuration files,
                    robots.txt, sitemap.xml and client-side security
                    inspection.

                </p>

            </div>

            {error && (

                <div className="alert alert-error">

                    {error}

                </div>

            )}

            <div className="website-card">

                <form onSubmit={handleTest}>

                    <div className="website-input-wrapper">

                        <div className="website-icon">

                            <Globe size={24} />

                        </div>

                        <input
                            type="text"
                            className="website-input"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                    </div>

                    <button
                        type="submit"
                        className="scan-btn"
                        disabled={isLoading}
                    >

                        {isLoading ? (
                            <>
                                <div className="loading-spinner"></div>
                                Scanning Website...
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                Run Security Scan
                            </>
                        )}

                    </button>

                </form>

                <div className="website-note">

                    <Lock size={18} />

                    Passive testing only.
                    No brute-force, SQL injection or exploitation
                    techniques are performed.

                </div>

            </div>

            {isLoading && (

                <div className="card">

                    <div className="card-body">

                        <div className="loading-overlay">

                            <div className="loading-spinner"></div>

                            <p className="loading-text">

                                Running security analysis...

                            </p>

                        </div>

                    </div>

                </div>

            )}

            {results && (

                <>
                    {/* Security Score */}

                    <div className="security-dashboard">

                        <div className="security-score-card">

                            <ShieldCheck size={42} />

                            <h2>Security Score</h2>

                            <div className={`risk-score ${getSeverityClass(results.riskScore)}`}>

                                {results.riskScore}

                            </div>

                            <span className="risk-label">

                                {results.severity.label}

                            </span>

                            <p className="score-url">

                                {results.results.url}

                            </p>

                        </div>

                        <div className="summary-grid">

                            <div className="summary-card">

                                <CheckCircle2
                                    size={22}
                                    color={results.results.ssl.valid ? "#22c55e" : "#ef4444"}
                                />

                                <div>

                                    <h4>SSL Certificate</h4>

                                    <p>

                                        {results.results.ssl.valid
                                            ? "Certificate Valid"
                                            : "Certificate Problem"}

                                    </p>

                                </div>

                            </div>

                            <div className="summary-card">

                                <ShieldCheck size={22} />

                                <div>

                                    <h4>Security Headers</h4>

                                    <p>

                                        {results.results.headers.present.length} Present

                                    </p>

                                </div>

                            </div>

                            <div className="summary-card">

                                <FileWarning size={22} />

                                <div>

                                    <h4>Missing Headers</h4>

                                    <p>

                                        {results.results.headers.missing.length} Missing

                                    </p>

                                </div>

                            </div>

                            <div className="summary-card">

                                <Server size={22} />

                                <div>

                                    <h4>Exposed Files</h4>

                                    <p>

                                        {results.results.exposedConfigs.found.length}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* SSL Certificate */}

                    <div className="security-section">

                        <div className="security-section-header">

                            <ShieldCheck className="security-section-icon" size={20} />

                            <span className="security-section-title">

                                SSL Certificate

                            </span>

                        </div>

                        <div className="security-section-body">

                            <div className="security-item">

                                <div
                                    className={`security-status ${results.results.ssl.valid ? "pass" : "fail"
                                        }`}
                                />

                                <div className="security-item-content">

                                    <div className="security-item-title">

                                        {results.results.ssl.valid
                                            ? "Certificate Valid"
                                            : "Certificate Invalid"}

                                    </div>

                                    <div className="security-item-desc">

                                        {results.results.ssl.valid ? (
                                            <>

                                                Issuer:

                                                {" "}

                                                {results.results.ssl.issuer || "Unknown"}

                                                <br />

                                                Expires in

                                                {" "}

                                                {results.results.ssl.daysUntilExpiry}

                                                {" "}

                                                days

                                            </>
                                        ) : (

                                            results.results.ssl.errors?.join(", ")

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Security Headers */}

                    <div className="security-section">

                        <div className="security-section-header">

                            <ShieldCheck className="security-section-icon" size={20} />

                            <span className="security-section-title">

                                Security Headers

                            </span>

                        </div>

                        <div className="security-section-body">
                            {results.results.headers.present.map((header) => (

                                <div
                                    key={header}
                                    className="security-item"
                                >

                                    <div className="security-status pass"></div>

                                    <div className="security-item-content">

                                        <div className="security-item-title">

                                            {header}

                                        </div>

                                        <div className="security-item-desc">

                                            {results.results.headers.details[header]?.substring(0, 100) || "Present"}

                                            {results.results.headers.details[header]?.length > 100 && "..."}

                                        </div>

                                    </div>

                                </div>

                            ))}

                            {results.results.headers.missing.map((header) => (

                                <div
                                    key={header}
                                    className="security-item"
                                >

                                    <div className="security-status warn"></div>

                                    <div className="security-item-content">

                                        <div className="security-item-title">

                                            {header}

                                        </div>

                                        <div className="security-item-desc">

                                            Missing security header

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Exposed Configurations */}

                    <div className="security-section">

                        <div className="security-section-header">

                            <FileWarning
                                className="security-section-icon"
                                size={20}
                            />

                            <span className="security-section-title">

                                Exposed Configurations

                            </span>

                        </div>

                        <div className="security-section-body">

                            {results.results.exposedConfigs.found.length === 0 ? (

                                <div className="security-item">

                                    <div className="security-status pass"></div>

                                    <div className="security-item-content">

                                        <div className="security-item-title">

                                            No exposed configuration files found

                                        </div>

                                        <div className="security-item-desc">

                                            Checked:

                                            {" "}

                                            {results.results.exposedConfigs.checked.join(", ")}

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                results.results.exposedConfigs.found.map((config) => (

                                    <div
                                        key={config.path}
                                        className="security-item"
                                    >

                                        <div className="security-status fail"></div>

                                        <div className="security-item-content">

                                            <div className="security-item-title">

                                                {config.path}

                                            </div>

                                            <div className="security-item-desc">

                                                Publicly accessible configuration file.

                                            </div>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                    {/* Default Pages */}

                    <div className="security-section">

                        <div className="security-section-header">

                            <Globe2
                                className="security-section-icon"
                                size={20}
                            />

                            <span className="security-section-title">

                                Default Pages

                            </span>

                        </div>

                        <div className="security-section-body">

                            {results.results.defaultPages.found.length === 0 ? (

                                <div className="security-item">

                                    <div className="security-status pass"></div>

                                    <div className="security-item-content">

                                        <div className="security-item-title">

                                            No default pages detected

                                        </div>

                                        <div className="security-item-desc">

                                            Common admin endpoints checked.

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                results.results.defaultPages.found.map((page) => (

                                    <div
                                        key={page.path}
                                        className="security-item"
                                    >

                                        <div className="security-status warn"></div>

                                        <div className="security-item-content">

                                            <div className="security-item-title">

                                                {page.path}

                                            </div>

                                            <div className="security-item-desc">

                                                Status {page.status}

                                            </div>

                                        </div>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>
                    {/* Metadata Files */}

                    <div className="security-section">

                        <div className="security-section-header">

                            <Globe2
                                className="security-section-icon"
                                size={20}
                            />

                            <span className="security-section-title">

                                Metadata Files

                            </span>

                        </div>

                        <div className="security-section-body">

                            <div className="security-item">

                                <div
                                    className={`security-status ${results.results.robotsTxt.exists
                                        ? "pass"
                                        : "warn"
                                        }`}
                                />

                                <div className="security-item-content">

                                    <div className="security-item-title">

                                        robots.txt

                                    </div>

                                    <div className="security-item-desc">

                                        {results.results.robotsTxt.exists
                                            ? "Present"
                                            : "Not Found"}

                                    </div>

                                </div>

                            </div>

                            <div className="security-item">

                                <div
                                    className={`security-status ${results.results.sitemapXml.exists
                                        ? "pass"
                                        : "warn"
                                        }`}
                                />

                                <div className="security-item-content">

                                    <div className="security-item-title">

                                        sitemap.xml

                                    </div>

                                    <div className="security-item-desc">

                                        {results.results.sitemapXml.exists
                                            ? `${results.results.sitemapXml.urls} URLs`
                                            : "Not Found"}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Client Side Issues */}

                    {results.results.clientSideIssues.length > 0 && (

                        <div className="security-section">

                            <div className="security-section-header">

                                <TriangleAlert
                                    className="security-section-icon"
                                    size={20}
                                />

                                <span className="security-section-title">

                                    Client Side Issues

                                </span>

                            </div>

                            <div className="security-section-body">

                                {results.results.clientSideIssues.map(
                                    (issue, index) => (

                                        <div
                                            key={index}
                                            className="security-item"
                                        >

                                            <div className="security-status warn"></div>

                                            <div className="security-item-content">

                                                <div className="security-item-title">

                                                    Issue Detected

                                                </div>

                                                <div className="security-item-desc">

                                                    {issue}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                    {/* Recommendations */}

                    {results.recommendations?.length > 0 && (

                        <div className="security-section">

                            <div className="security-section-header">

                                <ShieldCheck
                                    className="security-section-icon"
                                    size={20}
                                />

                                <span className="security-section-title">

                                    Recommendations

                                </span>

                            </div>

                            <div className="security-section-body">

                                {results.recommendations.map((rec, index) => (

                                    <div
                                        key={index}
                                        className="security-item"
                                    >

                                        <div
                                            className={`security-status ${rec.priority === "high"
                                                ? "fail"
                                                : "warn"
                                                }`}
                                        />

                                        <div className="security-item-content">

                                            <div className="security-item-title">

                                                [{rec.category}] {rec.priority.toUpperCase()}

                                            </div>

                                            <div className="security-item-desc">

                                                {rec.message}

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    )}

                </>

            )}

            {!isLoading && !results && (

                <div className="card">

                    <div className="card-body">

                        <div className="empty-state">

                            <ShieldCheck
                                size={48}
                                className="empty-state-icon"
                            />

                            <h3>

                                No Scan Results

                            </h3>

                            <p>

                                Enter a website URL above and click
                                <strong> Run Security Scan </strong>
                                to analyze its security posture.

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default WebsiteTesting;