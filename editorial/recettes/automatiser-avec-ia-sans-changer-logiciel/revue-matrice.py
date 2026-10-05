from pathlib import Path
import json, hashlib, collections, re, runpy, copy, shutil
ROOT = Path.cwd()
D = ROOT / 'editorial/recettes/automatiser-avec-ia-sans-changer-logiciel'
catalogue_local = D/'revue-catalogue-hermes.json'
if not catalogue_local.exists():
    shutil.copyfile('/Users/kevinkitanga/.hermes/profiles/qa/cache/spillover/call_W7tz6w9weLej3EkhNNPnbGrB.txt',catalogue_local)
cat = json.loads(catalogue_local.read_text())
matrix = json.loads((D/'couverture-skills.json').read_text())
reads = json.loads((D/'lectures-skills.json').read_text())
template = json.loads((ROOT/'editorial/templates/skills.json').read_text())
names = {x['name'] for x in cat['skills'] if re.match(r'^(blog|seo)(-|$)', x['name'])}
names.update(template['blog'] + template['seo'] + ['blog','seo'])
# Union avec les extensions effectivement installées : le catalogue seul ne suffit pas.
pack = Path('/Users/kevinkitanga/hermes/packs/memlia-skills')
names.update(p.parent.name for p in pack.glob('*/SKILL.md') if re.match(r'^(blog|seo)(-|$)',p.parent.name))
rows = matrix['lignes']
mapped = {x['skill']: x for x in rows}
issues = []
for row in rows:
    content = Path(row['chemin_charge']).read_bytes()
    loaded = next(x for x in reads if x['skill'] == row['skill'])
    digest = hashlib.sha256(content).hexdigest()
    if row['version_sha256'] != digest or loaded['sha256'] != digest or loaded['content'].encode() != content:
        issues.append('lecture/version ' + row['skill'])
    for proof in row['preuves']:
        if not (D/proof).exists():
            issues.append('preuve absente ' + row['skill'] + ' ' + proof)
    if not row['motif'].strip() or not row['constat'].strip():
        issues.append('motif/constat vide ' + row['skill'])
    if row['applicabilite'] == 'N/A' and row['etat'] != 'N/A':
        issues.append('etat N/A ' + row['skill'])
source_dir = ROOT/'editorial/articles/automatiser-avec-ia-sans-changer-logiciel'
source = json.loads((source_dir/'preuves/sources/cnil-risques.json').read_text())
source_bytes = (source_dir/source['contentPath']).read_bytes()
assert hashlib.sha256(source_bytes).hexdigest() == source['contentSha256']
assert source['excerpt'] in source_bytes.decode()
assert len(rows) == len(mapped) and names == set(mapped) and not issues
# Fixture native source-only explicitement isolée ; ne change ni le garde Git ni origin/main.
# La référence distante partagée a avancé pendant la QA : le contrôle réel reste refusé
# jusqu'à intégration par marketing. Cette fixture ne prouve aucune fraîcheur de publication.
fixture = ROOT/'.qa/plan-fixture-t_003f2bb5'
shutil.copytree(ROOT/'src',fixture/'src',dirs_exist_ok=True)
shutil.copytree(ROOT/'docs/strategy/site-v3',fixture/'docs/strategy/site-v3',dirs_exist_ok=True)
planner = runpy.run_path(str(fixture/'docs/strategy/site-v3/build-cluster-plan.py'))
args = planner['construire']()
assert not planner['verifier'](*args)[0]
mutations = []
def check_change(label, action, expected):
    poles, families, published, pillar, satellites, links, by_family = copy.deepcopy(args)
    action(satellites, by_family)
    errors = planner['verifier'](poles, families, published, pillar, satellites, links, by_family)[0]
    assert any(expected in error for error in errors), (label, errors)
    mutations.append({'case':label,'errors':errors})
def old_slug(sat, families):
    row = copy.deepcopy(next(x for x in sat if x['slug']=='automatiser-avec-ia-sans-changer-logiciel'))
    row.update(slug='automatiser-sans-changer-de-logiciel', requete='ancien angle doublon de retour', famille='complements-excel')
    sat.append(row); families['complements-excel'].append(row)
check_change('ancien angle réintroduit',old_slug,'complements-excel : 4 angles au lieu de 3')
def bad_family(sat, families):
    row = next(x for x in sat if x['slug']=='automatiser-avec-ia-sans-changer-logiciel')
    families[row['famille']].remove(row); row['famille']='complements-excel'; families['complements-excel'].append(row)
check_change('brief déplacé dans mauvaise famille',bad_family,'famille du brief mandaté divergente')
def arbitrary(sat, families):
    row=copy.deepcopy(next(x for x in sat if x['slug']=='automatiser-avec-ia-sans-changer-logiciel'))
    row.update(slug='nouvel-angle-arbitraire',requete='ajout non mandaté')
    sat.append(row); families[row['famille']].append(row)
check_change('angle IA arbitraire ajouté',arbitrary,'angles au lieu de')
def duplicate(sat, families):
    row=copy.deepcopy(next(x for x in sat if x['slug']=='automatiser-avec-ia-sans-changer-logiciel'))
    sat.append(row);families[row['famille']].append(row)
check_change('slug et requête dupliqués',duplicate,'slugs en double')
# Les autres familles n'ont pas changé de stock dans le diff source.
result = {'reviewerTaskId':'t_003f2bb5','cataloguePackUnion':len(names),'matrixCount':len(rows),'distinct':len(mapped),'missing':sorted(names-set(mapped)),'extra':sorted(set(mapped)-names),'states':dict(collections.Counter(x['etat'] for x in rows)),'issues':issues,'sourceIntegrity':True,'lectureVersions':len(reads),'future':[x['skill'] for x in rows if x['etat']=='a-executer'],'plannerMutations':mutations,'plannerMutationScope':'Fixture non Git explicite, aucune certification de fraîcheur du checkout réel ; origin/main avancé pendant la revue.'}
(D/'revue-matrice.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
