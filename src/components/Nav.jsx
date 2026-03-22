import React, { useState, useRef, useEffect } from 'react'

export default function Nav({ screen, setScreen, auth }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const profileRef = useRef()
  const fileRef = useRef()

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const user = auth?.user
  const displayName = user?.firstName ? user.firstName.split(' ')[0] : null

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 32px',
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo + Nos offres */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <button onClick={() => setScreen('landing')} style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-.3px', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 600, fontFamily: "'Geist', sans-serif" }}>FB</div>
          FitBody<em style={{ color: 'var(--accent)' }}>Plan</em>
        </button>
        <a href="#pricing" onClick={e => {
            e.preventDefault()
            setScreen('landing')
            setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100)
          }}
          style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none', fontFamily: "'Geist', sans-serif", fontWeight: 500, letterSpacing: '.3px', marginLeft: 148, marginTop: 1, transition: 'color .15s' }}
          onMouseEnter={e => e.target.style.color = 'var(--accent)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
        >Nos offres</a>
      </div>

      {/* Badge centré */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 100, padding: '6px 16px 6px 12px', fontSize: 16, fontFamily: "'Geist Mono', monospace", color: 'var(--muted)', letterSpacing: '.5px' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2.5s infinite' }} />
        Sport + Nutrition · 100% personnalisé
      </div>

      {/* Droite : connecter + profil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!user ? (
          <button onClick={() => setScreen('login')} style={{ padding: '8px 16px', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer', border: '1.5px solid var(--border-dark)', background: 'none', color: 'var(--text)' }}>
            Se connecter
          </button>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'inherit' }}>
            Bonjour {displayName || 'toi'} 👋
          </span>
        )}

        {/* Bouton profil */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: '50%', background: avatar ? 'transparent' : 'var(--accent)', border: avatar ? '2px solid var(--accent)' : 'none', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, padding: 0 }}>
            {avatar ? <img src={avatar} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
          </button>

          {profileOpen && (
            <div style={{ position: 'absolute', right: 0, top: 44, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '8px 0', minWidth: 220, boxShadow: 'var(--shadow-lg)', zIndex: 300 }}>
              {user && (
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user.firstName || 'Mon compte'}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2, fontWeight: 500 }}>Offre {user.plan || 'Découverte'}</div>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
              <button onClick={() => fileRef.current.click()} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', fontFamily: 'inherit', fontWeight: 500 }}>
                📷 Changer ma photo
              </button>

              {[
                { label: '📋 Mon historique', action: () => { setScreen('history'); setProfileOpen(false) } },
                { label: '⚙️ Mon compte', action: () => { setScreen('account'); setProfileOpen(false) } },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, color: 'var(--text)', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >{item.label}</button>
              ))}

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                {user ? (
                  <button onClick={() => { auth.logout(); setProfileOpen(false) }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, color: 'var(--muted)', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >🚪 Se déconnecter</button>
                ) : (
                  <button onClick={() => { setScreen('login'); setProfileOpen(false) }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', fontFamily: 'inherit', fontWeight: 500 }}>
                    → Se connecter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
