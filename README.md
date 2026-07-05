<div align="center">

# 🛡️ AutoNalyst

### AI-Powered Code & Website Security Analysis Platform

Analyze source code with AI and scan websites for common security vulnerabilities in seconds.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

### 🌐 Live Demo

**Frontend:** https://auto-nalyst.vercel.app

**Backend:** https://autonalyst-backend.onrender.com

</div>

---

# 📖 Overview

AutoNalyst is an AI-powered cybersecurity platform that combines Large Language Models (LLMs) with automated website security testing.

It helps developers identify vulnerabilities inside source code while also performing passive website security assessments including SSL validation, security header inspection, robots.txt detection, sitemap analysis and risk scoring.

The project was developed as a full-stack cybersecurity application using React, Node.js and Express with deployment on Vercel and Render.

---

# ✨ Features

## 🤖 AI Code Analysis

- Upload source code
- Online AI Analysis (Mistral)
- Offline Analysis
- Vulnerability Detection
- Security Recommendations
- Risk Assessment

---

## 🌐 Website Security Testing

- SSL Certificate Validation
- Security Headers Analysis
- Missing Headers Detection
- robots.txt Detection
- sitemap.xml Detection
- Security Score
- Risk Classification

---

## ⚙ Settings

- Save API Keys
- Manage AI Configuration
- Persistent Storage

---

## 🎨 Modern UI

- Responsive Design
- Dark Theme
- Interactive Dashboard
- Professional Security Cards
- Real-time Results

---

# 🏗 Architecture

```
                  React + Vite
                        │
                        │ Axios API Calls
                        ▼
              Node.js + Express Backend
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
 Website Security Engine         Mistral AI
         │
         ▼
 Security Reports
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Axios
- Lucide React
- CSS3

---

## Backend

- Node.js
- Express.js
- Multer
- Axios
- CORS

---

## AI

- Mistral AI API

---

## Deployment

- Vercel
- Render

---

# 📂 Folder Structure

```
AutoNalyst
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── routes
│   ├── uploads
│   ├── utils
│   ├── data
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Shivendra1005/AutoNalyst.git

cd AutoNalyst
```

---

## Backend

```bash
cd backend

npm install

npm start
```

Backend runs on

```
http://localhost:3001
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔑 Environment Variables

## Frontend

Create a `.env` file inside `frontend`.

```env
VITE_API_URL=https://autonalyst-backend.onrender.com
```

---

# 📸 Screenshots

## Dashboard

> *(Add screenshot here)*

---

## Code Analysis

> *(Add screenshot here)*

---

## Website Testing

> *(Add screenshot here)*

---

## Settings

> *(Add screenshot here)*

---

# 🎯 Future Scope

- User Authentication
- Scan History
- PDF Report Export
- Docker Support
- Multiple AI Providers
- CVE Database Integration
- OWASP Mapping
- Scheduled Website Monitoring
- Team Collaboration

---

# 🤝 Contributing

Contributions are always welcome.

If you would like to improve AutoNalyst:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

## Shivendra Tarate

Bachelor of Engineering (Information Technology)

GitHub

https://github.com/Shivendra1005

---

<div align="center">

### ⭐ If you like this project, consider giving it a Star!

</div>