// src/App.jsx
// main React app component.
// right now I have 3 pages:
//   "/"          → LandingPage (intro screen)
//   "/auth"      → AuthPage (log in / sign up)
//   "/dashboard" → DashboardPage (lockable savings demo)

import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App
