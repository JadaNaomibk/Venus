// src/pages/AuthPage.jsx
// this page lets someone either log in or create an account.
// it talks to my backend auth routes using the apiRequest helper.

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../api.js"

function AuthPage() {
  // mode tells me if the user is logging in or signing up
  const [mode, setMode] = useState("login")

  // email + password text fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // message area to show success / errors
  const [message, setMessage] = useState("")

  // simple loading flag
  const [loading, setLoading] = useState(false)

  // allows me to change pages in React Router
  const navigate = useNavigate()

  async function handleSubmit(event) {
    // stop the browser from refreshing the page
    event.preventDefault()

    // clear any old message
    setMessage("")
    setLoading(true)

    try {
      // pick the correct backend path based on the mode
      const path = mode === "login" ? "/auth/login" : "/auth/register"

      // send the request to my backend
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      // if the backend replies with a friendly message, show it
      setMessage(data.message || "success.")

      // if login / signup works, send the user to the dashboard demo
      navigate("/dashboard")
    } catch (error) {
      // if something goes wrong, show that message to the user
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth">
      <h1>venus auth</h1>

      {/* toggle buttons so I can switch between login and sign up */}
      <div className="auth-toggle">
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          log in
        </button>
        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          sign up
        </button>
      </div>

      {/* main form for email + password */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          email
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          password
          <input
            type="password"
            value={password}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "please wait..."
            : mode === "login"
            ? "log in"
            : "create account"}
        </button>
      </form>

      {/* show success / error text under the form */}
      {message && <p className="auth-message">{message}</p>}

      <p className="auth-note">
        this is just a demo. please don&apos;t use real banking passwords here.
      </p>
    </main>
  )
}

export default AuthPage
