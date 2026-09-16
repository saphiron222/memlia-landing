#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';
import { ADOPTION_PATH, PUBLISHED_BLOG_COMMIT, PUBLISHED_BLOG_HASHES, dossierFiles, sha256 } from './lib/blog-published-authority.mjs';

// Migration locale rejouable : aucun fetch, aucune génération ni nouvelle revue métier.
const writeJson = (path, value) => { mkdirSync(dirname(path), {recursive:true}); writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`); };
const units = (markdown) => markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim()
  .replace(/<!--[\s\S]*?-->/g, '').split(/\r?\n\s*\r?\n/).map((s)=>s.trim()).filter(Boolean)
  .map((s)=>s.replace(/^#{1,6}\s+/, '').replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[`*_~]/g,'').replace(/\s+/g,' ').trim())
  .map((text)=>({id:`unit-${sha256(text).slice(0,12)}`,text}));
for (const [slug, expected] of Object.entries(PUBLISHED_BLOG_HASHES)) {
  const dossier = join('editorial/articles',slug);
  const path = `src/content/blog/${slug}.md`;
  const bytes = readFileSync(path);
  if (sha256(bytes)!==expected || !bytes.equals(execFileSync('git',['show',`${PUBLISHED_BLOG_COMMIT}:${path}`]))) throw new Error(`Article non autoritaire : ${slug}`);
  const markdown = bytes.toString();
  const fm = parse(markdown.match(/^---\n([\s\S]*?)\n---/)[1]);
  const originalsDir = join(dossier,'preuves/inherited');
  if (!existsSync(originalsDir)) {
    const jsonPaths = dossierFiles(dossier).filter((p)=>p.endsWith('.json'));
    for (const p of jsonPaths) { const out=join(originalsDir,p); mkdirSync(dirname(out),{recursive:true}); writeFileSync(out,readFileSync(join(dossier,p))); }
  }
  const original = (p) => JSON.parse(readFileSync(join(originalsDir,p)));
  const manifest=original('manifest.json');
  manifest.editorialStatus=fm.statutEditorial;
  manifest.updatedAt=fm.dateMiseAJour;
  manifest.proofRequired=fm.proofRequired;
  manifest.reviewRule=fm.reviewRule;
  manifest.evidenceVerifiedAt=manifest.sourcesVerifiedAt;
  manifest.sourcesVerifiedAt=fm.sourcesVerifieesLe;
  manifest.publicationEvidence=ADOPTION_PATH;
  manifest.sources=manifest.sources.map((s)=>({...s,publishedCheckedAt:fm.sources.find((r)=>r.url===s.url).consulte}));
  manifest.businessReview.evidence='preuves/published-non-attestation.json';
  // Les approbations historiques restent historiques, aucune autorisation nouvelle.
  manifest.kevin.productionApproved=false;
  writeJson(join(dossier,'manifest.json'),manifest);
  const manifestHash=sha256(readFileSync(join(dossier,'manifest.json')));
  const adoptedEvidence=[];
  for (const p of dossierFiles(originalsDir)) {
    if (!p.endsWith('.json') || p==='manifest.json') continue;
    const value=original(p);
    const originalPath=`preuves/inherited/${p}`;
    const provenance={originalPath,originalSha256:sha256(readFileSync(join(dossier,originalPath))),adoptedBy:'marketing',mode:'published-preservation',newExecution:false};
    const rebind=(item)=> {
      if (!item || typeof item!=='object') return;
      for (const [key,child] of Object.entries(item)) {
        if (key==='articleSha256') item[key]=expected;
        else if (key==='manifestSha256') item[key]=manifestHash;
        else rebind(child);
      }
    };
    rebind(value);
    value.adoption=provenance;
    if (p==='claims.json') {
      const actual=units(markdown);
      const previous=value.contentUnits;
      const lookup=new Map();
      value.contentUnits=actual.map((u)=>{
        const old=previous.find((o)=>o.text===u.text || o.text.replaceAll('13 septembre 2026','15 septembre 2026')===u.text);
        if (old) lookup.set(old.id,u.id);
        return {...u,claimIds:old?.claimIds??[],...(!old?{editorialNotice:true,provenance:'published-article-939464c'}:{})};
      });
      for (const claim of value.claims) {
        if (!lookup.has(claim.unitId)) throw new Error(`Claim sans unité migrable ${slug}/${claim.id}`);
        claim.unitId=lookup.get(claim.unitId);
      }
    }
    writeJson(join(dossier,p),value);
    adoptedEvidence.push({path:p,originalPath,originalSha256:provenance.originalSha256});
  }
  writeJson(join(dossier,'preuves/published-non-attestation.json'),{
    version:1,candidateSlug:slug,articleSha256:expected,manifestSha256:manifestHash,
    kind:'published-non-attestation',status:'PASS',checkedAt:manifest.evidenceVerifiedAt,
    observations:['La revue métier historique reste PENDING ; le commit public déclare explicitement le contenu non attesté. Ce reçu constate cette limite, ne vaut ni revue métier ni autorisation.'],
    businessAttestation:false,publicationAuthorized:false,
    publicationCommit:PUBLISHED_BLOG_COMMIT,publishedStateObservedAt:new Date().toISOString(),
  });
  const files=dossierFiles(dossier).filter((p)=>p!==ADOPTION_PATH).map((p)=>{
    const bytes=readFileSync(join(dossier,p));return {path:p,bytes:bytes.length,sha256:sha256(bytes)};
  });
  writeJson(join(dossier,ADOPTION_PATH),{
    version:1,kind:'published-dossier-adoption',candidateSlug:slug,commit:PUBLISHED_BLOG_COMMIT,
    articleSha256:expected,adoptedBy:'marketing',adoptedAt:new Date().toISOString(),
    publicationAuthorized:false,newSourceFetch:false,businessAttestation:false,
    evidenceVerifiedAt:manifest.evidenceVerifiedAt,publishedSourceReviewDate:manifest.sourcesVerifiedAt,
    limitation:'Les reçus conservés datent du 13 septembre. La relecture au 15 est déclarée dans le commit publié ; cet audit conserve ses octets sans prétendre apporter une nouvelle preuve réseau ni un fact-check frais. Les évaluations héritées restent historiques.',
    adoptedEvidence,files,
  });
  console.log(`${slug}: article exact, ${files.length} fichiers scellés ; preuves héritées datées du ${manifest.evidenceVerifiedAt}, aucune nouvelle publication.`);
}
