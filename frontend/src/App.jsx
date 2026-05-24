import { useState, useEffect, useCallback } from 'react'
import TextInput from './components/TextInput'
import SentimentCard from './components/SentimentCard'
import EmotionChart from './components/EmotionChart'
import NERHighlighter from './components/NERHighlighter'
import HistoryTable from './components/HistoryTable'
import StatsPanel from './components/StatsPanel'
import { analyzeText, getHistory, deleteHistoryItem, getStats } from './api'

export default function App() {
  const [text, setText]         = useState('')
  const [result, setResult]     = useState(null)
  const [history, setHistory]   = useState([])
  const [stats, setStats]       = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState(null)
  const [activeTab, setTab]     = useState('analyze')

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await getHistory()
      setHistory(data)
    } catch { /* ignore */ }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await getStats()
      setStats(data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [fetchHistory, fetchStats])

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    try {
      const { data } = await analyzeText(text)
      setResult(data)
      await Promise.all([fetchHistory(), fetchStats()])
      // Switch to results view on mobile
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to connect to the backend. Make sure the FastAPI server is running on port 8000.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id)
      await Promise.all([fetchHistory(), fetchStats()])
      // If deleted result matches current result, clear it
      if (result && history.find(h => h.id === id && h.text === result.text)) {
        setResult(null)
      }
    } catch {
      setError('Failed to delete record.')
    }
  }

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="header">
        <div className="header-badge">
          <span className="dot" />
          Powered by HuggingFace Transformers
        </div>
        <h1>AI Sentiment Analyzer</h1>
        <p>Real-time text analysis with state-of-the-art NLP models - sentiment, emotion & named entity recognition</p>
        <div className="model-pills">
          <span className="model-pill">cardiffnlp/twitter-roberta-base-sentiment</span>
          <span className="model-pill">j-hartmann/emotion-english-distilroberta</span>
          <span className="model-pill">dslim/bert-base-NER</span>
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="tabs" role="tablist">
        {['analyze', 'history', 'stats'].map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setTab(tab)}
          >
            {tab === 'analyze' && '🔍 '}
            {tab === 'history' && '📋 '}
            {tab === 'stats' && '📊 '}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="error-banner" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >✕</button>
        </div>
      )}

      {/* ── Analyze Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'analyze' && (
        <>
          <TextInput
            text={text}
            setText={setText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />

          {result && (
            <>
              <div className="results-grid">
                <SentimentCard result={result} />
                <EmotionChart result={result} />
              </div>
              <NERHighlighter result={result} />
            </>
          )}

          {!result && !isLoading && (
            <div className="empty-state" style={{ padding: '64px 0' }}>
              <div className="empty-state-icon">✨</div>
              <p>Enter text above and click <strong>Analyze Text</strong> to get started</p>
            </div>
          )}
        </>
      )}

      {/* ── History Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <HistoryTable history={history} onDelete={handleDelete} />
      )}

      {/* ── Stats Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <StatsPanel stats={stats} />
      )}

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        <p>
          Built with <a href="https://huggingface.co" target="_blank" rel="noreferrer">HuggingFace Transformers</a>
          {' · '}
          <a href="https://fastapi.tiangolo.com" target="_blank" rel="noreferrer">FastAPI</a>
          {' · '}
          <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>
          {' · '}
          My Portfolio Project
        </p>
      </footer>
    </div>
  )
}
