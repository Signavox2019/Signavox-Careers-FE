import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { NavigationProvider } from './contexts/NavigationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
)
