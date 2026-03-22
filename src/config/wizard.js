export const STEPS = [
  {
    id: 'objectif', type: 'multi_max2',
    q: 'Quel est ton <em>objectif</em> ?',
    hint: "Tu peux choisir jusqu'à 2 objectifs — le plan s'adaptera aux deux.",
    options: [
      { e: '🔥', l: 'Perdre de la graisse', s: 'Sèche, ventre plat, définition', v: 'perdre_graisse' },
      { e: '💪', l: 'Prendre du muscle', s: 'Masse, volume, force', v: 'prise_masse' },
      { e: '⚡', l: 'Recomposition', s: 'Perdre gras + prendre muscle', v: 'recomposition' },
      { e: '🏃', l: 'Remise en forme', s: 'Énergie, santé, cardio', v: 'remise_forme' },
      { e: '🎯', l: 'Performance sportive', s: 'Améliorer mes capacités', v: 'performance' },
    ]
  },
  {
    id: 'niveau', type: 'options',
    q: 'Quel est ton <em>niveau actuel</em> ?',
    hint: 'Sois honnête — le plan sera calibré exactement selon ton expérience.',
    options: [
      { e: '🌱', l: 'Débutant complet', s: 'Jamais pratiqué régulièrement', v: 'debutant' },
      { e: '🔄', l: 'Quelques mois', s: 'Je connais les bases', v: 'base' },
      { e: '💪', l: 'Intermédiaire', s: '1 à 2 ans de pratique', v: 'intermediaire' },
      { e: '🏆', l: 'Avancé', s: '3 ans et plus, bonne maîtrise', v: 'avance' },
    ]
  },
  {
    id: 'physique', type: 'inputs',
    q: 'Tes <em>données physiques</em>.',
    hint: 'Indispensables pour calculer tes besoins caloriques avec précision.',
  },
  {
    id: 'equipement', type: 'options',
    q: 'Où tu <em>t\'entraînes</em> ?',
    hint: "Le programme d'exercices sera adapté à ton équipement.",
    options: [
      { e: '🏋️', l: 'Salle de sport complète', s: 'Tout le matériel disponible', v: 'salle_complete' },
      { e: '🏠', l: 'Maison avec matériel', s: 'Haltères, barre, banc…', v: 'maison_mat' },
      { e: '🤸', l: 'Maison sans matériel', s: 'Poids du corps uniquement', v: 'maison_sans' },
      { e: '🔀', l: 'Mixte salle + maison', s: 'Selon les jours', v: 'mixte' },
    ]
  },
  {
    id: 'frequence', type: 'options',
    q: 'Ta <em>disponibilité</em> par semaine ?',
    hint: 'Le programme sera construit autour de tes créneaux réels.',
    options: [
      { e: '🕐', l: '2 fois / semaine', s: 'Emploi du temps chargé', v: '2' },
      { e: '🕒', l: '3 fois / semaine', s: 'Rythme équilibré', v: '3' },
      { e: '🕔', l: '4 fois / semaine', s: 'Rythme soutenu', v: '4' },
      { e: '🔥', l: '5 fois et plus', s: 'Très investi', v: '5' },
    ]
  },
  {
    id: 'alimentation', type: 'options',
    q: 'Tes <em>préférences alimentaires</em> ?',
    hint: 'Le plan repas sera entièrement adapté à ton régime.',
    options: [
      { e: '🍽️', l: 'Aucune contrainte', s: 'Je mange de tout', v: 'aucune' },
      { e: '🥩', l: 'Halal', s: 'Viande halal uniquement', v: 'halal' },
      { e: '🥗', l: 'Végétarien', s: 'Sans viande ni poisson', v: 'vegetarien' },
      { e: '🌱', l: 'Vegan', s: 'Sans aucun produit animal', v: 'vegan' },
    ]
  },
  {
    id: 'allergies', type: 'allergies',
    q: 'As-tu des <em>allergies alimentaires</em> ?',
    hint: 'Sécurité prioritaire — coche tout ce qui te concerne.',
  },
  {
    id: 'extras', type: 'multi',
    q: 'Des <em>informations supplémentaires</em> ?',
    hint: "Sélectionne tout ce qui s'applique.",
    options: [
      { e: '🌙', l: 'Je pratique le jeûne intermittent', s: '(16:8 ou autre)', v: 'jeune_if' },
      { e: '💰', l: 'Budget alimentaire serré', s: 'Repas économiques prioritaires', v: 'budget_serre' },
      { e: '😴', l: 'Je suis souvent fatigué', s: "Dans la journée ou à l'entraînement", v: 'fatigue' },
      { e: '🦵', l: 'Blessure ou douleur', s: 'Précise ci-dessous si coché', v: 'blessure' },
    ]
  },
  {
    id: 'details', type: 'freetext',
    q: 'La parole est à <em>toi</em>.',
    hint: "Donne-nous tous les détails qui t'aideront à avoir le meilleur plan possible.",
  },
]

