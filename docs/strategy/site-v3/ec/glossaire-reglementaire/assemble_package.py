"""Assemble les preuves sans produire de verdict métier."""
import datetime as dt
import hashlib
import json
from pathlib import Path
import re

ROOT = Path('docs/strategy/site-v3/ec/glossaire-reglementaire')
entries = json.loads((ROOT/'entries.json').read_text())
sources = json.loads((ROOT/'sources.json').read_text())
texts = {s['id']:(ROOT/s['snapshotPath']).read_text() for s in sources}

def paragraph(sid, needle):
    blocks = texts[sid].split('\n\n')
    return next(b for b in blocks if needle in b)

def section(sid, start, end):
    text = texts[sid]
    pos = text.index(start)
    return text[pos:text.index(end,pos+len(start))].strip()

quotes = {
 'ia-definition':('eurlex-consolide',paragraph('eurlex-consolide','«maîtrise de l’IA»')),
 'ia-measures':('eurlex-consolide',paragraph('eurlex-consolide','Cette obligation ne contraint')),
 'ia-modification':('eurlex-modificatif',paragraph('eurlex-modificatif',"L'article\u00a04 est remplacé")),
 'human-control':('eurlex-consolide',section('eurlex-consolide','Article\u00a014\n','Article\u00a015\n')),
 'human-original':('eurlex-original',paragraph('eurlex-original','La conception et le développement des systèmes d’IA à\u00a0haut risque permettent')),
 'ia-calendar':('eurlex-consolide',section('eurlex-consolide','Article\u00a0113\n','ANNEXE\u00a0I\n')),
 'human-calendar-amendment':('eurlex-modificatif',paragraph('eurlex-modificatif','du 2\u00a0décembre 2027 en ce qui concerne')+'\n\n'+paragraph('eurlex-modificatif','du 2\u00a0août 2028 en ce qui concerne')),
 'mission-contract':('legi-mission',paragraph('legi-mission',"Les personnes mentionnées à l'article 141 passent")),
 'mission-all':('legi-mission',section('legi-mission','## Article 151\n','Voir les versions\n')),
 'mission-form':('legi-mission',paragraph('legi-mission',"Ce contrat, qui peut prendre la forme d'une lettre de mission")),
 'mission-rules':('legi-mission',paragraph('legi-mission','Ce contrat fait référence aux règles professionnelles')),
 'mission-version':('legi-mission',paragraph('legi-mission','Version en vigueur depuis le 01/01/2023')),
 'invoice-definition':('dgfip-definition',section('dgfip-definition','Non,','Cette réponse vous')),
 'invoice-scope':('legi-cgi',paragraph('legi-cgi',"I. - Pour l'application de l'article 289")),
 'invoice-platform':('legi-cgi',paragraph('legi-cgi',"L'émission, la transmission et la réception des factures électroniques s'effectuent en recourant")),
 'invoice-cgi':('legi-cgi',section('legi-cgi',"I. - Pour l'application de l'article 289",'II. - (Abrogé).')),
 'invoice-calendar':('dgfip-calendrier',section('dgfip-calendrier','La mise en œuvre','Cette réponse vous')),
 'invoice-format':('dgfip-perimetre',section('dgfip-perimetre','### Qu’est-ce-qu’une facture électronique ?','### Comment vais-je')),
 'invoice-reporting':('dgfip-perimetre',section('dgfip-perimetre','### Qu’est-ce que la réforme ?','### Quels sont les objectifs')),
}
# Tous les extraits doivent déjà appartenir exactement à une copie ; pas de traduction ou reconstruction.
for name,(sid,q) in quotes.items():
    assert q in texts[sid], name

