"""Paquet candidat avec citations exactes ; aucun verdict métier de l’auteur."""
import datetime, hashlib, json, re, subprocess
from pathlib import Path
from zoneinfo import ZoneInfo
BASE=Path('docs/qa/hub-ressources/glossaire-cac-lot-4-sources')
PACKAGE=Path('docs/strategy/site-v3/glossaire-cac-lot-4.json')
sha=lambda b:hashlib.sha256(b).hexdigest()
now=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
day=lambda t:datetime.datetime.fromisoformat(t).astimezone(ZoneInfo('Europe/Paris')).date().isoformat()
def save(path,data): Path(path).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
evidence=json.loads((BASE/'captures.json').read_text()) | json.loads((BASE/'capture-pdf.json').read_text())
sources={}
for sid,item in evidence.items():
    lines=Path(item['snapshotPath']).read_text().splitlines()
    if sid.startswith('h2a'):
        item['versionAttestation']=next(l for l in lines if l.startswith('Homologuée'))
        title=next(l for l in lines if l.startswith('NEP '))
        publisher='H2A'
    elif sid.startswith('cncc-nep'):
        item['versionAttestation']=lines[2]; title=lines[1]; publisher='CNCC'
    else: title='Propos et Débats, Audit et société, septembre 2022, n°2 : acronyme ALPE'; publisher='CNCC'
    item.setdefault('applicabilityNote','Version attestée ; vérifier le cadre et la durée de la mission. Aucun seuil ancien recopié.')
    sources[sid]={'id':sid,'publisher':publisher,'title':title,'url':item['requestedUrl'],'checkedAt':day(item['retrievedAt'])}
for number in [66,69,79,83,85,92,94]:
    sid=f'dila-a821-{number}'; path=BASE/f'{sid}.json'; data=json.loads(path.read_text()); textpath=path.with_suffix('.txt')
    assert textpath.read_text()==data['text']
    retrieved=data['provenance']['retrieved_at']
    sources[sid]={'id':sid,'publisher':'Légifrance — DILA/DINUM','title':f'Code de commerce, A.821-{number}','url':data['url'],'checkedAt':day(retrieved)}
    evidence[sid]={'accessMode':'dila-copy','httpStatus':None,'requestedUrl':data['url'],'finalUrl':data['url'],'upstreamUrl':data['url'],'retrievedAt':retrieved,'dilaCopyPath':str(path),'dilaCopySha256':sha(path.read_bytes()),'snapshotPath':str(textpath),'contentSha256':sha(textpath.read_bytes()),'version':data['id'],'versionDate':data['valid_from'],'validToExclusive':data['valid_to_exclusive'],'warning':data['warning'],'official':True,'level':'tier-1','provenance':'DILA LEGI via dérivé DINUM A4'}
links=[]; link_checks=[]
for slug,label in [('verifier-reponse-ia-comptabilite','Vérifier une réponse IA en comptabilité, méthode EC'),('ia-comptabilite-confidentialite-donnees','Préparer des données confidentielles pour une IA, contexte EC')]:
    sourcepath=Path(f'src/content/blog/{slug}.md'); assert 'brouillon: false' in sourcepath.read_text()
    href=f'/blog/{slug}'; url='https://memlia.fr'+href
    r=subprocess.run(['curl','--silent','--show-error','--fail','--location','--max-time','45','--write-out','\n%{json}',url],capture_output=True,check=True)
    raw,meta=r.stdout.rsplit(b'\n',1); meta=json.loads(meta); assert meta['http_code']==200 and re.search(rb'<article[\s>]',raw)
    path=BASE/f'link-{slug}.html'; path.write_bytes(raw)
    link_checks.append({'href':href,'url':url,'finalUrl':meta['url_effective'],'httpStatus':200,'inMain':True,'hasArticleBody':True,'checkedAt':now(),'snapshotPath':str(path),'sha256':sha(raw),'sourcePath':str(sourcepath)})
    links.append({'label':label,'href':href})
