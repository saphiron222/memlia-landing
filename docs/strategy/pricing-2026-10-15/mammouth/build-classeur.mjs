import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import os from 'node:os';
const requireBundled=createRequire(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const {Workbook,SpreadsheetFile,FileBlob}=await import(requireBundled.resolve('@oai/artifact-tool'));
import {bareme,modele,devis,coutUnite,verifier} from './calcul-economie.mjs';

const project=path.resolve(import.meta.dirname,'../../../..');
const out=path.join(project,'outputs/01a13e1c-ec37-74f0-8a26-6ad074cde9ac');
await fs.mkdir(out,{recursive:true});
const wb=Workbook.create();
const budget=wb.worksheets.add('Budget');
const units=wb.worksheets.add('Unités');
const hyp=wb.worksheets.add('Hypothèses');
const green='#176D39',ink='#231F20',muted='#686961',cream='#FFFEFB',pale='#EAF5EC',amber='#FFF2CC';
const money='#,##0.00" €";(#,##0.00" €");"—"';
const num='#,##0.00;(#,##0.00);"—"';
const pct='0.0%;(0.0%);"—"';
const put=(s,cell,v)=>s.getRange(cell).values=[[v]];
const formula=(s,cell,f)=>s.getRange(cell).formulas=[[f]];
const title=(s,text)=>{put(s,'A2',text);s.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:ink};};
const header=(s,range)=>{s.getRange(range).format={fill:green,font:{name:'Arial',size:10,color:'#FFFFFF',bold:true},wrapText:true,horizontalAlignment:'center',verticalAlignment:'center',rowHeight:34};};
const input=(s,range,fmt)=>{s.getRange(range).format.fill=amber;s.getRange(range).format.font.color='#0000FF';if(fmt)s.getRange(range).setNumberFormat(fmt);};
const neg=(s,range)=>s.getRange(range).conditionalFormats.add('cellIs',{operator:'lessThan',formula:0,format:{fill:'#FDE8E5',font:{color:'#9B2525',bold:true}}});
for(const s of [budget,units,hyp]){s.showGridLines=false;s.getRange('A1:L50').format={font:{name:'Arial',size:10,color:ink},rowHeight:24,verticalAlignment:'center'};s.getRange('A1:L50').format.fill=cream;}
budget.tabColor=green;hyp.tabColor='#9BD8AA';

