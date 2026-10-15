import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { AGENTS, FICHES, comptesParGroupe, ficheDe } from '../../src/data/specialistes.ts';
import { controlerAgents, erreursDemonstration, exigerAgents } from '../../src/data/specialistes-controle.ts';

/*
 * Les recoupements des données des agents IA (src/data/specialistes-controle.ts) : partition des familles, pages
 * service liées, démonstrations, et le moment où la fiche devient obligatoire (dès que l'agent est publié).
 * Chaque règle a son témoin : une copie des vraies données, altérée d'un seul geste, doit rougir pour cette raison-là.
 */

const SERVICES_DIR = new URL('../../src/content/services/', import.meta.url);

/** Les pages service telles que le dépôt les publie : slug du fichier, `family` et `status` du frontmatter. */
function lireServices() {
  return readdirSync(SERVICES_DIR).filter((nom) => nom.endsWith('.md')).sort().map((nom) => {
    const entete = /^---\r?\n([\s\S]*?)\r?\n---/u.exec(readFileSync(new URL(nom, SERVICES_DIR), 'utf8'))?.[1] ?? '';
    const champ = (cle) => new RegExp(`^${cle}:\\s*"?([^"\\n]+?)"?\\s*$`, 'mu').exec(entete)?.[1];
    return { slug: nom.slice(0, -3), famille: champ('family'), statut: champ('status') };
  });
}
const SERVICES = lireServices();
const copie = () => structuredClone(AGENTS);
const de = (agents, slug) => agents.find((agent) => agent.slug === slug);
const erreurs = (agents, services = SERVICES) => controlerAgents({ services, agents });
/** Une seule altération ; l'erreur attendue doit figurer parmi celles rendues. */
function rougit(changer, attendue, services = SERVICES) {
  const agents = copie();
  changer(agents);
  const rendues = erreurs(agents, services);
  assert.ok(rendues.some((erreur) => attendue.test(erreur)), `attendu ${attendue}, rendu : ${JSON.stringify(rendues)}`);
}

/** Une fiche complète et fictive pour Balthazar : le point de départ des témoins de fiche. */
function ficheFictive(agent) {
  const aussi = ['notes-de-frais', 'ged-dossier-permanent'];
  const texte = (n) => `Texte fictif ${n}.`;
  return {
    requete: 'ia comptabilité', h1: 'Titre fictif', titreOnglet: 'Onglet fictif', descriptionLead: 'Début fictif.', description: 'Début fictif. Suite.',
    chapeau: texte('chapeau'), serviceType: 'Préparation fictive',
    eeat: { auteur: 'kevin', datePublication: '2026-10-15', dateModification: '2026-10-15', sources: [] },
    image: { url: 'https://memlia.fr/proofs/v2/og/99-fiche-fictive.webp', alt: texte('alt') },
    taches: agent.familles.filter((id) => !aussi.includes(id)).map((famille, i) => ({ geste: texte(`geste ${i}`), prepare: texte(`prépare ${i}`), famille })),
    aussi: aussi.map((famille) => ({ famille, texte: texte(famille) })),
    livrables: [1, 2, 3].map((n) => ({ titre: texte(`livrable ${n}`), texte: texte(n) })),
    // La frontière en bref de la carte en est un extrait : chaque cellule dans sa colonne, ici sur deux lignes (R25).
    frontiere: [[agent.frontiereEnBref[0], texte('validation'), agent.frontiereEnBref[2]], [texte('seul'), agent.frontiereEnBref[1], texte('humain')]],
    arrets: [texte('arrêt')],
    neJamaisSansVous: [{ envoi: texte('envoi'), validation: texte('validation') }],
    avecSans: [1, 2, 3, 4].map((n) => ({ sans: texte(`sans ${n}`), avec: texte(`avec ${n}`) })),
    faq: { balisage: false, questions: [1, 2, 3, 4, 5].map((n) => ({ question: `Question ${n} ?`, reponse: texte(n) })) },
    tachesDepart: ['collecte-pieces', 'saisie-ocr', 'banque-rapprochement'],
    voisins: [{ agent: 'commercial', role: 'avant', objet: 'l’entrée en relation' }, { agent: 'juridique-fiscal', role: 'apres' }],
    pageDeLaRegle: '/automatisation/saisie-comptable',
  };
}
const avecFiche = (agents, changer = () => {}) => {
  const balthazar = de(agents, 'comptabilite');
  balthazar.publie = true;
  balthazar.fiche = ficheFictive(balthazar);
  changer(balthazar.fiche, balthazar);
};

test('les pages service sont lues : douze, chacune avec sa famille et son statut', () => {
  assert.ok(SERVICES.length >= 12, `${SERVICES.length} pages service lues`);
  assert.ok(SERVICES.every(({ famille, statut }) => famille && statut), JSON.stringify(SERVICES));
});