nep_article={'230':66,'300':69,'580':79,'570':83,'560':85,'700':92,'911':94,'912':94}
def citation(sid,number,norm=None):
    text=Path(evidence[sid]['snapshotPath']).read_text(); offset=0; scope=text
    if sid=='dila-a821-94':
        marker=f' NEP {norm}.'; offset=text.index(marker); stop=text.find(' NEP 912.',offset+len(marker)) if norm=='911' else -1
        scope=text[offset:stop if stop!=-1 else len(text)]
    matches=list(re.finditer(r'(?m)^\s*(\d{1,2})\.\s',scope))
    m=next(m for m in matches if int(m[1])==int(number)); start=offset+m.start()
    while text[start].isspace(): start+=1
    nextm=next((x for x in matches if x.start()>m.start()),None); end=offset+nextm.start() if nextm else offset+len(scope)
    # Ne garder que le paragraphe, sans titre de section ni pied de page.
    lines=text[start:end].rstrip().splitlines()
    while lines and not lines[-1].strip(): lines.pop()
    if not nextm:
        foot=next((i for i,l in enumerate(lines) if l.strip()=='Remonter en haut de page'),len(lines)); lines=lines[:foot]
    while len(lines)>1 and not re.search(r'[.;:!?»\"”)]$',lines[-1].strip()): lines.pop()
    quote='\n'.join(lines).rstrip(); assert len(quote)>=40 and quote in text
    return {'text':quote,'locator':f'{sid}:nep-{norm}:paragraphe-{number}:ligne-{text[:start].count(chr(10))+1}'}
def exact(sid,quote,locator):
    text=Path(evidence[sid]['snapshotPath']).read_text(); start=text.index(quote)
    return {'text':quote,'locator':f'{sid}:{locator}:ligne-{text[:start].count(chr(10))+1}'}
entries=[]; units=[]
def unit(e,field,text,sid=None,citations=None,suffix=''):
    units.append({'id':f'{e["id"]}-{field}-{sid or "memlia"}{suffix}','entryId':e['id'],'field':field,'text':text,'unitText':e[field],'sourceId':sid,'type':'legal-reglementaire' if sid else 'methode-memlia','applicability':'Audit des comptes en France, vérifier le cadre et la durée de la mission.' if sid else 'Convention de présentation ou illustration fictive Memlia.','regime':'Version attestée, avec réserve A4 sur la consolidation locale.' if sid else 'Support de pratique sans obligation autonome ni preuve d’intégration livrée.','exceptions':'Le CAC conserve le jugement, les diligences, la responsabilité et l’opinion ; lire la norme complète.' if sid else 'Le cabinet valide et conserve ses saisies ; préparation ne vaut pas conclusion.','citations':citations or [],'businessVerdict':None})
for d in json.loads((BASE/'draft.json').read_text()):
    sidlist=list(dict.fromkeys(s for n in d['norms'] for s in [f'h2a-nep-{n}',f'dila-a821-{nep_article[n]}']))+d.get('extraSources',[])
    e={k:d[k] for k in ['term','anchor','definition','context','exampleFictitious','commonConfusion','automationBoundary','relatedTerms']}
    e.update({'id':d['anchor'],'nature':'Professionnelle','owner':'Pôle audit CAC','author':'Memlia','editorialReviewer':'Équipe éditoriale Memlia','businessReviewer':None,'reviewedAt':None,'sourceCheckedAt':day(now()),'nextReviewAt':'2027-03-13','sourceIds':sidlist,'routeDecision':'anchor','status':'preview-only','internalLinks':links,'motsSources':{s:d['sourceWords'][n] for n in d['norms'] for s in [f'h2a-nep-{n}',f'dila-a821-{nep_article[n]}']}})
    entries.append(e)
    for field in d.get('conventionFields',[]): unit(e,field,e[field])
    for field,convention in d.get('conventionSplit',{}).items():
        # Acronyme ALPE : preuve CNCC historique ci-dessous plutôt que convention.
        if e['id']!='alpe': unit(e,field,convention,suffix='-terminologie')
    for n,fields in d['norms'].items():
        for field,numbers in fields.items():
            claim=e[field]
            if field in d.get('conventionSplit',{}): claim=claim.replace(d['conventionSplit'][field],'').strip()
            if e['id']=='alpe' and field=='context':
                claim=e[field].split('. ')[0]+'.' if n=='911' else 'La NEP 912 concerne une mission de six exercices dans les petites entreprises.'
            for sid in [f'h2a-nep-{n}',f'dila-a821-{nep_article[n]}']:
                unit(e,field,claim,sid,[citation(sid,num,n) for num in numbers],suffix=f'-nep-{n}')
    if e['id']=='alpe':
        e['motsSources'].update({'cncc-nep-911':'NEP 911','cncc-nep-912':'NEP 912','cncc-alpe':'ALPE'})
        for sid in ['cncc-nep-911','cncc-nep-912']:
            text=Path(evidence[sid]['snapshotPath']).read_text().splitlines()[2]
            unit(e,'context',e['context'].split('. ')[-1],sid,[exact(sid,text,'attestation-homologation')])
        sid='cncc-alpe'; quote='ALPE (Audit Légal des Petites Entreprises), représente 3300'
        unit(e,'definition','ALPE signifie audit légal des petites entreprises.',sid,[exact(sid,quote,'acronyme-historique')])
        units[-1]['type']='professionnelle-terminologie'; units[-1]['regime']='CNCC septembre 2022 : acronymie uniquement, aucun seuil ni nombre de mandats repris dans l’entrée.'
    for field in ['exampleFictitious','automationBoundary']: unit(e,field,e[field])