// Sources et paramètres : seule sélection de scénario du classeur.
title(hyp,'Hypothèses et tarifs Mammouth');
put(hyp,'A3','Tarifs publics au 15/10/2026 ; consommation et temps humains non mesurés.');
put(hyp,'A5','Scénario (1 à 3)');put(hyp,'C5',1);input(hyp,'C5','0');
hyp.getRange('C5').dataValidation={rule:{type:'whole',operator:'between',formula1:1,formula2:3}};
formula(hyp,'E5','=CHOOSE($C$5,"Base calculée","Reprises élevées","Modèle premium")');
hyp.getRange('E5').format.font.color=green;
hyp.getRange('A7:F7').values=[['Coût / facteur','Base','Reprises','Premium','Actif','Unité']];header(hyp,'A7:F7');
const drivers=[
 ['Conversion budgétaire USD / EUR','usdToEurBudget','EUR / USD'],
 ['Coût humain chargé','humanHourlyEur','EUR / heure'],
 ['Volume de tokens','tokenMultiplier','multiplicateur'],
 ['Tentatives et reprises API','attemptFactor','multiplicateur'],
 ['Temps humain variable','humanMultiplier','multiplicateur'],
 ['Réserve autres outils','toolsMultiplier','multiplicateur'],
 ['Routage premium (0 / 1)','premium','indicateur'],
 ['Infrastructure allouée','fixedInfraMonthlyEur','EUR / mois'],
 ['Maintenance / support fixe','fixedHumanMinutes','minutes / mois'],
 ['Effort de mise en service','setupEffortMultiplier','multiplicateur'],
 ['Taxes / frais fournisseur','supplierTaxMultiplier','coefficient'],
 ['Réserve encaissement variable','collectionPercent','part du CA'],
 ['Réserve encaissement fixe','collectionFixedEur','EUR / facture']
];
for(let i=0;i<drivers.length;i++){const r=i+9;const [label,k,unit]=drivers[i];hyp.getRange(`A${r}:D${r}`).values=[[label,...bareme.scenarios.map(s=>typeof s[k]==='boolean'?Number(s[k]):s[k])]];const allowZero=['premium','fixedInfraMonthlyEur','fixedHumanMinutes','collectionPercent','collectionFixedEur'].includes(k);const guarded=col=>`IF(AND(ISNUMBER(${col}${r}),${col}${r}${allowZero?'>=':'>'}0),${col}${r},NA())`;formula(hyp,`E${r}`,`=CHOOSE($C$5,${guarded('B')},${guarded('C')},${guarded('D')})`);put(hyp,`F${r}`,unit);}
input(hyp,'B9:D21',num);hyp.getRange('B20:E20').setNumberFormat(pct);hyp.getRange('E9:E21').setNumberFormat(num);hyp.getRange('E20').setNumberFormat(pct);hyp.getRange('E9:E21').format.fill=pale;
const oh=bareme.overheadAssumptions;
const shared=[['Socle agents HT / mois',bareme.baseMonthlyCents/100],['Frais généraux alloués / mois',oh.generalMonthlyEur],['Acquisition allouée / cabinet',oh.acquisitionPerCabinetEur],['Amortissement acquisition / mois',oh.acquisitionAmortizationMonths],['Catalogue alloué / cabinet',oh.cataloguePerCabinetEur],['Amortissement catalogue / mois',oh.catalogueAmortizationMonths],['Marge variable cible',bareme.targetVariableMargin]];
hyp.getRange('A24:B30').values=shared;input(hyp,'B24:B30',num);hyp.getRange('B30').setNumberFormat(pct);put(hyp,'A31','Encaissements installation');put(hyp,'B31',bareme.setupPaymentCount);input(hyp,'B31','0');
put(hyp,'A32','Prix API publics : USD par million de tokens');
hyp.getRange('A32').format.font.bold=true;
hyp.getRange('A34:E34').values=[['Modèle','Entrée $/M','Sortie $/M','Entrée max.','Sortie max.']];header(hyp,'A34:E34');
const modelIds=['gpt-6.1-sol','claude-opus-5-5','gpt-6-astra','glm-5.3-flash'];
hyp.getRange('A35:E38').values=modelIds.map(id=>{const m=modele(id);return [id,m.input_usd_per_million,m.output_usd_per_million,m.max_input_tokens,m.max_output_tokens];});
hyp.getRange('B35:C38').setNumberFormat('0.00');hyp.getRange('D35:E38').setNumberFormat('#,##0');
put(hyp,'A41','https://api.mammouth.ai/public/models');put(hyp,'A42','https://info.mammouth.ai/fr/docs/api-quick-start/');
put(hyp,'A44','FX = budget prudent, pas cours observé. Aucun crédit gratuit ni cache déduit.');
put(hyp,'A45','Autres coûts = provisions ; licences et infrastructure dédiées à confirmer au devis.');
put(hyp,'A46','Encaissement = hypothèse interne, pas tarif contractuel de Mammouth.');
hyp.getRange('A41:F46').format.font={name:'Arial',size:10,color:muted};
hyp.getRange('A1:A46').format.columnWidth=40;hyp.getRange('B1:D46').format.columnWidth=14;hyp.getRange('E1:E46').format.columnWidth=25;hyp.getRange('F1:F46').format.columnWidth=19;
hyp.freezePanes.freezeRows(7);

