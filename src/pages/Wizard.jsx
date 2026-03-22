import React, { useState } from 'react'
import { STEPS, ALLERGENS } from '../config/wizard.js'

const s = {
  container: { maxWidth: 600, margin: '0 auto', padding: '44px 24px 80px' },
  progress: { display: 'flex', gap: 4, marginBottom: 40 },
  seg: { flex: 1, height: 2, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
  segFill: { height: '100%', background: 'var(--text)', borderRadius: 99, transition: 'width .4s cubic-bezier(.4,0,.2,1)' },
  eyebrow: { fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 },
  question: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(24px,4vw,32px)', letterSpacing: '-.5px', lineHeight: 1.2, color: 'var(--text)', marginBottom: 8 },
  hint: { fontSize: 14, color: 'var(--muted)', fontWeight: 300, marginBottom: 28 },
  optsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 },
  opt: { background: 'var(--surface)', borderRadius: 14, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  btnBack: { background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--muted)', cursor: 'pointer', padding: '10px 0' },
  btnNext: { background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 12, padding: '14px 32px', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' },
  btnGenerate: { background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 12, padding: '15px 36px', fontFamily: 'inherit', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  input: { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '12px 14px', fontFamily: 'inherit', fontSize: 15, color: 'var(--text)', outline: 'none', width: '100%' },
  label: { fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' },
}

export default function Wizard({ answers, setAnswers, setScreen, setPlanText }) {
  const [step, setStep] = useState(() => answers.objectif ? 1 : 0)
  const [multiSel, setMultiSel] = useState(new Set(answers.objectif_multi || []))
  const [extras, setExtras] = useState(new Set(answers.extras || []))
  const [allergies, setAllergies] = useState(new Set(answers.allergies || []))
  const [allergyNone, setAllergyNone] = useState(answers.allergyNone || false)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const canNext = () => {
    if (current.type === 'options') return !!answers[current.id]
    if (current.type === 'multi_max2') return multiSel.size > 0
    if (current.type === 'inputs') return !!(answers.sexe && answers.age && answers.taille && answers.poids)
    return true
  }

  const next = async () => {
    if (!canNext()) return
    if (isLast) await generate()
    else { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const prev = () => {
    if (step > 0) { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const generate = async () => {
    const finalAnswers = { ...answers, allergies: [...allergies], allergyNone, extras: [...extras] }
    setIsGenerating(true)
    setProgress(0)
    setPlanText('')

    // Simuler progression pendant la génération
    // Progression basée sur le texte reçu (estimé ~4000 chars pour plan complet)
    const ESTIMATED_LENGTH = 8000 // JSON complet ~6000-8000 chars

    try {
      const res = await fetch('/api/plans/generate-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      if (!res.ok) throw new Error('Erreur serveur')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      let buffer = ''

      // Timeout de sécurité : si pas de done:true après 3 min, on arrête
      const TIMEOUT_MS = 180000
      const timeoutId = setTimeout(() => {
        reader.cancel()
      }, TIMEOUT_MS)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            if (json.text) {
              fullText += json.text
              const p = Math.min(Math.round((fullText.length / ESTIMATED_LENGTH) * 95), 95)
              setProgress(p)
            }
            if (json.done) {
              clearTimeout(timeoutId)
              const finalText = json.fullText || fullText
              console.log('[WIZARD] done, chars:', finalText.length, finalText.slice(0, 80))
              if (finalText && finalText.length > 10) {
                try { sessionStorage.setItem('fbp_plan_text', finalText) } catch(e) {}
                setPlanText(finalText)
              } else {
                console.error('[WIZARD] fullText vide ou trop court!')
              }
            }
            if (json.error) throw new Error(json.message || json.error)
          } catch (e) { if (e.message && !e.message.includes('JSON')) throw e }
        }
      }

      setProgress(100)
      // Délai plus long pour laisser React mettre à jour planText avant de changer d'écran
      setTimeout(() => {
        setIsGenerating(false)
        setScreen('result')
      }, 300)

    } catch (err) {
      if (typeof timeoutId !== 'undefined') clearTimeout(timeoutId)
      setIsGenerating(false)
      setProgress(0)
      alert('Erreur : ' + err.message)
    }
  }

  // Écran de chargement intégré
  if (isGenerating) return (
    <div style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, marginBottom: 8 }}>Génération en cours…</div>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 40, fontWeight: 300 }}>construction de ton plan personnalisé</p>
      <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 99, width: `${Math.min(progress, 100)}%`, transition: 'width .5s ease' }} />
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: "'Geist Mono', monospace" }}>{Math.round(Math.min(progress, 100))}%</div>
      <div style={{ marginTop: 40, textAlign: 'left' }}>
        {[
          { label: 'Calcul métabolisme & TDEE', threshold: 8 },
          { label: 'Macros personnalisées calculées', threshold: 20 },
          { label: 'Programme entraînement sur mesure', threshold: 40 },
          { label: 'Plan alimentaire 7 jours', threshold: 60 },
          { label: 'Courses & compléments', threshold: 78 },
          { label: 'Recettes & conseils personnalisés', threshold: 92 },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: progress > step.threshold ? 'var(--text)' : 'var(--muted)', transition: 'color .3s' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${progress > step.threshold ? 'var(--accent)' : 'var(--border)'}`, background: progress > step.threshold ? 'var(--accent)' : 'transparent', color: progress > step.threshold ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, transition: 'all .3s' }}>
              {progress > step.threshold ? '✓' : i + 1}
            </div>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  )

  const renderBody = () => {
    switch (current.type) {
      case 'options':
        return (
          <div style={s.optsGrid}>
            {current.options.map(opt => {
              const sel = answers[current.id] === opt.v
              return (
                <button key={opt.v} onClick={() => setAnswers(a => ({ ...a, [current.id]: opt.v }))}
                  style={{ ...s.opt, border: `2px solid ${sel ? 'var(--text)' : 'var(--border)'}`, background: sel ? 'var(--text)' : 'var(--surface)' }}>
                  <span style={{ fontSize: 22, display: 'block', marginBottom: 10 }}>{opt.e}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 3, color: sel ? 'var(--bg)' : 'var(--text)' }}>{opt.l}</span>
                  <span style={{ fontSize: 12, color: sel ? 'rgba(255,255,255,0.6)' : 'var(--muted)', fontWeight: 300, lineHeight: 1.4 }}>{opt.s}</span>
                </button>
              )
            })}
          </div>
        )

      case 'multi_max2':
        return (
          <>
            <div style={s.optsGrid}>
              {current.options.map(opt => {
                const sel = multiSel.has(opt.v)
                return (
                  <button key={opt.v} onClick={() => {
                    const next = new Set(multiSel)
                    if (next.has(opt.v)) next.delete(opt.v)
                    else { if (next.size >= 2) { const first = [...next][0]; next.delete(first) }; next.add(opt.v) }
                    setMultiSel(next)
                    const arr = [...next]
                    setAnswers(a => ({ ...a, objectif: arr[0] || null, objectif_multi: arr }))
                  }}
                    style={{ ...s.opt, border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`, background: sel ? 'var(--accent-bg)' : 'var(--surface)' }}>
                    <span style={{ fontSize: 22, display: 'block', marginBottom: 10 }}>{opt.e}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 3, color: sel ? 'var(--accent)' : 'var(--text)' }}>{opt.l}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.4 }}>{opt.s}</span>
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginBottom: 20 }}>Sélectionne 1 ou 2 objectifs maximum</p>
          </>
        )

      case 'inputs':
        return (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={s.label}>Sexe</label>
                <select style={s.input} value={answers.sexe || ''} onChange={e => setAnswers(a => ({ ...a, sexe: e.target.value }))}>
                  <option value="">—</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={s.label}>Âge (ans)</label>
                <input style={s.input} type="number" placeholder="28" value={answers.age || ''} onChange={e => setAnswers(a => ({ ...a, age: e.target.value }))} min={14} max={80} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={s.label}>Taille (cm)</label>
                <input style={s.input} type="number" placeholder="175" value={answers.taille || ''} onChange={e => setAnswers(a => ({ ...a, taille: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={s.label}>Poids actuel (kg)</label>
                <input style={s.input} type="number" placeholder="75" value={answers.poids || ''} onChange={e => setAnswers(a => ({ ...a, poids: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={s.label}>Poids objectif (kg) — optionnel</label>
              <input style={s.input} type="number" placeholder="80" value={answers.poids_cible || ''} onChange={e => setAnswers(a => ({ ...a, poids_cible: e.target.value }))} />
            </div>
          </div>
        )

      case 'multi':
        return (
          <>
            <div style={s.optsGrid}>
              {current.options.map(opt => {
                const sel = extras.has(opt.v)
                return (
                  <button key={opt.v} onClick={() => {
                    const next = new Set(extras)
                    if (next.has(opt.v)) next.delete(opt.v); else next.add(opt.v)
                    setExtras(next)
                    setAnswers(a => ({ ...a, extras: [...next] }))
                  }}
                    style={{ ...s.opt, border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`, background: sel ? 'var(--accent-bg)' : 'var(--surface)' }}>
                    <span style={{ fontSize: 22, display: 'block', marginBottom: 10 }}>{opt.e}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 3, color: sel ? 'var(--accent)' : 'var(--text)' }}>{opt.l}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.4 }}>{opt.s}</span>
                  </button>
                )
              })}
            </div>
            {extras.has('blessure') && (
              <div style={{ marginBottom: 16 }}>
                <label style={s.label}>Décris ta blessure</label>
                <input style={{ ...s.input, marginTop: 6 }} type="text" placeholder="ex: douleur genou droit..." value={answers.blessureDetail || ''} onChange={e => setAnswers(a => ({ ...a, blessureDetail: e.target.value }))} />
              </div>
            )}
          </>
        )

      case 'allergies':
        return (
          <>
            <div onClick={() => { const next = !allergyNone; setAllergyNone(next); setAnswers(a => ({ ...a, allergyNone: next })); if (next) { setAllergies(new Set()); setAnswers(a => ({ ...a, allergies: [] })) } }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: allergyNone ? 'var(--accent-bg)' : 'var(--surface)', border: `1.5px solid ${allergyNone ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', marginBottom: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${allergyNone ? 'var(--accent)' : 'var(--border-dark)'}`, background: allergyNone ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, flexShrink: 0 }}>{allergyNone ? '✓' : ''}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: allergyNone ? 'var(--accent)' : 'var(--text)' }}>✅ Aucune allergie</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Je n'ai pas de contrainte alimentaire</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, opacity: allergyNone ? 0.4 : 1, pointerEvents: allergyNone ? 'none' : 'all' }}>
              {ALLERGENS.map(a => {
                const checked = allergies.has(a.id)
                return (
                  <div key={a.id} onClick={() => { const next = new Set(allergies); if (next.has(a.id)) next.delete(a.id); else next.add(a.id); setAllergies(next); setAnswers(ans => ({ ...ans, allergies: [...next] })) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: checked ? 'color-mix(in srgb, var(--accent2) 8%, transparent)' : 'var(--surface)', border: `1.5px solid ${checked ? 'var(--accent2)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', fontSize: 13, userSelect: 'none' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? 'var(--accent2)' : 'var(--border-dark)'}`, background: checked ? 'var(--accent2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, flexShrink: 0 }}>{checked ? '✓' : ''}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{a.l}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.s}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginBottom: 16, opacity: allergyNone ? 0.4 : 1, pointerEvents: allergyNone ? 'none' : 'all' }}>
              <label style={s.label}>Autre allergie</label>
              <input style={{ ...s.input, marginTop: 6 }} type="text" placeholder="ex: kiwi..." value={answers.allergyOther || ''} onChange={e => setAnswers(a => ({ ...a, allergyOther: e.target.value }))} />
            </div>
          </>
        )

      case 'freetext':
        return (
          <div style={{ marginBottom: 28 }}>
            <label style={{ ...s.label, display: 'block', marginBottom: 8 }}>Informations complémentaires — optionnel</label>
            <textarea style={{ ...s.input, minHeight: 140, resize: 'vertical', fontSize: 14, lineHeight: 1.6 }}
              placeholder="Exemple : je travaille de nuit, mariage dans 3 mois..."
              value={answers.details || ''}
              onChange={e => setAnswers(a => ({ ...a, details: e.target.value }))}
              maxLength={300}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
              {(answers.details || '').length}/300
            </div>
            <div style={{ background: 'var(--accent-bg)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: 'var(--accent)', marginTop: 8 }}>
              💡 Plus tu nous en dis, plus le plan sera précis.
            </div>
            <div style={{ background: 'color-mix(in srgb, var(--accent2) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--accent2) 30%, transparent)', borderRadius: 10, padding: '16px', fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginTop: 12 }}>
              <strong style={{ color: 'var(--accent2)' }}>⚠️ Avertissement important</strong><br />
              Le plan généré est fourni à titre <strong>purement indicatif</strong> et ne constitue pas un avis médical, nutritionnel ou sportif professionnel. En générant ce plan, tu reconnaîtres l'utiliser <strong>sous ta seule responsabilité</strong> et t'engages à consulter un professionnel de santé avant tout changement significatif de régime ou d'activité physique. <a href="#" style={{ color: 'var(--accent2)' }}>Voir les CGU complètes.</a>
            </div>
          </div>
        )

      default: return null
    }
  }

  return (
    <div style={s.container}>
      <div style={s.progress}>
        {STEPS.map((_, i) => (
          <div key={i} style={s.seg}>
            <div style={{ ...s.segFill, width: i < step ? '100%' : i === step ? '50%' : '0%' }} />
          </div>
        ))}
      </div>
      <div style={s.eyebrow}>Étape {step + 1} sur {STEPS.length}</div>
      <div style={s.question} dangerouslySetInnerHTML={{ __html: current.title }} />
      {current.subtitle && <div style={s.hint}>{current.subtitle}</div>}
      {renderBody()}
      <div style={s.nav}>
        <button style={{ ...s.btnBack, opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'all' }} onClick={prev}>← Retour</button>
        <button onClick={next} disabled={!canNext() || isGenerating}
          style={{ ...(isLast ? s.btnGenerate : s.btnNext), opacity: canNext() ? 1 : 0.2, pointerEvents: canNext() ? 'all' : 'none' }}>
          {isLast ? 'Générer mon plan ⚡' : 'Continuer →'}
        </button>
      </div>
    </div>
  )
}
