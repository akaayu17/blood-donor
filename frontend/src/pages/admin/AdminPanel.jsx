import { useEffect, useState } from 'react'
import { Trash2, RefreshCw, ShieldCheck, Users, Building2, Heart, Droplets, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { adminAPI, userAPI, bloodStockAPI } from '../../services/api'

const ROLES = ['User', 'Donor', 'Admin']

export default function AdminPanel() {
  const [stats, setStats]       = useState(null)
  const [users, setUsers]       = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const [sRes, uRes, lsRes] = await Promise.all([
        adminAPI.getStats(), userAPI.getAll(), bloodStockAPI.getLowStock(100)
      ])
      setStats(sRes.data)
      setUsers(uRes.data)
      setLowStock(lsRes.data)
    } catch { toast.error('Failed to load admin data') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRoleChange = async (userId, role) => {
    setSaving(s => ({ ...s, [userId]: true }))
    try {
      await userAPI.updateRole(userId, role)
      toast.success('Role updated!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update role') }
    finally { setSaving(s => ({ ...s, [userId]: false })) }
  }

  const handleDelete = async (userId, name) => {
    if (!confirm(`Delete user "${name}"? This is permanent.`)) return
    try {
      await userAPI.delete(userId)
      toast.success('User deleted!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Admin Panel" subtitle="System administration and user management" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Admin Panel</h2>
              <p className="page-subtitle">Full system control and oversight</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /> Refresh</button>
          </div>

          {loading ? <div className="spinner-overlay"><div className="spinner" /></div> : (
            <>
              {/* Stats */}
              {stats && (
                <div className="stats-grid" style={{ marginBottom: 32 }}>
                  <StatCard icon={Heart}         value={stats.totalDonors}      label="Total Donors"      color="#e8192c" />
                  <StatCard icon={Users}         value={users.length}           label="Total Users"       color="#3b82f6" />
                  <StatCard icon={Building2}     value={stats.totalBloodBanks}  label="Blood Banks"       color="#8b5cf6" />
                  <StatCard icon={AlertTriangle} value={stats.lowStockAlerts}   label="Low Stock Alerts"  color="#f59e0b" />
                  <StatCard icon={Droplets}      value={stats.totalDonations}   label="Donations"         color="#22c55e" />
                  <StatCard icon={ShieldCheck}   value={stats.pendingRequests}  label="Pending Requests"  color="#f97316" />
                </div>
              )}

              {/* Low Stock Alerts */}
              {lowStock.length > 0 && (
                <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(239,68,68,0.3)' }}>
                  <div className="card-header">
                    <h2 className="card-title" style={{ color: 'var(--danger)' }}>
                      <AlertTriangle size={16} style={{ display: 'inline', marginRight: 6 }} />
                      Low Stock Alerts ({lowStock.length})
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {lowStock.map(s => (
                      <div key={s.stockId} style={{ padding: '8px 14px', background: 'var(--danger-subtle)', borderRadius: 8,
                        border: '1px solid rgba(239,68,68,0.2)', fontSize: 13 }}>
                        <strong style={{ color: 'var(--danger)' }}>{s.bloodGroup}</strong>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{s.bankName}</span>
                        <span style={{ color: 'var(--danger)', marginLeft: 8, fontWeight: 700 }}>{Number(s.quantity).toFixed(0)} ml</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Management */}
              <div className="card" style={{ padding: 0 }}>
                <div className="card-header" style={{ padding: '20px 20px 16px' }}>
                  <h2 className="card-title">User Management</h2>
                  <span className="badge badge-muted">{users.length} users</span>
                </div>
                {users.length === 0 ? <EmptyState title="No users" /> : (
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Gender</th>
                          <th>Date of Birth</th>
                          <th>Role</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.userId}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.email}</div>
                            </td>
                            <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.gender}</td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.dateOfBirth}</td>
                            <td>
                              <select
                                className="filter-select"
                                style={{ padding: '4px 8px', fontSize: 12 }}
                                value={u.role}
                                onChange={e => handleRoleChange(u.userId, e.target.value)}
                                disabled={saving[u.userId]}
                                id={`role-select-${u.userId}`}
                              >
                                {ROLES.map(r => <option key={r}>{r}</option>)}
                              </select>
                            </td>
                            <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td>
                              <button className="btn btn-danger btn-icon" onClick={() => handleDelete(u.userId, u.fullName)}
                                id={`del-user-${u.userId}`}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
