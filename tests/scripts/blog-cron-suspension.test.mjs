import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BLOG_CRONS, verifyBlogCronSuspension } from '../../scripts/verify-blog-cron-suspension.mjs';

const suspended = () => ({ jobs: Object.entries(BLOG_CRONS).map(([id, name]) => ({ id, name, enabled: false, state: 'paused', fire_claim: null })) });

test('le gel des cinq routines refuse une exécution active, revendiquée ou un doublon', () => {
  assert.deepEqual(verifyBlogCronSuspension(suspended()), []);
  for (const change of [
    (jobs) => { jobs[0].enabled = true; },
    (jobs) => { jobs[0].state = 'active'; },
    (jobs) => { jobs[0].fire_claim = { owner: 'worker' }; },
    (jobs) => { jobs.push({ ...jobs[0] }); },
    (jobs) => { jobs[0].id = 'autre'; },
  ]) {
    const data = suspended();
    change(data.jobs);
    assert.notDeepEqual(verifyBlogCronSuspension(data), []);
  }
  assert.throws(() => verifyBlogCronSuspension({}), /jobs absent/);
});
