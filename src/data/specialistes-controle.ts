/**
 * Les recoupements des données des agents IA avec la carte des familles et les pages service : ce que
 * `specialistes.ts`, feuille, ne vérifie pas seul. Pur : les pages service lui sont passées (le test les lit dans
 * `src/content/services`, un gabarit les prendrait dans la collection Astro). `controlerAgents` rend la liste des
 * erreurs ; `exigerAgents` refuse de continuer quand elle n'est pas vide (fail-closed).
 *
 * Quand la fiche devient obligatoire : une carte qui mène à une page existante n'a jamais de fiche ; une carte qui
 * mène à une fiche la porte dès que l'agent est `publie` (tâche 6 pour Comptabilité, tâche 9 pour les huit autres).
 * Avant, son contenu peut manquer : la carte n'est pas en ligne et sa route ne se construit pas.
 */
import { FAMILLES, IDS_POLES, TOUTES_LES_FAMILLES } from './familles.ts';
import type { Famille } from './familles.ts';
import { AGENTS, FAMILLES_DE_NOUS, FAMILLES_DU_HUB, FAMILLES_TENUES_HORS_PAGE, GROUPES, ISSUES } from './specialistes.ts';
import type { Demonstration, Fiche, Specialiste } from './specialistes.ts';

/** Une page de `src/content/services` : son slug, la famille de son frontmatter (`family`) et son statut (`status`). */
export interface PageService {
  slug: string;
  famille: string;
  statut: string;
}

const NOMBRE_DE_CAS = 4;
const QUESTIONS_MIN = 5;
const QUESTIONS_MAX = 6;
const plein = (valeur: unknown): boolean => typeof valeur === 'string' && valeur.trim() !== '';
const doublons = (valeurs: readonly string[]): string[] => [...new Set(valeurs.filter((v, i) => valeurs.indexOf(v) !== i))];

function erreursDeCarte(agent: Specialiste): string[] {
  const erreurs: string[] = [];
  for (const champ of ['prenom', 'libelle', 'ligne'] as const) if (!plein(agent[champ])) erreurs.push(`${champ} vide`);
  if (!GROUPES.some(({ id }) => id === agent.groupe)) erreurs.push(`groupe inconnu « ${agent.groupe} »`);
  if (!IDS_POLES.includes(agent.teinte)) erreurs.push(`teinte hors des pôles « ${agent.teinte} »`);
  if (typeof agent.publie !== 'boolean') erreurs.push('`publie` n’est pas un booléen');
  if (agent.frontiereEnBref.length !== 3 || !agent.frontiereEnBref.every(plein)) erreurs.push('frontière en bref : trois cellules non vides attendues');
  if (agent.avatar && (!agent.avatar.src.startsWith(`/agents/${agent.slug}-`) || !plein(agent.avatar.alt))) erreurs.push('avatar : `/agents/<slug>-…` et un `alt` rédigé');
  if (agent.logiciels.length === 0) erreurs.push('aucun logiciel cité');
  if (!agent.logiciels.every((nom) => plein(nom) && nom.trim() === nom)) erreurs.push('nom de logiciel vide ou entouré de blancs');
  for (const nom of doublons(agent.logiciels)) erreurs.push(`logiciel cité deux fois « ${nom} »`);
  return erreurs;
}

/** La forme d'une démonstration (spec §2.1) ; AGENTS-CONTENU §14 la veut aussi avec un Préparé et un À valider. */
export function erreursDemonstration(demonstration: Demonstration): string[] {
  const erreurs: string[] = [];
  for (const champ of ['tache', 'dossier', 'regle'] as const) if (!plein(demonstration[champ])) erreurs.push(`démonstration : ${champ} vide`);
  if (!demonstration.dossier.startsWith('Dossier fictif : ')) erreurs.push('démonstration : le dossier ne se dit pas fictif (« Dossier fictif : … »)');
  if (demonstration.cas.length !== NOMBRE_DE_CAS) erreurs.push(`démonstration : ${demonstration.cas.length} cas au lieu de ${NOMBRE_DE_CAS}`);
  demonstration.cas.forEach((cas, i) => {
    if (!plein(cas.cas) || !plein(cas.sortie)) erreurs.push(`démonstration : cas ${i + 1} incomplet`);
    if (!(ISSUES as readonly string[]).includes(cas.issue)) erreurs.push(`démonstration : cas ${i + 1}, issue « ${cas.issue} » hors de ${ISSUES.join(' / ')}`);
  });
  for (const issue of ISSUES) if (!demonstration.cas.some((cas) => cas.issue === issue)) erreurs.push(`démonstration : aucun cas « ${issue} »`);
  const arrets = demonstration.cas.filter((cas) => cas.issue === 'Arrêt');
  if (arrets.length > 0 && !arrets.every((cas) => /Motif\s:/u.test(cas.sortie))) erreurs.push('démonstration : un Arrêt sans « Motif : » dans sa sortie');
  return erreurs;
}

