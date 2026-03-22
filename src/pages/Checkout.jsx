import React, { useState } from 'react'

const PLANS = [
  {
    id: 'TRANSFORMATION', name: 'Transformation', price: '4,99€', period: 'par mois',
    features: ['10 plans / mois sur 7 jours', 'PDF téléchargeable', 'Historique 3 mois', 'Recalibrage du plan', 'Check-in hebdomadaire'],
    bg: 'linear-gradient(160deg, #b2eee6, #7addd0)', color: '#065048', accent: '#0a9688', border: '#3ec9bc',
  },
  {
    id: 'PERFORMANCE', name: 'Performance', price: '9,99€', period: 'par mois',
    features: ['40 plans / mois sur 7 jours', 'PDF téléchargeable', 'Historique illimité', '3 profils multi-personnes', 'Recalibrage automatique', 'Check-in hebdomadaire'],
    bg: 'linear-gradient(160deg, #ffe680, #ffb830)', color: '#5a3500', accent: '#c47800', border: '#e8960a',
  },
  {
    id: 'COACH', name: 'Coach', price: '24,99€', period: 'par mois',
    features: ['200 plans / mois sur 7 jours', 'PDF téléchargeable', '30 profils clients', 'Historique illimité', 'Export macros Excel', 'Lien partage client', 'Recalibrage automatique'],
    bg: 'linear-gradient(160deg, #ff2a00, #cc1500)', color: '#fff', accent: '#ffaa99', border: '#a00e00', dark: true,
  },
]

export default function Checkout({ setScreen, auth, selectedPlan }) {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const handleCheckout = async (planId) => {
    if (!auth.user) { setScreen('login'); return }
    setLoading(planId)
    setError('')
    try {
      const token = localStorage.getItem('fbp_token')
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 80px' }}>
      <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', marginBottom: 32, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour</button>

      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, letterSpacing: '-1px', marginBottom: 8 }}>Passer à l'offre suivante</div>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 48, fontWeight: 300 }}>Paiement sécurisé par Stripe. Annulation à tout moment.</p>

      {error && <div style={{ background: 'color-mix(in srgb, var(--accent2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent2) 30%, transparent)', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: 'var(--accent2)', marginBottom: 24 }}>⚠️ {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {/* Découverte - plan actuel */}
        <div style={{ background: 'linear-gradient(160deg, #cce8ff, #a8d4f5)', border: '1px solid #6bb5ee', borderRadius: 16, padding: '28px 22px', display: 'flex', flexDirection: 'column', opacity: 0.7 }}>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, color: '#0a3d6b', marginBottom: 4 }}>Découverte</div>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 40, letterSpacing: -2, color: '#0a3d6b', lineHeight: 1, marginBottom: 4 }}>0€</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24, fontWeight: 300 }}>Pour toujours</div>
          <ul style={{ listStyle: 'none', marginBottom: 28, flex: 1 }}>
            {['2 plans / mois sur 7 jours', 'Programme entraînement complet', 'Plan alimentaire 7 jours', 'Calcul macros personnalisé'].map(f => (
              <li key={f} style={{ fontSize: 13, color: 'var(--muted)', padding: '6px 0', display: 'flex', gap: 8, fontWeight: 300, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#1a7abf', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <div style={{ width: '100%', padding: 13, borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'center', border: '1.5px solid #6bb5ee', color: '#0a3d6b', background: 'rgba(255,255,255,0.5)' }}>
            Plan actuel
          </div>
        </div>

        {PLANS.map(plan => (
          <div key={plan.id} style={{ background: plan.bg, border: `1px solid ${plan.border}`, borderRadius: 16, padding: '28px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 40, letterSpacing: -2, color: plan.color, lineHeight: 1, marginBottom: 4 }}>{plan.price}</div>
            <div style={{ fontSize: 12, color: plan.dark ? 'rgba(255,255,255,0.7)' : 'var(--muted)', marginBottom: 24, fontWeight: 300 }}>{plan.period}</div>
            <ul style={{ listStyle: 'none', marginBottom: 28, flex: 1 }}>
              {plan.features.map(f => (
                <li key={f} style={{ fontSize: 13, color: plan.dark ? 'rgba(255,255,255,0.9)' : 'var(--muted)', padding: '6px 0', display: 'flex', gap: 8, fontWeight: 300, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ color: plan.accent, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading === plan.id}
              style={{ width: '100%', padding: 13, borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${plan.dark ? 'rgba(255,255,255,0.5)' : plan.accent}`, background: plan.dark ? 'rgba(255,255,255,0.25)' : plan.accent, color: '#fff', backdropFilter: plan.dark ? 'none' : 'none', transition: 'all .15s', opacity: loading === plan.id ? .7 : 1 }}
            >
              {loading === plan.id ? '...' : `Choisir ${plan.name} →`}
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', fontSize: 12, color: 'var(--muted)', marginTop: 32, display: 'flex', gap: 24, justifyContent: 'center' }}>
        <span>🔒 Paiement sécurisé SSL</span>
        <span>💳 Stripe · CB, Visa, Mastercard</span>
        <span>↩️ Annulation sans engagement</span>
      </div>
    </div>
  )
}
