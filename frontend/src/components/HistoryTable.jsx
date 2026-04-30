const EMOTION_EMOJI = {
  joy: '😄', sadness: '😢', anger: '😠', fear: '😨',
  surprise: '😲', disgust: '🤢', neutral: '😐',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryTable({ history, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <p className="card-title">Analysis History</p>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No analyses yet. Run your first analysis above!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="card-title">Analysis History ({history.length})</p>
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Sentiment</th>
              <th>Emotion</th>
              <th>Words</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.id}</td>
                <td>
                  <div className="history-text" title={item.text}>{item.text}</div>
                </td>
                <td>
                  <span className={`sentiment-badge ${item.sentiment_label}`}>
                    {item.sentiment_label === 'positive' ? '↑' : item.sentiment_label === 'negative' ? '↓' : '→'}{' '}
                    {item.sentiment_label}
                  </span>
                </td>
                <td>
                  <span className="emotion-badge">
                    {EMOTION_EMOJI[item.emotion_label] || '🤔'} {item.emotion_label}
                  </span>
                </td>
                <td>{item.word_count}</td>
                <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDate(item.created_at)}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(item.id)}
                    title="Delete this record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
