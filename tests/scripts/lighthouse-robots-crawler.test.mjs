import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import RobotsAudit from 'lighthouse/core/audits/seo/robots-txt.js';
import defaultConfig from 'lighthouse/core/config/default-config.js';
import { initializeConfig } from 'lighthouse/core/config/config.js';
import CrawlerRobots, { withRobotsCrawler } from '../../scripts/lib/lighthouse-robots-crawler.mjs';

test('la configuration Lighthouse conserve dans le companion la collecte utilisée par l’audit natif', async () => {
  let status = 200;
  const body = 'User-agent: *\nAllow: /\n';
  let requests = 0;
  const server = createServer((request, response) => {
    assert.equal(request.url, '/robots.txt');
    requests++;
    response.writeHead(status, {'Content-Type': 'text/plain'});
    response.end(body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/robots.txt`;
  const context = {baseArtifacts: {URL: {finalDisplayedUrl: `${url}?private=123`}}};
  try {
    const crawler = new CrawlerRobots();
    const {resolvedConfig} = await initializeConfig('navigation', withRobotsCrawler(defaultConfig, crawler));
    const used = resolvedConfig.artifacts.find(artifact => artifact.id === 'RobotsTxt').gatherer.instance;
    for (const expectedStatus of [200, 503]) {
      status = expectedStatus;
      const artifact = await used.getArtifact(context);
      const companion = JSON.parse(JSON.stringify({robotsEvidence: crawler.evidence}));
      assert.ok(companion.robotsEvidence, 'le companion ne doit pas rester vide après la collecte Lighthouse');
      assert.equal(companion.robotsEvidence.url, url);
      assert.equal(companion.robotsEvidence.finalUrl, url);
      assert.ok(Number.isFinite(Date.parse(companion.robotsEvidence.fetchedAt)));
      assert.deepEqual(companion.robotsEvidence.artifact, artifact);
      assert.deepEqual(artifact, {status: expectedStatus, content: body});
      assert.equal(RobotsAudit.audit({RobotsTxt: artifact}).score, expectedStatus === 200 ? 1 : 0);
    }
    assert.equal(requests, 2, 'aucun second GET de remplacement pour le companion');
    assert.equal(withRobotsCrawler(defaultConfig, null).artifacts.find(a => a.id === 'RobotsTxt'),
      defaultConfig.artifacts.find(a => a.id === 'RobotsTxt'));
    const {resolvedConfig: nativeConfig} = await initializeConfig('navigation', defaultConfig);
    assert.deepEqual(resolvedConfig.categories, nativeConfig.categories);
    assert.deepEqual(resolvedConfig.settings, nativeConfig.settings);
    assert.ok(resolvedConfig.audits.some(a => a.implementation === RobotsAudit));
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('le collecteur hors document lit le robots réel sans query, sans cookie et sans modifier l’audit', async () => {
  let body = 'User-agent: *\nAllow: /\n';
  let status = 200;
  const requests = [];
  const server = createServer((request,response) => {requests.push({url:request.url,headers:request.headers}); response.writeHead(status,{'Content-Type':'text/plain'});response.end(body);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const gatherer = new CrawlerRobots();
  const context = {baseArtifacts:{URL:{finalDisplayedUrl:`http://127.0.0.1:${server.address().port}/roi?private=123`}}};
  try {
    const valid = await gatherer.getArtifact(context);
    assert.equal(valid.content, body);assert.equal(RobotsAudit.audit({RobotsTxt:valid}).score,1);
    body = 'Unknown-directive: invalid\n';
    assert.equal(RobotsAudit.audit({RobotsTxt:await gatherer.getArtifact(context)}).score,0);
    status = 503;
    assert.equal(RobotsAudit.audit({RobotsTxt:await gatherer.getArtifact(context)}).score,0);
    assert.ok(requests.every(r=>r.url === '/robots.txt' && !r.headers.cookie && r.headers['cache-control'] === 'no-cache'));
  } finally {await new Promise(resolve=>server.close(resolve));}
});
test('le collecteur ferme sur échec réseau, sans artefact vert de remplacement', async () => {
  const gatherer = new CrawlerRobots();
  const artifact = await gatherer.getArtifact({baseArtifacts:{URL:{finalDisplayedUrl:'http://127.0.0.1:1/roi'}}});
  assert.equal(artifact.status,null); assert.equal(artifact.content,null);assert.ok(artifact.errorMessage);
  assert.equal(RobotsAudit.audit({RobotsTxt:artifact}).score,0);
});
