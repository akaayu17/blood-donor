const STATUS_MAP = {
  // Request status
  Pending:     { cls: 'badge-warning', dot: '●' },
  Fulfilled:   { cls: 'badge-success', dot: '●' },
  Cancelled:   { cls: 'badge-danger',  dot: '●' },
  // Eligibility
  Eligible:    { cls: 'badge-success', dot: '●' },
  Ineligible:  { cls: 'badge-danger',  dot: '●' },
  // Screening
  Passed:      { cls: 'badge-success', dot: '●' },
  Failed:      { cls: 'badge-danger',  dot: '●' },
  // Urgency
  Critical:    { cls: 'badge-danger',  dot: '▲' },
  High:        { cls: 'badge-warning', dot: '▲' },
  Medium:      { cls: 'badge-info',    dot: '●' },
  Low:         { cls: 'badge-muted',   dot: '●' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { cls: 'badge-muted', dot: '●' }
  return (
    <span className={`badge ${config.cls}`}>
      <span style={{ fontSize: 8 }}>{config.dot}</span>
      {status}
    </span>
  )
}
