import {
    Code2,
    ShieldCheck,
    Globe,
    Cpu,
    FileText,
    Lock,
    ArrowRight,
    CheckCircle,
} from "lucide-react";

const features = [
    {
        icon: Code2,
        title: "AI Code Review",
        description:
            "Analyze Java, Python, JavaScript, C++, PHP and more with intelligent line-by-line insights.",
    },
    {
        icon: ShieldCheck,
        title: "Security Scanner",
        description:
            "Detect vulnerabilities, insecure coding practices and common security risks instantly.",
    },
    {
        icon: Globe,
        title: "Website Testing",
        description:
            "Analyze live websites for SSL issues, missing security headers and configuration weaknesses.",
    },
    {
        icon: Cpu,
        title: "Offline AI",
        description:
            "Run local AI models using Ollama or switch to cloud models whenever needed.",
    },
];

const workflow = [
    "Upload your project",
    "AI scans every file",
    "Security analysis begins",
    "Generate detailed report",
];

function Stats() {
    return (
        <section className="stats-section">

            <div className="section-heading">
                <span>WHY AUTONALYST</span>

                <h2>
                    Everything you need to audit your application.
                </h2>

                <p>
                    Built for developers who want fast code reviews,
                    security analysis and AI-powered recommendations in
                    one place.
                </p>
            </div>

            <div className="stats-grid">

                {features.map((feature, index) => {

                    const Icon = feature.icon;

                    return (

                        <div className="stat-card" key={index}>

                            <div className="stat-icon">
                                <Icon size={28} />
                            </div>

                            <h4>{feature.title}</h4>

                            <p>{feature.description}</p>

                        </div>

                    );

                })}

            </div>

            <div className="workflow-section">

                <div className="workflow-left">

                    <span className="workflow-badge">
                        HOW IT WORKS
                    </span>

                    <h2>
                        Analyze your project in four simple steps.
                    </h2>

                    <p>
                        Upload your project, let AI inspect every file,
                        discover vulnerabilities and receive a complete
                        security report.
                    </p>

                </div>

                <div className="workflow-right">

                    {workflow.map((step, index) => (

                        <div className="workflow-card" key={index}>

                            <div className="workflow-number">
                                0{index + 1}
                            </div>

                            <div>

                                <h4>{step}</h4>

                                <p>
                                    AI powered automation
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </div>

                    ))}

                </div>

            </div>

            <div className="trusted-section">

                <h3>Powered By</h3>

                <div className="trusted-grid">

                    <div className="trusted-item">
                        <Cpu size={20} />
                        Ollama
                    </div>

                    <div className="trusted-item">
                        <ShieldCheck size={20} />
                        OWASP
                    </div>

                    <div className="trusted-item">
                        <Code2 size={20} />
                        React
                    </div>

                    <div className="trusted-item">
                        <FileText size={20} />
                        Mistral AI
                    </div>

                    <div className="trusted-item">
                        <Lock size={20} />
                        SSL
                    </div>

                    <div className="trusted-item">
                        <CheckCircle size={20} />
                        Secure Reports
                    </div>

                </div>

            </div>

        </section>
    );
}

export default Stats;