mapping = {
 'supervision-humaine': {'definition':['human-control','human-original'], 'context':['ia-calendar','human-calendar-amendment'], 'commonConfusion':['human-control']},
 'maitrise-de-l-ia': {'definition':['ia-definition','ia-measures'], 'context':['ia-calendar','ia-measures','ia-modification'], 'commonConfusion':['ia-measures']},
 'lettre-de-mission': {'definition':['mission-contract','mission-rules','mission-form'], 'context':['mission-contract','mission-form','mission-version'], 'commonConfusion':['mission-contract','mission-form']},
 'facture-electronique-et-plateforme-agreee': {'definition':['invoice-definition','invoice-scope','invoice-platform'], 'context':['invoice-scope','invoice-platform','invoice-calendar','invoice-reporting'], 'commonConfusion':['invoice-definition','invoice-format','invoice-calendar']},
}
claims=[]
atomic = {
 'supervision-humaine': {
  'definition': [['human-control'],['human-control']],
  'context': [['human-control'],['ia-calendar'],['ia-calendar']],
  'commonConfusion': [[],['human-control'],[]],
 },
 'maitrise-de-l-ia': {
  'definition': [['ia-definition'],['ia-measures']],
  'context': [['ia-calendar'],['ia-modification'],['ia-measures']],
  'commonConfusion': [[],['ia-measures'],[]],
 },
 'lettre-de-mission': {
  'definition': [['mission-all'],['mission-all'],['mission-all']],
  'context': [['mission-all'],['mission-all'],[]],
  'commonConfusion': [[],['mission-all'],['mission-all']],
 },
 'facture-electronique-et-plateforme-agreee': {
  'definition': [['invoice-definition'],['invoice-definition'],['invoice-definition']],
  'context': [['invoice-cgi'],['invoice-calendar'],['invoice-reporting']],
  'exampleFictitious': [[],['invoice-calendar'],['invoice-definition']],
  'commonConfusion': [['invoice-definition'],['invoice-format'],['invoice-calendar']],
 },
}
for e in entries:
    for field in ['definition','context','exampleFictitious','commonConfusion','automationBoundary']:
        sentences = re.split(r'(?<=[.!?]) ', e[field]) if field in atomic[e['id']] else [e[field]]
        keys_by_sentence = atomic[e['id']].get(field,[[]])
        assert len(sentences) == len(keys_by_sentence), (e['id'],field,sentences)
        for index,(sentence,keys) in enumerate(zip(sentences,keys_by_sentence),1):
            for key in keys:
                sid,quote=quotes[key]
                claims.append({'id':f"{e['id']}.{field}.{index}.{key}",'entryId':e['id'],'field':field,'fieldText':e[field],'claim':sentence,'claimType':'fiscal' if e['id'].startswith('facture') else 'legal-reglementaire','sourceId':sid,'excerpt':quote,'locator':key,'reviewVerdict':None,'reason':'Proposition de lecture à juger indépendamment par couple affirmation/source ; une seconde source peut compléter une composante, sans verdict prérempli ni promesse de conformité.'})
            if not keys:
                claims.append({'id':f"{e['id']}.{field}.{index}.editorial",'entryId':e['id'],'field':field,'fieldText':e[field],'claim':sentence,'claimType':'information' if field=='exampleFictitious' else 'editorial-memlia','sourceId':None,'excerpt':None,'reviewVerdict':None,'reason':'Cas entièrement fictif, précision pédagogique ou frontière de préparation/décision du service Memlia ; pas une obligation légale universelle, une mesure de résultat ou une certification. Les clauses réglementaires du champ ont leurs couples de preuve distincts.'})
(ROOT/'claims.json').write_text(json.dumps(claims,ensure_ascii=False,indent=2)+'\n')

observations=json.loads((ROOT/'article-observations.json').read_text())
admissions=[]
for e in entries:
    served=[]
    for link in e['internalLinks']:
        article=next(a for a in observations['served'] if a['href']==link['href'])
        usage=article['usages'][e['id']]
        assert usage and 'introuvable' not in article['title'].lower()
        served.append({'href':link['href'],'title':article['title'],'httpStatus':None,'accessMode':'web-extract','accessSuccessful':True,'termUsageVerified':True,'snapshotPath':article['snapshotPath'],'checkedAt':article['checkedAt'],'usages':usage})
    reason = 'L’article publié emploie explicitement « lettre de mission » dans la carte et le paragraphe juridique ; le lien futur spécialisé n’est pas utilisé.' if e['id']=='lettre-de-mission' else 'Deux articles publiés emploient « facture électronique » ; la plateforme agréée est définie ici comme le canal de ce même dispositif. Pas de prétention que les articles emploient déjà le terme composé entier ou décrivent son calendrier.' if e['id'].startswith('facture') else 'Aucun des seize articles servis examinés n’emploie ce terme. Les articles AI Act prévus par le plan rendent une page introuvable ; conserver la définition préparée sans l’admettre à la publication.'
    admissions.append({'entryId':e['id'],'decision':'admissible' if served else 'deferred-no-published-article','reason':reason,'servedLinks':served})
(ROOT/'admission.json').write_text(json.dumps({'canonical':'/glossaire','entries':admissions,'futureLinks':observations['future'],'articlesExamined':len(observations['served']),'reviewRequired':True},ensure_ascii=False,indent=2)+'\n')

for s in sources:
    s['contentSha256']=hashlib.sha256((ROOT/s['snapshotPath']).read_bytes()).hexdigest()
    s['version']='27 juillet 2026 (outil documentaire ; actes JO faisant foi)' if s['id']=='eurlex-consolide' else '8 juillet 2026, JO du 24 juillet 2026' if s['id']=='eurlex-modificatif' else '13 juin 2024, JO du 12 juillet 2024' if s['id']=='eurlex-original' else 'Depuis le 1er janvier 2023 ; données du décret mises à jour le 1er juillet 2025' if s['id']=='legi-mission' else 'Depuis le 21 février 2026, LEGIARTI000053546660 ; abrogation différée et maintien transitoire indiqués sur la page' if s['id']=='legi-cgi' else 'Date de page conservée dans la copie DGFiP'
(ROOT/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n')

lines=['# Table affirmation / extrait exact / source','', 'Chaque ligne correspond à un couple à revoir. Les exemples et conventions Memlia sont séparés des obligations réglementaires. Aucun verdict métier acquis.','']
for c in claims:
    lines += ['## '+c['id'], '','Champ : '+c['field']+' — type : '+c['claimType'],'','Affirmation : '+c['claim'],'']
    if c['sourceId']:
        s=next(s for s in sources if s['id']==c['sourceId'])
        lines += ['Source : '+s['url'],'Copie : '+s['snapshotPath']+' ; ouverture : '+s['checkedAt'],'','Extrait exact :','','```text',c['excerpt'],'```','']
    else: lines += ['Origine : '+c['reason'],'']
(ROOT/'affirmations-sources.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'entries':len(entries),'definitionWords':{e['id']:len(e['definition'].split()) for e in entries},'sources':len(sources),'evidencePairs':len(claims),'admitted':[a['entryId'] for a in admissions if a['decision']=='admissible']},ensure_ascii=False,indent=2))