/** Ce que la fiche affiche se rattache aux familles titulaires, et les montre toutes, sauf celles tenues hors page. */
function erreursDeFiche(agent: Specialiste, fiche: Fiche, slugs: ReadonlySet<string>): string[] {
  const erreurs: string[] = [];
  for (const champ of ['requete', 'h1', 'titreOnglet', 'description', 'descriptionLead', 'chapeau', 'serviceType'] as const) {
    if (!plein(fiche[champ])) erreurs.push(`fiche : ${champ} vide`);
  }
  if (!fiche.description.startsWith(fiche.descriptionLead)) erreurs.push('fiche : la description n’ouvre pas sur son `descriptionLead`');
  const affichees = [...fiche.taches.map(({ famille }) => famille), ...fiche.aussi.map(({ famille }) => famille)];
  for (const id of new Set([...affichees, ...fiche.tachesDepart])) if (!agent.familles.includes(id)) erreurs.push(`fiche : famille « ${id} » affichée sans en être titulaire`);
  for (const id of affichees) if (id in FAMILLES_TENUES_HORS_PAGE) erreurs.push(`fiche : « ${id} » ne s’affiche jamais`);
  for (const id of agent.familles) if (!(id in FAMILLES_TENUES_HORS_PAGE) && !affichees.includes(id)) erreurs.push(`fiche : famille titulaire « ${id} » absente des tâches`);
  for (const id of doublons(fiche.aussi.map(({ famille }) => famille))) erreurs.push(`fiche : « ${id} » deux fois dans « Aussi dans son périmètre »`);
  if (doublons([...fiche.tachesDepart]).length > 0) erreurs.push('fiche : tâche de départ en double');
  if (!fiche.taches.every((t) => plein(t.geste) && plein(t.prepare))) erreurs.push('fiche : tâche sans geste ou sans préparation');
  if (!fiche.livrables.every((l) => plein(l.titre) && plein(l.texte))) erreurs.push('fiche : livrable incomplet');
  if (fiche.frontiere.length === 0 || !fiche.frontiere.every((ligne) => ligne.length === 3 && ligne.every(plein))) erreurs.push('fiche : frontière vide ou incomplète');
  if (fiche.arrets.length === 0 || !fiche.arrets.every(plein)) erreurs.push('fiche : conditions d’arrêt absentes');
  if (fiche.neJamaisSansVous.length === 0 || !fiche.neJamaisSansVous.every((e) => plein(e.envoi) && plein(e.validation))) erreurs.push('fiche : « Ce qui ne part jamais sans vous » vide ou incomplet');
  if (!fiche.avecSans.every((l) => plein(l.sans) && plein(l.avec))) erreurs.push('fiche : ligne « avec ou sans » incomplète');
  const { questions } = fiche.faq;
  if (questions.length < QUESTIONS_MIN || questions.length > QUESTIONS_MAX) erreurs.push(`fiche : ${questions.length} questions au lieu de ${QUESTIONS_MIN} ou ${QUESTIONS_MAX}`);
  if (!questions.every((q) => plein(q.question) && plein(q.reponse))) erreurs.push('fiche : question sans réponse');
  if (fiche.faq.balisage !== false) erreurs.push('fiche : FAQPage émise, alors que la porte 2 l’a écartée');
  for (const voisin of fiche.voisins) if (voisin.agent === agent.slug || !slugs.has(voisin.agent)) erreurs.push(`fiche : voisin « ${voisin.agent} » inconnu ou soi-même`);
  if (doublons(fiche.voisins.map(({ agent: id }) => id)).length > 0) erreurs.push('fiche : voisin en double');
  if (fiche.pageDeLaRegle && !agent.servicesLies.some((slug) => fiche.pageDeLaRegle === `/automatisation/${slug}`)) erreurs.push(`fiche : page de la règle « ${fiche.pageDeLaRegle} » hors des services liés`);
  return erreurs;
}

function erreursDeDestination(agent: Specialiste, slugs: ReadonlySet<string>): string[] {
  if (agent.destination.type === 'page') return agent.fiche ? ['fiche écrite alors que la carte mène à une page existante'] : [];
  if (!agent.fiche) return agent.publie ? ['publié sans contenu de fiche : la route ne peut pas se construire'] : [];
  return erreursDeFiche(agent, agent.fiche, slugs);
}

