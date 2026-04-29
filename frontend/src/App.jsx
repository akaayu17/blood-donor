import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Donors from './pages/donors/Donors'
import BloodBanks from './pages/bloodbanks/BloodBanks'
import BloodStock from './pages/stock/BloodStock'
import BloodRequests from './pages/requests/BloodRequests'
import Donations from './pages/donations/Donations'
import AdminPanel from './pages/admin/AdminPanel'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<Navigate to="/login/user" replace />} />
      <Route path="/login/user" element={<Login panel="User" />} />
      <Route path="/login/admin" element={<Login panel="Admin" />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/donors"    element={<ProtectedRoute allowedRoles={['Admin']}><Donors /></ProtectedRoute>} />
      <Route path="/blood-banks" element={<ProtectedRoute><BloodBanks /></ProtectedRoute>} />
      <Route path="/blood-stock" element={<ProtectedRoute><BloodStock /></ProtectedRoute>} />
      <Route path="/blood-requests" element={<ProtectedRoute><BloodRequests /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
