import React, { useState } from 'react'

const inp = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%' }
const lbl = { fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }

export default function Account({ setScreen, auth }) {
  const [tab, setTab] = useState('profil')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')

  const openBillingPortal = async () => {
    setPortalLoading(true)
    setPortalError('')
    try {
      const token = localStorage.getItem('fbp_token')
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (e) {
      setPortalError(e.message)
    } finally {
      setPortalLoading(false)
    }
  }

  const user = auth?.user
  const name = user?.firstName || ''
  const parts = name.split(' ')
  const [form, setForm] = useState({
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    email: user?.email || '',
    password: '', newPassword: '', confirmPassword: ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const saveProfile = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await auth.updateProfile({ firstName: `${form.firstName} ${form.lastName}`.trim(), email: form.email })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px 80px' }}>
      <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', marginBottom: 24, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour</button>

      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 32, letterSpacing: '-.7px', marginBottom: 8 }}>Mon compte</div>
      {user && <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>{user.email} · Offre <strong>{user.plan || 'Découverte'}</strong></p>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'var(--surface2)', borderRadius: 10, padding: 4 }}>
        {[
          { id: 'profil', label: 'Profil' },
          { id: 'securite', label: 'Sécurité' },
          { id: 'abonnement', label: 'Abonnement' },
          { id: 'donnees', label: 'Mes données' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, background: tab === t.id ? 'var(--surface)' : 'transparent', color: tab === t.id ? 'var(--text)' : 'var(--muted)', boxShadow: tab === t.id ? 'var(--shadow)' : 'none', transition: 'all .15s' }}>{t.label}</button>
        ))}
      </div>

      {/* PROFIL */}
      {tab === 'profil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl}>Prénom</label><input style={inp} type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
            <div><label style={lbl}>Nom</label><input style={inp} type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
          </div>
          <div><label style={lbl}>Email</label><input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={saveProfile} disabled={loading} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              {loading ? '...' : 'Sauvegarder'}
            </button>
            {saved && <span style={{ fontSize: 13, color: 'var(--accent)' }}>✅ Sauvegardé</span>}
          </div>
        </div>
      )}

      {/* SÉCURITÉ */}
      {tab === 'securite' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'password', label: 'Mot de passe actuel', placeholder: '••••••••' },
            { key: 'newPassword', label: 'Nouveau mot de passe', placeholder: '••••••••' },
            { key: 'confirmPassword', label: 'Confirmer', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}><label style={lbl}>{f.label}</label><input style={inp} type="password" placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} /></div>
          ))}
          <button style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start' }}>Changer le mot de passe</button>
        </div>
      )}

      {/* ABONNEMENT */}
      {tab === 'abonnement' && (
        <div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22 }}>Offre {user?.plan || 'Découverte'}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{!user?.plan || user?.plan === 'DECOUVERTE' ? 'Gratuit · Pour toujours' : 'Abonnement actif'}</div>
              </div>
              <div style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600 }}>✅ Actif</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {(!user?.plan || user?.plan === 'DECOUVERTE') ? (
                <button onClick={() => setScreen('landing')} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  Passer à une offre supérieure →
                </button>
              ) : (
                <>
                  <button onClick={openBillingPortal} disabled={portalLoading} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: portalLoading ? .7 : 1 }}>
                    {portalLoading ? '...' : '📋 Gérer mon abonnement'}
                  </button>
                  <button onClick={() => setScreen('landing')} style={{ background: 'none', border: '1.5px solid var(--border)', color: 'var(--muted)', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
                    Changer d'offre
                  </button>
                </>
              )}
            </div>
            {portalError && <p style={{ fontSize: 12, color: 'var(--accent2)', marginTop: 10 }}>⚠️ {portalError}</p>}
          </div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>📊 Portail de facturation Stripe</strong><br />
            En cliquant sur "Gérer mon abonnement" tu accèdes à :<br />
            • Historique complet des paiements<br />
            • Téléchargement des factures PDF<br />
            • Changement de carte bancaire<br />
            • Résiliation de l'abonnement
          </div>
        </div>
      )}

      {/* DONNÉES */}
      {tab === 'donnees' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Exporter mes données</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>Télécharge toutes tes données personnelles au format JSON (profil, plans générés, historique).</p>
            <button style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>📥 Exporter mes données</button>
          </div>

          <div style={{ background: 'color-mix(in srgb, var(--accent2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent2) 30%, transparent)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 600, color: 'var(--accent2)', marginBottom: 8 }}>Supprimer mon compte</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>Action irréversible. Toutes tes données seront supprimées définitivement.</p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} style={{ background: 'var(--accent2)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>🗑️ Supprimer mon compte</button>
            ) : (
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--accent2)' }}>⚠️ Es-tu sûr ? Irréversible.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => auth.deleteAccount()} style={{ background: 'var(--accent2)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Oui, supprimer</button>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 20px', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', color: 'var(--muted)' }}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
