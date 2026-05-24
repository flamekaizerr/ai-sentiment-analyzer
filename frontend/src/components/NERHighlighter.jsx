const TYPE_LABELS = { PER: 'Person', ORG: 'Organization', LOC: 'Location', MISC: 'Miscellaneous' }

function buildSegments(text, entities) {
  if (!entities || entities.length === 0) return [{ text, type: null }]

  const segments = []
  let cursor = 0

  // Sort entities by start position
  const sorted = [...entities].sort((a, b) => a.start - b.start)

  for (const entity of sorted) {
    if (entity.start > cursor) {
      segments.push({ text: text.slice(cursor, entity.start), type: null })
    }
    segments.push({
      text: text.slice(entity.start, entity.end),
      type: entity.entity_group,
      score: entity.score,
    })
    cursor = entity.end
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), type: null })
  }

  return segments
}

export default function NERHighlighter({ result }) {
  const { text, entities } = result
  const segments = buildSegments(text, entities)
  const usedTypes = [...new Set(entities.map((e) => e.entity_group))]

  return (
    <div className="card">
      <p className="card-title">Named Entity Recognition</p>

      {entities.length === 0 ? (
        <p className="no-entities">No named entities detected in this text.</p>
      ) : (
        <>
          <div className="ner-text">
            {segments.map((seg, i) =>
              seg.type ? (
                <span
                  key={i}
                  className="ner-entity"
                  data-type={seg.type}
                  title={`${TYPE_LABELS[seg.type] || seg.type} - ${(seg.score * 100).toFixed(0)}% confidence`}
                >
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>

          <div className="ner-legend">
            {usedTypes.map((type) => (
              <div key={type} className="ner-legend-item">
                <div className={`ner-dot ${type}`} />
                {TYPE_LABELS[type] || type}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