// Une seule table de calcul du coût variable ; les devis lisent ces résultats.
title(units,'Prix proposés et coûts par travail');
formula(units,'B3',"='Hypothèses'!E5");units.getRange('B3').format.font.color=green;
units.getRange('A5:I5').values=[['Travail remis','Prix HT','API €','Humain €','Autres €','Encais. €','Coût direct €','Marge','Humain max. s*']];header(units,'A5:I5');
units.getRange('A19:L19').values=[['Unité','Prix HT','Modèle fixé','Tokens entrée','Tokens sortie','Humain s','Autres €','Périmètre','$/M entrée','$/M sortie','Provision ×','Provision API $']];header(units,'A19:L19');
for(let i=0;i<bareme.units.length;i++){
 const u=bareme.units[i],r=6+i,s=20+i;
 units.getRange(`A${s}:H${s}`).values=[[u.id,u.priceCents/100,u.modelId,u.inputTokens,u.outputTokens,u.humanSeconds,u.toolsReserveEur,u.scope]];
 put(units,`K${s}`,u.technicalEnvelopeMultiplier);
 formula(units,`I${s}`,`=IF('Hypothèses'!$E$15=1,'Hypothèses'!$B$37,INDEX('Hypothèses'!$B$35:$B$38,MATCH(C${s},'Hypothèses'!$A$35:$A$38,0)))`);
 formula(units,`J${s}`,`=IF('Hypothèses'!$E$15=1,'Hypothèses'!$C$37,INDEX('Hypothèses'!$C$35:$C$38,MATCH(C${s},'Hypothèses'!$A$35:$A$38,0)))`);
 formula(units,`L${s}`,`=(D${s}*I${s}+E${s}*J${s})/1000000*K${s}`);
 put(units,`A${r}`,`${u.id} · ${u.label}`);
 formula(units,`B${r}`,`=IF(AND(ISNUMBER(B${s}),B${s}>0),B${s},NA())`);
 formula(units,`C${r}`,`=IF(AND(COUNT(D${s}:E${s})=2,D${s}>=0,E${s}>=0,I${s}>0,J${s}>0),(D${s}*I${s}+E${s}*J${s})/1000000*'Hypothèses'!$E$9*'Hypothèses'!$E$11*'Hypothèses'!$E$12*'Hypothèses'!$E$19,NA())`);
 formula(units,`D${r}`,`=IF(AND(ISNUMBER(F${s}),F${s}>=0),F${s}*'Hypothèses'!$E$13/3600*'Hypothèses'!$E$10,NA())`);
 formula(units,`E${r}`,`=IF(AND(ISNUMBER(G${s}),G${s}>=0),G${s}*'Hypothèses'!$E$14,NA())`);
 formula(units,`F${r}`,`=B${r}*'Hypothèses'!$E$20`);
 formula(units,`G${r}`,`=SUM(C${r}:F${r})`);
 formula(units,`H${r}`,`=(B${r}-G${r})/B${r}`);
 formula(units,`I${r}`,`=(B${r}*(1-'Hypothèses'!$B$30)-C${r}-E${r}-F${r})/'Hypothèses'!$E$10*3600`);
}
units.getRange('B6:G13').setNumberFormat(money);units.getRange('H6:H13').setNumberFormat(pct);units.getRange('I6:I13').setNumberFormat('0.0');units.getRange('A6:I13').format.rowHeight=32;
neg(units,'I6:I13');units.getRange('H6:H13').conditionalFormats.add('cellIs',{operator:'lessThan',formula:.7,format:{fill:'#FFF2CC',font:{color:'#805500'}}});
put(units,'A15','*Temps humain moyen compatible avec la marge cible, pas une durée facturée.');
put(units,'A16','Les prix restent fixes ; les tentatives internes ne constituent pas de nouvelles unités.');
units.getRange('A15:L16').format.font={name:'Arial',size:10,color:muted};
input(units,'B20:G27');input(units,'K20:K27');units.getRange('B20:B27').setNumberFormat(money);units.getRange('D20:F27').setNumberFormat('#,##0');units.getRange('G20:G27').setNumberFormat('0.00');units.getRange('I20:L27').setNumberFormat('0.0000');
units.getRange('C20:C27').dataValidation={rule:{type:'list',values:modelIds}};
units.getRange('H20:H27').format.wrapText=true;units.getRange('A20:L27').format.rowHeight=88;
put(units,'A30','Mise en service : effort prévisionnel et coût direct');units.getRange('A30').format.font.bold=true;
units.getRange('A33:I33').values=[['Périmètre','Prix HT','Effort h','Réserve €','Humain €','Autres €','Encais. €','Coût direct €','Marge']];header(units,'A33:I33');
bareme.setup.forEach((s,i)=>{const r=34+i;units.getRange(`A${r}:D${r}`).values=[[s.label,s.priceCents/100,s.hours,s.technicalReserveEur]];formula(units,`E${r}`,`=IF(AND(ISNUMBER(C${r}),C${r}>=0),C${r}*'Hypothèses'!$E$18*'Hypothèses'!$E$10,NA())`);formula(units,`F${r}`,`=IF(AND(ISNUMBER(D${r}),D${r}>=0),D${r}*'Hypothèses'!$E$14,NA())`);formula(units,`G${r}`,`=IF(AND(ISNUMBER(B${r}),B${r}>0,ISNUMBER('Hypothèses'!$B$31),'Hypothèses'!$B$31>0),B${r}*'Hypothèses'!$E$20+'Hypothèses'!$E$21*'Hypothèses'!$B$31,NA())`);formula(units,`H${r}`,`=SUM(E${r}:G${r})`);formula(units,`I${r}`,`=(B${r}-H${r})/B${r}`);});
input(units,'B34:D36');units.getRange('B34:B36').setNumberFormat(money);units.getRange('D34:H36').setNumberFormat(money);units.getRange('I34:I36').setNumberFormat(pct);units.getRange('A34:I36').format.rowHeight=32;
put(units,'A39','Standard : une tâche et un connecteur existants.');put(units,'A40','Adaptation : trois tâches, deux connecteurs standards.');put(units,'A41','Création : à partir de 4 900 €, périmètre fixé au devis.');
put(units,'A43','Provisions tokens et temps = hypothèses. Aucun appel Mammouth effectué.');
units.getRange('A1:A45').format.columnWidth=42;units.getRange('B1:B45').format.columnWidth=14;units.getRange('C1:G45').format.columnWidth=13;units.getRange('H1:H45').format.columnWidth=38;units.getRange('I1:L45').format.columnWidth=16;
units.freezePanes.freezeRows(5);units.freezePanes.freezeColumns(1);

