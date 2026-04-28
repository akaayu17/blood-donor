export default function StatCard({ icon: Icon, value, label, color = '#e8192c', iconBg, change }) {
  return (
    <div
      className="stat-card"
      style={{ '--icon-color': color, '--icon-bg': iconBg || `${color}15` }}
    >
      <div className="stat-icon">
        <Icon size={22} color={color} />
      </div>
      <div className="stat-info">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        {change && <div className="stat-change" style={{ color }}>{change}</div>}
      </div>
    </div>
  )
}
