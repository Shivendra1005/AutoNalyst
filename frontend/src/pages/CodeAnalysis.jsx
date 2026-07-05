import { useState, useRef, useEffect } from "react";

import {
    Upload,
    FileCode2,
    Cpu,
    Sparkles,
    FolderOpen,
} from "lucide-react";
import api from "../api"
import ReactMarkdown from 'react-markdown'

function CodeAnalysis() {
    // File upload state
    const [file, setFile] = useState(null)
    const [uploadedData, setUploadedData] = useState(null)
    const [selectedChunk, setSelectedChunk] = useState(0)
    const [isDragging, setIsDragging] = useState(false)

    // Model state
    const [activeTab, setActiveTab] = useState('offline')
    const [ollamaModels, setOllamaModels] = useState([])
    const [selectedModel, setSelectedModel] = useState('')
    const [ollamaError, setOllamaError] = useState(null)

    // Analysis state
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [error, setError] = useState(null)

    const fileInputRef = useRef(null)

    // Fetch Ollama models on mount
    useEffect(() => {
        fetchOllamaModels()
    }, [])

    const fetchOllamaModels = async () => {
        try {
            const response = await api.get('/api/ollama-models')
            if (response.data.success) {
                setOllamaModels(response.data.models)
                if (response.data.models.length > 0) {
                    setSelectedModel(response.data.models[0].name)
                }
                setOllamaError(null)
            } else {
                setOllamaError(response.data.error)
                setOllamaModels([])
            }
        } catch (err) {
            setOllamaError('Could not connect to Ollama. Make sure it is installed and running.')
            setOllamaModels([])
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            handleFileSelect(droppedFile)
        }
    }

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            handleFileSelect(selectedFile)
        }
    }

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile)
        setError(null)
        setAnalysisResult(null)

        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const response = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.success) {
                setUploadedData(response.data)
                setSelectedChunk(0)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload file')
        }
    }

    const handleAnalyze = async () => {
        if (!uploadedData || uploadedData.chunks.length === 0) {
            setError('Please upload a file first')
            return
        }

        setIsAnalyzing(true)
        setError(null)
        setAnalysisResult(null)

        const chunk = uploadedData.chunks[selectedChunk]
        const chunkInfo = `${uploadedData.fileName} [${uploadedData.language}] - Lines ${chunk.startLine}-${chunk.endLine}`

        try {
            let response

            if (activeTab === 'offline') {
                if (!selectedModel) {
                    setError('Please select an Ollama model')
                    setIsAnalyzing(false)
                    return
                }

                response = await api.post('/api/analyze-offline', {
                    model: selectedModel,
                    code: chunk.code,
                    chunkInfo
                })
            } else {
                response = await api.post('/api/analyze-online', {
                    code: chunk.code,
                    chunkInfo
                })
            }

            if (response.data.success) {
                setAnalysisResult(response.data)
            } else {
                setError(response.data.error || 'Analysis failed')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const clearFile = () => {
        setFile(null)
        setUploadedData(null)
        setSelectedChunk(0)
        setAnalysisResult(null)
        setError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Code Analysis</h1>
                <p className="page-subtitle">
                    Upload your code files for AI-powered error detection, security analysis, and optimization suggestions.
                </p>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {/* File Upload Section */}
            {!uploadedData ? (
                <div className="card">
                    <div className="card-body">
                        <div
                            className={`upload-zone premium-upload ${isDragging ? "dragging" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >

                            <div className="upload-circle">

                                <Upload size={42} />

                            </div>

                            <h2>Drop your project here</h2>

                            <p>
                                Upload source code for AI-powered security,
                                bug detection and optimization.
                            </p>

                            <div className="upload-tags">

                                <span>
                                    <FileCode2 size={15} />
                                    20+ Languages
                                </span>

                                <span>
                                    <Cpu size={15} />
                                    Ollama
                                </span>

                                <span>
                                    <Sparkles size={15} />
                                    AI Analysis
                                </span>

                            </div>

                            <button
                                type="button"
                                className="btn btn-primary btn-lg"
                            >
                                <FolderOpen size={18} />
                                Browse Files
                            </button>

                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.java,.c,.cpp,.go,.rb,.php,.sql,.sh,.yml,.yaml,.xml,.md"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            ) : (
                <>
                    {/* File Info */}
                    <div className="file-info">
                        <div className="file-info-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                        </div>
                        <div className="file-info-details">
                            <div className="file-info-name">{uploadedData.fileName}</div>
                            <div className="file-info-meta">
                                {uploadedData.language} • {uploadedData.totalLines} lines • {uploadedData.chunks.length} chunk(s)
                            </div>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={clearFile}>
                            Remove
                        </button>
                    </div>

                    {/* Chunk Selector */}
                    {uploadedData.chunks.length > 1 && (
                        <div className="chunk-selector">
                            {uploadedData.chunks.map((chunk, index) => (
                                <button
                                    key={index}
                                    className={`chunk-btn ${selectedChunk === index ? 'active' : ''}`}
                                    onClick={() => setSelectedChunk(index)}
                                >
                                    Lines {chunk.startLine}-{chunk.endLine}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Model Selection Tabs */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-body">
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === 'offline' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('offline')}
                                >
                                    🖥️ Offline Models (Ollama)
                                </button>
                                <button
                                    className={`tab ${activeTab === 'online' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('online')}
                                >
                                    ☁️ Online Models (Mistral)
                                </button>
                            </div>

                            {activeTab === 'offline' && (
                                <div>
                                    {ollamaError ? (
                                        <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
                                            {ollamaError}
                                            <br />
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                style={{ marginTop: '12px' }}
                                                onClick={fetchOllamaModels}
                                            >
                                                Retry Connection
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="input-group">
                                            <label className="input-label">Select Ollama Model</label>
                                            <select
                                                className="model-select"
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                            >
                                                {ollamaModels.map((model) => (
                                                    <option key={model.name} value={model.name}>
                                                        {model.name} {model.size && `(${model.size})`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'online' && (
                                <div className="alert alert-info">
                                    Using Mistral API for analysis. Make sure you have configured your API key in Settings.
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (activeTab === 'offline' && !selectedModel)}
                                style={{ width: '100%', marginTop: '16px' }}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        Analyze Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Side-by-Side View */}
                    <div className="code-container">
                        {/* Original Code */}
                        <div className="code-panel">

                            <div className="code-panel-header">

                                <div className="editor-controls">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>

                                <div className="editor-title">
                                    📄 {uploadedData.fileName}
                                </div>

                                <div className="editor-language">
                                    {uploadedData.language}
                                </div>

                            </div>

                            <div className="code-panel-body">

                                <pre className="code-block">
                                    {uploadedData.chunks[selectedChunk]?.code || "No code to display"}
                                </pre>

                            </div>

                        </div>

                        {/* Analysis Results */}
                        {/* Analysis Results */}

                        <div className="code-panel">

                            <div className="code-panel-header">

                                <div className="editor-controls">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>

                                <div className="editor-title">
                                    🤖 AI Security Report
                                </div>

                                {analysisResult && (
                                    <div className="editor-language">
                                        {analysisResult.model}
                                    </div>
                                )}

                            </div>

                            <div className="code-panel-body">

                                {isAnalyzing ? (

                                    <div className="loading-overlay">
                                        <div className="loading-spinner"></div>
                                        <p className="loading-text">
                                            Analyzing code with AI...
                                        </p>
                                    </div>

                                ) : analysisResult ? (

                                    <div className="markdown-content">

                                        <ReactMarkdown>
                                            {analysisResult.analysis}
                                        </ReactMarkdown>

                                        <div
                                            style={{
                                                marginTop: "20px",
                                                paddingTop: "20px",
                                                borderTop: "1px solid var(--border-color)"
                                            }}
                                        >
                                            <small style={{ color: "var(--text-muted)" }}>
                                                Analyzed with {analysisResult.model} at{" "}
                                                {new Date(
                                                    analysisResult.timestamp
                                                ).toLocaleString()}
                                            </small>
                                        </div>

                                    </div>

                                ) : (

                                    <div className="empty-state">

                                        <svg
                                            className="empty-state-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>

                                        <h3>No Analysis Yet</h3>

                                        <p>
                                            Click <b>Analyze Code</b> to generate an AI report.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

export default CodeAnalysis;