test('les données réelles des douze agents passent tous les recoupements', (t) => {
  assert.deepEqual(erreurs(AGENTS), []);
  assert.doesNotThrow(() => exigerAgents(SERVICES));
  const publiees = SERVICES.filter(({ statut }) => statut === 'publie').length;
  t.diagnostic(`${AGENTS.length} agents, ${FICHES.length} à fiche, ${AGENTS.filter(({ publie }) => publie).length} publiés, ${AGENTS.filter(({ fiche }) => fiche).length} fiches écrites ; ${publiees} pages service publiées, toutes liées`);
});

test('R19 : publiée veut dire « page de destination construite » ; les filtres comptent les douze cartes, publiées ou non', () => {
  // L'invariant, et non la liste du jour (revue de la tâche 2) : une carte qui mène à une page existante est publiée,
  // puisque sa page l'est déjà ; une fiche publiée porte son contenu. Les fiches passent à `true` une à une (6, puis 9).
  const versPage = AGENTS.filter(({ destination }) => destination.type === 'page');
  assert.ok(versPage.length > 0, 'des cartes mènent à une page existante');
  assert.deepEqual(versPage.filter(({ publie }) => publie !== true).map(({ slug }) => slug), [], 'carte vers une page existante non publiée');
  assert.deepEqual(FICHES.filter(({ publie, fiche }) => publie === true && !fiche).map(({ slug }) => slug), [], 'fiche publiée sans contenu');
  // Spec §0 : Production et conseil 5, Relation client 3, Vie du cabinet 4. Le total vaut 12 quel que soit le nombre
  // d'agents publiés : un filtre sur `publie` rendrait un compte qui bouge à chaque fiche construite.
  assert.deepEqual(comptesParGroupe(), { 'production-conseil': 5, 'relation-client': 3, 'vie-cabinet': 4 });
  assert.equal(Object.values(comptesParGroupe()).reduce((total, n) => total + n, 0), AGENTS.length);
});

test('témoins de partition : famille inconnue, en double, prise au hub ou au bloc « nous », perdue, neuve non portée', () => {
  rougit((a) => de(a, 'finance').familles.push('famille-inventee'), /finance : famille inconnue « famille-inventee »/u);
  rougit((a) => de(a, 'finance').familles.push('tva'), /famille « tva » portée par juridique-fiscal et par finance/u);
  rougit((a) => de(a, 'finance').familles.push('ia-generative-agents'), /« ia-generative-agents » portée par finance et par le hub/u);
  rougit((a) => de(a, 'finance').familles.push('mesure-roi'), /« mesure-roi » portée par finance et par le bloc « nous »/u);
  rougit((a) => { de(a, 'juridique-fiscal').familles = de(a, 'juridique-fiscal').familles.filter((id) => id !== 'tva'); }, /famille « tva » sans titulaire/u);
  rougit((a) => { de(a, 'juridique-fiscal').familles = de(a, 'juridique-fiscal').familles.filter((id) => id !== 'liasse-fiscale'); }, /famille « liasse-fiscale » sans titulaire/u);
  rougit((a) => { de(a, 'informatique-outils').familles = de(a, 'informatique-outils').familles.filter((id) => id !== 'complements-excel'); }, /tenue hors page « complements-excel » sans titulaire/u);
  // Une famille CAC inactive restée sans titulaire peut être prise : ce n'est pas une erreur.
  const agents = copie();
  de(agents, 'missions-audit').familles.push('cac-procedures-convenues');
  assert.deepEqual(erreurs(agents), []);
});

test('témoins des pages service : inconnue, non publiée, d’une famille non portée, publiée sans agent', () => {
  rougit((a) => de(a, 'finance').servicesLies.push('page-inventee'), /finance : service lié inconnu « page-inventee »/u);
  rougit((a) => de(a, 'finance').servicesLies.push('saisie-comptable'), /finance : service « saisie-comptable » d’une famille qu’il ne porte pas/u);
  rougit((a) => { de(a, 'comptabilite').servicesLies = de(a, 'comptabilite').servicesLies.filter((s) => s !== 'notes-de-frais'); }, /service publié « notes-de-frais » lié par aucun agent/u);
  rougit(() => {}, /service lié non publié « notes-de-frais »/u, SERVICES.map((s) => (s.slug === 'notes-de-frais' ? { ...s, statut: 'brouillon' } : s)));
  assert.throws(() => exigerAgents([...SERVICES, { slug: 'page-neuve', famille: 'tva', statut: 'publie' }]), /« page-neuve » lié par aucun agent/u);
});

