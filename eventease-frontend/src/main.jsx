// Verify this is EXACTLY what's in your main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'  // ← This line must be here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>  {/* ← This must wrap App */}
          <App />
        </UserProvider>  {/* ← Closing tag here */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)