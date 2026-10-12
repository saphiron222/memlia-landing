import json,re,shutil
from pathlib import Path
from datetime import datetime,timezone
from collections import Counter
root=Path.cwd(); out=root/'docs/qa/cac-f4-livraison/editorial';out.mkdir(parents=True,exist_ok=True)
slugs=['automatiser-un-cabinet-cac-la-carte-des-taches','cac-reception-fec-constat']
pack=Path('/Users/kevinkitanga/hermes/packs/memlia-skills')
registry=json.loads((root/'editorial/templates/skills.json').read_text())
catalog_file=Path('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_ef486fb71a274360b74d4364494143fc.txt')
shutil.copyfile(catalog_file,out/'catalogue-courant.json')
catalog=json.loads(catalog_file.read_text());available={s['name'] for s in catalog['skills']}
for src,name in [('/Users/kevinkitanga/.hermes/profiles/marketing/cache/web/www.comptasecure.fr-23d02e563f.md','concurrent-comptasecure.md'),('/Users/kevinkitanga/.hermes/profiles/marketing/cache/web/www.compta-online.com-424ed3e422.md','concurrent-compta-online.md')]:shutil.copyfile(src,out/name)
# Statuts portent sur cette fabrication. Les rapports d'avis acquis sont cités, jamais renommés en exécution nouvelle.
groups=[]
def group(names,state,phase,note,proofs):
 for name in names.split():groups.append((name,state,phase,note,proofs))