export const ALLERGENS = [
  { id: 'gluten', l: '🌾 Gluten', s: 'Blé, seigle, orge' },
  { id: 'crustaces', l: '🦐 Crustacés', s: 'Crevettes, homard' },
  { id: 'oeufs', l: '🥚 Œufs', s: 'Et produits dérivés' },
  { id: 'poisson', l: '🐟 Poisson', s: 'Tous types' },
  { id: 'arachides', l: '🥜 Arachides', s: 'Cacahuètes, beurre cacahuète' },
  { id: 'soja', l: '🫘 Soja', s: 'Tofu, lait de soja' },
  { id: 'lait', l: '🥛 Lait', s: 'Lactose, fromage, beurre' },
  { id: 'fruits_a_coque', l: '🌰 Fruits à coque', s: 'Amandes, noix, noisettes' },
  { id: 'celeri', l: '🥬 Céleri', s: 'Et ses dérivés' },
  { id: 'moutarde', l: '🌿 Moutarde', s: 'Graines et feuilles' },
  { id: 'sesame', l: '⚪ Sésame', s: 'Graines, tahini' },
  { id: 'sulfites', l: '🍷 Sulfites', s: 'Vin, fruits secs' },
  { id: 'lupin', l: '🌼 Lupin', s: 'Farine, graines' },
  { id: 'mollusques', l: '🐚 Mollusques', s: 'Moules, huîtres, calmars' },
  { id: 'lactose', l: '🧀 Intolérance lactose', s: 'Différent allergie lait' },
  { id: 'fructose', l: '🍓 Intolérance fructose', s: 'Fruits sucrés à limiter' },
]

