import React, { useState } from 'react'

const inp = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%', transition: 'border-color .2s' }
const lbl = { fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }

export default function Login({ setScreen, auth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setError('')
    if (!form.email || !form.password) return setError('Remplis tous les champs obligatoires.')
    if (mode === 'register') {
      if (form.password.length < 8) return setError('Mot de passe : 8 caractères minimum.')
      if (form.password !== form.confirmPassword) return setError('Les mots de passe ne correspondent pas.')
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await auth.login(form.email, form.password)
      } else {
        await auth.register(form.email, form.password, form.firstName, form.lastName)
      }
      setScreen('landing')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 24px 80px' }}>
      <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', marginBottom: 32, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour</button>

      <div style={{ display: 'flex', gap: 4, marginBottom: 36, background: 'var(--surface2)', borderRadius: 10, padding: 4 }}>
        {[{ id: 'login', label: 'Se connecter' }, { id: 'register', label: 'Créer un compte' }].map(t => (
          <button key={t.id} onClick={() => { setMode(t.id); setError('') }} style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: mode === t.id ? 600 : 400, background: mode === t.id ? 'var(--surface)' : 'transparent', color: mode === t.id ? 'var(--text)' : 'var(--muted)', boxShadow: mode === t.id ? 'var(--shadow)' : 'none', transition: 'all .15s' }}>{t.label}</button>
        ))}
      </div>

      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 30, letterSpacing: '-.6px', marginBottom: 28 }}>
        {mode === 'login' ? 'Bon retour 👋' : 'Rejoins FitBodyPlan'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'register' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Prénom</label>
              <input style={inp} type="text" placeholder="Prénom" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Nom</label>
              <input style={inp} type="text" placeholder="Nom" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>
        )}

        <div>
          <label style={lbl}>Email *</label>
          <input style={inp} type="email" placeholder="ton@email.fr" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>

        <div>
          <label style={lbl}>Mot de passe *</label>
          <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>

        {mode === 'register' && (
          <div>
            <label style={lbl}>Confirmer le mot de passe *</label>
            <input style={inp} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
          </div>
        )}

        {mode === 'login' && (
          <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', textAlign: 'right' }}>Mot de passe oublié ?</a>
        )}

        {error && (
          <div style={{ background: 'color-mix(in srgb, var(--accent2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--accent2) 30%, transparent)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--accent2)' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={submit} disabled={loading} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 12, padding: 15, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1, marginTop: 4 }}>
          {loading ? '...' : mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
        </button>

        {mode === 'register' && (
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
            En créant un compte tu acceptes nos <a href="#" onClick={e => { e.preventDefault(); setScreen('legal') }} style={{ color: 'var(--accent)', textDecoration: 'none' }}>CGU</a> et notre <a href="#" onClick={e => { e.preventDefault(); setScreen('legal') }} style={{ color: 'var(--accent)', textDecoration: 'none' }}>politique de confidentialité</a>.
          </p>
        )}
      </div>
    </div>
  )
}
