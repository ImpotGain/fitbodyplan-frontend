import React from 'react'

const PLANS = [
  {
    name: 'Découverte', price: '0€', period: 'Pour toujours',
    features: ['2 plans / mois sur 7 jours', 'Programme entraînement complet', 'Plan alimentaire 7 jours', 'Calcul macros personnalisé'],
    cta: 'Commencer gratuit', ctaAction: true,
    bg: 'linear-gradient(160deg, #cce8ff, #a8d4f5)', border: '#6bb5ee', color: '#0a3d6b', accent: '#1a7abf',
  },
  {
    id: 'TRANSFORMATION', name: 'Transformation', price: '4,99€', period: 'par mois',
    features: ['10 plans / mois sur 7 jours', 'PDF téléchargeable', 'Historique 3 mois', 'Recalibrage du plan', 'Check-in hebdomadaire'],
    cta: 'Souscrire →', ctaAction: 'checkout',
    bg: 'linear-gradient(160deg, #b2eee6, #7addd0)', border: '#3ec9bc', color: '#065048', accent: '#0a9688',
  },
  {
    id: 'PERFORMANCE', name: 'Performance', price: '9,99€', period: 'par mois',
    features: ['40 plans / mois sur 7 jours', 'PDF téléchargeable', 'Historique illimité', '3 profils multi-personnes', 'Recalibrage automatique', 'Check-in hebdomadaire'],
    cta: 'Souscrire →', ctaAction: 'checkout',
    bg: 'linear-gradient(160deg, #ffe680, #ffb830)', border: '#e8960a', color: '#5a3500', accent: '#c47800',
  },
  {
    id: 'COACH', name: 'Coach', price: '24,99€', period: 'par mois',
    features: ['200 plans / mois sur 7 jours', 'PDF téléchargeable', '30 profils clients', 'Historique illimité', 'Export macros Excel', 'Lien partage client 7 jours', 'Recalibrage automatique'],
    cta: 'Souscrire →', ctaAction: 'checkout',
    bg: 'linear-gradient(160deg, #ff2a00, #cc1500)', border: '#a00e00', color: '#fff', accent: '#ffaa99', dark: true,
  },
]

const TAGS = [
  { label: '🔥 Perdre du ventre', key: 'gras' },
  { label: '💪 Prendre du muscle', key: 'masse' },
  { label: '⚡ Recomposition', key: 'recomp' },
  { label: '🏃 Remise en forme', key: 'forme' },
  { label: '🎯 Performance', key: 'perf' },
]

export default function Landing({ setScreen, setAnswers, auth }) {
  const start = (preselect) => {
    const map = { gras: 'perdre_graisse', masse: 'prise_masse', recomp: 'recomposition', forme: 'remise_forme', perf: 'performance' }
    if (preselect && map[preselect]) setAnswers({ objectif: map[preselect], objectif_multi: [map[preselect]] })
    else setAnswers({})
    setScreen('wizard')
  }

  const handleCheckout = async (planId) => {
    if (!auth?.user) { setScreen('login'); return }
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
      alert('Erreur : ' + e.message)
    }
  }

  return (
    <div>
      {/* HERO */}
      <div style={{ position: 'relative', width: '100%' }}>
        <img src="/hero.jpg" alt="FitBodyPlan" style={{ width: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', marginTop: '-8%' }}>
          <div style={{ maxWidth: 680, width: '100%' }}>

            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.1, letterSpacing: '-1px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', marginBottom: 14 }}>
              Ton corps.<br />
              <em style={{ color: 'var(--accent)' }}>Ton plan.</em>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '.6em', marginTop: 4 }}>En 2 minutes chrono.</span>
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6, maxWidth: 580, margin: '48px auto 0', fontWeight: 400, textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>
              Réponds à quelques questions. FitBodyPlan te personnalise à 100% ton plan alimentaire complet et ton programme d'entraînement.
            </p>
          </div>
        </div>
      </div>

      {/* BARRE COMMENCER à cheval */}
      <div style={{ background: 'var(--bg)', padding: '0 24px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', transform: 'translateY(-29px)' }}>
          <div onClick={() => start()} style={{ width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border-dark)', borderRadius: 14, padding: '0 8px 0 20px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}>
            <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300 }}>Quel est ton objectif fitness ?</span>
            <div style={{ background: 'var(--accent)', borderRadius: 10, padding: '9px 18px', color: 'white', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>Commencer →</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: -6 }}>
          {TAGS.map(t => (
            <button key={t.key} onClick={() => start(t.key)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, padding: '7px 16px', fontSize: 16, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--tag)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--muted)' }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Nos offres</div>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(30px,4vw,46px)', letterSpacing: -1, lineHeight: 1.1, color: 'var(--text)', marginBottom: 48 }}>
          Commence<br /><em style={{ color: 'var(--accent)' }}>gratuitement.</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'stretch' }}>
          {PLANS.map(plan => (
            <div key={plan.name}
              style={{ background: plan.bg, border: `1px solid ${plan.border}`, borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', transition: 'transform .2s, box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 38, letterSpacing: -1.5, color: plan.color, lineHeight: 1, marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 12, color: plan.dark ? 'rgba(255,255,255,0.7)' : 'var(--muted)', marginBottom: 20, fontWeight: 300 }}>{plan.period}</div>
              <ul style={{ listStyle: 'none', marginBottom: 24, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: plan.dark ? 'rgba(255,255,255,0.9)' : 'var(--muted)', padding: '5px 0', display: 'flex', gap: 8, fontWeight: 300 }}>
                    <span style={{ color: plan.accent, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={plan.ctaAction === true ? () => start() : plan.ctaAction === 'checkout' ? () => handleCheckout(plan.id) : undefined}
                style={{ width: '100%', padding: 11, borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: plan.ctaAction ? 700 : 500, cursor: plan.ctaAction ? 'pointer' : 'default', border: `1.5px solid ${plan.dark ? 'rgba(255,255,255,0.5)' : plan.accent}`, background: plan.ctaAction === true ? plan.accent : (plan.ctaAction === 'checkout' ? (plan.dark ? 'rgba(255,255,255,0.25)' : plan.accent) : (plan.dark ? 'rgba(255,255,255,0.15)' : 'none')), color: plan.dark ? '#fff' : (plan.ctaAction ? '#fff' : plan.color) }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', flexWrap: 'wrap', gap: 16 }}>
        <span>© 2026 FitBodyPlan · fitbodyplan.fr</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ label: 'Mentions légales & CGU', screen: 'legal' }, { label: 'Contact', screen: 'contact' }].map(l => (
            <a key={l.label} href="#" onClick={e => { e.preventDefault(); setScreen(l.screen) }}
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{l.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
