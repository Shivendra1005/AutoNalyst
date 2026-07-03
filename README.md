# AutoNalyst

**AI-Powered Cybersecurity Tool for Code Analysis & Website Security Testing**

AutoNalyst is a modern web application that helps developers identify errors, security vulnerabilities, and optimization opportunities in their code. It also provides non-intrusive security testing for websites.

![AutoNalyst](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🔍 Code Analysis
- **File Upload**: Drag-and-drop or click to upload code files (.js, .py, .html, .css, and more)
- **Intelligent Chunking**: Large files are automatically split into manageable chunks (1000 lines each)
- **Side-by-Side View**: Original code displayed alongside AI analysis
- **Line-by-Line Feedback**: Errors (red), suggestions (green), and detailed explanations

### 🤖 AI Model Options
- **Offline (Ollama)**: Use local LLMs for private, offline analysis
- **Online (Mistral)**: Cloud-powered analysis with Mistral API

### 🛡️ Website Security Testing
- SSL Certificate validation
- Security headers check (CSP, HSTS, X-Frame-Options, etc.)
- Exposed configuration detection
- Default admin pages discovery
- robots.txt and sitemap.xml analysis
- Client-side vulnerability scanning
- Risk scoring (0-100) with recommendations

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express, Multer
- **Styling**: Custom CSS (ChatGPT/Claude-inspired design)
- **AI Integration**: Ollama (local) & Mistral API

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- (Optional) Ollama installed for offline LLM analysis

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /Users/karannishad/Outonalyst
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:3001

2. **Start the Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   App will open on http://localhost:5173

### Using Ollama (Offline LLM)

1. Install Ollama from https://ollama.ai
2. Run `ollama serve` to start the server
3. Pull a model: `ollama pull codellama` or `ollama pull mistral`
4. In AutoNalyst, go to Code Analysis → Offline Models

### Using Mistral API (Online)

1. Get an API key from https://console.mistral.ai
2. In AutoNalyst, go to Settings
3. Enter your Mistral API key and save
4. Go to Code Analysis → Online Models

## Project Structure

```
Outonalyst/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CodeAnalysis.jsx
│   │   │   ├── WebsiteTesting.jsx
│   │   │   └── Settings.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   ├── analysisRoutes.js
│   │   ├── securityRoutes.js
│   │   └── settingsRoutes.js
│   ├── utils/
│   │   └── codeChunker.js
│   ├── uploads/        (auto-created)
│   ├── data/           (auto-created)
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload code file |
| GET | /api/ollama-models | Get available Ollama models |
| POST | /api/analyze-offline | Analyze with Ollama |
| POST | /api/analyze-online | Analyze with Mistral |
| POST | /api/test-website | Run security tests |
| POST | /api/save-key | Save API key |
| GET | /api/get-key-status | Check API key status |
| DELETE | /api/delete-key/:provider | Delete API key |

## Security Notes

- **Non-intrusive testing only**: Website security tests use only standard HTTP requests
- **No exploitation**: No brute force, auth bypass, SQLi/XSS, or aggressive scanning
- **Local storage**: API keys are stored locally in a JSON file, not in any external database
- **Input sanitization**: All user inputs are validated and sanitized

## Supported File Types

`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.html`, `.css`, `.json`, `.java`, `.c`, `.cpp`, `.go`, `.rb`, `.php`, `.sql`, `.sh`, `.yml`, `.yaml`, `.xml`, `.md`

## Contributing

This project was created for educational purposes. Feel free to fork and modify!

## License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ for SLRTCE**
