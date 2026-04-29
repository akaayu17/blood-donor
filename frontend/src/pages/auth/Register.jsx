import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const GENDERS = ['Male', 'Female', 'Other']

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    dateOfBirth: '', gender: '', address: '', phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password || !form.dateOfBirth || !form.gender) {
      toast.error('Please fill all required fields'); return
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const payload = { ...form }
      delete payload.confirmPassword
      const res = await authAPI.register(payload)
      login(res.data)
      toast.success('Account created! Welcome!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🩸</div>
          <span className="auth-logo-name">Blood Donor</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the network and save lives</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" type="text" name="fullName" placeholder="John Doe"
                value={form.fullName} onChange={handleChange} required id="reg-fullname" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required id="reg-email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" name="password" placeholder="Min 6 chars"
                value={form.password} onChange={handleChange} required id="reg-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required id="reg-confirm-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input className="form-input" type="date" name="dateOfBirth"
                value={form.dateOfBirth} onChange={handleChange} required id="reg-dob" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select className="form-select" name="gender" value={form.gender}
                onChange={handleChange} required id="reg-gender">
                <option value="">Select gender</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" name="phoneNumber" placeholder="+1-555-000-0000"
              value={form.phoneNumber} onChange={handleChange} id="reg-phone" />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-textarea" name="address" placeholder="Your address..."
              value={form.address} onChange={handleChange} rows={2} id="reg-address" />
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }} disabled={loading} id="reg-submit">
            {loading ? <><div className="spinner spinner-sm" /> Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login/user" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
