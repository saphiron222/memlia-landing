import json
import pathlib
import hashlib
root = pathlib.Path.cwd()
folder = pathlib.Path(__file__).resolve().parent
catalog = json.loads(pathlib.Path('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_Q7hi5WS9DWkOPd4Ht8BCrB7M.txt').read_text())
installed = pathlib.Path('/Users/kevinkitanga/hermes/packs/memlia-skills')
registry = json.loads((root / 'editorial/templates/skills.json').read_text())
names = set(registry['blog'] + registry['seo'] + ['blog', 'seo'])
names |= {s['name'] for s in catalog['skills'] if s['name'].startswith(('blog-', 'seo-'))}
names |= {p.parent.name for p in installed.glob('*/SKILL.md') if p.parent.name.startswith(('blog-', 'seo-'))}
reads = []
for n in sorted(names):
    p = installed / n / 'SKILL.md'
    text = p.read_text()
    reads.append({'skill': n, 'path': str(p), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'content': text})
(folder / 'preuves').mkdir(exist_ok=True)
(folder / 'preuves/lectures-skills.json').write_text(json.dumps(reads, ensure_ascii=False, indent=2) + '\n')
(folder / 'preuves/catalogue-skills.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
summary = '\n\n'.join(r['skill'] + '\n' + '\n'.join(x for x in r['content'].splitlines() if x.startswith('#') or ('must' in x.lower()) or ('never' in x.lower())) for r in reads)
(folder / 'preuves/synthese-skills.txt').write_text(summary)
print('Union :', len(names))
print(summary)
