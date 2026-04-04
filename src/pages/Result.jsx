import React, { useState, useMemo } from 'react'

const PRIMARY = '#2c5f3f'
const PRIMARY_LIGHT = '#e6efe8'
const PRIMARY_DARK = '#1b3a26'

const SHORT_DAYS = { 'Lundi':'Lun','Mardi':'Mar','Mercredi':'Mer','Jeudi':'Jeu','Vendredi':'Ven','Samedi':'Sam','Dimanche':'Dim' }
const MEAL_LABELS = {
  petit_dejeuner: { label:'Petit-dejeuner', emoji:'🌅', time:'7h - 8h30' },
  dejeuner:       { label:'Dejeuner',       emoji:'☀️', time:'12h - 13h30' },
  collation:      { label:'Collation',      emoji:'🍎', time:'16h - 17h' },
  diner:          { label:'Diner',          emoji:'🌙', time:'19h - 20h30' },
}

function parsePlan(text) {
  if (!text) return null
  try {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    return JSON.parse(text.substring(start, end + 1))
  } catch(e) { return null }
}

function calculateCourses(jours) {
  if (!jours || !Array.isArray(jours)) return {}
  const totals = {}
  jours.forEach(jour => {
    if (!jour.repas) return
    Object.values(jour.repas).forEach(repas => {
      if (!Array.isArray(repas)) return
      repas.forEach(item => {
        if (!item.aliment) return
        const key = item.aliment.toLowerCase().trim()
        const qtyMatch = (item.quantite || '').match(/([\d]+(?:[.,][\d]+)?)\s*(g|kg|ml|l|cl)?/i)
        const qty = qtyMatch ? parseFloat(qtyMatch[1].replace(',', '.')) : 0
        const unit = qtyMatch ? (qtyMatch[2] || 'g').toLowerCase() : 'g'
        const qtyInG = unit === 'kg' ? qty * 1000 : unit === 'l' ? qty * 1000 : unit === 'cl' ? qty * 10 : qty
        if (!totals[key]) totals[key] = { total: 0, aliment: item.aliment }
        totals[key].total += qtyInG
      })
    })
  })

  const categories = { 'Proteines': [], 'Feculents et Fruits': [], 'Legumes': [], 'Produits laitiers': [], 'Divers': [] }
  const catMap = {
    'Proteines': ['poulet', 'dinde', 'steak', 'thon', 'saumon', 'oeuf', 'blanc', 'viande', 'poisson', 'crevette'],
    'Feculents et Fruits': ['riz', 'pate', 'flocon', 'pain', 'avoine', 'lentille', 'pois', 'patate', 'pomme', 'banane', 'haricot', 'quinoa'],
    'Legumes': ['brocoli', 'carotte', 'courgette', 'epinard', 'tomate', 'salade', 'poivron', 'champignon', 'concombre'],
    'Produits laitiers': ['fromage', 'yaourt', 'lait', 'creme', 'skyr'],
  }

  Object.entries(totals).forEach(([key, data]) => {
    const total = Math.round(data.total)
    if (total === 0) return
    const label = total >= 1000 ? (total/1000).toFixed(1)+'kg' : total+'g'
    const display = data.aliment + ' — ' + label
    let placed = false
    for (const [cat, keywords] of Object.entries(catMap)) {
      if (keywords.some(kw => key.includes(kw))) { categories[cat].push(display); placed = true; break }
    }
    if (!placed) categories['Divers'].push(display)
  })

  return Object.fromEntries(Object.entries(categories).filter(([, v]) => v.length > 0))
}

const objLabels = {
  perdre_graisse:'Seche & Perte de graisse', prise_masse:'Prise de masse',
  recomposition:'Recomposition', remise_forme:'Remise en forme', performance:'Performance',
}

