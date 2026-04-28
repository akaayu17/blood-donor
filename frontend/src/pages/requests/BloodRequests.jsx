import { useEffect, useState } from 'react'
import { Plus, Search, RefreshCw, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import BloodGroupBadge from '../../components/BloodGroupBadge'
import EmptyState from '../../components/EmptyState'
import { bloodRequestAPI, bloodBankAPI, fulfillmentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
const URGENCIES    = ['Critical','High','Medium','Low']
const STATUSES     = ['Pending','Fulfilled','Cancelled']

export default function BloodRequests() {
  const { user, isAdmin } = useAuth()
  const [requests, setRequests]   = useState([])
  const [banks, setBanks]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')
  const [search, setSearch]       = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [form, setForm] = useState({
    bankId: '', bloodGroup: '', quantity: '', urgencyLevel: 'Medium', requestDate: new Date().toISOString().split('T')[0]
  })

  const load = async () => {
    setLoading(true)
    try {
      const [rRes, bRes] = await Promise.all([
        isAdmin() ? bloodRequestAPI.getAll() : bloodRequestAPI.getMyRequests(),
        bloodBankAPI.getAll()
      ])
      setRequests(rRes.data)
      setBanks(bRes.data)
    } catch { toast.error('Failed to load requests') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.requesterName?.toLowerCase().includes(search.toLowerCase()) ||
                        r.bloodGroup?.includes(search)
    const matchStatus = !filterStatus || r.status === filterStatus
    const matchUrgency = !filterUrgency || r.urgencyLevel === filterUrgency
    return matchSearch && matchStatus && matchUrgency
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.bankId || !form.bloodGroup || !form.quantity || !form.requestDate) {
      toast.error('Fill all required fields'); return
    }
    setSaving(true)
    try {
      await bloodRequestAPI.create({ ...form, bankId: parseInt(form.bankId), quantity: parseFloat(form.quantity) })
      toast.success('Blood request created!')
      setShowCreate(false)
      setForm({ bankId: '', bloodGroup: '', quantity: '', urgencyLevel: 'Medium', requestDate: new Date().toISOString().split('T')[0] })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create request') }
    finally { setSaving(false) }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await bloodRequestAPI.updateStatus(id, status)
      toast.success(`Request ${status.toLowerCase()}!`)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status') }
  }

  const handleFulfill = async (requestId) => {
    try {
      await fulfillmentAPI.create(requestId)
      toast.success('Request fulfilled and stock deducted!')
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to fulfill request') }
  }

  const canManage = (r) => isAdmin() || r.userId === user?.userId

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Blood Requests" subtitle="Track and manage blood requests" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Blood Requests</h2>
              <p className="page-subtitle">{isAdmin() ? 'All system requests' : 'Your blood requests'}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)} id="create-request-btn">
              <Plus size={16} /> New Request
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={14} />
              <input className="search-input" placeholder="Search requests..." value={search}
                onChange={e => setSearch(e.target.value)} id="request-search" />
            </div>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="request-status-filter">
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} id="request-urgency-filter">
              <option value="">All Urgency</option>
              {URGENCIES.map(u => <option key={u}>{u}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="spinner-overlay"><div className="spinner" /></div>
            : filtered.length === 0 ? <EmptyState title="No requests found" description="Create your first blood request" />
            : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Requester</th>
                      <th>Blood Group</th>
                      <th>Qty (ml)</th>
                      <th>Bank</th>
                      <th>Urgency</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.requestId}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{r.requesterName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>#{r.requestId}</div>
                        </td>
                        <td><BloodGroupBadge group={r.bloodGroup} /></td>
                        <td style={{ fontWeight: 600 }}>{r.quantity}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.bankName}</td>
                        <td><StatusBadge status={r.urgencyLevel} /></td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.requestDate}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {r.status === 'Pending' && isAdmin() && (
                              <button className="btn btn-success btn-sm" onClick={() => handleFulfill(r.requestId)} id={`fulfill-btn-${r.requestId}`}>
                                Fulfill
                              </button>
                            )}
                            {r.status === 'Pending' && canManage(r) && (
                              <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(r.requestId, 'Cancelled')} id={`cancel-btn-${r.requestId}`}>
                                <XCircle size={12} /> Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Blood Request"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={saving} id="create-request-submit">
            {saving ? <div className="spinner spinner-sm" /> : 'Submit Request'}
          </button>
        </>}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Blood Group *</label>
            <select className="form-select" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} required id="req-bg">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity (ml) *</label>
            <input className="form-input" type="number" min="1" step="0.01" placeholder="e.g. 450"
              value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required id="req-qty" />
          </div>
          <div className="form-group">
            <label className="form-label">Blood Bank *</label>
            <select className="form-select" value={form.bankId} onChange={e => setForm({...form, bankId: e.target.value})} required id="req-bank">
              <option value="">Select bank</option>
              {banks.map(b => <option key={b.bankId} value={b.bankId}>{b.bankName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Urgency Level</label>
            <select className="form-select" value={form.urgencyLevel} onChange={e => setForm({...form, urgencyLevel: e.target.value})} id="req-urgency">
              {URGENCIES.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Request Date *</label>
          <input className="form-input" type="date" value={form.requestDate}
            onChange={e => setForm({...form, requestDate: e.target.value})} required id="req-date" />
        </div>
      </Modal>
    </div>
  )
}