// Vue décision : facture maximum, coût de service et charges allouées séparés.
title(budget,'Agents IA : devis et économie mensuelle');
formula(budget,'B3',"='Hypothèses'!E5");budget.getRange('B3').format.font.color=green;
put(budget,'E3','Exemple fictif · 15 octobre 2026');
const left=[['Mensuel HT','C5'],['Consommation HT','C6'],['Plafond d’usage HT','C7'],['Maximum mensuel HT','C8'],['Budget restant HT','C9'],['État du budget','C10'],['','C11'],['Installation (0 à 3)','C12'],['Mise en service HT','C13'],['Premier mois HT','C14'],['Maximum premier mois HT','C15'],['Première année HT','C16'],['Socle HT / mois','C17']];
for(let i=0;i<left.length;i++)put(budget,`B${5+i}`,left[i][0]);
put(budget,'C7',bareme.initialUsageCapCents/100);put(budget,'C12',1);input(budget,'C7',money);input(budget,'C12','0');budget.getRange('C12').dataValidation={rule:{type:'whole',operator:'between',formula1:0,formula2:3}};
formula(budget,'C5','=C17+C6');formula(budget,'C6','=E31');formula(budget,'C8',"=IF(AND(ISNUMBER(C7),C7>=0,ROUND(C7,2)=C7),C17+C7,NA())");formula(budget,'C9','=C8-C5');formula(budget,'C10','=IF(C9>=0,"Dans le plafond","Plafond dépassé")');formula(budget,'C13',"=IF(AND(ISNUMBER(C12),C12>=0,C12<=3,INT(C12)=C12),IF(C12=0,0,IF(INDEX('Unités'!$B$34:$B$36,C12)>0,INDEX('Unités'!$B$34:$B$36,C12),NA())),NA())");formula(budget,'C14','=C5+C13');formula(budget,'C15','=C8+C13');formula(budget,'C16','=12*C5+C13');formula(budget,'C17',"=IF(AND(ISNUMBER('Hypothèses'!B24),'Hypothèses'!B24>=0),'Hypothèses'!B24,NA())");
const right=['Coûts directs / mois','Marge brute','Frais généraux alloués','Acquisition amortie','Catalogue amorti','Contribution mensuelle','','Temps humain h / mois','Coût de mise en service','Marge installation','Contribution première année'];right.forEach((v,i)=>put(budget,`E${5+i}`,v));
formula(budget,'F5',"=F31+'Hypothèses'!$E$16+'Hypothèses'!$E$17/60*'Hypothèses'!$E$10+C17*'Hypothèses'!$E$20+'Hypothèses'!$E$21");
formula(budget,'F6','=(C5-F5)/C5');formula(budget,'F7',"=IF(ISNUMBER('Hypothèses'!B25),'Hypothèses'!B25,NA())");formula(budget,'F8',"=IF(AND(ISNUMBER('Hypothèses'!B26),ISNUMBER('Hypothèses'!B27),'Hypothèses'!B27>0),'Hypothèses'!B26/'Hypothèses'!B27,NA())");formula(budget,'F9',"=IF(AND(ISNUMBER('Hypothèses'!B28),ISNUMBER('Hypothèses'!B29),'Hypothèses'!B29>0),'Hypothèses'!B28/'Hypothèses'!B29,NA())");formula(budget,'F10','=C5-F5-SUM(F7:F9)');formula(budget,'F12',"=G31+'Hypothèses'!E17/60");formula(budget,'F13',"=IF(C13=0,0,INDEX('Unités'!$H$34:$H$36,C12))");formula(budget,'F14','=IF(C13=0,"n.a.",(C13-F13)/C13)');formula(budget,'F15','=12*F10+C13-F13');
budget.getRange('C5:C17').setNumberFormat(money);budget.getRange('C12').setNumberFormat('0');budget.getRange('F5:F15').setNumberFormat(money);budget.getRange('F6').setNumberFormat(pct);budget.getRange('F12').setNumberFormat('0.00');budget.getRange('F14').setNumberFormat(pct);budget.getRange('B5:C5').format.fill=pale;budget.getRange('E10:F10').format.fill=pale;budget.getRange('C5').format.font.bold=true;budget.getRange('F10').format.font.bold=true;
budget.getRange('C10').format.wrapText=true;budget.getRange('B10:C10').format.rowHeight=34;
put(budget,'B18','Contribution avant impôts et frais non alloués. Les coûts sont des hypothèses.');
put(budget,'B20','Travaux du mois — quantités modifiables');budget.getRange('B20').format.font.bold=true;
budget.getRange('A21:G21').values=[['Unité','Travail','Prix HT','Qté','Usage HT','Coût direct','Humain h']];header(budget,'A21:G21');
bareme.units.forEach((u,i)=>{const r=22+i,s=6+i,inputs=20+i;put(budget,`A${r}`,u.id);put(budget,`B${r}`,u.label);formula(budget,`C${r}`,`='Unités'!B${s}`);put(budget,`D${r}`,u.defaultQuantity);formula(budget,`E${r}`,`=IF(AND(ISNUMBER(D${r}),D${r}>=0,INT(D${r})=D${r}),C${r}*D${r},NA())`);formula(budget,`F${r}`,`=D${r}*'Unités'!G${s}`);formula(budget,`G${r}`,`=D${r}*'Unités'!F${inputs}*'Hypothèses'!$E$13/3600`);});
input(budget,'D22:D29','#,##0');budget.getRange('D22:D29').dataValidation={rule:{type:'whole',operator:'between',formula1:0,formula2:1000000}};
budget.getRange('C22:C29').setNumberFormat(money);budget.getRange('E22:F31').setNumberFormat(money);budget.getRange('G22:G31').setNumberFormat('0.00');budget.getRange('A22:G29').format.rowHeight=30;
put(budget,'B31','Total consommation');formula(budget,'E31','=SUM(E22:E29)');formula(budget,'F31','=SUM(F22:F29)');formula(budget,'G31','=SUM(G22:G29)');budget.getRange('B31:G31').format.font.bold=true;budget.getRange('B31:G31').format.borders={bottom:{style:'thin',color:green}};
put(budget,'B34','0 = sans installation ; 1 = standard ; 2 = adaptation ; 3 = création à partir de.');
put(budget,'B35','Le plafond est une règle de devis proposée. Ce fichier ne pilote aucun agent.');
put(budget,'B36','Pour comparer les coûts : choisir 1, 2 ou 3 dans Hypothèses!C5.');
budget.getRange('B34:G36').format.font={name:'Arial',size:10,color:muted};
budget.getRange('A1:A38').format.columnWidth=7;budget.getRange('B1:B38').format.columnWidth=39;budget.getRange('C1:C38').format.columnWidth=20;budget.getRange('D1:D38').format.columnWidth=9;budget.getRange('E1:E38').format.columnWidth=32;budget.getRange('F1:G38').format.columnWidth=19;
neg(budget,'C9');neg(budget,'F10');neg(budget,'F15');
budget.getRange('C10').conditionalFormats.add('containsText',{text:'dépassé',format:{fill:'#FDE8E5',font:{color:'#9B2525',bold:true}}});

