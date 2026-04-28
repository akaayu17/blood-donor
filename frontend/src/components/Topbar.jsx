import { useAuth } from '../context/AuthContext'

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth()
  const roleClass = user?.role === 'Admin' ? 'badge-admin'
                  : user?.role === 'Donor' ? 'badge-donor' : 'badge-user'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{title}</h1>
        {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
      </div>
      <div className="topbar-right">
        <span className={`topbar-badge ${roleClass}`}>
          {user?.role}
        </span>
      </div>
    </header>
  )
}
