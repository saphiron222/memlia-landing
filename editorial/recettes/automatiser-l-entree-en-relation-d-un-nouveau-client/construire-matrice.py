import json
import pathlib
from collections import Counter
folder = pathlib.Path(__file__).resolve().parent
reads = json.loads((folder / 'preuves/lectures-skills.json').read_text())
na = {
    'blog-audio': 'Aucune narration mandatée : article écrit et accessible sans inscription.',
    'blog-notebooklm': 'Quatre sources primaires lues directement ; aucun notebook requis.',
    'blog-rewrite': 'Nouvel article, pas une réécriture ou republication.',
    'blog-chart': 'Aucune série numérique à grapher ; les états sont mieux représentés en tableau et écran fictif.',
    'blog-repurpose': 'Aucune diffusion hors blog mandatée ; ne pas ouvrir LinkedIn ou e-mail.',
    'blog-multilingual': 'Une seule langue publique : français.',
    'blog-translate': 'Aucune traduction requise pour une intention française.',
    'blog-localize': 'Aucun autre marché ni adaptation culturelle demandés.',
    'blog-locale-audit': 'Pas de version étrangère à comparer.',
    'blog-decay': 'Route nouvelle non publiée, pas de série de déclin.',
    'seo-local': 'Intention cabinet nationale, pas de page ville ni GBP.',
    'seo-maps': 'Pas d’intention géographique ni fiche Maps.',
    'seo-hreflang': 'Site français, aucun ensemble alterné.',
    'seo-ecommerce': 'Article de méthode, pas catalogue transactionnel ni panier.',
    'seo-programmatic': 'Corps unique avec essais propres, pas déclinaison en masse.',
    'seo-competitor-pages': 'Deux pages concurrentes sont des entrées de recherche, pas un comparatif public d’éditeurs.',
    'seo-backlinks': 'Aucun entrant externe à mesurer pour une page encore non publiée ; aucun outreach mandaté.',
    'seo-dataforseo': 'Volume ND ; recherche qualitative gratuite suffisante pour ce sujet mandaté, aucun budget API engagé.',
    'seo-firecrawl': 'Pas de crawl intégral nécessaire pour cette fabrication ; corpus local et pages pertinentes lus.',
    'seo-ahrefs': 'Pas de campagne backlink ni abonnement à ouvrir pour fabriquer cette page.',
    'seo-profound': 'Pas de campagne de mesure de citations IA mandatée pour une page absente.',
    'seo-seranking': 'Pas de suivi de rang/SOV payant à ouvrir pour ce guide.',
    'seo-unlighthouse': 'Pas d’audit crawl/performance de site complet dans ce paquet de fabrication.',
}
executed = {
    'blog': ('RECHERCHE-BRIEF.md', 'Cycle scoped recherche → brief → corps → essais et rendu ; publication explicitement séparée.'),
    'blog-brand': ('RECHERCHE-BRIEF.md', 'Charte v5 relue ; nous/vous, pas de gain, pas de catalogue ni identité légale dans le corps.'),
    'blog-persona': ('recette.json', 'Administratif/secrétariat nommé par le backlog ; décisions et personne autorisatrice explicitement séparées.'),
    'blog-brief': ('RECHERCHE-BRIEF.md', 'Besoin, intention, acteurs/formats, preuve et frontières fixés avant rendu ; aucune métrique comparative inventée.'),
    'blog-outline': ('corps.md', 'Trois checklists et suite d’essais ; ranked-listicle écarté car il répond à une comparaison, pas à ce geste.'),
    'blog-write': ('corps.md', 'Réponse directe, définitions, gestes, tableaux, exceptions, quatre questions et clôture rédigés.'),
    'blog-factcheck': ('preuves/qualification-sources.json', 'Trois citations exactes contrôlées ; deux CMF DILA et CNIL réseau. Article151 hérité intègre conservé seulement en recherche complémentaire, sans claim public.'),
    'blog-style': ('preuves/style.json', 'Analyseur exécuté : Healthy, 15 sections, 0 overloaded, 2 borderline ; heuristique anglaise non assimilée à une qualité française certifiée.'),
    'blog-cannibalization': ('preuves/verification-paquet.json', 'Mentions des pages publiées examinées et comparaison des intentions du backlog ; deux variantes futures non actionnées.'),
    'blog-taxonomy': ('recette.json', 'Famille onboarding-client et rôle du backlog conservés ; pas de catégorie artificielle.'),
    'blog-flow': ('RECHERCHE-BRIEF.md', 'Find : besoin des jalons ; Leverage : corpus/charte ; Optimize : preuve et refus ; Win : mesure future explicitement séparée.'),
    'seo-content': ('preuves/verification-paquet.json', 'Source par citation et preuve fictive traçable ; aucune expérience client ni qualité d’expert-comptable attribuée à Kevin.'),
    'seo-content-brief': ('RECHERCHE-BRIEF.md', 'Nouveau guide, format choisi selon intention et relevé qualitative ; pas de score de concurrents ni densité forcée.'),
    'seo-flow': ('RECHERCHE-BRIEF.md', 'Observation externe et corpus interne rapprochés ; faux positif de besoin côté recrutement explicitement exclu.'),
    'seo-sxo': ('RECHERCHE-BRIEF.md', 'User story : savoir qui doit faire quoi sur le dossier avant passation ; tableau de prochaine action, pas définition seule.'),
}
partial = {
    'seo': ('preuves/verification-paquet.json', 'Contrôles scoped au contenu et rendu local ; pas audit intégral du site ni score de santé.'),
    'blog-strategy': ('RECHERCHE-BRIEF.md', 'Sujet demandé et charte relus ; demande/intentions différenciées, pas refonte de la stratégie complète.'),
    'blog-discourse': ('RECHERCHE-BRIEF.md', 'Recherche web qualitative du jour, pas étude sociale last30days ni citation de praticien.'),
    'blog-calendar': ('RECHERCHE-BRIEF.md', 'Ancien créneau et date réelle distingués ; réservation native et cadence au jour de publication déléguées à platform.'),
    'blog-cluster': ('RECHERCHE-BRIEF.md', 'Famille/pilier/frère du backlog comparés ; aucun cluster entier refait.'),
    'blog-image': ('image-traitement.json', 'Pièce jointe native opérateur copiée sans recoloration ; dérivés exécutés. Mesure réelle : verts de marque absents selon tolérance45, réserve cosmétique conservée sans PASS de palette.'),
    'seo-image-gen': ('provenance-e1b26719-2623-4044-8ccb-86b40198bac6.json', 'Génération native OpenAI fournie par opérateur, pas Gemini du pack ; aucune génération durant la correction, modèle/coût non exposés.'),
    'seo-images': ('preuves/rendu-controles.json', 'Dimensions, tailles, variantes et chargement du rendu local contrôlés ; pas LCP/CWV servies ni image SERP.'),
    'blog-seo-check': ('preuves/verification-paquet.json', 'H1, titres, requête mesurée, liens du corps, sommaire et figures contrôlés ; métas/schema publics à valider après matérialisation.'),
    'blog-geo': ('corps.md', 'Réponse directe, définitions stables, citations contextualisées, tableaux et preuves contrôlables ; aucune citation IA réellement mesurée.'),
    'seo-geo': ('corps.md', 'Extractibilité locale et limites documentées ; robots/llms et visibilité IA de la route non publiés à contrôler à release.'),
    'blog-audit': ('preuves/verification-paquet.json', 'Lecture scoped du nouveau dossier et mentions du corpus ; pas audit du blog complet ni historique performance.'),
    'seo-audit': ('preuves/verification-paquet.json', 'Audit scoped du paquet ; infra, indexation et performance hors fabrication restent inconnues.'),
    'seo-page': ('preuves/rendu-controles.json', 'Page locale inspectée à1280/390 ; pas une page Astro publique ni un audit performance réel.'),
    'seo-technical': ('preuves/rendu-controles.json', 'HTML local non vide, h1 unique, pas de débordement et images chargées ; indexabilité/headers publics futurs.'),
    'seo-plan': ('RECHERCHE-BRIEF.md', 'Sujet mandaté exécuté dans le plan existant ; aucune nouvelle roadmap ni KPI inventés.'),
    'seo-cluster': ('RECHERCHE-BRIEF.md', 'Différenciation pilote onboarding/recurrent/pilier ; pas clustering automatique des SERP complet.'),
    'blog-schema': ('recette.json', 'Données auteur/titre/date/image préparées pour le gabarit existant ; aucun JSON-LD public émis par le rendu de fabrication.'),
    'seo-schema': ('recette.json', 'Contrat BlogPosting/Breadcrumb/Person du gabarit existant repéré ; validation du JSON-LD réellement construit reste à platform.'),
}
future = {
    'blog-analyze': ('revue-independante', 'Unique metier à venir sur fond, sources, visuels et matrice ; aucun verdict ni score auteur.', 'HANDOFF.md'),
    'seo-sitemap': ('release-platform', 'Route encore non matérialisée : contrôler entrée sitemap, date et canonical après publication réelle.', 'HANDOFF.md'),
    'seo-drift': ('release-platform', 'Baseline publique inexistante ; comparer article servi et dossier après première publication.', 'HANDOFF.md'),
}
unavailable = {
    'blog-google': 'GSC/API performance non interrogées dans cette fabrication ; impressions/clics ND, aucune donnée déduite de l’absence de route.',
    'seo-google': 'Autocomplétion reçue, mais GSC/PSI/CrUX/indexation non collectées ; ne pas présenter la suggestion comme résultat de ces APIs.',
    'seo-bing': 'Aucun relevé Bing de cette route non publiée ; pas de soumission avant reçu public.',
}
lines = []
for loaded in reads:
    name = loaded['skill']
    phase = 'fabrication'
    if name in na:
        state, applicable, reason, proofs = 'N/A', 'N/A', na[name], ['RECHERCHE-BRIEF.md']
    elif name in executed:
        proof, reason = executed[name]; state, applicable, proofs = 'execute', 'applicable', [proof]
    elif name in partial:
        proof, reason = partial[name]; state, applicable, proofs = 'partiel', 'applicable', [proof]
    elif name in future:
        phase, reason, proof = future[name]; state, applicable, proofs = 'a-executer', 'applicable', [proof]
    elif name in unavailable:
        state, applicable, reason, proofs = 'indisponible', 'applicable', unavailable[name], ['RECHERCHE-BRIEF.md']
    else:
        raise ValueError('Skill sans décision : ' + name)
    lines.append({'skill': name, 'slug': folder.name, 'chemin_charge': loaded['path'], 'version_sha256': loaded['sha256'], 'phase': phase, 'applicabilite': applicable, 'etat': state, 'preuves': proofs, 'constat': reason, 'motif': reason, 'changement': 'Conforme au périmètre de fabrication ; limites et owner de la suite déclarés.'})
assert len({x['skill'] for x in lines}) == len(reads)
for line in lines:
    assert line['motif'] and all((folder / p).exists() for p in line['preuves']), line
matrix = {'schema_version': 1, 'slug': folder.name, 'date': '2026-10-12', 'limites': ['Lectures complètes archivées depuis le pack installé et synthèse chargée ; pas de lecture transitive de toutes références.', 'Les états execute sont scoped aux preuves décrites, jamais PASS complet du skill ou verdict de revue.', 'API/production indisponibles ou futures explicitement conservées ; aucun seuil ni score simulé.'], 'lignes': lines}
(folder / 'couverture-skills.json').write_text(json.dumps(matrix, ensure_ascii=False, indent=2) + '\n')
(folder / 'COUVERTURE-SKILLS.md').write_text('# Couverture des compétences · fabrication\n\n' + '\n'.join('- ' + x['skill'] + ' : ' + x['etat'] + ' ; ' + x['constat'] + ' Preuve : ' + ', '.join(x['preuves']) for x in lines) + '\n')
print(json.dumps({'union': len(lines), 'etats': dict(Counter(x['etat'] for x in lines)), 'preuvesExistantes': True}, ensure_ascii=False))