// Contrôles indépendants : changement du scénario, des quantités et des prix.
const number=(sheet,cell)=>{const v=sheet.getRange(cell).values[0][0];assert.equal(typeof v,'number',`${sheet.name}!${cell}: ${JSON.stringify(v)}`);return v;};
const near=(actual,expected,name)=>assert(Math.abs(actual-expected)<1e-7,`${name}: ${actual} / ${expected}`);
const quantities=Object.fromEntries(bareme.units.map(u=>[u.id,u.defaultQuantity]));
const tests=[];
for(let i=0;i<3;i++){
 put(hyp,'C5',i+1);wb.recalculate();const q=devis(quantities,bareme.initialUsageCapCents,bareme.scenarios[i]);
 near(number(budget,'C5'),q.monthlyCents/100,'mensuel');near(number(budget,'F5'),q.directEur,'direct');near(number(budget,'F10'),q.contributionEur,'contribution');near(number(budget,'F13'),q.setupDirectEur,'installation');
 for(let j=0;j<8;j++){const c=coutUnite(bareme.units[j],bareme.scenarios[i]);near(number(units,`G${6+j}`),c.totalEur,'coût unitaire');}
 tests.push({scenario:bareme.scenarios[i].id,mensuel:q.monthlyCents/100,cout:q.directEur,contribution:q.contributionEur,resultat:'PASS'});
}
put(hyp,'C5',1);for(let i=0;i<8;i++)put(budget,`D${22+i}`,0);put(budget,'C12',0);wb.recalculate();near(number(budget,'C5'),99,'zéro consommation');near(number(budget,'C13'),0,'sans installation');
put(budget,'D22',200);wb.recalculate();assert.equal(budget.getRange('C10').values[0][0],'Dans le plafond');put(budget,'D22',201);wb.recalculate();assert.equal(budget.getRange('C10').values[0][0],'Plafond dépassé');
put(budget,'D22',.5);wb.recalculate();assert.notEqual(typeof budget.getRange('C5').values[0][0],'number','quantité fractionnaire refusée');
bareme.units.forEach((u,i)=>put(budget,`D${22+i}`,u.defaultQuantity));put(budget,'C12',1);
put(units,'B20',2);wb.recalculate();near(number(budget,'C5'),373,'prix modifiable propagé');put(units,'B20',1);
put(hyp,'B9',1.2);wb.recalculate();assert(number(units,'C6')>coutUnite(bareme.units[0]).apiEur);put(hyp,'B9',1.1);wb.recalculate();
put(hyp,'C9',null);wb.recalculate();near(number(budget,'F5'),62.7595,'cas non sélectionné incomplet sans effet');put(hyp,'C5',2);wb.recalculate();assert.notEqual(typeof budget.getRange('F5').values[0][0],'number','hypothèse sélectionnée manquante visible');put(hyp,'C9',1.2);put(hyp,'C5',1);
put(budget,'D22',null);wb.recalculate();assert.notEqual(typeof budget.getRange('C5').values[0][0],'number','quantité manquante distincte de zéro','tokens humain outils installation et plafond manquants visibles','zéro humain autorisé');put(budget,'D22',100);wb.recalculate();
// Effacement de paramètres obligatoires : un manque ne devient pas un coût nul.
for(const cell of ['D20','E20','F20','G20']){const old=units.getRange(cell).values[0][0];put(units,cell,null);wb.recalculate();assert.notEqual(typeof budget.getRange('F5').values[0][0],'number',`manque ${cell} visible`);put(units,cell,old);}
for(const cell of ['B34','C34','D34']){const old=units.getRange(cell).values[0][0];put(units,cell,null);wb.recalculate();assert.notEqual(typeof budget.getRange('F13').values[0][0],'number',`installation ${cell} manquante visible`);put(units,cell,old);}
put(budget,'C7',null);wb.recalculate();assert.notEqual(typeof budget.getRange('C8').values[0][0],'number','plafond manquant visible');put(budget,'C7',200);
put(budget,'C12',null);wb.recalculate();assert.notEqual(typeof budget.getRange('C13').values[0][0],'number','installation manquante distincte de zéro');put(budget,'C12',1);
const originalHum=units.getRange('F20').values[0][0];put(units,'F20',0);wb.recalculate();near(number(units,'D6'),0,'zéro humain autorisé');put(units,'F20',originalHum);
wb.recalculate();
const inspections=await wb.inspect({kind:'table',range:'Budget!B5:F17',include:'values,formulas',tableMaxRows:14,tableMaxCols:5,maxChars:5000});
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:100},summary:'Vérification finale des erreurs de formules',maxChars:2500});
await fs.writeFile(path.join(out,'verification-formules.json'),JSON.stringify({internalModel:verifier(),cases:tests,edgeCases:['zéro consommation','sans installation','200 dans le plafond','201 dépassement','quantité fractionnaire refusée','prix et conversion modifiés puis restaurés','cas non sélectionné incomplet','hypothèse active manquante visible','quantité manquante distincte de zéro','tokens humain outils installation et plafond manquants visibles','zéro humain autorisé'],inspect:inspections.ndjson,errors:errors.ndjson},null,2));
console.log(errors.ndjson);
for(const [s,range,name]of [[budget,'A1:G37','budget'],[units,'A1:I16','unites'],[units,'A19:L27','entrees-unitaires'],[units,'A30:I43','installation'],[hyp,'A1:F31','hypotheses'],[hyp,'A32:F46','tarifs-api']]){
 const preview=await wb.render({sheetName:s.name,range,scale:1.5,format:'png'});
 await fs.writeFile(path.join(out,`${name}.png`),new Uint8Array(await preview.arrayBuffer()));
}
const xlsx=await SpreadsheetFile.exportXlsx(wb);const outputPath=path.join(out,'couts-et-tarifs-agents-mammouth.xlsx');await xlsx.save(outputPath);
const reopened=await SpreadsheetFile.importXlsx(await FileBlob.load(outputPath));reopened.recalculate();const reopenedBudget=reopened.worksheets.getItem('Budget');near(number(reopenedBudget,'C5'),273,'fichier réouvert');near(number(reopenedBudget,'F5'),62.7595,'coûts réouverts');reopened.worksheets.getItem('Hypothèses').getRange('C5').values=[[2]];reopened.recalculate();near(number(reopenedBudget,'F5'),153.25165333333334,'scénario réouvert');
console.log(JSON.stringify({output:path.join(out,'couts-et-tarifs-agents-mammouth.xlsx'),scenarios:tests,resultat:'formules recalculées et comparées au modèle indépendant'}));
