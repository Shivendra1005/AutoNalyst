import { useState, useEffect } from 'react'
import axios from 'axios'

function Settings() {
    const [mistralKey, setMistralKey] = useState('')
    const [keyStatus, setKeyStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchKeyStatus()
    }, [])

    const fetchKeyStatus = async () => {
        try {
            const response = await axios.get('/api/get-key-status')
            setKeyStatus(response.data)
        } catch (err) {
            console.error('Failed to fetch key status:', err)
        }
    }

    const handleSaveKey = async (e) => {
        e.preventDefault()

        if (!mistralKey.trim()) {
            setMessage({ type: 'error', text: 'Please enter an API key' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const response = await axios.post('/api/save-key', {
                provider: 'mistral',
                apiKey: mistralKey.trim()
            })

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Mistral API key saved successfully!' })
                setMistralKey('')
                fetchKeyStatus()
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save API key' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteKey = async () => {
        if (!confirm('Are you sure you want to delete your Mistral API key?')) {
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            await axios.delete('/api/delete-key/mistral')
            setMessage({ type: 'success', text: 'API key deleted successfully' })
            fetchKeyStatus()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to delete API key' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddOtherProvider = () => {
        setMessage({
            type: 'warning',
            text: 'This feature is upcoming and will be available after the third project review at SLRTCE.'
        })
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">
                    Manage your API keys and application preferences.
                </p>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Mistral API Key */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3 className="card-title">Mistral API Key</h3>
                    {keyStatus?.mistral?.configured && (
                        <span style={{
                            background: 'var(--success-green-light)',
                            color: 'var(--success-green)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            Configured
                        </span>
                    )}
                </div>
                <div className="card-body">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                        Enter your Mistral API key to enable online code analysis. Your key is stored locally on the server and used only for API requests.
                    </p>

                    {keyStatus?.mistral?.configured && (
                        <div className="api-key-display">
                            <span className="api-key-preview">{keyStatus.mistral.preview}</span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={handleDeleteKey}
                                disabled={isLoading}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSaveKey} style={{ marginTop: '20px' }}>
                        <div className="input-group">
                            <label className="input-label">
                                {keyStatus?.mistral?.configured ? 'Update API Key' : 'API Key'}
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter your Mistral API key"
                                value={mistralKey}
                                onChange={(e) => setMistralKey(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save API Key'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>How to get a Mistral API key:</h4>
                        <ol style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
                            <li>Visit <a href="https://console.mistral.ai/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>console.mistral.ai</a></li>
                            <li>Sign up or log in to your account</li>
                            <li>Navigate to API Keys section</li>
                            <li>Generate a new API key and paste it above</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Other Providers */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Other AI Providers</h3>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={handleAddOtherProvider}
                        >
                            + Add OpenAI
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleAddOtherProvider}
                        >
                            + Add Anthropic
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleAddOtherProvider}
                        >
                            + Add Google AI
                        </button>
                    </div>
                </div>
            </div>

            {/* Ollama Status */}
            <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                    <h3 className="card-title">Ollama (Local LLM)</h3>
                </div>
                <div className="card-body">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                        Ollama allows you to run LLMs locally on your machine for offline code analysis.
                        No API key required.
                    </p>

                    <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Setup Instructions:</h4>
                        <ol style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', margin: 0 }}>
                            <li>Download Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>ollama.ai</a></li>
                            <li>Install and run <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>ollama serve</code></li>
                            <li>Pull a model: <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>ollama pull codellama</code></li>
                            <li>Go to Code Analysis and select "Offline Models"</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
