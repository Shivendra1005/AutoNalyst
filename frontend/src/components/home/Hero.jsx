import { Link } from "react-router-dom";
import {
    ShieldCheck,
    ArrowRight,
    Globe,
    Code2,
    Sparkles,
    Lock,
    Activity,
    Bug,
    Cpu,
} from "lucide-react";

function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-grid">

                {/* LEFT SIDE */}
                <div className="hero-left">

                    <div className="hero-badge">
                        <ShieldCheck size={16} />
                        AI Powered Cybersecurity Platform
                    </div>

                    <h1 className="hero-title">
                        Secure your
                        <span> Code & Websites </span>
                        with AI
                    </h1>

                    <p className="hero-description">
                        AutoNalyst performs intelligent code analysis,
                        vulnerability detection and website security testing
                        using AI models to generate enterprise-grade reports
                        in seconds.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/code-analysis"
                            className="btn btn-primary btn-lg"
                        >
                            <Code2 size={20} />
                            Analyze Code
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/website-testing"
                            className="btn btn-secondary btn-lg"
                        >
                            <Globe size={20} />
                            Scan Website
                        </Link>
                    </div>

                    <div className="hero-highlights">

                        <div className="highlight-card">
                            <Sparkles size={22} />
                            <div>
                                <h4>AI Analysis</h4>
                                <p>Line-by-line intelligent review</p>
                            </div>
                        </div>

                        <div className="highlight-card">
                            <ShieldCheck size={22} />
                            <div>
                                <h4>Security First</h4>
                                <p>Enterprise vulnerability detection</p>
                            </div>
                        </div>

                        <div className="highlight-card">
                            <Lock size={22} />
                            <div>
                                <h4>Offline Support</h4>
                                <p>Powered by Ollama</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="hero-right">

                    <div className="dashboard-card">

                        <div className="dashboard-header">
                            <div className="dashboard-dot red"></div>
                            <div className="dashboard-dot yellow"></div>
                            <div className="dashboard-dot green"></div>

                            <span>Security Dashboard</span>
                        </div>

                        <div className="dashboard-body">

                            <div className="metric-card">
                                <Activity size={22} />
                                <div>
                                    <h3>99.8%</h3>
                                    <p>Detection Rate</p>
                                </div>
                            </div>

                            <div className="metric-card">
                                <Bug size={22} />
                                <div>
                                    <h3>42</h3>
                                    <p>Threats Blocked</p>
                                </div>
                            </div>

                            <div className="metric-card">
                                <Cpu size={22} />
                                <div>
                                    <h3>AI Ready</h3>
                                    <p>Offline + Cloud</p>
                                </div>
                            </div>

                            <div className="dashboard-progress">

                                <div className="progress-title">
                                    Security Score
                                    <span>96%</span>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: "96%" }}
                                    ></div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Hero;