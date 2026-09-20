#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const LISTING_URL = 'https://www.compta-online.com/discussions-professionnel';
const WINDOW_DAYS = 31;
const NEED_PATTERN = /\b(?:automatis\w*|logiciel\w*|outil\w*|méthode\w*|methode\w*|chronophage\w*|temps|manquant\w*|relan\w*|contrôl\w*|control\w*|rapproch\w*|révision\w*|revision\w*|cut-off|tva|factur\w*|dsn|paie|fec|écriture\w*|ecriture\w*|pièce\w*|piece\w*)\b/i;
const QUESTION_PATTERN = /\?|\b(?:comment|quel|quelle|quels|quelles|votre|vos|besoin|difficulté|difficulte)\b/i;

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

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'cache-control': 'no-cache',
      'user-agent': 'MemliaQuestionWatch/1.0 (+https://memlia.fr)',
    },
    signal: AbortSignal.timeout(20_000),
  });
  return { response, body: await response.text() };
}

export async function collectQuestions() {
  const generatedAt = new Date().toISOString();
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
    result.terrains.push({ terrain: 'Compta Online', status: 'ok', listingHttpStatus: listing.response.status, itemsScanned: links.length, relevantQuestions: details.length });
    result.observations.push(...details);
  } catch (error) {
    result.terrains.push({ terrain: 'Compta Online', status: 'source-inaccessible', error: error instanceof Error ? error.message : 'unknown' });
  }

  return result;
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) {
  console.log(JSON.stringify(await collectQuestions(), null, 2));
}
