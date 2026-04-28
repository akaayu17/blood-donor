import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#16161f',
              color: '#f0f0f5',
              border: '1px solid #252535',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#16161f' },
            },
            error: {
              iconTheme: { primary: '#e8192c', secondary: '#16161f' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
