// src/pages/AuthPage.jsx
// this page lets someone either log in or create an account.
// it talks directly to my backend auth routes.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api.js'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'

      const data = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      setMessage(data.message || 'success.')

      // for now I just send them back to the landing page after auth
      navigate('/')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth">
      <h1>venus auth</h1>

      <div className="auth-toggle">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          log in
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          sign up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'please wait...' : mode === 'login' ? 'log in' : 'create account'}
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <p className="auth-note">
        this is just a demo. please don&apos;t use real banking passwords here.
      </p>
    </main>
  )
}

export default AuthPage