future=[('/blog/automatiser-un-cabinet-cac-la-carte-des-taches',[e['id'] for e in entries]),('/blog/cac-lettre-affirmation-preparation',['declarations-ecrites-direction']),('/blog/cac-declarations-direction-lettre',['declarations-ecrites-direction']),('/blog/cac-memos-synthese-renvois',['dossier-travail-audit','rapport-sur-comptes']),('/blog/cac-projet-rapport-opinion-en-blanc',['rapport-sur-comptes']),('/blog/cac-feuille-maitresse-exemple',['feuille-maitresse-audit']),('/blog/cac-referencement-dossier',['dossier-travail-audit']),('/blog/cac-contributions-dossier-preservation',['dossier-travail-audit']),('/blog/cac-dossier-travail-permanent',['dossier-permanent-audit','dossier-travail-audit']),('/blog/cac-dossier-constitution-soixante-jours',['dossier-travail-audit']),('/outils-comptables-gratuits/feuilles-maitresses-audit',['feuille-maitresse-audit']),('/automatisation/dossier-travail-cac',['dossier-travail-audit'])]
architecture=Path('docs/strategy/site-v3/cac/ARCHITECTURE-CAC.md').read_text()
for href,ids in future:
    assert href in architecture
    if href.startswith('/blog/'): assert not Path('src/content'+href+'.md').exists()
existing=re.findall(r"anchor: '([^']+)'",Path('src/data/glossary.ts').read_text()); assert not set(existing)&{e['anchor'] for e in entries}
pack={'schemaVersion':1,'lot':'cac-audit-4','canonical':'/glossaire','preparedAt':now(),'baselineMain':'f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f','entries':entries,'sources':sources,'evidence':{'sources':evidence,'units':units},'linkChecks':link_checks,'deferredLinks':[{'entryIds':ids,'href':href,'reason':'Destination ARCHITECTURE-CAC différée ; réutiliser le propriétaire existant et promouvoir après contrôle de publication.'} for href,ids in future],'aliases':{'lettre d’affirmation':'declarations-ecrites-direction','dossier de travail':'dossier-travail-audit'},'compatibility':{'entryShape':'GlossaryEntry','sourceShape':'GlossarySource','dateExtensionRequired':[day(now())],'note':'Étendre sourceCheckedAt avec la date de préparation à l’intégration groupée ; ne pas redater la collecte DILA.','globalFilesModified':False},'review':{'status':'pending','taskId':'t_bf6cb3b3','publicationAuthorized':False}}
save(PACKAGE,pack)
excerpts=['# Extraits exacts, lot CAC 4','','Rattachements proposés par l’auteur, sans verdict métier.','']
for u in units:
    excerpts.extend([f'## {u["id"]}','',u['text'],''])
    for c in u['citations']: excerpts.extend([f'Localisation : {c["locator"]}','',c['text'],''])
(BASE/'extraits.md').write_text('\n'.join(excerpts)+'\n')
shape="import type { GlossaryEntry, GlossarySource } from '../../../../src/data/glossary';\ntype CandidateEntry = Omit<GlossaryEntry, 'sourceCheckedAt'> & { sourceCheckedAt: GlossaryEntry['sourceCheckedAt'] | '2026-10-11' };\nconst data = "+json.dumps({'entries':entries,'sources':sources},ensure_ascii=False,indent=2)+" as const;\nconst entries: CandidateEntry[] = data.entries.map(e => ({ ...e, relatedTerms: [...e.relatedTerms], internalLinks: [...e.internalLinks], sourceIds: [...e.sourceIds] }));\nconst sources: Record<string, GlossarySource> = data.sources;\nvoid entries; void sources;\n"
(BASE/'shape-check.ts').write_text(shape)
print(json.dumps({'entries':len(entries),'sources':len(sources),'units':len(units),'links':len(links),'deferredLinks':len(future),'existingAnchors':len(existing)},indent=2))
