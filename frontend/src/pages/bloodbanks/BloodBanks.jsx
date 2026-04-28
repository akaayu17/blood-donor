import { useEffect, useState } from 'react'
import { Plus, MapPin, Phone, Pencil, Trash2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import Modal from '../../components/Modal'
import EmptyState from '../../components/EmptyState'
import { bloodBankAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = { bankName: '', location: '', licenseNumber: '', phoneNumbers: [''] }

export default function BloodBanks() {
  const { isAdmin } = useAuth()
  const [banks, setBanks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)

  const load = async () => {
    setLoading(true)
    try { setBanks((await bloodBankAPI.getAll()).data) }
    catch { toast.error('Failed to load blood banks') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (b) => {
    setEditing(b)
    setForm({ bankName: b.bankName, location: b.location, licenseNumber: b.licenseNumber,
              phoneNumbers: b.phones?.length ? b.phones : [''] })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.bankName || !form.location || !form.licenseNumber) { toast.error('Fill all required fields'); return }
    setSaving(true)
    try {
      const payload = { ...form, phoneNumbers: form.phoneNumbers.filter(p => p.trim()) }
      if (editing) {
        await bloodBankAPI.update(editing.bankId, payload)
        toast.success('Blood bank updated!')
      } else {
        await bloodBankAPI.create(payload)
        toast.success('Blood bank created!')
      }
      setShowModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try { await bloodBankAPI.delete(id); toast.success('Blood bank deleted!'); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  const addPhone = () => setForm({ ...form, phoneNumbers: [...form.phoneNumbers, ''] })
  const updatePhone = (i, v) => {
    const arr = [...form.phoneNumbers]; arr[i] = v; setForm({ ...form, phoneNumbers: arr })
  }
  const removePhone = (i) => setForm({ ...form, phoneNumbers: form.phoneNumbers.filter((_, j) => j !== i) })

  const getStockLevel = (qty) => {
    if (qty < 100) return 'low'
    if (qty < 300) return 'medium'
    return 'high'
  }

  const maxQty = 600

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Blood Banks" subtitle={`${banks.length} registered blood banks`} />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h2 className="page-title">Blood Banks</h2>
              <p className="page-subtitle">Manage blood bank facilities and their stock</p>
            </div>
            {isAdmin() && (
              <button className="btn btn-primary" onClick={openAdd} id="add-bank-btn">
                <Plus size={16} /> Add Blood Bank
              </button>
            )}
          </div>

          {loading ? <div className="spinner-overlay"><div className="spinner" /></div>
          : banks.length === 0 ? <EmptyState title="No blood banks found" />
          : (
            <div className="bank-cards">
              {banks.map(bank => (
                <div key={bank.bankId} className="bank-card">
                  <div className="bank-card-header">
                    <div>
                      <div className="bank-card-name">{bank.bankName}</div>
                      <div className="bank-card-license">#{bank.licenseNumber}</div>
                    </div>
                    {isAdmin() && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(bank)} id={`edit-bank-${bank.bankId}`}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(bank.bankId, bank.bankName)} id={`del-bank-${bank.bankId}`}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bank-card-location">
                    <MapPin size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                    {bank.location}
                  </div>

                  {bank.phones?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                      {bank.phones.map((ph, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                          <Phone size={10} />{ph}
                        </span>
                      ))}
                    </div>
                  )}

                  {bank.stocks?.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Stock Levels
                      </div>
                      <div className="stock-bars">
                        {bank.stocks.map(s => {
                          const level = getStockLevel(Number(s.quantity))
                          const pct = Math.min((Number(s.quantity) / maxQty) * 100, 100)
                          return (
                            <div key={s.stockId} className="stock-bar-item">
                              <div className="stock-bar-header">
                                <span className="stock-bar-group">{s.bloodGroup}</span>
                                <span className="stock-bar-qty">{Number(s.quantity).toFixed(0)} ml</span>
                              </div>
                              <div className="stock-bar-track">
                                <div className={`stock-bar-fill ${level}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? 'Edit Blood Bank' : 'Add Blood Bank'}
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} id="save-bank-btn">
            {saving ? <div className="spinner spinner-sm" /> : 'Save'}
          </button>
        </>}>
        <div className="form-group">
          <label className="form-label">Bank Name *</label>
          <input className="form-input" value={form.bankName} placeholder="City Blood Center"
            onChange={e => setForm({...form, bankName: e.target.value})} id="bank-name-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Location *</label>
          <textarea className="form-textarea" rows={2} value={form.location} placeholder="Full address..."
            onChange={e => setForm({...form, location: e.target.value})} id="bank-location-input" />
        </div>
        <div className="form-group">
          <label className="form-label">License Number *</label>
          <input className="form-input" value={form.licenseNumber} placeholder="LIC-XXX-000"
            onChange={e => setForm({...form, licenseNumber: e.target.value})} id="bank-license-input" />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="form-label" style={{ margin: 0 }}>Phone Numbers</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addPhone}><Plus size={12} /> Add</button>
          </div>
          {form.phoneNumbers.map((ph, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input className="form-input" value={ph} placeholder="+1-555-000-0000"
                onChange={e => updatePhone(i, e.target.value)} />
              {form.phoneNumbers.length > 1 && (
                <button type="button" className="btn btn-danger btn-icon" onClick={() => removePhone(i)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
