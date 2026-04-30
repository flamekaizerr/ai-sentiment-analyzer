import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const EMOTION_EMOJI = {
  joy: '😄', sadness: '😢', anger: '😠', fear: '😨',
  surprise: '😲', disgust: '🤢', neutral: '😐',
}

const EMOTION_COLORS = {
  joy:      'rgba(251, 191, 36, 0.85)',
  sadness:  'rgba(96, 165, 250, 0.85)',
  anger:    'rgba(239, 68, 68, 0.85)',
  fear:     'rgba(167, 139, 250, 0.85)',
  surprise: 'rgba(251, 146, 60, 0.85)',
  disgust:  'rgba(52, 211, 153, 0.85)',
  neutral:  'rgba(148, 163, 184, 0.85)',
}

export default function EmotionChart({ result }) {
  const { emotion_all, emotion_label, emotion_score } = result

  const chartData = {
    labels: emotion_all.map((e) => e.label),
    datasets: [
      {
        data: emotion_all.map((e) => parseFloat((e.score * 100).toFixed(1))),
        backgroundColor: emotion_all.map((e) => EMOTION_COLORS[e.label] || 'rgba(139,92,246,0.8)'),
        borderColor: emotion_all.map((e) => (EMOTION_COLORS[e.label] || 'rgba(139,92,246,0.8)').replace('0.85', '1')),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(18,18,26,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toFixed(1)}% confidence`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 }, callback: (v) => `${v}%` },
        max: 100,
      },
    },
  }

  return (
    <div className="card">
      <p className="card-title">Emotion Detection</p>
      <div className="top-emotion">
        <span className="emotion-emoji">{EMOTION_EMOJI[emotion_label] || '🤔'}</span>
        <div>
          <div className="emotion-name">{emotion_label}</div>
          <div className="emotion-pct">{(emotion_score * 100).toFixed(1)}% confidence</div>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
