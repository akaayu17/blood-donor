import { useEffect, useState } from 'react'
import { Pencil, AlertTriangle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Modal from '../../components/Modal'
import BloodGroupBadge from '../../components/BloodGroupBadge'
import EmptyState from '../../components/EmptyState'
import { bloodStockAPI, bloodBankAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function BloodStock() {
  const { isAdmin } = useAuth()
  const [stocks, setStocks]     = useState([])
  const [banks, setBanks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filterBank, setFilterBank] = useState('')
  const [showEdit, setShowEdit]     = useState(false)
  const [selected, setSelected]     = useState(null)
  const [newQty, setNewQty]         = useState('')
  const [saving, setSaving]         = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [sRes, bRes] = await Promise.all([bloodStockAPI.getAll(), bloodBankAPI.getAll()])
      setStocks(sRes.data)
      setBanks(bRes.data)
    } catch { toast.error('Failed to load stock') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = filterBank ? stocks.filter(s => s.bankId === parseInt(filterBank)) : stocks

  const getRowStyle = (qty) => {
    const q = Number(qty)
    if (q < 100) return { background: 'rgba(239, 68, 68, 0.04)' }
    if (q < 200) return { background: 'rgba(245, 158, 11, 0.04)' }
    return {}
  }

  const getQtyStyle = (qty) => {
    const q = Number(qty)
    if (q < 100) return { color: 'var(--danger)', fontWeight: 700 }
    if (q < 200) return { color: 'var(--warning)', fontWeight: 600 }
    return { color: 'var(--success)' }
  }

  const openEdit = (s) => {
    setSelected(s)
    setNewQty(String(s.quantity))
    setShowEdit(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const qty = parseFloat(newQty)
    if (isNaN(qty) || qty < 0) { toast.error('Enter a valid quantity'); return }
    setSaving(true)
    try {
      await bloodStockAPI.update(selected.stockId, qty)
      toast.success('Stock updated!')
      setShowEdit(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Blood Stock" subtitle="Monitor and manage blood inventory" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Blood Inventory</h2>
              <p className="page-subtitle">Real-time stock levels across all blood banks</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-danger"><AlertTriangle size={10} /> Low: &lt;100ml</span>
              <span className="badge badge-warning">Medium: &lt;200ml</span>
              <span className="badge badge-success">Good: ≥200ml</span>
              <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={14} /></button>
            </div>
          </div>

          <div className="filter-bar">
            <select className="filter-select" value={filterBank} onChange={e => setFilterBank(e.target.value)} id="stock-bank-filter">
              <option value="">All Blood Banks</option>
              {banks.map(b => <option key={b.bankId} value={b.bankId}>{b.bankName}</option>)}
            </select>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="spinner-overlay"><div className="spinner" /></div>
            : filtered.length === 0 ? <EmptyState title="No stock records" />
            : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Blood Group</th>
                      <th>Bank</th>
                      <th>Quantity (ml)</th>
                      <th>Level</th>
                      {isAdmin() && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.stockId} style={getRowStyle(s.quantity)}>
                        <td><BloodGroupBadge group={s.bloodGroup} /></td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{s.bankName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {s.bankId}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: 20, ...getQtyStyle(s.quantity) }}>{Number(s.quantity).toFixed(2)}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>ml</span>
                        </td>
                        <td>
                          {Number(s.quantity) < 100 ? <span className="badge badge-danger"><AlertTriangle size={10} /> Critical</span>
                          : Number(s.quantity) < 200 ? <span className="badge badge-warning">Low</span>
                          : <span className="badge badge-success">Good</span>}
                        </td>
                        {isAdmin() && (
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)} id={`edit-stock-${s.stockId}`}>
                              <Pencil size={12} /> Update
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

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)}
        title={`Update Stock — ${selected?.bloodGroup} @ ${selected?.bankName}`}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="stock-save-btn">
            {saving ? <div className="spinner spinner-sm" /> : 'Save'}
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">New Quantity (ml) *</label>
          <input className="form-input" type="number" min="0" step="0.01"
            value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="e.g. 450.00" id="stock-qty-input" />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Current: <strong style={{ color: 'var(--text-secondary)' }}>{Number(selected?.quantity || 0).toFixed(2)} ml</strong>
        </div>
      </Modal>
    </div>
  )
}
