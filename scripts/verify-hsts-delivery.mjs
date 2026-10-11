#!/usr/bin/env node
// Contrat HTTP réel : Pages local avec Host canonique, puis production après fusion.
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';

const origin = new URL(process.argv[2] || 'https://memlia.fr');
const local = origin.hostname === '127.0.0.1' || origin.hostname === 'localhost';
const baseline = process.argv.includes('--baseline');
const paths = ['/', '/contact', '/outils-comptables-gratuits/generateur-prompt-ia-gratuit', '/outils-comptables-gratuits/calculateur-roi-automatisation', '/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec', '/blog/automatiser-avec-ia-sans-changer-logiciel', '/hsts-contract-404'];

function probe(url, method, host) {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http;
    const req = transport.request(url, {method, headers: host ? {Host: host} : {}}, response => {
      response.resume();
      response.on('end', () => resolve({status: response.statusCode, headers: response.headers}));
    });
    req.setTimeout(20000, () => req.destroy(new Error(`Timeout ${method} ${url}`)));
    req.on('error', reject);
    req.end();
  });
}

for (const path of paths) {
  for (const method of ['GET', 'HEAD']) {
    const result = await probe(new URL(path, origin), method, local ? 'memlia.fr' : undefined);
    console.log(JSON.stringify({method, path, ...result}));
    assert.equal(result.headers['strict-transport-security'], baseline ? undefined : 'max-age=31536000');
    assert.equal(result.status, path === '/hsts-contract-404' ? 404 : 200);
    if (path === '/contact') assert.match(result.headers['content-security-policy'], /https:\/\/challenges\.cloudflare\.com/);
    if (path.startsWith('/outils-comptables-gratuits/')) assert.match(result.headers['content-security-policy'], /connect-src 'none'/);
  }
}
if (local) {
  for (const host of ['preview.memlia.pages.dev', 'localhost', 'www.memlia.fr']) {
    for (const path of ['/', '/outils-comptables-gratuits/calculateur-roi-automatisation']) {
      const result = await probe(new URL(path, origin), 'HEAD', host);
      assert.equal(result.headers['strict-transport-security'], undefined);
      console.log(JSON.stringify({host, path, status: result.status, hsts: null}));
    }
  }
} else {
  for (const url of ['http://memlia.fr/', 'http://www.memlia.fr/', 'https://www.memlia.fr/']) {
    const result = await probe(new URL(url), 'HEAD');
    console.log(JSON.stringify({url, ...result}));
    assert.ok([301, 308].includes(result.status));
    assert.equal(new URL(result.headers.location).protocol, 'https:');
  }
}
console.log(`HSTS ${baseline ? 'baseline (absence)' : 'delivery'} PASS`);