test('la fiche : jamais pour une carte vers une page, obligatoire dès que l’agent est publié, facultative avant', () => {
  rougit((a) => { de(a, 'paie-social').fiche = ficheFictive(de(a, 'comptabilite')); }, /paie-social : fiche écrite alors que la carte mène à une page existante/u);
  rougit((a) => { de(a, 'finance').publie = true; }, /finance : publié sans contenu de fiche/u);
  const nonPubliee = copie();
  assert.equal(de(nonPubliee, 'finance').publie, false);
  assert.deepEqual(erreurs(nonPubliee), [], 'une fiche non publiée peut attendre son contenu');
  // Une carte vers une page existante peut être publiée sans fiche.
  const page = copie();
  de(page, 'paie-social').publie = true;
  assert.deepEqual(erreurs(page), []);
  // `ficheDe` refuse de rendre une fiche absente ou une carte vers une page.
  assert.throws(() => ficheDe(de(AGENTS, 'finance')), /pas encore écrit/u);
  assert.throws(() => ficheDe(de(AGENTS, 'paie-social')), /mène à \/automatisation\/paie/u);
});

test('témoins de fiche : une fiche complète passe, chaque écart d’un seul champ rougit', () => {
  const complete = copie();
  avecFiche(complete);
  assert.deepEqual(erreurs(complete), []);
  assert.equal(ficheDe(de(complete, 'comptabilite')).h1, 'Titre fictif');
  const fiche = (changer, attendue) => rougit((a) => avecFiche(a, changer), attendue);
  fiche((f) => { f.taches[0].famille = 'tva'; }, /comptabilite : fiche : famille « tva » affichée sans en être titulaire/u);
  fiche((f) => { f.taches = f.taches.filter(({ famille }) => famille !== 'lettrage'); }, /famille titulaire « lettrage » absente des tâches/u);
  // Une famille tenue hors page (ici prise à Aude pour l'occasion) ne s'affiche jamais, même titulaire.
  fiche((f, a) => { a.familles.push('audit-legal'); f.aussi.push({ famille: 'audit-legal', texte: 'x' }); }, /« audit-legal » ne s’affiche jamais/u);
  fiche((f) => { f.faq.balisage = true; }, /FAQPage émise/u);
  fiche((f) => { f.faq.questions.pop(); }, /4 questions au lieu de 5 ou 6/u);
  fiche((f) => { f.tachesDepart = ['collecte-pieces', 'collecte-pieces', 'saisie-ocr']; }, /tâche de départ en double/u);
  fiche((f) => { f.tachesDepart = ['collecte-pieces', 'saisie-ocr', 'tva']; }, /famille « tva » affichée sans en être titulaire/u);
  fiche((f) => { f.voisins.push({ agent: 'comptabilite', role: 'a-cote' }); }, /voisin « comptabilite » inconnu ou soi-même/u);
  fiche((f) => { f.description = 'Autre début. Suite.'; }, /n’ouvre pas sur son `descriptionLead`/u);
  fiche((f) => { f.pageDeLaRegle = '/automatisation/paie'; }, /page de la règle « \/automatisation\/paie » hors des services liés/u);
  fiche((f) => { f.livrables[2].texte = ' '; }, /livrable incomplet/u);
  fiche((f) => { f.neJamaisSansVous = []; }, /« Ce qui ne part jamais sans vous » vide/u);
  fiche((f) => { f.h1 = ''; }, /fiche : h1 vide/u);
  // Image sociale (contrat de `ficheGraph` et du contrat de page) : URL absolue sur https://memlia.fr, alt rédigé.
  fiche((f) => { f.image.url = '/proofs/v2/og/50-fiche-comptabilite.webp'; }, /fiche : image sociale/u);
  fiche((f) => { f.image.url = 'http://memlia.fr/proofs/v2/og/50-fiche-comptabilite.webp'; }, /fiche : image sociale/u);
  fiche((f) => { f.image.url = 'https://example.com/proofs/v2/og/50-fiche-comptabilite.webp'; }, /fiche : image sociale/u);
  fiche((f) => { f.image.alt = ' '; }, /fiche : image sociale/u);
  // R25 : chaque cellule de la frontière en bref figure dans sa colonne de la règle, sur n'importe quelle ligne.
  fiche((f) => { f.frontiere[0] = [f.frontiere[0][0], f.frontiere[0][1], 'Une autre cellule']; }, /fiche : la frontière en bref « .+ » manque dans sa colonne 3/u);
  // La bonne cellule dans une autre colonne ne compte pas : elle doit être dans la sienne.
  fiche((f, a) => { f.frontiere[0] = [f.frontiere[0][0], f.frontiere[0][1], 'Une autre cellule']; f.frontiere[1] = [a.frontiereEnBref[2], f.frontiere[1][1], f.frontiere[1][2]]; }, /fiche : la frontière en bref « .+ » manque dans sa colonne 3/u);
  // Témoin : l'ordre des lignes est libre, le contrôle ne réclame pas la première.
  const permutee = copie();
  avecFiche(permutee, (f) => { f.frontiere = [...f.frontiere].reverse(); });
  assert.deepEqual(erreurs(permutee), [], 'lignes de la règle dans un autre ordre');
});

