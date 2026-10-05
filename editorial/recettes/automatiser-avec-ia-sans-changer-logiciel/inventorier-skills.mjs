import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {BLOG_SKILLS,SEO_SKILLS} from '../../../scripts/lib/blog-pipeline.mjs';
const dir=new URL('./',import.meta.url);
const catalog=JSON.parse(readFileSync('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_7Dgi1jVRAzt84MLuxAmcdtA7.txt','utf8'));
writeFileSync(new URL('catalogue-hermes.json',dir),JSON.stringify(catalog,null,2));
const names=[...new Set(['blog','seo',...BLOG_SKILLS,...SEO_SKILLS,...catalog.skills.filter(x=>/^(blog|seo)-/.test(x.name)).map(x=>x.name), 'seo-ahrefs','seo-bing','seo-profound','seo-seranking','seo-unlighthouse'])].sort();
const reads=names.map(skill=>{const path='/Users/kevinkitanga/hermes/packs/memlia-skills/'+skill+'/SKILL.md';if(!existsSync(path))throw Error(path);const content=readFileSync(path,'utf8');return {skill,path,sha256:createHash('sha256').update(content).digest('hex'),content};});
writeFileSync(new URL('lectures-skills.json',dir),JSON.stringify(reads,null,2));
for(const r of reads){console.log('\n'+r.skill+' '+r.path+'\n'+r.content.split('\n').filter(x=>/^(#|[0-9]+\.|- |\|.*(Critical|Source|Schema|Intent|Read|Verify|Score|Technical|Content|Apply|Step|Pillar))/.test(x)).join('\n').slice(0,4200));}
console.log(JSON.stringify({union:names.length,blog:BLOG_SKILLS.length,seo:SEO_SKILLS.length,catalogue:catalog.skills.filter(x=>names.includes(x.name)).length}));