/** Chaque famille a au plus un titulaire ; seules les familles CAC inactives peuvent n'en avoir aucun. */
function erreursDePartition(agents: readonly Specialiste[], toutes: readonly Famille[]): string[] {
  const erreurs: string[] = [];
  const connues = new Set(toutes.map(({ id }) => id));
  const titulaires = new Map<string, string>();
  const poser = (id: string, qui: string) => {
    if (!connues.has(id)) erreurs.push(`${qui} : famille inconnue « ${id} »`);
    else if (titulaires.has(id)) erreurs.push(`famille « ${id} » portée par ${titulaires.get(id)} et par ${qui}`);
    else titulaires.set(id, qui);
  };
  for (const agent of agents) for (const id of agent.familles) poser(id, agent.slug);
  for (const id of FAMILLES_DU_HUB) poser(id, 'le hub');
  for (const id of FAMILLES_DE_NOUS) poser(id, 'le bloc « nous »');
  for (const { id, profession, active } of toutes) {
    if (!titulaires.has(id) && !(profession === 'cac' && !active)) erreurs.push(`famille « ${id} » sans titulaire`);
  }
  const methode = FAMILLES.filter(({ pole }) => pole === 'methode-decision-humaine').map(({ id }) => id);
  if (methode.length !== FAMILLES_DE_NOUS.length || !methode.every((id) => FAMILLES_DE_NOUS.includes(id))) erreurs.push('le bloc « nous » ne porte pas exactement le pôle « Méthode et décision humaine »');
  for (const id of Object.keys(FAMILLES_TENUES_HORS_PAGE)) {
    if (!agents.some((agent) => agent.familles.includes(id))) erreurs.push(`famille tenue hors page « ${id} » sans titulaire`);
  }
  return erreurs;
}

/** Chaque page service publiée est liée par l'agent qui porte sa famille (ou dont elle est le pôle), et par lui seul. */
function erreursDeServices(agents: readonly Specialiste[], services: readonly PageService[]): string[] {
  const erreurs: string[] = [];
  const porte = (agent: Specialiste, service: PageService) => agent.familles.includes(service.famille) || agent.teinte === service.famille;
  for (const agent of agents) {
    for (const slug of doublons(agent.servicesLies)) erreurs.push(`${agent.slug} : service « ${slug} » lié deux fois`);
    for (const slug of agent.servicesLies) {
      const service = services.find((autre) => autre.slug === slug);
      if (!service) erreurs.push(`${agent.slug} : service lié inconnu « ${slug} »`);
      else if (service.statut !== 'publie') erreurs.push(`${agent.slug} : service lié non publié « ${slug} » (${service.statut})`);
      else if (!porte(agent, service)) erreurs.push(`${agent.slug} : service « ${slug} » d’une famille qu’il ne porte pas (${service.famille})`);
    }
  }
  for (const service of services.filter(({ statut }) => statut === 'publie')) {
    const lies = agents.filter((agent) => agent.servicesLies.includes(service.slug)).map(({ slug }) => slug);
    if (lies.length === 0) erreurs.push(`service publié « ${service.slug} » lié par aucun agent (famille ${service.famille})`);
  }
  return erreurs;
}

/** Toutes les erreurs des données des agents, préfixées de l'agent en cause ; vide quand tout tient. */
export function controlerAgents({ services, agents = AGENTS, familles = TOUTES_LES_FAMILLES }: {
  services: readonly PageService[];
  agents?: readonly Specialiste[];
  familles?: readonly Famille[];
}): string[] {
  const slugs = new Set(agents.map(({ slug }) => slug));
  const erreurs: string[] = [];
  if (slugs.size !== agents.length) erreurs.push('identifiant d’agent en double');
  for (const prenom of doublons(agents.map(({ prenom }) => prenom))) erreurs.push(`prénom en double « ${prenom} »`);
  const chemins = agents.flatMap(({ destination }) => (destination.type === 'page' ? [destination.chemin] : []));
  for (const chemin of doublons(chemins)) erreurs.push(`deux cartes mènent à ${chemin}`);
  for (const agent of agents) {
    const propres = [...erreursDeCarte(agent), ...erreursDemonstration(agent.demonstration), ...erreursDeDestination(agent, slugs)];
    erreurs.push(...propres.map((erreur) => `${agent.slug} : ${erreur}`));
  }
  return [...erreurs, ...erreursDePartition(agents, familles), ...erreursDeServices(agents, services)];
}

/** Garde de build : lève avec toutes les erreurs plutôt que de rendre une page sur des données fausses. */
export function exigerAgents(services: readonly PageService[]): void {
  const erreurs = controlerAgents({ services });
  if (erreurs.length > 0) throw new Error(`Données des agents IA refusées (${erreurs.length}) :\n- ${erreurs.join('\n- ')}`);
}