test('les fiches écrites : chaque cellule de la frontière en bref figure, mot pour mot, dans sa colonne de la règle (R25)', () => {
  const ecrites = AGENTS.filter(({ fiche }) => fiche);
  assert.ok(ecrites.length > 0, 'au moins une fiche écrite (Comptabilité, tâche 6)');
  for (const agent of ecrites) {
    agent.frontiereEnBref.forEach((cellule, i) => {
      assert.ok(agent.fiche.frontiere.some((ligne) => ligne[i] === cellule), `${agent.slug} : « ${cellule} » absent de la colonne ${i + 1}`);
    });
  }
});

test('R19 : une carte vers une page existante non publiée rougit', () => {
  rougit((a) => { de(a, 'informatique-outils').publie = false; }, /informatique-outils : carte vers une page existante non publiée/u);
});

test('témoins de démonstration : trois cas, une issue inventée, aucun Arrêt, un Arrêt sans motif, un dossier qui ne se dit pas fictif', () => {
  const demo = () => structuredClone(de(AGENTS, 'comptabilite').demonstration);
  assert.deepEqual(erreursDemonstration(demo()), []);
  const altere = (changer) => { const d = demo(); changer(d); return erreursDemonstration(d); };
  assert.ok(altere((d) => d.cas.pop()).includes('démonstration : 3 cas au lieu de 4'));
  assert.ok(altere((d) => { d.cas[0].issue = 'Compatible'; }).some((e) => /issue « Compatible »/u.test(e)));
  assert.ok(altere((d) => { d.cas[2].issue = 'À valider'; d.cas[3].issue = 'À valider'; }).includes('démonstration : aucun cas « Arrêt »'));
  assert.ok(altere((d) => { d.cas[0].issue = 'À valider'; }).includes('démonstration : aucun cas « Préparé »'));
  assert.ok(altere((d) => { d.cas[2].sortie = 'Aucune écriture proposée, doublon probable'; }).includes('démonstration : un Arrêt sans « Motif : » dans sa sortie'));
  assert.ok(altere((d) => { d.dossier = 'L’Atelier Loriot, SARL de menuiserie.'; }).some((e) => /ne se dit pas fictif/u.test(e)));
  assert.ok(altere((d) => { d.regle = ''; }).includes('démonstration : regle vide'));
  rougit((a) => { de(a, 'protection-donnees').demonstration.cas.pop(); }, /protection-donnees : démonstration : 3 cas au lieu de 4/u);
});

test('témoins de carte : groupe, teinte, frontière en bref, logiciels, avatar, publication, prénom et destination', () => {
  rougit((a) => { de(a, 'finance').groupe = 'tous'; }, /finance : groupe inconnu « tous »/u);
  rougit((a) => { de(a, 'finance').teinte = 'finance'; }, /finance : teinte hors des pôles « finance »/u);
  rougit((a) => { de(a, 'finance').frontiereEnBref[2] = ''; }, /finance : frontière en bref/u);
  rougit((a) => { de(a, 'finance').frontiereEnBref.pop(); }, /finance : frontière en bref/u);
  rougit((a) => de(a, 'finance').logiciels.push('Qonto'), /finance : logiciel cité deux fois « Qonto »/u);
  rougit((a) => { de(a, 'finance').logiciels = []; }, /finance : aucun logiciel cité/u);
  rougit((a) => { de(a, 'finance').logiciels[0] = ' Microsoft Excel'; }, /finance : nom de logiciel vide ou entouré de blancs/u);
  rougit((a) => { de(a, 'finance').avatar = { src: '/agents/finance-256.webp', alt: '' }; }, /finance : avatar/u);
  rougit((a) => { de(a, 'finance').avatar = { src: '/images/finance.webp', alt: 'Florent' }; }, /finance : avatar/u);
  rougit((a) => { de(a, 'finance').publie = 'oui'; }, /finance : `publie` n’est pas un booléen/u);
  rougit((a) => { de(a, 'finance').prenom = 'Balthazar'; }, /prénom en double « Balthazar »/u);
  rougit((a) => { de(a, 'missions-audit').destination = { type: 'page', chemin: '/integrations' }; }, /deux cartes mènent à \/integrations/u);
  rougit((a) => { de(a, 'finance').ligne = ' '; }, /finance : ligne vide/u);
});
