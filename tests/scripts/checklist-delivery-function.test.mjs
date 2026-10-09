import {test} from 'node:test';
import assert from 'node:assert/strict';
import {onRequestGet,onRequestHead} from '../../functions/outils-comptables-gratuits/checklist-pieces-comptables.js';
import * as delivery from '../../functions/outils-comptables-gratuits/calculateur-roi-automatisation.js';

test('checklist uses the proven anti-beacon GET/HEAD delivery without reading inputs',()=>{
  assert.equal(onRequestGet,delivery.onRequestGet);
  assert.equal(onRequestHead,delivery.onRequestHead);
});