export function buildPrompt(answers) {
  const objLabels = {
    perdre_graisse: 'Perte de graisse / sèche / ventre plat',
    prise_masse: 'Prise de masse musculaire',
    recomposition: 'Recomposition corporelle',
    remise_forme: 'Remise en forme générale',
    performance: 'Amélioration des performances sportives',
  }
  const nivLabels = { debutant: 'Débutant complet', base: 'Quelques mois', intermediaire: 'Intermédiaire (1-2 ans)', avance: 'Avancé (3 ans+)' }
  const equLabels = { salle_complete: 'Salle complète', maison_mat: 'Maison avec matériel', maison_sans: 'Maison sans matériel', mixte: 'Mixte' }
  const aliLabels = { aucune: 'Aucune contrainte', halal: 'Régime halal (sans porc, sans alcool, sans produits dérivés du porc)', vegetarien: 'Végétarien', vegan: 'Vegan' }

  const objs = answers.objectif_multi || (answers.objectif ? [answers.objectif] : [])
  const objStr = objs.map(o => objLabels[o] || o).join(' + ') || 'Non précisé'
  const extras = answers.extras || []
  const allergies = answers.allergies || []
  const allergyStr = allergies.length === 0 ? 'Aucune allergie' : allergies.join(', ') + (answers.allergyOther ? ', ' + answers.allergyOther : '')

  let p = `Génère un plan fitness COMPLET pour ce profil :\n\n`
  p += `PROFIL :\n`
  p += `- Objectif(s) : ${objStr}\n`
  p += `- Niveau : ${nivLabels[answers.niveau] || answers.niveau}\n`
  p += `- Sexe : ${answers.sexe}\n`
  p += `- Âge : ${answers.age} ans\n`
  p += `- Taille : ${answers.taille} cm\n`
  p += `- Poids : ${answers.poids} kg\n`
  if (answers.poids_cible) p += `- Objectif poids : ${answers.poids_cible} kg\n`
  p += `- Équipement : ${equLabels[answers.equipement] || answers.equipement}\n`
  p += `- Séances/semaine : ${answers.frequence}\n`
  p += `- Alimentation : ${aliLabels[answers.alimentation] || answers.alimentation}\n`
  p += `- Allergies : ${allergyStr}\n`

  if (extras.length > 0) {
    p += `\nCONTRAINTES :\n`
    if (extras.includes('jeune_if')) p += `- Pratique le jeûne intermittent 16:8\n`
    if (extras.includes('budget_serre')) p += `- Budget alimentaire serré\n`
    if (extras.includes('fatigue')) p += `- Souvent fatigué (adapter intensité)\n`
    if (extras.includes('blessure')) p += `- Blessure : ${answers.blessureDetail || 'adapter les exercices'}\n`
  }

  p += `\nGÉNÈRE dans cet ordre :\n\n`
  p += `## MACROS JOURNALIÈRES\n(KCAL:XXXX PROT:XXXg GLU:XXXg LIP:XXg)\nExplication courte.\n\n`
  p += `## STRATÉGIE GLOBALE\nApproche adaptée (2-3 paragraphes).\n\n`
  p += `## PROGRAMME ENTRAÎNEMENT — ${answers.frequence} SÉANCES/SEMAINE\nChaque jour : nom + groupe musculaire + exercices avec séries x reps\n\n`
  p += `## PLAN ALIMENTAIRE 7 JOURS\nChaque jour avec tous les repas détaillés et quantités\n\n`
  p += `## LISTE DE COURSES — SEMAINE TYPE\nPar catégorie\n\n`
  p += `## COMPLÉMENTS RECOMMANDÉS\nPriorisés selon objectif.\n\n`
  p += `## STRATÉGIE GLOBALE\n`
  p += `Approche personnalisée, stratégie sur 8 semaines, points clés à retenir pour ce profil.\n\n`

  p += `## PROGRAMME ENTRAÎNEMENT — ${answers.frequence || 3} SÉANCES/SEMAINE\n`
  p += `Chaque jour de la semaine avec son programme détaillé. Pour chaque séance : groupe musculaire, exercices avec séries x reps. Pour les jours de repos : écrire clairement "REPOS — récupération active".\n\n`

  p += `## PLAN ALIMENTAIRE 7 JOURS\n`
  p += `Chaque jour avec petit-déjeuner, déjeuner, dîner et collation si nécessaire. Quantités précises en grammes.\n\n`

  p += `## LISTE DE COURSES — SEMAINE TYPE\n`
  p += `Par catégorie (protéines, légumes, féculents, fruits, produits laitiers, divers). Quantités pour la semaine.\n\n`

  p += `## COMPLÉMENTS RECOMMANDÉS\n`
  p += `3-4 compléments prioritaires avec dosages et timing de prise.\n\n`

  p += `## MICRONUTRIMENTS À SURVEILLER\n`
  p += `4-5 micronutriments clés pour ce profil avec aliments sources. Inclure besoins en hydratation (litres/jour).\n\n`

  p += `## PLAN 4 SEMAINES — PÉRIODISATION\n`
  p += `Comment le plan évolue sur 4 semaines. Semaine 1 : adaptation. Semaine 2 : progression. Semaine 3 : surcharge. Semaine 4 : décharge.\n\n`

  p += `## NUTRITION PÉRIODISÉE\n`
  p += `Différence alimentation jours d'entraînement vs jours de repos. Timing repas pré/post séance.\n\n`

  p += `## RECETTES SIMPLES\n`
  p += `3 recettes rapides (moins de 20 min) adaptées à l'objectif et au régime alimentaire. Format : nom, ingrédients, préparation en 3 étapes.\n\n`

  p += `## RÉCUPÉRATION & SOMMEIL\n`
  p += `Conseils récupération active, étirements, sommeil, gestion du stress.\n\n`

  p += `## PRÉVENTION & ÉCHAUFFEMENT\n`
  p += `Programme échauffement 5-10 min. Points de vigilance blessures.\n\n`

  p += `## CONSEILS CLÉS\n`
  p += `5-7 conseils personnalisés et actionnables pour ce profil exact.`

  if (answers.userDetails) p += `\n\nINFOS COMPLÉMENTAIRES :\n"${answers.userDetails}"\nPrend en compte dans tout le plan.`

  return p
}