export default function Result({ planText, answers, setScreen, setAnswers, setPlanText, auth }) {
  const [activeDay, setActiveDay] = useState(0)
  const [activeExtraTab, setActiveExtraTab] = useState(null)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [checkedItems, setCheckedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fbp_courses') || '{}') } catch(e) { return {} }
  })

  const toggleCourse = (key) => {
    setCheckedItems(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem('fbp_courses', JSON.stringify(next)) } catch(e) {}
      return next
    })
  }

  const resetCourses = () => {
    setCheckedItems({})
    try { localStorage.removeItem('fbp_courses') } catch(e) {}
  }

  const effectivePlanText = planText || (() => {
    try { return sessionStorage.getItem('fbp_plan_text') || '' } catch(e) { return '' }
  })()

  const plan = useMemo(() => parsePlan(effectivePlanText), [effectivePlanText])
  const computedCourses = useMemo(() => plan ? calculateCourses(plan.jours) : {}, [plan])

  const date = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
  const title = ((answers?.objectif_multi) || (answers?.objectif ? [answers.objectif] : [])).filter(Boolean).map(o => objLabels[o] || o).join(' + ') || 'Plan personnalise'

  if (!plan) return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 20px', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:10, padding:16, fontSize:14, color:'#92400e', marginBottom:20 }}>
        ⚠️ Le plan n'a pas pu etre analyse.
      </div>
      <pre style={{ fontSize:11, color:'#718096', whiteSpace:'pre-wrap', background:'#f8fafc', padding:16, borderRadius:8, maxHeight:400, overflowY:'auto' }}>{planText}</pre>
      <button onClick={() => { setAnswers({}); setPlanText(''); setScreen('wizard') }}
        style={{ marginTop:16, padding:'10px 20px', background:PRIMARY, color:'white', border:'none', borderRadius:10, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
        ↺ Nouveau plan
      </button>
    </div>
  )

  const { macros, jours = [], supplements = [], conseils = [], strategie } = plan
  const currentDay = jours[activeDay] || jours[0]

  const EXTRA_TABS = [
    {
      id:'strategie', label:'📋 Strategie',
      content: strategie ? (
        <div style={{ fontSize:14, color:'#4a5568', lineHeight:1.8 }}>
          {strategie.split('\n').map((line, i) => <p key={i} style={{ margin:'4px 0' }}>{line}</p>)}
        </div>
      ) : null
    },
    {
      id:'courses', label:'🛒 Courses',
      content: Object.keys(computedCourses).length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#e6efe8', border:'1px solid #b8dfc8', borderRadius:8, padding:'10px 14px', fontSize:12, color:PRIMARY_DARK, marginBottom:4 }}>
            ✅ Liste calculee automatiquement depuis les repas de la semaine — quantites exactes.
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:12, color:'#666' }}>
              {Object.values(checkedItems).filter(Boolean).length}/{Object.values(computedCourses).flat().length} articles coches
            </span>
            <button onClick={resetCourses} style={{ background:'none', border:'1px solid #ddd', borderRadius:6, padding:'4px 10px', fontSize:11, color:'#999', cursor:'pointer' }}>
              Reinitialiser
            </button>
          </div>
          {Object.entries(computedCourses).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize:11, fontWeight:700, color:PRIMARY, textTransform:'uppercase', letterSpacing:1, marginBottom:8, background:PRIMARY_LIGHT, padding:'4px 10px', borderRadius:6, display:'inline-block' }}>{cat}</div>
              <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                {(items||[]).map((c,i) => {
                  const key = cat + '_' + i
                  const checked = !!checkedItems[key]
                  return (
                    <li key={i} onClick={() => toggleCourse(key)}
                      style={{ padding:'10px 8px', borderBottom:'1px solid #f0f0f0', fontSize:14, display:'flex', alignItems:'center', gap:10, cursor:'pointer', background: checked ? '#f8fdf8' : 'transparent', borderRadius:4 }}>
                      <div style={{ width:20, height:20, borderRadius:4, border:`2px solid ${checked ? PRIMARY : '#ccc'}`, background: checked ? PRIMARY : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                        {checked && <span style={{ color:'white', fontSize:12, fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ color: checked ? '#aaa' : '#4a5568', textDecoration: checked ? 'line-through' : 'none', transition:'all .15s' }}>{c}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null
    },
    {
      id:'supplements', label:'💊 Supplements',
      content: supplements.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {supplements.map((s,i) => (
            <div key={i} style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:12, padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, flexWrap:'wrap', gap:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:'#2d3748' }}>{s.nom}</div>
                  {s.categorie && <span style={{ fontSize:11, color:'#718096', textTransform:'uppercase', letterSpacing:1 }}>{s.categorie}</span>}
                </div>
                <div style={{ display:'flex', gap:6', flexShrink:0 }}>
                  {s.priorite && <span style={{ background: s.priorite === 'Haute' ? PRIMARY : '#e2e8f0', color: s.priorite === 'Haute' ? 'white' : '#718096', borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:600 }}>{s.priorite}</span>}
                  {s.cout && <span style={{ background:'#f59e0b', color:'white', borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:600 }}>{s.cout}</span>}
                </div>
              </div>
              {s.pourquoi && <div style={{ fontSize:13, color:'#4a5568', marginBottom:8, lineHeight:1.5, background:'white', padding:'8px 10px', borderRadius:8 }}>{s.pourquoi}</div>}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {s.dosage && <span style={{ background:'white', border:'1px solid #fcd34d', color:'#92400e', borderRadius:20, padding:'3px 10px', fontSize:12 }}>📊 {s.dosage}</span>}
                {s.moment && <span style={{ background:'white', border:'1px solid #fcd34d', color:'#92400e', borderRadius:20, padding:'3px 10px', fontSize:12 }}>🕐 {s.moment}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : null
    },
    {
      id:'conseils', label:'💡 Conseils',
      content: conseils.length > 0 ? (
        <ul style={{ margin:0, padding:0, listStyle:'none' }}>
          {conseils.map((c,i) => (
            <li key={i} style={{ padding:'10px 0', borderBottom:'1px solid #f0f0f0', fontSize:14, color:'#4a5568', display:'flex', gap:10, lineHeight:1.6 }}>
              <span style={{ color:PRIMARY, fontWeight:700, flexShrink:0 }}>✓</span>{c}
            </li>
          ))}
        </ul>
      ) : null
    },
  ].filter(t => t.content)

  return (
    <div style={{ background:'#f6f8f6', minHeight:'100vh', padding:'20px 20px 60px', fontFamily:'system-ui,-apple-system,sans-serif' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#718096', marginBottom:4 }}>Plan genere le {date}</div>
            <h1 style={{ fontSize:'clamp(16px,2.5vw,22px)', fontWeight:700, color:PRIMARY_DARK, margin:0 }}>
              {title}{answers?.poids && ` — ${answers.poids}kg`}{answers?.poids_cible && ` → ${answers.poids_cible}kg`}
            </h1>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => { setAnswers({}); setPlanText(''); setScreen('wizard') }}
              style={{ padding:'9px 16px', borderRadius:20, fontFamily:'inherit', fontSize:13, cursor:'pointer', border:`1.5px solid ${PRIMARY}`, background:'white', color:PRIMARY, fontWeight:600 }}>
              ↺ Nouveau plan
            </button>
            <button onClick={() => setCheckinOpen(true)}
              style={{ padding:'9px 16px', borderRadius:20, fontFamily:'inherit', fontSize:13, cursor:'pointer', border:`1.5px solid ${PRIMARY}`, background:PRIMARY, color:'white', fontWeight:600 }}>
              📊 Check-in
            </button>
          </div>
        </div>

        {/* Macros */}
        {macros && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(100px, 1fr))', gap:12, marginBottom:16 }}>
            {[
              { val: macros.kcal?.toLocaleString('fr'), label:'Kcal' },
              { val: macros.prot + 'g', label:'Proteines' },
              { val: macros.glu + 'g', label:'Glucides' },
              { val: macros.lip + 'g', label:'Lipides' },
              ...(macros.fibres ? [{ val: macros.fibres, label:'Fibres' }] : []),
              ...(macros.eau ? [{ val: macros.eau, label:'Hydratation' }] : []),
            ].map(m => (
              <div key={m.label} style={{ background:'white', borderRadius:12, padding:'14px 12px', textAlign:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.05)', borderBottom:`3px solid ${PRIMARY}` }}>
                <div style={{ fontSize:22, fontWeight:700, color:PRIMARY }}>{m.val}</div>
                <div style={{ fontSize:12, color:'#718096', textTransform:'uppercase', letterSpacing:.5, marginTop:3 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Jours */}
        {jours.length > 0 && (
          <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:20, flexWrap:'wrap' }}>
            {jours.map((d, i) => {
              const shortName = SHORT_DAYS[d.nom] || d.nom?.slice(0,3)
              return (
                <button key={i} onClick={() => setActiveDay(i)}
                  style={{ width:54, height:54, borderRadius:'50%', border:`2px solid ${activeDay===i ? PRIMARY : '#e2e8f0'}`, background: activeDay===i ? PRIMARY : 'white', color: activeDay===i ? 'white' : PRIMARY, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all .2s', boxShadow: activeDay===i ? '0 4px 12px rgba(44,95,63,.3)' : 'none', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1, fontFamily:'inherit' }}>
                  <span style={{ fontSize:10, lineHeight:1 }}>{shortName}</span>
                  <span style={{ fontSize:14 }}>💪</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Alimentation pleine largeur */}
        <div style={{ background:'white', borderRadius:16, padding:20, boxShadow:'0 4px 10px rgba(0,0,0,0.05)', marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:PRIMARY_DARK, margin:'0 0 16px', textTransform:'uppercase', letterSpacing:.5 }}>
            🥗 Alimentation — {currentDay?.nom || 'Lundi'}
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:12 }}>
            {currentDay?.repas ? Object.entries(currentDay.repas).map(([key, items]) => {
              if (!items || items.length === 0) return null
              const meta = MEAL_LABELS[key] || { label: key, emoji: '🍽️', time: '' }
              return (
                <div key={key} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:14 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16 }}>{meta.emoji}</span>
                      <h3 style={{ margin:0, fontSize:12, fontWeight:700, color:PRIMARY_DARK, textTransform:'uppercase', letterSpacing:.5 }}>{meta.label}</h3>
                    </div>
                    {meta.time && <span style={{ fontSize:11, color:'#a0aec0', background:'#f7fafc', padding:'2px 8px', borderRadius:10, fontWeight:500 }}>{meta.time}</span>}
                  </div>
                  <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                    {(items || []).map((item, ii) => (
                      <li key={ii} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom: ii < items.length-1 ? '1px solid #edf2f7' : 'none' }}>
                        <span style={{ fontSize:14, color:'#4a5568' }}>{item.aliment}</span>
                        <span style={{ fontSize:13, fontWeight:700, color:PRIMARY, flexShrink:0, marginLeft:8 }}>{item.quantite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }) : <p style={{ fontSize:14, color:'#a0aec0', fontStyle:'italic' }}>Aucune donnee alimentaire pour ce jour.</p>}
          </div>
        </div>

        {/* Onglets supplementaires */}
        {EXTRA_TABS.length > 0 && (
          <div style={{ background:'white', borderRadius:16, boxShadow:'0 4px 10px rgba(0,0,0,0.05)', overflow:'hidden', marginBottom:16 }}>
            <div style={{ display:'flex', borderBottom:'2px solid #e2e8f0', overflowX:'auto', scrollbarWidth:'none' }}>
              {EXTRA_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveExtraTab(activeExtraTab === tab.id ? null : tab.id)}
                  style={{ background:'none', border:'none', padding:'12px 14px', fontSize:13, fontWeight:600, color: activeExtraTab===tab.id ? PRIMARY : '#718096', borderBottom: activeExtraTab===tab.id ? `3px solid ${PRIMARY}` : '3px solid transparent', marginBottom:-2, cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s', fontFamily:'inherit' }}>
                  {tab.label}
                </button>
              ))}
            </div>
            {activeExtraTab && (
              <div style={{ padding:'24px' }}>
                {EXTRA_TABS.find(t => t.id === activeExtraTab)?.content}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ background:'#fffbeb', border:'1px solid #fcd34d', borderRadius:10, padding:'12px 16px', fontSize:12, color:'#92400e', display:'flex', gap:8, lineHeight:1.6 }}>
          <span>ℹ️</span>
          <span>Ce plan est fourni a titre informatif uniquement. Nos recommandations nutritionnelles s'inscrivent dans le respect des recommandations de sante publique (PNNS). Consulte un professionnel de sante avant tout changement significatif.</span>
        </div>
      </div>

      {/* Check-in modal */}
      {checkinOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', backdropFilter:'blur(8px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'white', borderRadius:20, padding:32, maxWidth:420, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ fontSize:22, fontWeight:700, color:PRIMARY_DARK, marginBottom:8 }}>Check-in hebdo 📊</div>
            <p style={{ fontSize:14, color:'#718096', marginBottom:24 }}>Entre ton poids pour suivre ta progression.</p>
            <label style={{ fontSize:11, fontFamily:'monospace', letterSpacing:2, textTransform:'uppercase', color:'#718096', display:'block', marginBottom:6 }}>Poids actuel (kg)</label>
            <input type="number" placeholder="ex: 77.5" style={{ width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'12px 14px', fontFamily:'inherit', fontSize:15, color:'#2d3748', outline:'none', marginBottom:20 }} />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setCheckinOpen(false)} style={{ flex:1, padding:13, background:PRIMARY, color:'white', border:'none', borderRadius:10, fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Enregistrer</button>
              <button onClick={() => setCheckinOpen(false)} style={{ padding:'13px 20px', background:'none', border:'1.5px solid #e2e8f0', borderRadius:10, fontFamily:'inherit', fontSize:14, color:'#718096', cursor:'pointer' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
