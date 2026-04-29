import { useEffect, useState } from 'react'
import { Heart, Users, Building2, AlertTriangle, ClipboardList, Droplets } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import BloodGroupBadge from '../../components/BloodGroupBadge'
import EmptyState from '../../components/EmptyState'
import { adminAPI, bloodRequestAPI, bloodStockAPI, donationAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [requests, setRequests] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const isAdminUser = isAdmin()
        const [requestsRes, stockRes] = await Promise.all([
          isAdminUser ? bloodRequestAPI.getAll() : bloodRequestAPI.getMyRequests(),
          bloodStockAPI.getAll(),
        ])
        if (isAdminUser) {
          const statsRes = await adminAPI.getStats()
          setStats(statsRes.data)
        } else {
          const myDonations = await donationAPI.getMy().catch(() => ({ data: [] }))
          const pendingCount = requestsRes.data.filter(r => r.status === 'Pending').length
          setStats({
            totalDonors: 0,
            totalRequests: requestsRes.data.length,
            totalBloodBanks: 0,
            lowStockAlerts: 0,
            totalDonations: myDonations.data.length,
            pendingRequests: pendingCount,
          })
        }
        setRequests(requestsRes.data.slice(0, 6))
        setStocks(stockRes.data)
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Aggregate stock by blood group summing all banks
  const stockByGroup = stocks.reduce((acc, s) => {
    acc[s.bloodGroup] = (acc[s.bloodGroup] || 0) + Number(s.quantity)
    return acc
  }, {})

  const maxStock = Math.max(...Object.values(stockByGroup), 1)

  const getStockClass = (qty) => {
    if (qty < 100) return 'stock-low'
    if (qty < 200) return 'stock-medium'
    return 'stock-good'
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Dashboard" subtitle="Overview of blood donation system" />
        <div className="page-content">

          {loading ? (
            <div className="spinner-overlay"><div className="spinner" /></div>
          ) : (
            <>
              <div className="stats-grid">
                <StatCard icon={Heart}          value={isAdmin() ? (stats?.totalDonors || 0) : (stats?.totalDonations || 0)}  label={isAdmin() ? 'Total Donors' : 'Your Donations'} color="#e8192c" />
                <StatCard icon={ClipboardList}  value={stats?.totalRequests || 0}    label="Blood Requests"    color="#3b82f6" />
                <StatCard icon={Building2}      value={stats?.totalBloodBanks || 0}  label={isAdmin() ? 'Blood Banks' : 'Available Banks'} color="#8b5cf6" />
                <StatCard icon={AlertTriangle}  value={stats?.lowStockAlerts || 0}   label={isAdmin() ? 'Low Stock Alerts' : 'Stock Alerts'} color="#f59e0b" />
                <StatCard icon={Droplets}       value={stats?.totalDonations || 0}   label={isAdmin() ? 'Total Donations' : 'Your Donations'} color="#22c55e" />
                <StatCard icon={Users}          value={stats?.pendingRequests || 0}  label="Pending Requests"  color="#f97316" />
              </div>

              <div className="dashboard-grid">
                {/* Recent Requests */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Recent Blood Requests</h2>
                    <span className="badge badge-muted">{requests.length} shown</span>
                  </div>
                  {requests.length === 0 ? (
                    <EmptyState title="No requests yet" />
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Requester</th>
                            <th>Blood Group</th>
                            <th>Urgency</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((r) => (
                            <tr key={r.requestId}>
                              <td>
                                <div style={{ fontWeight: 600 }}>{r.requesterName}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.requestDate}</div>
                              </td>
                              <td><BloodGroupBadge group={r.bloodGroup} /></td>
                              <td><StatusBadge status={r.urgencyLevel} /></td>
                              <td><StatusBadge status={r.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Stock Overview */}
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Blood Stock Overview</h2>
                    <span className="badge badge-muted">All Banks</span>
                  </div>
                  <div className="stock-overview">
                    {Object.entries(stockByGroup).map(([group, qty]) => (
                      <div key={group} className="stock-overview-item">
                        <div className={`stock-overview-group ${getStockClass(qty)}`}>{group}</div>
                        <div className={`stock-overview-qty ${getStockClass(qty)}`}>{qty.toFixed(0)}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>ml</div>
                        <div style={{ height: 4, background: 'var(--bg-primary)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${(qty / maxStock) * 100}%`,
                            background: qty < 100 ? 'var(--danger)' : qty < 200 ? 'var(--warning)' : 'var(--success)',
                            borderRadius: 2,
                            transition: 'width 0.6s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
