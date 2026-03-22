import React, { useState, useEffect } from 'react'

const STEPS_LABELS = [
  'Analyse de ton profil',
  'Calcul des macros et calories',
  'Construction du programme d\'entraînement',
  'Rédaction du plan alimentaire 7 jours',
  'Génération de la liste de courses',
  'Vérification allergènes',
]

export default function Loading() {
  const [done, setDone] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDone(d => {
        if (d < STEPS_LABELS.length) return d + 1
        clearInterval(interval)
        return d
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center', padding: '0 24px' }}>
      <div style={{
        width: 52, height: 52, border: '2px solid var(--border)',
        borderTopColor: 'var(--text)', borderRadius: '50%',
        animation: 'spin .8s linear infinite', margin: '0 auto 28px',
      }} />
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, letterSpacing: '-.5px', color: 'var(--text)', marginBottom: 8 }}>
        Génération en cours…
      </div>
      <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6, marginBottom: 36 }}>
        L'IA analyse ton profil et construit<br />un plan 100% personnalisé pour toi.
      </p>
      <div style={{ textAlign: 'left' }}>
        {STEPS_LABELS.map((label, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 0', borderBottom: i < STEPS_LABELS.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: 14, color: i < done ? 'var(--text)' : 'var(--muted)',
            transition: 'color .3s',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `1.5px solid ${i < done ? 'var(--accent)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 11,
              background: i < done ? 'var(--accent)' : 'transparent',
              color: i < done ? 'white' : 'inherit',
              transition: 'all .3s',
            }}>
              {i < done ? '✓' : i + 1}
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