control='docs/qa/cac-f4-livraison/editorial/CONTROLES.json'
research='docs/qa/cac-f4-livraison/editorial/RECHERCHE-2026-10-12.md'
liaison='docs/qa/cac-f4-livraison/liaison-avis/VERIFICATION-R1-LIAISON.json'
qualification='docs/qa/cac-f4-livraison/liaison-avis/QUALIFICATION-AVIS.md'
avis='docs/qa/cac-f4-metier/AVIS.md'
group('blog seo','execute','routage','Deux racines chargées ; union pack/catalogue/registre confrontée. Le routage ne certifie pas les sous-compétences.',[research,control])
group('blog-strategy seo-plan blog-cluster seo-cluster','partiel','cadrage','Lot mandaté conservé : choix d’une tâche CAC / réception FEC, cluster certification. Recherche fraîche de formats, sans SERP Google calibrée ni volumes ; aucun nouveau sujet choisi.',[research,'docs/strategy/site-v3/backlog-v3.json'])
group('blog-brand blog-persona','execute','cadrage','Charte v5 relue, signataire/chef de mission/auditeur CAC distincts des EC ; nous/vous, saisies préservées et jugement conservé. Aucun nouveau profil de marque créé.',[avis,'.agents/product-marketing.md',control])
group('blog-calendar','execute','créneau','Garde réel du12/10 et deux réservations PASS ; calendrier inchangé dans cette fabrication. Ni antidate ni publication.',['docs/strategy/site-v3/CONTENT-CALENDAR.md','docs/qa/cac-f4-livraison/editorial/creneau.json'])
group('blog-taxonomy','execute','métadonnées','Sujets autorisés cabinet/automatisation/methode et cabinet/donnees/methode, cluster certification. Rubrique CAC délibérément inactive, activation réservée à platform.',[control,'docs/qa/cac-f4-livraison/ETAT-2026-10-12.md'])
group('blog-brief seo-content-brief blog-outline blog-write','execute','fabrication','Deux corps et recettes relus intégralement : réponse initiale, définitions, prérequis, méthode, frontière, sept cas fictifs, erreurs et quatre FAQ chacun. Maintien des textes déjà examinés, aucun nouveau texte écrit. Ce contrôle de conformité du paquet ne revendique pas l’exécution historique de la rédaction.',[control,avis,liaison])
group('blog-factcheck','execute','sources','Avis acquis relié aux15 claims ; rejeu du construireClaims réel sans erreur, extraits et copies intègres. R1 reliée aux unités, exception signature/approbation et portées315/330 conservées. Pas de nouvelle ouverture HTTP prétendue.',[avis,liaison])
group('blog-image seo-images','partiel','images','Quatre figures relues par métier, provenance HTML non IA et zéro crédit ; dimensions/poids/alt des dérivés réellement mesurés, chargement local vérifié. Nouveaux critères complets image non examinés dans l’avis : qualification restante, pas score inventé.',[control,avis,qualification])
group('blog-schema seo-schema','execute','rendu','JSON-LD lu et parsé dans vrai HTML : BlogPosting, Person Kevin Kitanga, Organization, WebSite, BreadcrumbList ; headline/canonical/dates concordent. Pas de bénéfice de citation ou rich-result FAQ promis.',[control])
group('blog-seo-check seo-page seo-technical','partiel','rendu','Un H1, niveaux propres, canonical/OG/Twitter, descriptions exactes, liens et images locaux200, viewport375/1440 sans erreur JS ni overflow. noindex attendu de preview ; CWV/Lighthouse/production non mesurés, pas PASS global anticipé.',[control])
group('blog-geo seo-geo blog-flow seo-flow','partiel','extractibilité','Corps statique complet ; définitions FEC/constat/version et tâche/règle/proposition autonomes ; tableaux avec thead et jeu fictif borné. Support officiel associé, pas estimation de chance de citation ni simulation de réponses IA.',[control,liaison,avis])
group('blog-analyze blog-audit seo-content seo-audit seo-sxo','partiel','qualité','Lecture des deux corps, réponse utile avant vente, limites explicites et CTA contextuel. Extraction et contrôles réels conservés, rapport qualitatif sans note numérique. Pas revue indépendante du rendu : mêmes critères à qualifier par métier, pas second examen du fond acquis.',[control,research,qualification,'docs/qa/cac-f4-livraison/editorial/LECTURE-EDITORIALE.md'])
group('blog-cannibalization','execute','maillage','Comparaison locale des requêtes primaires de toutes les recettes et lecture des deux intentions : aucune collision exacte ; pilier choix/organisation CAC, satellite réception technique distinct du fiscal et de l’EC. Pas d’intersection SERP quantifiée. Liens réciproques présents dans rendu.',[control,research])
group('seo-sitemap','a-executer','publication','Brouillons non publics et noindex dans preview ; vérifier inclusion des2 articles et rubrique lors de livraison, sans inventer état du sitemap public.',['docs/qa/cac-f4-livraison/ETAT-2026-10-12.md'])
group('blog-google seo-google seo-bing','a-executer','mesure publique','URLs nouvelles non publiées : données de performance/indexation/soumission à relever après reçu réel, aucun zéro ni credential manquant supposé.',['docs/qa/cac-f4-livraison/ETAT-2026-10-12.md'])
group('blog-discourse','N/A','cadrage','Aucune recherche de discours sociaux ou d’actualité récente mandatée ; sujet normatif/méthodologique déjà revu, recherche concurrentielle suffisante pour cette remise. Aucun démarrage LinkedIn.',[research])
group('blog-rewrite','N/A','rédaction','Pas réécriture ni actualisation du fond : corps acquis explicitement conservés.',[avis])
group('blog-style','N/A','voix','Sous-skill courant apprend une voix sur5–10 articles ; pas de nouvelle voix à apprendre, charte française v5 fait foi. Diagnostic prose local distinct, pas exécution fictive du learner anglais.',['.agents/product-marketing.md'])
group('blog-chart','N/A','visuels','Aucune série de données à tracer, figures écrans fictifs acquis conservées ; pas de graphique ajouté pour cocher une case.',[avis])
group('blog-notebooklm','N/A','sources','Sources primaires locales avec copies et avis acquis ; aucun notebook ni compte nécessaire au lot.',[avis])
group('blog-audio blog-repurpose','N/A','distribution','Aucune narration ni déclinaison externe blog mandatée ; aucune nouvelle surface ou action hors blog.',[avis])
group('blog-multilingual blog-translate blog-localize blog-locale-audit seo-hreflang','N/A','international','Deux méthodes CAC françaises, site fr-FR, aucune autre langue/locale ni alternates à produire.',[control])
group('blog-decay seo-drift','N/A','maintenance','Première publication, aucune baseline ou série de trafic de ces URLs ; pas de déclin ni dérive à calculer avant existence publique.',[research])
group('seo-backlinks seo-ahrefs seo-seranking seo-profound','N/A','mesure','Pas campagne de liens ni monitoring fournisseur dans cette fabrication ; URLs non publiques, aucun abonnement ou outil supplémentaire créé.',[research])
group('seo-competitor-pages','N/A','format','Analyse de concurrence exécutée pour le besoin ; pas de page comparative d’éditeurs à fabriquer.',[research])
group('seo-local seo-maps','N/A','local','Méthodes professionnelles nationales CAC, pas page d’établissement/zone ni GBP ; pas données géolocalisées à produire.',[research])
group('seo-ecommerce','N/A','commerce','Aucun catalogue/achat/produit ecommerce dans le lot, service à la tâche.', ['.agents/product-marketing.md'])
group('seo-programmatic','N/A','volume','Deux textes originaux acquis, pas production à partir d’un dataset ni variantes de pages.',[avis])
group('seo-dataforseo seo-firecrawl','N/A','outil','Extension fournisseur non nécessaire : recherche Hermes et2 URLs locales suffisantes, sans crawl site-wide ni dépense SEO pour cocher la matrice.',[research,control])
group('seo-image-gen','N/A','génération','Couvertures HTML originales autorisées et figures acquises, aucune génération IA demandée ou dépense.',[avis])
group('seo-unlighthouse','N/A','performance','Extension de crawl Lighthouse global hors fabrication de2 articles ; la performance finale demeure à vérifier en livraison, pas certifiée par cette ligne.',[control])
entries={g[0]:g for g in groups}; assert len(entries)==len(groups),'Doublon'
paths={p.parent.name:p for p in pack.glob('*/SKILL.md') if p.parent.name in ['blog','seo'] or p.parent.name.startswith(('blog-','seo-'))}
assert set(paths)==set(entries),str({'missing':sorted(set(paths)-set(entries)),'extra':sorted(set(entries)-set(paths))})
rows=[]
for name,p in sorted(paths.items()):
 content=p.read_text();front=content.split('---',2)[1];v=re.search(r'(?m)^\s*version:\s*([^\n]+)',front)
 _,state,phase,note,proofs=entries[name]
 for proof in proofs:assert (root/proof).exists(),proof
 rows.append({'skill':name,'slugs':slugs,'loadedPath':str(p),'version':v.group(1).strip(' "') if v else 'non déclarée','catalogueAvailable':name in available,'technicalRegistry':name in registry['blog']+registry['seo'],'phase':phase,'applicability':'N/A' if state=='N/A' else 'applicable','execution':state,'evidence':proofs,'finding':note,'change':'Maintien des corps et figures ; fabrication/contrôles seulement','independentReview':False})
