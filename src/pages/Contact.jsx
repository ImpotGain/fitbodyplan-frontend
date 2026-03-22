import React, { useState } from 'react'

export default function Contact({ setScreen }) {
  const [sent, setSent] = useState(false)
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px 80px' }}>
      <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', marginBottom: 24, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour</button>
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, letterSpacing: '-.8px', marginBottom: 8 }}>Nous contacter</div>
      <p style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 300, marginBottom: 36, lineHeight: 1.6 }}>Une question, un bug, une demande RGPD ? On te répond sous 48h.</p>
      {sent ? (
        <div style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent)', borderRadius: 12, padding: '24px', textAlign: 'center', color: 'var(--accent)', fontSize: 15 }}>
          ✅ Message envoyé ! On te répond sous 48h.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>Prénom</label>
              <input type="text" placeholder="Ton prénom" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>Email</label>
              <input type="email" placeholder="ton@email.fr" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>Message</label>
            <textarea placeholder="Décris ta demande..." style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 14, color: 'var(--text)', outline: 'none', width: '100%', minHeight: 120, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <button onClick={() => setSent(true)} style={{ background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 12, padding: '15px 32px', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start' }}>
            Envoyer le message
          </button>
        </div>
      )}
    </div>
  )
}
