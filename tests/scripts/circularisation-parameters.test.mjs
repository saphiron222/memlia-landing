import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../../src/lib/circularisation.mjs';
test('chosen reminder parameters are retained in all dossier exports',()=>{
 let s=c.demoSession();s=c.updateParameters(s,{reminderDelayDays:23,reminderAsOf:'2026-02-01'});
 assert.deepEqual(c.importSession(c.exportSession(s)).parameters,s.parameters);
 assert.match(c.exportCsv(s),/reminderDelayDays/);assert.match(c.printReport(s),/2026-02-01/);
 assert.throws(()=>c.updateParameters(s,{reminderDelayDays:0}),/Délai/);
});
