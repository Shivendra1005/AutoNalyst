<div align="center">

# AutoNalyst

### AI-Powered Code & Website Security Analysis Platform

Analyze source code with AI and scan websites for security vulnerabilities in seconds.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Overview

AutoNalyst is a full-stack cybersecurity analysis platform that combines Large Language Models (LLMs) with automated website security testing. It helps developers identify vulnerabilities in source code and perform passive website security assessments.

---

## Features

### AI Code Analysis

- Upload individual source files or entire project ZIP archives
- Online analysis via Mistral AI API
- Offline analysis via local Ollama models (Llama 3, CodeLlama, etc.)
- Consolidated project reports with cross-file vulnerability mapping
- Risk assessment with severity classification
- Actionable security recommendations

### Project ZIP Analysis

- Multi-file project upload and recursive analysis
- Smart file filtering (ignores binaries, images, node_modules)
- Per-file chunking with large file splitting
- Aggregated AI analysis across all project files
- Unified report with structural overview

### Website Security Testing

- SSL certificate validation
- Security headers analysis (HSTS, CSP, X-Frame-Options, etc.)
- Missing headers detection
- robots.txt discovery and analysis
- sitemap.xml detection
- Security score gauge with risk classification

### Report Export

- Download analysis results as PDF
- Client-side PDF generation (no data sent to external services)
- Formatted with code snippets and severity badges

### Flexible AI Provider

- **Online mode:** Mistral AI API (requires API key)
- **Offline mode:** Ollama (local, no API key needed)
- Automatic model detection and listing
- Persistent provider and model settings

---

## Architecture

```
React + Vite Frontend
        |
        | Axios API Calls
        v
Node.js + Express Backend
        |
    ----+----
    |       |
    v       v
Mistral   Ollama
API       (local)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, React Router, Axios, Lucide React |
| Backend | Node.js, Express.js, Multer, Axios, CORS |
| AI Providers | Mistral AI API, Ollama (local LLMs) |
| Reports | html2pdf.js, React Markdown |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Clone

```bash
git clone https://github.com/Shivendra1005/AutoNalyst.git
cd AutoNalyst
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Required for online (Mistral) AI mode |
| `PORT` | Server port (default: 3001) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL for production builds |

---

## Usage

1. Open the app at `http://localhost:5173`
2. Go to **Settings** to configure your preferred AI provider:
   - **Online:** Enter your Mistral API key
   - **Offline:** Ensure Ollama is running locally
3. Navigate to **Code Analysis** to upload source files or project ZIPs
4. Navigate to **Website Testing** to analyze a website URL
5. Download results as PDF from any analysis page

---

## Project Structure

```
AutoNalyst/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS
│   │   └── api.js            # API client
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── routes/               # Express route handlers
│   ├── utils/                # AI provider, code chunker, scanners
│   ├── uploads/              # Uploaded files (gitignored)
│   ├── data/                 # Persistent data (gitignored)
│   ├── server.js
│   └── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License.

---

## Developer

**Shivendra Tarate** — Bachelor of Engineering (Information Technology)

GitHub: [@Shivendra1005](https://github.com/Shivendra1005)

---

<div align="center">

If you like this project, consider giving it a Star!

</div>
