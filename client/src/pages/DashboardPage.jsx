// src/pages/DashboardPage.jsx
// dashboard page for Venus.
// this version uses ONLY FRONTEND STATE (mock data) for savings goals.
// no database, no real money – just a safe demo of the lockable savings concept.

import { useState, useEffect } from "react";

function DashboardPage() {
  // -----------------------------
  // 1. state for the savings form
  // -----------------------------
  const [label, setLabel] = useState("");            // name of the goal (ex: "Puerto Rico trip")
  const [amount, setAmount] = useState("");          // how much to lock
  const [lockUntil, setLockUntil] = useState("");    // date string: "2025-12-31"
  const [emergencyAllowed, setEmergencyAllowed] = useState(true); // can user unlock early?

  // -----------------------------
  // 2. state for the goals list
  // -----------------------------
  const [goals, setGoals] = useState([]);            // array of goal objects
  const [message, setMessage] = useState("");        // success / error text for the user

  // -------------------------------------------
  // 3. load any saved goals from localStorage
  //    (so if you refresh the page, you still
  //     see the same mock goals)
  // -------------------------------------------
  useEffect(() => {
    try {
      const stored = localStorage.getItem("venusGoals");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setGoals(parsed);
        }
      }
    } catch (err) {
      console.error("error reading venusGoals from localStorage:", err);
    }
  }, []);

  // ----------------------------------------------------
  // 4. every time "goals" changes, save them to storage
  // ----------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem("venusGoals", JSON.stringify(goals));
    } catch (err) {
      console.error("error saving venusGoals to localStorage:", err);
    }
  }, [goals]);

  // ------------------------------------------------
  // helper: build one goal object in a consistent way
  // ------------------------------------------------
  function createGoalObject({ label, amount, lockUntil, emergencyAllowed }) {
    const now = new Date();

    return {
      id: String(now.getTime()) + "-" + Math.random().toString(16).slice(2),
      label: String(label).trim(),
      amount: Number(amount),
      lockUntil,                    // keep as date string from the input
      createdAt: now.toISOString(), // when the goal was made
      status: "locked",             // "locked" or "withdrawn"
      emergencyAllowed: !!emergencyAllowed,
      emergencyUsed: false          // becomes true if we unlock early
    };
  }

  // ------------------------------------------------
  // 5. submit handler for the "create goal" form
  // ------------------------------------------------
  function handleCreateGoal(event) {
    event.preventDefault();
    setMessage("");

    // basic validation, very beginner friendly:
    if (!label || !amount || !lockUntil) {
      setMessage("please fill out all the fields first.");
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setMessage("amount must be a positive number.");
      return;
    }

    const newGoal = createGoalObject({
      label,
      amount: numericAmount,
      lockUntil,
      emergencyAllowed
    });

    // add the new goal to the existing list
    setGoals((prev) => [newGoal, ...prev]);

    // clear the form
    setLabel("");
    setAmount("");
    setLockUntil("");
    setEmergencyAllowed(true);

    setMessage("new savings goal locked.");
  }

  // ------------------------------------------------
  // 6. click handler for "emergency withdraw" button
  // ------------------------------------------------
  function handleEmergencyWithdraw(goalId) {
    setMessage("");

    setGoals((prev) => {
      return prev.map((goal) => {
        if (goal.id !== goalId) return goal;

        // if it's already withdrawn, do nothing
        if (goal.status === "withdrawn") {
          return goal;
        }

        // in a real app, we would check the date and maybe block this.
        // for this demo, we just mark it as withdrawn
        return {
          ...goal,
          status: "withdrawn",
          emergencyUsed: true
        };
      });
    });

    setMessage("goal withdrawn from lock (demo only, no real money).");
  }

  // ------------------------------------------------
  // 7. helper: compute total locked amount
  // ------------------------------------------------
  const totalLocked = goals
    .filter((goal) => goal.status === "locked")
    .reduce((sum, goal) => sum + goal.amount, 0);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>your venus dashboard</h1>
        <p className="dashboard-tagline">
          lock small amounts on purpose, not by accident.
        </p>
      </header>

      {/* summary bar at the top */}
      <section className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">goals locked</span>
          <span className="summary-value">{goals.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">total locked</span>
          <span className="summary-value">${totalLocked.toFixed(2)}</span>
        </div>
      </section>

      {/* form to create a new goal */}
      <section className="dashboard-section">
        <h2>create a savings goal</h2>

        <form className="goal-form" onSubmit={handleCreateGoal}>
          <label>
            goal name
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ex: flight, rent buffer, camera"
              required
            />
          </label>

          <label>
            amount to lock
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </label>

          <label>
            lock until
            <input
              type="date"
              value={lockUntil}
              onChange={(e) => setLockUntil(e.target.value)}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={emergencyAllowed}
              onChange={(e) => setEmergencyAllowed(e.target.checked)}
            />
            allow emergency withdrawal before the lock date
          </label>

          <button type="submit">lock this money (demo)</button>
        </form>
      </section>

      {/* list of goals */}
      <section className="dashboard-section">
        <h2>your savings goals</h2>

        {goals.length === 0 && (
          <p className="empty-state">
            you don&apos;t have any locked goals yet. start with something tiny.
          </p>
        )}

        <ul className="goals-list">
          {goals.map((goal) => (
            <li key={goal.id} className="goal-card">
              <div className="goal-card-main">
                <h3>{goal.label}</h3>
                <p className="goal-amount">${goal.amount.toFixed(2)}</p>
              </div>

              <p className="goal-meta">
                lock until: <span>{goal.lockUntil}</span>
              </p>

              <p className="goal-meta">
                status:{" "}
                <span className={goal.status === "locked" ? "status-pill locked" : "status-pill withdrawn"}>
                  {goal.status}
                </span>
              </p>

              {goal.emergencyAllowed && (
                <p className="goal-meta">
                  emergency:{" "}
                  <span className="status-pill emergency">
                    {goal.emergencyUsed ? "used" : "allowed"}
                  </span>
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
  );
}

export default DashboardPage;