export function buildSystemPrompt(answers) {
  const allergies = answers.allergies || []
  const extras = answers.extras || []
  let allergyRule = 'Aucune allergie déclarée.'
  if (allergies.length > 0) {
    allergyRule = `ALLERGIES DÉCLARÉES : ${allergies.join(', ')}${answers.allergyOther ? ', ' + answers.allergyOther : ''}
RÈGLE ABSOLUE : Aucun aliment contenant ces allergènes ne doit apparaître dans le plan.`
  }
  
  let extraRules = ''
  if (extras.includes('jeune_if')) {
    extraRules += `
JEÛNE INTERMITTENT 16:8 : Fenêtre alimentaire 12h-20h. Structure tous les repas dans cette fenêtre. BCAA conseillé avant séance si entraînement en dehors de la fenêtre. Pas de petit-déjeuner classique, remplacer par un repas vers 12h.`
  }
  if (extras.includes('budget_serre')) {
    extraRules += `
BUDGET SERRÉ : Plan alimentaire sous 40€/semaine. Privilégier : œufs, flocons d'avoine, riz, lentilles, thon en boîte, blanc de poulet (Lidl/Aldi), légumes surgelés, fromage blanc 0%. Éviter les aliments coûteux. Indiquer le coût estimé à la fin de la liste de courses.`
  }
  
  // Filtre sécurité
  const age = parseInt(answers.age) || 0
  const poids = parseInt(answers.poids) || 0
  const taille = parseInt(answers.taille) || 0
  const imc = taille > 0 ? (poids / ((taille/100) * (taille/100))).toFixed(1) : 0
  
  let safetyWarning = ''
  if (imc > 0 && (imc < 16 || imc > 40)) {
    safetyWarning = `
ATTENTION SÉCURITÉ : IMC de ${imc} détecté. Recommande IMPÉRATIVEMENT de consulter un médecin avant tout programme. Adapte le plan pour être très progressif et prudent.`
  }
  if (age < 16 || age > 75) {
    safetyWarning += `
ATTENTION : Profil âge ${age} ans — sois particulièrement prudent, recommande un avis médical préalable.`
  }

  return `Tu es FitBodyPlan, coach fitness et nutritionniste expert français.${safetyWarning} Tu génères des plans 100% adaptés au marché français.

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec le plan, sans introduction ni conclusion
- Commence par : KCAL:XXXX PROT:XXXg GLU:XXXg LIP:XXg
- Sections ## claires
- Ton direct et motivant en français
- HALAL STRICT : NE JAMAIS écrire le mot "halal" nulle part dans le plan. JAMAIS. Ni pour les aliments, ni pour les compléments (pas de "whey halal", "protéine halal" etc). Exclure silencieusement porc, alcool, gélatine porcine. Écrire uniquement "poulet", "steak haché", "whey protéine" sans aucune mention halal.
- Aliments français : steak haché, escalope, jambon, fromage blanc, riz basmati, lentilles, courgettes
- Jours : "LUNDI —", "MARDI —" etc. Repos = "LUNDI — REPOS"
- Exercices en tableau markdown : | Exercice | Séries x Reps | Repos | Notes |
- Compléments en tableau : | Priorité | Complément | Dosage | Moment | Coût |
- Sois CONCIS — pas de phrases inutiles

${allergyRule}${extraRules}`
}
