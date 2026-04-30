import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function StatsPanel({ stats }) {
  if (!stats || stats.total_analyses === 0) {
    return (
      <div className="card">
        <p className="card-title">Analytics Dashboard</p>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>Analyze some text to see your statistics here.</p>
        </div>
      </div>
    )
  }

  const sentimentColors = {
    positive: 'rgba(16, 185, 129, 0.8)',
    negative: 'rgba(239, 68, 68, 0.8)',
    neutral: 'rgba(99, 102, 241, 0.8)',
  }

  const sentLabels = Object.keys(stats.sentiment_distribution)
  const sentData = Object.values(stats.sentiment_distribution)
  const emoLabels = Object.keys(stats.emotion_distribution)
  const emoData = Object.values(stats.emotion_distribution)

  const emoColors = [
    'rgba(251,191,36,0.8)', 'rgba(96,165,250,0.8)', 'rgba(239,68,68,0.8)',
    'rgba(167,139,250,0.8)', 'rgba(251,146,60,0.8)', 'rgba(52,211,153,0.8)',
    'rgba(148,163,184,0.8)',
  ]

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 12, padding: 12 },
      },
      tooltip: {
        backgroundColor: 'rgba(18,18,26,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
      },
    },
  }

  return (
    <div className="card">
      <p className="card-title">Analytics Dashboard</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-value">{stats.total_analyses}</div>
          <div className="stat-card-label">Total Analyses</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{stats.avg_word_count}</div>
          <div className="stat-card-label">Avg Word Count</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ textTransform: 'capitalize', fontSize: 20 }}>
            {stats.most_common_sentiment}
          </div>
          <div className="stat-card-label">Top Sentiment</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ textTransform: 'capitalize', fontSize: 20 }}>
            {stats.most_common_emotion}
          </div>
          <div className="stat-card-label">Top Emotion</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Sentiment Distribution</p>
          <div style={{ height: 160 }}>
            <Doughnut
              data={{
                labels: sentLabels,
                datasets: [{
                  data: sentData,
                  backgroundColor: sentLabels.map(l => sentimentColors[l] || 'rgba(139,92,246,0.8)'),
                  borderWidth: 0,
                }],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Emotion Distribution</p>
          <div style={{ height: 160 }}>
            <Doughnut
              data={{
                labels: emoLabels,
                datasets: [{
                  data: emoData,
                  backgroundColor: emoColors.slice(0, emoLabels.length),
                  borderWidth: 0,
                }],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