result={'date':datetime.now(timezone.utc).isoformat(),'scope':'Matrice du lot, états de fabrication honnêtes ; ni RUN synthétique de preparer ni revue indépendante','slugs':slugs,'inventory':{'pack':len(paths),'blog':len(registry['blog']),'seo':len(registry['seo']),'catalogueAbsent':sorted(set(paths)-available),'extensionOutsideRegistry':sorted(set(paths)-set(registry['blog']+registry['seo'])-{'blog','seo'})},'rows':rows}
(out/'couverture-skills.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
lines=['# Matrice Blog/SEO du lot CAC — 12/10/2026','',result['scope'],'','Les états « partiel » restent partiels ; les preuves d’avis sont historiques. Aucune ligne ne crée un verdict indépendant. Livraison/mesure après publication restent à-exécuter.','', '| Skill | État | Phase | Constat / N/A motivé | Preuves |','|---|---|---|---|---|']
for r in rows:lines.append('| '+ ' | '.join([r['skill'],r['execution'],r['phase'],r['finding'],' ; '.join(r['evidence'])])+' |')
(out/'COUVERTURE-SKILLS.md').write_text('\n'.join(lines)+'\n')
for s in slugs:
 d=root/'editorial/recettes'/s
 (d/'couverture-skills.json').write_text(json.dumps({**result,'articleSlug':s},ensure_ascii=False,indent=2)+'\n')
 (d/'COUVERTURE-SKILLS.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'inventory':result['inventory'],'states':dict(Counter(r['execution'] for r in rows)),'omissions':[],'missingEvidence':[]},ensure_ascii=False,indent=2))
