import tarifs from '../data/tarifs-memlia.json' with { type: 'json' };
export { tarifs };
function entier(value, min, max, nom) {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new RangeError(`${nom} : choisissez un entier entre ${min} et ${max}.`);
  return value;
}
export function prixRobotsAnnuel(dossiers) {
  entier(dossiers, 1, 100000, 'Dossiers');
  const r = tarifs.robots;
  if (dossiers > r.maximumPortfolio) return null;
  return r.minimumAnnualCents + Math.max(0, Math.min(dossiers, r.secondThreshold) - r.firstThreshold) * r.firstAdditionalCents + Math.max(0, dossiers - r.secondThreshold) * r.secondAdditionalCents;
}
export function prixAgentsMensuel(ids, creditsNecessaires = 0) {
  entier(creditsNecessaires, 0, 1000000000, 'Crédits');
  if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length) throw new RangeError('Choisissez au moins un agent, sans doublon.');
  const agents = ids.map(id => {
    const agent = tarifs.agents.find(a => a.id === id);
    if (!agent) throw new RangeError('Agent inconnu.');
    return agent;
  });
  const creditsInclus = agents.reduce((n,a) => n + a.includedCredits, 0);
  const creditsSupplementaires = Math.max(0, creditsNecessaires - creditsInclus);
  const abonnement = tarifs.baseMonthlyCents + agents.reduce((n,a) => n + a.priceCents, 0);
  const depassement = creditsSupplementaires * tarifs.overagePriceCentsPerCredit;
  return { abonnement, creditsInclus, creditsNecessaires, creditsSupplementaires, depassement, total: abonnement + depassement };
}
/** @param {{offre?: string, dossiers: number, profil?: string, coutHoraire: number, tempsManuel: number, tempsControle: number, miseEnService?: number|null}} options */
export function estimerBudget({ offre = 'robots', dossiers, profil, coutHoraire, tempsManuel, tempsControle, miseEnService = null }) {
  entier(dossiers, 1, 100000, 'Dossiers');
  for (const [nom,value,max] of [['Coût horaire',coutHoraire,1000],['Temps manuel',tempsManuel,10000],['Temps de contrôle',tempsControle,10000]]) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new RangeError(`${nom} : indiquez un nombre entre 0 et ${max}.`);
  }
  if (miseEnService !== null && (!Number.isSafeInteger(miseEnService) || miseEnService < 0 || miseEnService > 100000000)) throw new RangeError('Mise en service : indiquez un montant valide.');
  let annuel, detail = null, profilChoisi = null;
  const periodes = offre === 'robots' ? 1 : 12;
  if (offre === 'robots') annuel = prixRobotsAnnuel(dossiers);
  else {
    const agent = tarifs.agents.find(a => a.id === offre);
    if (!agent) throw new RangeError('Offre inconnue.');
    const trouve = agent.profiles.find(p => p.id === profil);
    if (profil && !trouve) throw new RangeError('Profil de dossier inconnu.');
    profilChoisi = trouve ?? agent.profiles[0];
    detail = prixAgentsMensuel([offre], dossiers * profilChoisi.creditsPerCase);
    annuel = detail.total * 12;
  }
  const heures = dossiers * (tempsManuel - tempsControle) * periodes / 60;
  const tempsValorise = Math.round(heures * coutHoraire * 100);
  const soldeAnnuel = annuel === null ? null : tempsValorise - annuel;
  const coutPremiereAnnee = annuel === null || miseEnService === null ? null : annuel + miseEnService;
  return { offre, dossiers, periodes, profil:profilChoisi, detail, annuel, heures, tempsValorise, soldeAnnuel, miseEnService, coutPremiereAnnee, soldePremiereAnnee:coutPremiereAnnee === null ? null : tempsValorise - coutPremiereAnnee };
}
