// src/pages/AuthPage.jsx
// This page lets the user either:
// - log in to an existing account
// - or create a new account
// It talks to the backend using the apiRequest() helper.

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "../api.js"

function AuthPage() {
  // "mode" tells us which action the user is doing: "login" or "register"
  const [mode, setMode] = useState("login")

  // form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // feedback for the user (errors or success messages)
  const [message, setMessage] = useState("")

  // loading = true while we are waiting for the backend
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // This runs when the form is submitted (user clicks the button)
  async function handleSubmit(e) {
    e.preventDefault() // stop the page from refreshing
    setMessage("") // clear any previous message
    setLoading(true) // show that we are doing work

    try {
      // 1) choose the backend path based on the mode
      //    NOTE: apiRequest already adds "/api" and the base URL,
      //    so here we only pass "/auth/login" or "/auth/register".
      const path = mode === "login" ? "/auth/login" : "/auth/register"

      // 2) send the request to the backend
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      })

      // 3) if we reach here, the backend responded with 2xx (success)
      //    so we can show the message from the server
      setMessage(data.message || "success.")

      // 4) after successful login / sign up,
      //    send them back to the landing page for now
      navigate("/")
    } catch (err) {
      // if the backend returned an error (4xx or 5xx)
      // apiRequest threw an Error, so we catch it here
      setMessage(err.message)
    } finally {
      // always turn loading off at the end
      setLoading(false)
    }
  }

  return (
    <main className="auth">
      <h1>venus auth</h1>

      {/* toggle between "log in" and "sign up" */}
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

      {/* the actual form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          email
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          password
          <input
            type="password"
            value={password}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
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

      {/* feedback message from the backend */}
      {message && <p className="auth-message">{message}</p>}

      <p className="auth-note">
        this is just a prototype. please don&apos;t use real banking passwords here.
      </p>
    </main>
  )
}

export default AuthPage
