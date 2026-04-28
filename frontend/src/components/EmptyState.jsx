import { PackageX } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <PackageX size={28} color="var(--text-muted)" />
      </div>
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-desc">{description}</div>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}
