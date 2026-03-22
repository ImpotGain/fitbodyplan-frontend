import React, { useState, useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Landing from './pages/Landing.jsx'
import Wizard from './pages/Wizard.jsx'
import Result from './pages/Result.jsx'
import Legal from './pages/Legal.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Account from './pages/Account.jsx'
import Checkout from './pages/Checkout.jsx'

const API = '/api'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('fbp_wizard')
      return saved ? JSON.parse(saved) : {}
    } catch(e) { return {} }
  })

  // Sauvegarder les réponses du wizard en sessionStorage
  React.useEffect(() => {
    try { sessionStorage.setItem('fbp_wizard', JSON.stringify(answers)) } catch(e) {}
  }, [answers])
  const [planText, setPlanText] = useState('')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Charger user au démarrage + gérer retour Stripe
  // AbortController pour éviter le double-appel React StrictMode
  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams(window.location.search)
    const payment = params.get('payment')
    if (payment === 'success') {
      window.history.replaceState({}, '', '/')
      // Refresh immédiat + retry après 3s pour laisser le webhook Stripe s'exécuter
      const refreshUser = () => {
        const token = localStorage.getItem('fbp_token')
        if (token) {
          fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(u => { if (u) setUser(u) })
            .catch(() => {})
        }
      }
      refreshUser()
      setTimeout(refreshUser, 3000) // Retry après 3s - le webhook peut avoir un délai
    }
    const token = localStorage.getItem('fbp_token')
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setUser(u) })
        .catch(e => { if (e.name !== 'AbortError') console.error(e) })
        .finally(() => setAuthLoading(false))
    } else {
      setAuthLoading(false)
    }
    return () => controller.abort()
  }, [])

  const auth = {
    user,
    login: async (email, password) => {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur connexion')
      localStorage.setItem('fbp_token', data.token)
      setUser(data.user)
      return data.user
    },
    register: async (email, password, firstName, lastName) => {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName: `${firstName} ${lastName}`.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur inscription')
      localStorage.setItem('fbp_token', data.token)
      setUser(data.user)
      return data.user
    },
    logout: () => {
      localStorage.removeItem('fbp_token')
      setUser(null)
      setScreen('landing')
    },
    deleteAccount: async () => {
      const token = localStorage.getItem('fbp_token')
      await fetch(`${API}/auth/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      localStorage.removeItem('fbp_token')
      setUser(null)
      setScreen('landing')
    }
  }

  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    </div>
  )

  return (
    <>
      <Nav screen={screen} setScreen={setScreen} auth={auth} />
      {screen === 'landing' && <Landing setScreen={setScreen} setAnswers={setAnswers} auth={auth} />}
      {screen === 'wizard' && <Wizard answers={answers} setAnswers={setAnswers} setScreen={setScreen} setPlanText={setPlanText} auth={auth} />}
      {screen === 'result' && <Result planText={planText} setPlanText={setPlanText} answers={answers} setScreen={setScreen} setAnswers={setAnswers} auth={auth} />}
      {screen === 'legal' && <Legal setScreen={setScreen} />}
      {screen === 'contact' && <Contact setScreen={setScreen} />}
      {screen === 'login' && <Login setScreen={setScreen} auth={auth} />}
      {screen === 'account' && <Account setScreen={setScreen} auth={auth} />}
      {screen === 'checkout' && <Checkout setScreen={setScreen} auth={auth} />}
    </>
  )
}
