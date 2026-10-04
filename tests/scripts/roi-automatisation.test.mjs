import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi, buildRoiReport, roiCsv, parseRoiValue, ROI_FIELDS } from '../../src/lib/roi-automatisation.mjs';
const nominal = { V:100, t:12, p:50, a:80, c:1, H:40, I:1000, M:50, E:200, d:0, n:12 };
test('borne cash exacte : avant, à et après dix mois, moteur et exports', () => {
  // Integer cents × hundredths of months: independent of floating payback division.
  const scenarios = [999,1000,1001].map(months => ({...nominal,I:1,M:0.9,E:1,d:0,n:months/100}));
  const report = buildRoiReport(scenarios);
  for (const [index,months] of [999,1000,1001].entries()) {
    const expected = months*(100-90) >= 100*100;
    const scenario = report.scenarios[index];
    assert.equal(scenario.results.withinHorizon,expected);
    assert.match(scenario.display.payback,expected ? /dans l’horizon/ : /hors l’horizon/);
    assert.equal(JSON.parse(JSON.stringify(report)).scenarios[index].results.withinHorizon,expected);
    assert.ok(roiCsv(report).includes(`"withinHorizon";"${expected}"`));
  }
});
test('oracle nominal du brief, capacité distincte du cash', () => {
  const r = calculateRoi(nominal);
  assert.equal(r.hours, 400/60); assert.equal(r.capacity, 400/60*40);
  assert.equal(r.cost,1600); assert.equal(r.cashBenefit,2400); assert.equal(r.net,800);
  assert.equal(r.roi,50); assert.equal(r.payback,1000/150); assert.equal(r.withinHorizon,true);
});
test('classement exact avec délai décimal et montants aux limites', () => {
  // Hand-computed integer cash oracles; no reuse of the production predicate.
  for (const inputs of [
    {...nominal,I:1,M:0.9,E:1,d:0.01,n:10.01},
    {...nominal,I:1,M:999999999.99,E:1000000000,d:0.01,n:100.01},
    {...nominal,I:1000000000,M:0,E:1000000000,d:1199,n:1200},
  ]) {
    assert.equal(calculateRoi(inputs).withinHorizon,true);
    assert.equal(calculateRoi({...inputs,n:inputs.n-0.01}).withinHorizon,false);
  }
});
test('E inconnu conserve capacité et coût sans inventer le cash', () => {
  const r = calculateRoi({...nominal,E:null});
  assert.equal(r.net,null); assert.equal(r.roi,null); assert.equal(r.payback,null);
  assert.equal(r.capacity,400/60*40); assert.equal(r.cost,1600);
});
test('temps négatif et adoption nulle ne deviennent pas gains', () => {
  assert.equal(calculateRoi({...nominal,p:0,a:100}).hours,-100/60);
  assert.equal(calculateRoi({...nominal,a:0}).hours,0);
});
test('zéro coût, payback impossible et sans investissement', () => {
  const r = calculateRoi({...nominal,I:0,M:0});
  assert.equal(r.roi,null); assert.equal(r.net,2400); assert.equal(r.paybackState,'non-applicable');
  assert.equal(calculateRoi({...nominal,E:50}).paybackState,'impossible');
  assert.equal(calculateRoi({...nominal,E:40}).paybackState,'impossible');
});
test('délai, horizon et approximation continue', () => {
  const r = calculateRoi({...nominal,d:13});
  assert.equal(r.activeMonths,0); assert.equal(r.cost,1000); assert.equal(r.net,-1000);
  assert.equal(r.withinHorizon,false); assert.equal(r.totalPayback,13+1000/150);
});
test('validation bornée, décimales françaises, refus non fini ou ambigu', () => {
  assert.equal(parseRoiValue('12,50','t'),12.5); assert.equal(parseRoiValue('','E'),null);
  for (const raw of ['-1','Infinity','1e3','1 000','1,000','NaN']) assert.throws(()=>parseRoiValue(raw,'t'));
  for (const field of ROI_FIELDS) {
    assert.throws(()=>calculateRoi({...nominal,[field.key]:-1}));
    assert.throws(()=>calculateRoi({...nominal,[field.key]:Infinity}));
  }
  assert.throws(()=>calculateRoi({...nominal,p:101}));
  assert.throws(()=>calculateRoi({...nominal,V:1.5}));
  assert.throws(()=>calculateRoi({...nominal,n:0}));
});
test('trois scénarios et exports complets reproduisent arrondis et hypothèses', () => {
  const report = buildRoiReport([nominal,{...nominal,E:null},{...nominal,p:0}]);
  assert.equal(report.scenarios.length,3);
  assert.deepEqual(report.scenarios[0].inputs,nominal);
  assert.match(report.scenarios[0].display.capacity,/266,67/);
  assert.match(report.scenarios[0].display.payback,/6,67/);
  assert.match(report.scenarios[1].display.net,/ND/);
  const csv = roiCsv(report);
  for (const field of ROI_FIELDS) assert.ok(csv.includes(field.label));
  for (const scenario of report.scenarios) for (const value of Object.values(scenario.display)) assert.ok(csv.includes(value));
  assert.deepEqual(JSON.parse(JSON.stringify(report)),report);
  assert.ok(report.formulas.length >= 6);
  assert.throws(()=>buildRoiReport([nominal]));
});
