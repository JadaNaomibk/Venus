// src/pages/DashboardPage.jsx
// very simple "lockable savings" demo screen.
// this version does NOT talk to the backend yet.
// it only uses local state so I can show the idea in my SBA project.

import { useState } from "react"

function DashboardPage() {
  // ------------------------------
  // 1) set up some starter mock data
  // ------------------------------

  // this is my list of savings goals for the logged-in user.
  // in a real app this would come from the server / database.
  const [goals, setGoals] = useState([
    {
      id: "demo-1",
      label: "rent buffer",
      amount: 300,
      lockUntil: "2025-12-01",
      status: "locked",           // "locked" | "withdrawn"
      emergencyAllowed: true,
      emergencyUsed: false,
    },
    {
      id: "demo-2",
      label: "birthday trip",
      amount: 500,
      lockUntil: "2026-03-15",
      status: "locked",
      emergencyAllowed: false,
      emergencyUsed: false,
    },
  ])

  // form fields for creating a new goal
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [lockUntil, setLockUntil] = useState("")
  const [emergencyAllowed, setEmergencyAllowed] = useState(true)

  // message area to show success / error text
  const [message, setMessage] = useState("")

  // simple loading flag so the button disables while "saving"
  const [saving, setSaving] = useState(false)

  // ------------------------------
  // 2) handle creating a new goal
  // ------------------------------

  function handleCreateGoal(event) {
    // stop the browser from refreshing the page
    event.preventDefault()

    // clear any old message
    setMessage("")

    // basic validation in plain english
    if (!label.trim() || !amount || !lockUntil) {
      setMessage("please fill in all fields.")
      return
    }

    const numericAmount = Number(amount)
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setMessage("amount must be a positive number.")
      return
    }

    setSaving(true)

    // create a simple goal object
    const newGoal = {
      id: String(Date.now()),   // quick unique id for demo only
      label: label.trim(),
      amount: numericAmount,
      lockUntil,
      createdAt: new Date().toISOString(),
      status: "locked",
      emergencyAllowed: emergencyAllowed,
      emergencyUsed: false,
    }

    // add the new goal onto the end of the existing array
    setGoals((prevGoals) => [...prevGoals, newGoal])

    // reset the form fields
    setLabel("")
    setAmount("")
    setLockUntil("")
    setEmergencyAllowed(true)

    // friendly success note
    setMessage("new savings goal created (demo only, local state).")

    setSaving(false)
  }

  // ------------------------------
  // 3) handle "emergency withdraw"
  // ------------------------------

  function handleEmergencyWithdraw(goalId) {
    // clear old message
    setMessage("")

    // update one goal inside the array
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id !== goalId) {
          // leave all the other goals alone
          return goal
        }

        // if the goal is already withdrawn, leave it as-is
        if (goal.status === "withdrawn") {
          return goal
        }

        // otherwise mark it withdrawn and flag emergencyUsed
        return {
          ...goal,
          status: "withdrawn",
          emergencyUsed: true,
        }
      })
    )

    setMessage("emergency withdrawal processed (demo only).")
  }

  // ------------------------------
  // 4) render the dashboard UI
  // ------------------------------

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>your venus dashboard</h1>
        <p className="dashboard-tagline">
          lock money on purpose, not by accident. (demo: local data only)
        </p>
      </header>

      <section className="dashboard-section">
        <h2>create a savings goal</h2>

        <form className="goal-form" onSubmit={handleCreateGoal}>
          <label className="field">
            <span className="field-label">goal name</span>
            <input
              type="text"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. emergency fund, rent buffer, trip"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">amount to lock</span>
            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              min="1"
              step="0.01"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">lock until</span>
            <input
              type="date"
              value={lockUntil}
              onChange={(event) => setLockUntil(event.target.value)}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={emergencyAllowed}
              onChange={(event) => setEmergencyAllowed(event.target.checked)}
            />
            allow emergency withdrawal
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "locking..." : "lock this money"}
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>your savings goals (demo)</h2>

        {goals.length === 0 && (
          <p className="dashboard-empty">you do not have any goals yet.</p>
        )}

        <ul className="goals-list">
          {goals.map((goal) => (
            <li key={goal.id} className="goal-card">
              <div className="goal-main">
                <h3>{goal.label}</h3>
                <p className="goal-amount">${goal.amount}</p>
              </div>

              <p className="goal-meta">
                lock until: <strong>{goal.lockUntil}</strong>
              </p>
              <p className="goal-meta">
                status: <strong>{goal.status}</strong>
              </p>
              {goal.emergencyAllowed && (
                <p className="goal-meta">
                  emergency:{" "}
                  <strong>{goal.emergencyUsed ? "used" : "available"}</strong>
                </p>
              )}

              {goal.status === "locked" && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleEmergencyWithdraw(goal.id)}
                >
                  emergency withdraw (demo)
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {message && <p className="dashboard-message">{message}</p>}
    </main>
  )
}

export default DashboardPage
