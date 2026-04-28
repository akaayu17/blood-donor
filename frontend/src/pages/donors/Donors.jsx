import { useEffect, useState } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import BloodGroupBadge from '../../components/BloodGroupBadge'
import EmptyState from '../../components/EmptyState'
import { donorAPI, userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
const ELIGIBILITY  = ['Eligible','Ineligible','Pending']

export default function Donors() {
  const { isAdmin } = useAuth()
  const [donors, setDonors]       = useState([])
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterBG, setFilterBG]   = useState('')
  const [filterEl, setFilterEl]   = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [showElig, setShowElig]   = useState(false)
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState({ userId: '', bloodGroup: '' })
  const [eligForm, setEligForm]   = useState({ eligibilityStatus: '' })
  const [saving, setSaving]       = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [dRes, uRes] = await Promise.all([donorAPI.getAll(), userAPI.getAll()])
      setDonors(dRes.data)
      // only users not already donors
      const donorUserIds = dRes.data.map(d => d.userId)
      setUsers(uRes.data.filter(u => !donorUserIds.includes(u.userId)))
    } catch { toast.error('Failed to load donors') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = donors.filter(d => {
    const matchSearch = d.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        d.email.toLowerCase().includes(search.toLowerCase())
    const matchBG = filterBG ? d.bloodGroup === filterBG : true
    const matchEl = filterEl ? d.eligibilityStatus === filterEl : true
    return matchSearch && matchBG && matchEl
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.userId || !form.bloodGroup) { toast.error('Fill all fields'); return }
    setSaving(true)
    try {
      await donorAPI.create({ userId: parseInt(form.userId), bloodGroup: form.bloodGroup })
      toast.success('Donor registered!')
      setShowAdd(false)
      setForm({ userId: '', bloodGroup: '' })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to register donor') }
    finally { setSaving(false) }
  }

  const openElig = (donor) => {
    setSelected(donor)
    setEligForm({ eligibilityStatus: donor.eligibilityStatus })
    setShowElig(true)
  }

  const handleElig = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await donorAPI.updateEligibility(selected.donorId, eligForm.eligibilityStatus)
      toast.success('Eligibility updated!')
      setShowElig(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Donors" subtitle={`${donors.length} registered donors`} />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Blood Donors</h2>
              <p className="page-subtitle">Manage and track all registered donors</p>
            </div>
            {isAdmin() && (
              <button className="btn btn-primary" onClick={() => setShowAdd(true)} id="add-donor-btn">
                <Plus size={16} /> Add Donor
              </button>
            )}
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={14} />
              <input className="search-input" placeholder="Search donors..." value={search}
                onChange={e => setSearch(e.target.value)} id="donor-search" />
            </div>
            <select className="filter-select" value={filterBG} onChange={e => setFilterBG(e.target.value)} id="donor-bg-filter">
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
            <select className="filter-select" value={filterEl} onChange={e => setFilterEl(e.target.value)} id="donor-el-filter">
              <option value="">All Eligibility</option>
              {ELIGIBILITY.map(e => <option key={e}>{e}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="spinner-overlay"><div className="spinner" /></div>
            : filtered.length === 0 ? <EmptyState title="No donors found" description="Try adjusting your filters" />
            : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Donor</th>
                      <th>Blood Group</th>
                      <th>Last Donation</th>
                      <th>Eligibility</th>
                      {isAdmin() && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <tr key={d.donorId}>
                        <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{d.fullName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.email}</div>
                        </td>
                        <td><BloodGroupBadge group={d.bloodGroup} /></td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {d.lastDonationDate || <span style={{ color: 'var(--text-muted)' }}>Never</span>}
                        </td>
                        <td><StatusBadge status={d.eligibilityStatus} /></td>
                        {isAdmin() && (
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => openElig(d)} id={`elig-btn-${d.donorId}`}>
                              Update Eligibility
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Donor Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register New Donor"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={saving} id="add-donor-submit">
            {saving ? <div className="spinner spinner-sm" /> : 'Register Donor'}
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Select User *</label>
          <select className="form-select" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} required id="donor-user-select">
            <option value="">Choose a user</option>
            {users.map(u => <option key={u.userId} value={u.userId}>{u.fullName} ({u.email})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Blood Group *</label>
          <select className="form-select" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} required id="donor-bg-select">
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
      </Modal>

      {/* Update Eligibility Modal */}
      <Modal isOpen={showElig} onClose={() => setShowElig(false)} title={`Update Eligibility — ${selected?.fullName}`}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowElig(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleElig} disabled={saving} id="elig-save-btn">
            {saving ? <div className="spinner spinner-sm" /> : 'Save'}
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Eligibility Status</label>
          <select className="form-select" value={eligForm.eligibilityStatus}
            onChange={e => setEligForm({...eligForm, eligibilityStatus: e.target.value})} id="elig-status-select">
            {ELIGIBILITY.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
      </Modal>
    </div>
  )
}
