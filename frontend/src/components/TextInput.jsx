const SAMPLES = [
  "Apple's new iPhone launch was absolutely incredible! Tim Cook delivered an amazing keynote.",
  "The flight was delayed for 4 hours and the airline staff were completely unhelpful. Worst experience ever.",
  "The quarterly earnings report showed moderate growth in most sectors with some volatility in tech stocks.",
  "I just got promoted at work! My team is so supportive and I genuinely love what I do every day.",
  "Scientists at MIT discovered a new material that could revolutionize solar energy efficiency.",
]

export default function TextInput({ text, setText, onAnalyze, isLoading }) {
  const charCount = text.length
  const isOverLimit = charCount > 2000
  const isNearLimit = charCount > 1800

  return (
    <div className="input-section card">
      <p className="card-title">Enter Text to Analyze</p>

      <div className="textarea-wrapper">
        <textarea
          id="main-text-input"
          className="main-textarea"
          placeholder="Type or paste any text here — a tweet, review, news headline, or paragraph..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />
      </div>

      <div className="samples">
        <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>Try:</span>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            className="sample-chip"
            onClick={() => setText(s)}
            title={s}
          >
            {s.slice(0, 28)}…
          </button>
        ))}
      </div>

      <div className="input-footer">
        <span className={`char-count ${isOverLimit ? 'error' : isNearLimit ? 'warning' : ''}`}>
          {charCount} / 2000 chars
        </span>
        <button
          id="analyze-btn"
          className="analyze-btn"
          onClick={onAnalyze}
          disabled={isLoading || !text.trim() || isOverLimit}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Analyzing…
            </>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              Analyze Text
            </>
          )}
        </button>
      </div>
    </div>
  )
}
