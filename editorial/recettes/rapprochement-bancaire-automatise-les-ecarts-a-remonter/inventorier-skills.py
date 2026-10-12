from pathlib import Path
import json, hashlib, sys
here = Path(__file__).resolve().parent
catalog = json.loads(Path('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_fa04c2d4c29e45df8aff0447908a2029.txt').read_text())
names = sorted({x['name'] for x in catalog['skills'] if x['name'] in ('blog','seo') or x['name'].startswith(('blog-','seo-'))})
applied = {
'blog': ('Cadrage de la forge du dépôt, charte v5 et backlog ; pas de quotas de graphiques inventés.', ['decision-editoriale.md','corps.md']),
'seo': ('Intention de méthode, métadonnées et DOM local contrôlés ; aucune visibilité acquise déclarée.', ['verification-locale.json']),
'blog-brief': ('Lecteur collaborateurs comptables, requête mesurée historique et quatre cas indépendants.', ['decision-editoriale.md','recette.json']),
'blog-outline': ('Gabarit how-to-guide : réponse, entrées, étapes, règle et cas, erreurs et quatre FAQ.', ['corps.md']),
'blog-write': ('Réponse de 75 mots ; définitions, règle et rejeu distincts ; zéro donnée client.', ['corps.md','charge-cognitive.json']),
'blog-analyze': ('Une lecture indépendante métier/éditorial/visuel acquise, qualité92/100 calculée et sansP0 ; avis propre au candidat, pas repris de septembre.', ['revues.json','revue-independante-2026-10-12.md']),
'blog-rewrite': ('Réutilisation du manuscrit historique : portée du programme resserrée sans changer les quatre cas.', ['corps.md','qualification-claims.md']),
'blog-factcheck': ('Trois pages ANC/CNIL réellement ouvertes par la forge, plus PDF ANC distinct. Calculs du jeu vérifiés ; revue indépendante encore requise.', ['qualification-claims.md','anc-pdf-provenance.json','preuve-rejeu.json']),
'blog-cannibalization': ('Méthode vs page service, outil Excel et futurs définition/checklist ; aucun doublon de requête primaire dans le corpus articles.', ['decision-editoriale.md','verification-intention.json']),
'blog-image': ('Adoption et revue auteur du fichier OpenAI fourni, pas génération Gemini/Higgsfield. Modèle non communiqué conservé.', ['image-source.json','revue-visuelle-auteur.md']),
'blog-schema': ('BlogPosting, Person, Organization, BreadcrumbList parsés dans le DOM ; pas nouvelle promesse de rich result.', ['verification-locale.json']),
'blog-seo-check': ('39 assertions locales : meta, OG, canonical, auteur/date, figures, liens/ancres, mobile et tableaux.', ['verification-locale.json']),
'blog-geo': ('Réponse autonome, trois définitions, trois tableaux, quatre FAQ ; preview noindex voulu. Aucun taux de citation ni probabilité revendiqués.', ['corps.md','verification-locale.json']),
'blog-calendar': ('Sources main actualisées, calendrier recalculé avant preparer ; date de recette réelle 12/10, ancien créneau pas antidaté.', ['recette.json','CONTROLES.md']),
'blog-taxonomy': ('Famille banque-rapprochement et topics existants conservés. Aucune rubrique bancaire maigre fabriquée.', ['recette.json','decision-editoriale.md']),
'seo-content-brief': ('Cadrage requête/tâche/lecteur et différenciation face aux guides généralistes ; volumes ND.', ['decision-editoriale.md','recette.json']),
'seo-content': ('Mécanique vs jugement, preuve restreinte, citations dans paragraphes, charte v5 et refus concrets.', ['corps.md','qualification-claims.md']),
'seo-page': ('Titre, description, un H1, langue, date, canonical et schema sur la page réellement rendue.', ['verification-locale.json']),
'seo-technical': ('DOM présent, preview noindex attendu, liens/ancres existants et absence de débordement ; production/CI futures.', ['verification-locale.json','CONTROLES.md']),
'seo-schema': ('Validation syntaxique JSON-LD et cohérence auteur/titre par navigateur ; pas test Google en ligne.', ['verification-locale.json']),
'seo-images': ('Dérivés AVIF/WebP 768/1200/1600, OG1200x630 ; deux écrans canoniques 1600x900 sous150Ko ; contrôles de chargement 390/1280.', ['verification-locale.json','revue-visuelle-auteur.md']),
'seo-sxo': ('Lecture réponse d’abord, sommaire, tableaux accessibles et CTA après méthode. Aucun test conversion inventé.', ['corps.md','verification-locale.json']),
'seo-geo': ('Contrôle de citabilité partagé avec blog-geo : définitions, réponse directe, source/limite, DOM et schema. Aucun résultat dans un moteur IA revendiqué.', ['corps.md','verification-locale.json'])
}
future = {

'blog-google': 'Route candidate : GSC/PageSpeed public après publication, pas relevé prématuré.',
'seo-google': 'Mesure Google publique après publication, aucun rang ni CTR inventé.',
'seo-bing': 'Soumission IndexNow après publication réelle par platform ; suivi partagé existant.',
'seo-drift': 'Baseline du contenu public après preuve HTTP, aucun état public fabriqué.',
'seo-sitemap': 'Vérification sitemap/RSS public par platform après publication ; preview exclue volontairement.'
}
na_groups = {
'blog-style': 'Aucun apprentissage de voix sur5à10posts demandé : charte v5 déjà canonique. Analyse cognitive exécutée séparément, pas nominalement ce learner.',
'blog-audit': 'Audit de tout le blog hors périmètre ; contrôle ciblé de cet article via blog-seo-check.',
'seo-audit': 'Crawl global/500pages hors périmètre ; contrôles locaux via seo-page/seo-technical.',
'blog-chart': 'Pas de données d’étude ni série à grapher ; tableaux des cas fictifs suffisent.',
'blog-brand': 'Pas création BRAND.md : marque et voix fixées par charte du dépôt.',
'blog-persona': 'Pas création persona : rôle existant collaborateurs-comptables.',
'blog-strategy': 'Pas stratégie nouvelle : sujet déjà mandaté au backlog W41.',
'blog-cluster': 'Architecture déjà planifiée ; comparaison de voisinage dans décision éditoriale, pas nouveau cluster.',
'seo-plan': 'Aucun nouveau plan de site ; exécution d’un sujet du backlog.',
'seo-cluster': 'Pas nouvelle grappe/mesure de chevauchement SERP ; méthode unique déjà cadrée.',
'blog-discourse': 'Aucune enquête sociale30jours demandée ; recherche web et backlog suffisent au besoin identifié.',
'blog-flow': 'Aucun prompt FLOW ni nouvelle campagne à lancer ; discipline de preuve appliquée via forge.',
'seo-flow': 'Aucune campagne FLOW additionnelle ; preuve et maillage traités dans brief.',
'blog-decay': 'Article non publié : aucune baisse de trafic à diagnostiquer.',
'blog-repurpose': 'Aucune diffusion externe hors blog mandatée.',
'seo-backlinks': 'Aucune acquisition de liens ni analyse historique de backlinks de cette route nouvelle.',
'seo-competitor-pages': 'Guide de méthode, pas comparatif éditeurs/alternatives.',
'seo-dataforseo': 'Pas de dépense supplémentaire ; demande historique et recherche Hermes, volume ND.',
'seo-firecrawl': 'Aucun crawl externe de masse nécessaire ; sources ouvertes individuellement.',
'seo-image-gen': 'Couverture existante fournie, pas nouvelle génération payante ni assistant Python image.',
'seo-hreflang': 'Article français unique, aucune traduction.',
'seo-local': 'Aucune intention locale ni page ville.',
'seo-maps': 'Aucune fiche locale/Maps.',
'seo-ecommerce': 'Pas boutique, catalogue de produits ou Shopping.',
'seo-programmatic': 'Article singulier de méthode, pas génération de pages par données.'
}
rows=[]; reads=[]
for name in names:
 path=Path('/Users/kevinkitanga/hermes/packs/memlia-skills')/name/'SKILL.md'
 if path.exists():
  text=path.read_text(); sha=hashlib.sha256(text.encode()).hexdigest()
  reads.append({'skill':name,'path':str(path),'sha256':sha,'content':text})
 else:
  raise RuntimeError('Skill catalogue absent '+name)
 if name in applied:
  reason,proofs=applied[name]; status='execute-perimetre'; applicable='applicable'
 elif name in future:
  reason=future[name]; proofs=['CONTROLES.md'];status='phase-suivante';applicable='applicable'
 elif name in na_groups:
  reason=na_groups[name];proofs=['decision-editoriale.md'];status=applicable='N/A'
 elif any(token in name for token in ('translate','localize','locale','multilingual')):
  reason='Publication française unique, aucune traduction/localisation.';proofs=['recette.json'];status=applicable='N/A'
 else:
  raise RuntimeError('Applicabilité à décider explicitement : '+name)
 rows.append({'skill':name,'chemin_charge':str(path),'version_sha256':sha,'applicabilite':applicable,'etat':status,'motif':reason,'preuves':proofs})
(here/'lectures-skills.json').write_text(json.dumps(reads,ensure_ascii=False,indent=2)+'\n')
(here/'couverture-skills.json').write_text(json.dumps({'date':'2026-10-12','slug':here.name,'limites':['Exécution au périmètre du candidat, pas invocation automatique de tous les services/scripts transitifs.','Les phases futures et N/A ne sont pas des PASS.','Aucun score de qualité ou visibilité automatique.'], 'lignes':rows},ensure_ascii=False,indent=2)+'\n')
from collections import Counter
print(json.dumps({'total':len(rows),'etats':Counter(x['etat'] for x in rows)},ensure_ascii=False))
for entry in reads:
 if entry['skill'] in applied and '--details' in sys.argv:
  print('\n'+entry['skill']+' : '+ '\n'.join(line for line in entry['content'].splitlines() if line.startswith(('#','1.','2.','3.','4.','5.','6.','7.'))))
