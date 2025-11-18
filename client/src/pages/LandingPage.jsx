// src/pages/LandingPage.jsx
// simple landing page that explains the idea
// and sends people to the auth screen.

import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="landing">
      <header className="landing-header">
        <h1>VENUS SAVINGS</h1>
        <p className="tagline">lock it. forget it. reach it.</p>
      </header>

      <section className="landing-body">
        <p>
          this is my lockable savings demo. right now I&apos;m focusing on the core
          auth flow: making an account and logging in safely. later on I can add
          the savings logic on top of this foundation.
        </p>

        <div className="cta-buttons">
          <button onClick={() => navigate('/auth')}>get started</button>
        </div>
      </section>
    </main>
  )
}

export default LandingPage
