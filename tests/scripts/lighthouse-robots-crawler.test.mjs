import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import RobotsAudit from 'lighthouse/core/audits/seo/robots-txt.js';
import CrawlerRobots from '../../scripts/lib/lighthouse-robots-crawler.mjs';

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
