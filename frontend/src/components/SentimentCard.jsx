const SENTIMENT_EMOJI = { positive: '😊', negative: '😞', neutral: '😐' }
const SENTIMENT_ICON_BG = { positive: 'positive', negative: 'negative', neutral: 'neutral' }

export default function SentimentCard({ result }) {
  const { sentiment_label, sentiment_score, sentiment_all, word_count, char_count } = result

  return (
    <div className="card">
      <p className="card-title">Sentiment Analysis</p>
      <div className="sentiment-result">
        <div className="sentiment-top">
          <div className={`sentiment-icon ${SENTIMENT_ICON_BG[sentiment_label]}`}>
            {SENTIMENT_EMOJI[sentiment_label] || '🤔'}
          </div>
          <div>
            <div className={`sentiment-label ${sentiment_label}`}>{sentiment_label}</div>
            <div className="sentiment-confidence">
              {(sentiment_score * 100).toFixed(1)}% confidence
            </div>
          </div>
        </div>

        <div className="score-bars">
          {sentiment_all.map((s) => (
            <div key={s.label} className="score-bar-row">
              <div className="score-bar-label">
                <span>{s.label}</span>
                <span>{(s.score * 100).toFixed(1)}%</span>
              </div>
              <div className="score-bar-track">
                <div
                  className={`score-bar-fill ${s.label}`}
                  style={{ width: `${(s.score * 100).toFixed(1)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="meta-stats">
          <div className="meta-stat">
            <span className="meta-stat-value">{word_count}</span>
            <span className="meta-stat-label">Words</span>
          </div>
          <div className="meta-stat">
            <span className="meta-stat-value">{char_count}</span>
            <span className="meta-stat-label">Characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}
