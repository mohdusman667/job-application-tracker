import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthPage from './AuthPage.jsx'

function Root() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  function handleAuth({ token, user }) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
  }

     const isResetting = new URLSearchParams(window.location.search).has('resetToken')

   return token && !isResetting ? (
    <App onLogout={handleLogout} />
  ) : (
    <AuthPage onAuth={handleAuth} />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)