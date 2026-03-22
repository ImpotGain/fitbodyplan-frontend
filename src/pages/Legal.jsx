import React from 'react'

export default function Legal({ setScreen }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px 80px' }}>
      <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', marginBottom: 24, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>← Retour</button>

      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 34, letterSpacing: '-.7px', marginBottom: 8 }}>Mentions légales, CGU & Politique de confidentialité</div>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 40 }}>Dernière mise à jour : mars 2026</p>

      {[
        {
          title: '1. Éditeur',
          content: `FitBodyPlan — fitbodyplan.fr\nContact : contact@fitbodyplan.fr\nHébergement : Railway Inc., 340 Pine Street, San Francisco, CA 94104, USA`
        },
        {
          title: '2. AVERTISSEMENT MÉDICAL ET NUTRITIONNEL — À LIRE IMPÉRATIVEMENT',
          content: `FitBodyPlan est une application de bien-être et de remise en forme à usage STRICTEMENT INFORMATIF et INDICATIF. Les plans d'entraînement et les programmes nutritionnels générés par notre intelligence artificielle NE CONSTITUENT EN AUCUN CAS :\n\n• Un avis médical, une prescription médicale ou un diagnostic\n• Un suivi diététique ou nutritionnel professionnel\n• Un programme d'entraînement établi par un coach sportif diplômé\n• Un substitut à une consultation médicale, diététique ou sportive\n\nLes informations fournies sont générées automatiquement par intelligence artificielle et peuvent contenir des erreurs ou être inadaptées à votre situation personnelle. FitBodyPlan ne saurait être tenu responsable de tout dommage corporel, physique, médical ou autre résultant de l'utilisation de ces informations.\n\nAVANT de commencer tout programme d'entraînement ou de modifier votre alimentation, il est FORTEMENT RECOMMANDÉ de :\n• Consulter votre médecin traitant, en particulier si vous souffrez d'une pathologie chronique (diabète, hypertension, maladies cardiovasculaires, troubles alimentaires, etc.)\n• Consulter un diététicien-nutritionniste diplômé d'État\n• Consulter un coach sportif certifié (BPJEPS, CQP IF) pour tout programme d'entraînement\n\nL'UTILISATEUR RECONNAÎT UTILISER CES INFORMATIONS SOUS SA SEULE ET ENTIÈRE RESPONSABILITÉ.`,
          highlight: true
        },
        {
          title: '3. Allergènes et intolérances alimentaires',
          content: `Bien que FitBodyPlan prenne en compte les allergènes déclarés par l'utilisateur, notre système de filtrage par intelligence artificielle n'est PAS infaillible. L'utilisateur est seul responsable de vérifier la composition des aliments consommés. FitBodyPlan décline toute responsabilité en cas de réaction allergique ou d'intolérance alimentaire. En cas d'allergie sévère, consultez impérativement un médecin allergologue.`
        },
        {
          title: '4. Limitation de responsabilité',
          content: `Dans toute la mesure permise par la loi applicable, FitBodyPlan, ses dirigeants, employés, partenaires et prestataires ne pourront être tenus responsables de :\n• Toute blessure, dommage corporel ou préjudice de santé résultant de l'utilisation des plans générés\n• Toute perte de poids excessive, prise de masse non souhaitée ou résultat nutritionnel indésirable\n• Toute réaction allergique ou intolérance alimentaire\n• Tout préjudice direct, indirect, accessoire, spécial ou consécutif\n\nLes résultats peuvent varier significativement d'une personne à l'autre. Aucun résultat n'est garanti.`
        },
        {
          title: '5. Conditions d\'utilisation',
          content: `En utilisant FitBodyPlan, l'utilisateur :\n• Reconnaît avoir lu et accepté l'intégralité des présentes conditions\n• Confirme être âgé d'au moins 18 ans (ou avoir l'autorisation parentale)\n• Accepte d'utiliser les informations fournies à titre indicatif uniquement\n• S'engage à consulter un professionnel de santé avant tout changement significatif de régime alimentaire ou d'activité physique\n• Reconnaît être seul responsable de l'usage qu'il fait des plans générés\n\nFitBodyPlan se réserve le droit de modifier ces conditions à tout moment. L'utilisation continue du service après modification vaut acceptation.`
        },
        {
          title: '6. Données personnelles (RGPD)',
          content: `Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) :\n\n• Les données collectées (profil, objectifs, mesures corporelles, plans générés) sont utilisées uniquement pour le fonctionnement du service\n• Aucune donnée n'est vendue à des tiers\n• Durée de conservation : 3 ans à compter de la dernière utilisation ou jusqu'à suppression du compte\n• Vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition sur vos données\n• Pour exercer ces droits : contact@fitbodyplan.fr — réponse sous 30 jours maximum\n• Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr)`
        },
        {
          title: '7. Cookies',
          content: `FitBodyPlan utilise uniquement des cookies fonctionnels essentiels au bon fonctionnement du service (session utilisateur, préférences). Aucun cookie publicitaire, de tracking ou de profilage commercial n'est utilisé.`
        },
        {
          title: '8. Propriété intellectuelle',
          content: `L'ensemble du contenu de FitBodyPlan (design, code, textes, images, logo) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite.`
        },
        {
          title: '9. Droit applicable',
          content: `Les présentes conditions sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront compétents.`
        },
      ].map(s => (
        <div key={s.title} style={{
          marginBottom: 32,
          background: s.highlight ? 'color-mix(in srgb, var(--accent2) 6%, transparent)' : 'transparent',
          border: s.highlight ? '1.5px solid color-mix(in srgb, var(--accent2) 35%, transparent)' : 'none',
          borderRadius: s.highlight ? 12 : 0,
          padding: s.highlight ? '20px 24px' : 0,
        }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: s.highlight ? 'var(--accent2)' : 'var(--muted)',
            marginBottom: 10, fontWeight: 600
          }}>{s.title}</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, fontWeight: 300, whiteSpace: 'pre-line' }}>{s.content}</p>
        </div>
      ))}
    </div>
  )
}
