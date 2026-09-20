#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const LISTING_URL = 'https://www.compta-online.com/discussions-professionnel';
const WINDOW_DAYS = 31;
const NEED_PATTERN = /\b(?:automatis\w*|logiciel\w*|outil\w*|méthode\w*|methode\w*|chronophage\w*|temps|manquant\w*|missing|relan\w*|chasing|contrôl\w*|controls?|rapproch\w*|reconcil\w*|révision\w*|revision\w*|cleanup|clean-up|rework|redoing|duplicat\w*|cut-off|tva|factur\w*|invoice\w*|dsn|payroll|paie|fec|écriture\w*|ecriture\w*|pièce\w*|piece\w*|document\w*|receipt\w*)\b/i;
const QUESTION_PATTERN = /\?|\b(?:comment|quel|quelle|quels|quelles|votre|vos|besoin|difficulté|difficulte|how|what|why|anyone|your)\b/i;

export function cleanText(value) {
  return String(value ?? '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&eacute;/gi, 'é')
    .replace(/&agrave;/gi, 'à')
    .replace(/&ccedil;/gi, 'ç')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeQuestion(value) {
  return cleanText(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function isRelevantQuestion(title) {
  return NEED_PATTERN.test(title) && QUESTION_PATTERN.test(title);
}

export function qualifiesSignal({ occurrences, distinctContributors, distinctThreads, coveredByC1 }) {
  return occurrences >= 3
    && distinctContributors >= 3
    && distinctThreads >= 2
    && coveredByC1 === false;
}

export function isWithinWindow(date, now = new Date(), days = WINDOW_DAYS) {
  if (!date) return false;
  const measured = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(measured.getTime())) return false;
  const ageMs = now.getTime() - measured.getTime();
  return ageMs >= 0 && ageMs <= days * 86_400_000;
}

function parseFrenchDate(html) {
  const match = cleanText(html).match(/Ecrit le:\s*(\d{2})\/(\d{2})\/(\d{4})/i);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function parseListingLinks(html) {
  const links = [];
  const seen = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = new URL(match[1], LISTING_URL).href;
    const title = cleanText(match[2]);
    if (!/compta-online\.com\/.+-t\d+/i.test(href) || !title || seen.has(href)) continue;
    seen.add(href);
    links.push({ title, url: href });
  }
  return links;
}

export function decodeHtml(bytes, contentType = '') {
  const probe = new TextDecoder('windows-1252').decode(bytes.slice(0, 2_048));
  const declared = `${contentType} ${probe.match(/charset\s*=\s*["']?([^\s"';>]+)/i)?.[1] ?? ''}`.toLowerCase();
  const encoding = /(?:iso-8859-1|windows-1252|latin-1)/.test(declared) ? 'windows-1252' : 'utf-8';
  return new TextDecoder(encoding).decode(bytes);
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'cache-control': 'no-cache',
      'user-agent': 'MemliaQuestionWatch/1.0 (+https://memlia.fr)',
    },
    signal: AbortSignal.timeout(20_000),
  });
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { response, body: decodeHtml(bytes, response.headers.get('content-type') ?? '') };
}

function collectLast30Days(path, now) {
  if (!path) return { terrain: null, observations: [] };
  const report = JSON.parse(readFileSync(path, 'utf8'));
  const sourceStatus = report.source_status ?? {};
  const items = Object.values(report.items_by_source ?? {}).flat();
  const observations = items
    .filter((item) => isWithinWindow(item.published_at, now) && isRelevantQuestion(`${item.title ?? ''} ${item.body ?? ''}`))
    .map((item) => {
      const url = String(item.url ?? '');
      const contributors = new Set((item.metadata?.top_comments ?? []).map(({ author }) => author).filter(Boolean));
      return {
        question: cleanText(item.title),
        source: `last30days · ${item.source}${item.container ? ` · r/${item.container}` : ''}`,
        sourceItemId: createHash('sha256').update(url).digest('hex').slice(0, 16),
        url,
        publishedAt: item.published_at ?? null,
        httpStatus: 200,
        occurrenceCount: Math.max(1, contributors.size),
        distinctContributors: contributors.size || 1,
        distinctThreads: 1,
      };
    });
  return {
    terrain: {
      terrain: 'last30days · monde',
      status: Object.values(sourceStatus).some(({ state }) => !['ok', 'no-results'].includes(state)) ? 'partial' : 'ok',
      sourceStatus: Object.fromEntries(Object.entries(sourceStatus).map(([source, status]) => [source, status.state])),
      itemsScanned: items.length,
      relevantQuestions: observations.length,
    },
    observations,
  };
}

export async function collectQuestions({ now = new Date(), last30daysPath = null } = {}) {
  const generatedAt = now.toISOString();
  const result = {
    schemaVersion: 1,
    generatedAt,
    windowDays: WINDOW_DAYS,
    privacy: 'Titres, dates et URL seulement; aucun nom, pseudonyme, commentaire ou profil conservé.',
    threshold: {
      occurrences: 3,
      distinctContributors: 3,
      distinctThreads: 2,
      windowDays: WINDOW_DAYS,
      rule: 'Un accès nouveau exige trois occurrences, trois contributeurs distincts vérifiés transitoirement, au moins deux fils et aucune couverture C1.',
    },
    terrains: [],
    observations: [],
  };

  try {
    const listing = await fetchText(LISTING_URL);
    if (!listing.response.ok) throw new Error(`HTTP ${listing.response.status}`);
    const links = parseListingLinks(listing.body).slice(0, 40);
    const relevant = links.filter(({ title }) => isRelevantQuestion(title));
    const details = await Promise.all(relevant.map(async (entry) => {
      try {
        const page = await fetchText(entry.url);
        return {
          question: entry.title.replace(/\s+/g, ' ').trim(),
          source: 'Compta Online · forum professionnel',
          sourceItemId: createHash('sha256').update(entry.url).digest('hex').slice(0, 16),
          url: entry.url,
          publishedAt: page.response.ok ? parseFrenchDate(page.body) : null,
          httpStatus: page.response.status,
        };
      } catch {
        return { question: entry.title, source: 'Compta Online · forum professionnel', sourceItemId: createHash('sha256').update(entry.url).digest('hex').slice(0, 16), url: entry.url, publishedAt: null, httpStatus: 0 };
      }
    }));
    const freshDetails = details.filter(({ publishedAt }) => isWithinWindow(publishedAt, now));
    result.terrains.push({ terrain: 'Compta Online', status: 'ok', listingHttpStatus: listing.response.status, itemsScanned: links.length, relevantQuestions: freshDetails.length, staleExcluded: details.length - freshDetails.length });
    result.observations.push(...freshDetails);
  } catch (error) {
    result.terrains.push({ terrain: 'Compta Online', status: 'source-inaccessible', error: error instanceof Error ? error.message : 'unknown' });
  }

  const worldwide = collectLast30Days(last30daysPath, now);
  if (worldwide.terrain) result.terrains.push(worldwide.terrain);
  result.observations.push(...worldwide.observations);

  return result;
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) {
  const value = (name) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.slice(name.length + 3) ?? null;
  const output = value('output');
  const report = await collectQuestions({ last30daysPath: value('last30days') });
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (output) writeFileSync(output, serialized);
  else process.stdout.write(serialized);
}
