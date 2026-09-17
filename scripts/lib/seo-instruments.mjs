/**
 * Couche d'instruments des crons SEO : ce qui lit le monde (sous-processus, réseau, git) et les
 * analyseurs purs de leurs sorties. Les analyseurs sont testés sur des fixtures prises sur les
 * sorties réelles du 17/09/2026 ; les lecteurs sont fins, ne décident rien et rendent toujours un
 * objet, jamais une exception : une mesure absente est écrite comme absente.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const CLAUDE_SEO = join(homedir(), '.claude/skills/seo/bin/claude-seo');
export const PYTHON_SEO = join(homedir(), '.claude/skills/seo/.venv/bin/python');
export const ORIGINE = 'https://memlia.fr';
export const UA_VERIFICATEUR = 'MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)';
export const UA_NAVIGATEUR = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 MemliaSeoCron/1.0';
export const CHEMIN_INDEXNOW = 'docs/strategy/site-v3/mesures/indexnow.json';

// ---------------------------------------------------------------- analyseurs purs

/** Lit le premier objet ou tableau JSON d'une sortie qui peut commencer par des lignes de texte. */
export function analyserSortieJson(texte) {
  const s = String(texte ?? '');
  const debut = s.search(/^[[{]/m);
  if (debut < 0) return null;
  try {
    return JSON.parse(s.slice(debut));
  } catch {
    const fin = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
    if (fin <= debut) return null;
    try {
      return JSON.parse(s.slice(debut, fin + 1));
    } catch {
      return null;
    }
  }
}

export function lireDerive({ sortie, code, url, commitBaseline = null }) {
  const json = analyserSortieJson(sortie);
  if (!json) {
    return { url, statut: 'erreur', message: String(sortie ?? '').trim().slice(0, 300) || `code de sortie ${code}`, commitBaseline };
  }
  if (json.error) {
    if (/no baseline/i.test(json.error)) return { url, statut: 'sans-baseline', commitBaseline: null, message: json.error };
    return { url, statut: 'erreur', message: String(json.error), commitBaseline };
  }
  const s = json.summary ?? {};
  const findings = (json.triggered_findings ?? []).map((f) => ({ rule: f.rule, severity: f.severity, message: f.message ?? '', ancien: f.old_value ?? null, nouveau: f.new_value ?? null }));
  const declenchees = Number(s.triggered ?? findings.length);
  return {
    url,
    statut: declenchees > 0 ? 'derive' : 'ok',
    critical: Number(s.critical ?? 0),
    warning: Number(s.warning ?? 0),
    info: Number(s.info ?? 0),
    findings,
    commitBaseline,
    baselineId: json.baseline_id ?? null,
  };
}

export function lirePsi(json, { url }) {
  const m = json?.psi?.mobile ?? json?.psi?.desktop ?? null;
  if (!json || !m) return { url, scores: null, labo: null, auditsEchoues: [], erreur: 'réponse vide de PageSpeed Insights' };
  if (m.error) return { url: m.url ?? url, scores: null, labo: null, auditsEchoues: [], erreur: String(m.error) };
  const s = m.lighthouse_scores ?? {};
  const lab = m.lab_metrics ?? {};
  const valeur = (cle) => (lab[cle] && lab[cle].value !== undefined && lab[cle].value !== null ? Number(lab[cle].value) : null);
  return {
    url: m.url ?? url,
    scores: {
      performance: s.performance ?? null,
      accessibility: s.accessibility ?? null,
      bestPractices: s['best-practices'] ?? null,
      seo: s.seo ?? null,
    },
    labo: {
      lcpMs: valeur('largest-contentful-paint'),
      cls: valeur('cumulative-layout-shift'),
      tbtMs: valeur('total-blocking-time'),
      fcpMs: valeur('first-contentful-paint'),
      speedIndexMs: valeur('speed-index'),
    },
    auditsEchoues: (m.failed_audits ?? []).map((a) => a?.id).filter(Boolean),
    erreur: null,
  };
}

export function lireSerpDataForSeo(reponse) {
  const tache = reponse?.tasks?.[0];
  if (!tache) return { ok: false, cout: 0, resultat: null, erreur: 'réponse sans tâche' };
  if (Number(tache.status_code) !== 20000) {
    return { ok: false, cout: Number(tache.cost ?? 0), resultat: null, erreur: `${tache.status_code} ${tache.status_message ?? ''}`.trim() };
  }
  return { ok: true, cout: Number(tache.cost ?? 0), resultat: tache.result?.[0] ?? null, erreur: null };
}

export function extraireLiensSitemap(xml) {
  return [...String(xml ?? '').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

export function cheminDepuisUrl(url) {
  const chemin = new URL(url).pathname;
  return chemin.length > 1 ? chemin.replace(/\/$/, '') : '/';
}

const MOIS_ANGLAIS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
const sansBalises = (html) => String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** Lit le tableau officiel des mises à jour de classement (developers.google.com/search/updates/ranking). */
export function lireMisesAJourGoogle(html) {
  const lignes = [];
  for (const rangee of String(html ?? '').matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cellules = [...rangee[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => sansBalises(m[1]));
    if (cellules.length < 2) continue;
    const m = cellules[1].match(/^(\d{1,2}) ([A-Za-z]{3})\w* (\d{4})$/);
    if (!m || !MOIS_ANGLAIS[m[2].toLowerCase()]) continue;
    let nom = cellules[0];
    const moitie = nom.slice(0, Math.floor(nom.length / 2)).trim();
    if (moitie && nom === `${moitie} ${moitie}`) nom = moitie;
    lignes.push({ nom, date: `${m[3]}-${MOIS_ANGLAIS[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`, duree: cellules[2] ?? '' });
  }
  return lignes;
}

export async function misesAJourGoogle() {
  const r = await chercherPage('https://developers.google.com/search/updates/ranking?hl=fr', { timeoutMs: 20_000 });
  if (!r.ok) return { ok: false, lignes: [], erreur: r.erreur ?? `HTTP ${r.status}` };
  const lignes = lireMisesAJourGoogle(r.corps);
  return { ok: lignes.length > 0, lignes, erreur: lignes.length ? null : 'tableau non reconnu' };
}

/** Seules les réponses textuelles ont un corps à lire ; un PDF ou une image se juge sur son statut. */
export function estTexte(contentType) {
  if (!contentType) return true;
  return /^(text\/|application\/(xhtml\+xml|xml|json|javascript|rss\+xml|atom\+xml))/i.test(String(contentType));
}

// ---------------------------------------------------------------- sous-processus

export function executer(commande, args, { timeoutMs = 120_000, cwd = process.cwd(), env = process.env, entree } = {}) {
  const r = spawnSync(commande, args, { encoding: 'utf8', timeout: timeoutMs, cwd, env, input: entree, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, sortie: r.stdout ?? '', erreur: r.stderr ?? '', signal: r.signal ?? null, echec: r.error?.message ?? null };
}

export const claudeSeo = (script, args = [], options = {}) => executer(CLAUDE_SEO, ['run', script, ...args], options);

export function gscPy(root, sousCommande, args = []) {
  const r = executer(PYTHON_SEO, [join(root, 'scripts/seo/gsc.py'), sousCommande, ...args], { timeoutMs: 600_000, cwd: root });
  return { ...r, json: analyserSortieJson(r.sortie) };
}

export function deriveComparer(url, { commitBaseline = null } = {}) {
  const r = claudeSeo('drift_compare.py', [url, '--skip-cwv'], { timeoutMs: 90_000 });
  return lireDerive({ sortie: r.sortie || r.erreur, code: r.code, url, commitBaseline });
}

export function derivePoser(url) {
  const r = claudeSeo('drift_baseline.py', [url, '--skip-cwv'], { timeoutMs: 90_000 });
  const json = analyserSortieJson(r.sortie);
  const ok = Boolean(json) && json.status === 'ok';
  return { url, ok, baselineId: json?.baseline_id ?? null, message: ok ? null : (r.erreur || r.sortie).trim().slice(0, 300) };
}

export function psiMobile(url) {
  const r = claudeSeo('pagespeed_check.py', [url, '--strategy', 'mobile', '--psi-only', '--json'], { timeoutMs: 180_000 });
  return lirePsi(analyserSortieJson(r.sortie), { url });
}

export function cruxOrigine(url) {
  const r = claudeSeo('pagespeed_check.py', [url, '--crux-only', '--json'], { timeoutMs: 60_000 });
  const json = analyserSortieJson(r.sortie);
  if (!json) return { disponible: false, message: 'réponse vide de CrUX' };
  if (json.error) return { disponible: false, message: String(json.error) };
  return { disponible: Object.keys(json.metrics ?? {}).length > 0, metriques: json.metrics ?? {}, periode: json.collection_period ?? null };
}

export function indexabiliteProduction(root) {
  const r = executer('node', [join(root, 'scripts/verify-production-indexability.mjs')], { timeoutMs: 120_000, cwd: root });
  const preuve = join(root, '.qa/indexation/production-indexability.json');
  let json = null;
  try {
    json = JSON.parse(readFileSync(preuve, 'utf8'));
  } catch {
    json = null;
  }
  return { passed: r.code === 0, message: r.code === 0 ? 'PASS' : (r.erreur || r.sortie).trim().slice(-400), preuve: json };
}

export function commitDistant(root) {
  const r = executer('git', ['ls-remote', '--quiet', 'origin', 'refs/heads/main'], { cwd: root, timeoutMs: 30_000 });
  const m = (r.sortie ?? '').match(/^([0-9a-f]{7,40})/);
  return m ? m[1].slice(0, 7) : null;
}

export function commitLocal(root) {
  const r = executer('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, timeoutMs: 10_000 });
  return r.code === 0 ? r.sortie.trim() : null;
}

// ---------------------------------------------------------------- réseau

export async function chercherPage(url, { ua = UA_NAVIGATEUR, timeoutMs = 25_000, suivre = true, maxRedirections = 5 } = {}) {
  const debut = Date.now();
  let courante = url;
  let redirections = 0;
  try {
    for (;;) {
      const r = await fetch(courante, {
        redirect: 'manual',
        headers: { 'User-Agent': ua, 'Cache-Control': 'no-cache', Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const brute = r.headers.get('location');
      const location = brute ? new URL(brute, courante).href : null;
      if (suivre && [301, 302, 303, 307, 308].includes(r.status) && location && redirections < maxRedirections) {
        courante = location;
        redirections += 1;
        continue;
      }
      const contentType = r.headers.get('content-type');
      if (!estTexte(contentType)) {
        await r.body?.cancel?.();
        return { ok: r.status === 200, status: r.status, location, finalUrl: courante, redirections, corps: '', corpsIgnore: true, dureeMs: Date.now() - debut, erreur: null, contentType };
      }
      const corps = await r.text();
      return { ok: r.status === 200, status: r.status, location, finalUrl: courante, redirections, corps, corpsIgnore: false, dureeMs: Date.now() - debut, erreur: null, contentType };
    }
  } catch (e) {
    const erreur = e?.name === 'TimeoutError' ? `délai dépassé (${timeoutMs} ms)` : (e?.cause?.message ?? e?.message ?? String(e));
    return { ok: false, status: 0, location: null, finalUrl: courante, redirections, corps: '', dureeMs: Date.now() - debut, erreur, contentType: null };
  }
}

export async function sitemapProduction({ url = `${ORIGINE}/sitemap-0.xml` } = {}) {
  const r = await chercherPage(url, { timeoutMs: 20_000 });
  return { ok: r.ok, urls: r.ok ? extraireLiensSitemap(r.corps) : [], status: r.status, erreur: r.erreur };
}

export async function pagesProduction(urls, { concurrence = 4, ua = UA_NAVIGATEUR } = {}) {
  const pages = {};
  const echecs = [];
  const file = [...urls];
  const travailleur = async () => {
    for (let u = file.shift(); u !== undefined; u = file.shift()) {
      const r = await chercherPage(u, { ua, timeoutMs: 25_000 });
      if (r.ok) pages[cheminDepuisUrl(u)] = r.corps;
      else echecs.push({ url: u, status: r.status, erreur: r.erreur });
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrence, urls.length || 1) }, travailleur));
  return { pages, echecs };
}

export async function serpDataForSeo(keyword, { locationCode = 2250, languageCode = 'fr', device = 'desktop', depth = 20, timeoutMs = 90_000 } = {}) {
  const login = process.env.DATAFORSEO_LOGIN || process.env.DATAFORSEO_USERNAME;
  const motDePasse = process.env.DATAFORSEO_PASSWORD;
  if (!login || !motDePasse) return { ok: false, cout: 0, resultat: null, erreur: 'identifiants DataForSEO absents de l’environnement' };
  const auth = Buffer.from(`${login}:${motDePasse}`).toString('base64');
  try {
    const r = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ keyword, location_code: locationCode, language_code: languageCode, device, os: device === 'desktop' ? 'windows' : 'android', depth }]),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return { ok: false, cout: 0, resultat: null, erreur: `HTTP ${r.status}` };
    return lireSerpDataForSeo(await r.json());
  } catch (e) {
    return { ok: false, cout: 0, resultat: null, erreur: e?.message ?? String(e) };
  }
}

export function porteDeCout(endpoint, count) {
  const r = claudeSeo('dataforseo_costs.py', ['check', endpoint, '--count', String(count)], { timeoutMs: 30_000 });
  const json = analyserSortieJson(r.sortie);
  return { statut: json?.status ?? 'inconnu', coutPrevu: json?.total_cost_usd ?? null, resteJour: json?.daily_remaining_usd ?? null, message: json ? null : (r.erreur || r.sortie).trim().slice(0, 200) };
}

export function journaliserCout(endpoint, cout) {
  const r = claudeSeo('dataforseo_costs.py', ['log', endpoint, String(cout)], { timeoutMs: 30_000 });
  return r.code === 0;
}

// ---------------------------------------------------------------- IndexNow

export function lireCleIndexNow(root) {
  const chemin = join(root, CHEMIN_INDEXNOW);
  if (!existsSync(chemin)) return null;
  try {
    const json = JSON.parse(readFileSync(chemin, 'utf8'));
    return json?.cle && json?.emplacement ? json : null;
  } catch {
    return null;
  }
}

export function indexNow(root, urls, { verifierSeulement = false } = {}) {
  const cle = lireCleIndexNow(root);
  if (!cle) return { ok: false, statut: 'non-configure', message: `clé IndexNow absente (${CHEMIN_INDEXNOW})`, json: null };
  if (!verifierSeulement && (!Array.isArray(urls) || urls.length === 0)) return { ok: true, statut: 'rien-a-envoyer', message: null, json: null };
  const args = ['--host', 'memlia.fr', '--key', cle.cle, '--key-location', cle.emplacement, '--json'];
  if (verifierSeulement) args.push('--verify-only');
  else args.push('--urls', ...urls);
  const r = claudeSeo('indexnow_submit.py', args, { timeoutMs: 60_000 });
  const json = analyserSortieJson(r.sortie);
  const ok = r.code === 0 && (json?.ok ?? true);
  return { ok, statut: ok ? (verifierSeulement ? 'verifie' : 'envoye') : 'echec', message: ok ? null : (r.erreur || r.sortie).trim().slice(0, 300), json };
}
