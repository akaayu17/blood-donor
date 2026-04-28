import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Modal from '../../components/Modal'
import StatusBadge from '../../components/StatusBadge'
import BloodGroupBadge from '../../components/BloodGroupBadge'
import EmptyState from '../../components/EmptyState'
import { donationAPI, donorAPI, bloodBankAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const SCREENING = ['Pending', 'Passed', 'Failed']

export default function Donations() {
  const { isAdmin } = useAuth()
  const [donations, setDonations] = useState([])
  const [donors, setDonors]       = useState([])
  const [banks, setBanks]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showScreen, setShowScreen] = useState(false)
  const [selected, setSelected]     = useState(null)
  const [saving, setSaving]         = useState(false)
  const [screenStatus, setScreenStatus] = useState('Passed')
  const [form, setForm] = useState({
    donorId: '', bankId: '', donationDate: new Date().toISOString().split('T')[0], quantity: ''
  })

  const load = async () => {
    setLoading(true)
    try {
      const [dRes, drRes, bRes] = await Promise.all([
        donationAPI.getAll(), donorAPI.getAll(), bloodBankAPI.getAll()
      ])
      setDonations(dRes.data)
      setDonors(drRes.data)
      setBanks(bRes.data)
    } catch { toast.error('Failed to load donations') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.donorId || !form.bankId || !form.donationDate || !form.quantity) {
      toast.error('Fill all fields'); return
    }
    setSaving(true)
    try {
      await donationAPI.create({ ...form, donorId: parseInt(form.donorId), bankId: parseInt(form.bankId), quantity: parseFloat(form.quantity) })
      toast.success('Donation recorded!')
      setShowCreate(false)
      setForm({ donorId: '', bankId: '', donationDate: new Date().toISOString().split('T')[0], quantity: '' })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to record') }
    finally { setSaving(false) }
  }

  const openScreen = (d) => { setSelected(d); setScreenStatus(d.screeningStatus); setShowScreen(true) }

  const handleScreen = async () => {
    setSaving(true)
    try {
      await donationAPI.updateScreening(selected.donationId, screenStatus)
      toast.success('Screening updated!' + (screenStatus === 'Passed' ? ' Stock increased.' : ''))
      setShowScreen(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Donations" subtitle="Track blood donation records" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Donation Records</h2>
              <p className="page-subtitle">{donations.length} total donations recorded</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)} id="add-donation-btn">
                <Plus size={16} /> Record Donation
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="spinner-overlay"><div className="spinner" /></div>
            : donations.length === 0 ? <EmptyState title="No donations recorded" />
            : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Blood Group</th>
                      <th>Bank</th>
                      <th>Date</th>
                      <th>Quantity (ml)</th>
                      <th>Screening</th>
                      {isAdmin() && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.donationId}>
                        <td><div style={{ fontWeight: 600 }}>{d.donorName}</div></td>
                        <td><BloodGroupBadge group={d.bloodGroup} /></td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.bankName}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.donationDate}</td>
                        <td style={{ fontWeight: 600 }}>{Number(d.quantity).toFixed(2)}</td>
                        <td><StatusBadge status={d.screeningStatus} /></td>
                        {isAdmin() && (
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => openScreen(d)} id={`screen-btn-${d.donationId}`}>
                              Update Screening
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

      {/* Record Donation Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Record Donation"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={saving} id="donation-submit">
            {saving ? <div className="spinner spinner-sm" /> : 'Record'}
          </button>
        </>}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Donor *</label>
            <select className="form-select" value={form.donorId} onChange={e => setForm({...form, donorId: e.target.value})} required id="don-donor">
              <option value="">Select donor</option>
              {donors.map(d => <option key={d.donorId} value={d.donorId}>{d.fullName} ({d.bloodGroup})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Blood Bank *</label>
            <select className="form-select" value={form.bankId} onChange={e => setForm({...form, bankId: e.target.value})} required id="don-bank">
              <option value="">Select bank</option>
              {banks.map(b => <option key={b.bankId} value={b.bankId}>{b.bankName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Donation Date *</label>
            <input className="form-input" type="date" value={form.donationDate}
              onChange={e => setForm({...form, donationDate: e.target.value})} required id="don-date" />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity (ml) *</label>
            <input className="form-input" type="number" min="1" step="0.01" placeholder="e.g. 450"
              value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required id="don-qty" />
          </div>
        </div>
      </Modal>

      {/* Update Screening Modal */}
      <Modal isOpen={showScreen} onClose={() => setShowScreen(false)}
        title={`Update Screening — ${selected?.donorName}`}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowScreen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleScreen} disabled={saving} id="screen-save-btn">
            {saving ? <div className="spinner spinner-sm" /> : 'Save'}
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Screening Status</label>
          <select className="form-select" value={screenStatus} onChange={e => setScreenStatus(e.target.value)} id="screen-status-select">
            {SCREENING.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          ⚡ Setting to <strong>Passed</strong> will automatically increase blood stock.
        </p>
      </Modal>
    </div>
  )
}
