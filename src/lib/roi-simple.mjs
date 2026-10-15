/** Estimation neutre : les montants viennent du cabinet, jamais du catalogue Memlia. */
/** @param {{heures:number,coutHoraire:number,budgetMensuel:number,miseEnService?:number|null}} options */
export function calculerRoiSimple({heures,coutHoraire,budgetMensuel,miseEnService=null}) {
 /** @type {[string,number,number][]} */
 const limites=[['Temps',heures,100000],['Coût horaire',coutHoraire,10000],['Budget mensuel',budgetMensuel,1000000]];
 for(const [nom,valeur,max] of limites) {
  if(typeof valeur!=='number'||!Number.isFinite(valeur)||valeur<0||valeur>max)throw new Error(`${nom} : renseignez un nombre entre 0 et ${max}.`);
 }
 if(miseEnService!==null&&(typeof miseEnService!=='number'||!Number.isFinite(miseEnService)||miseEnService<0||miseEnService>1000000))throw new Error('Mise en service : montant positif ou nul requis.');
 const valeurAnnuelle=Math.round(heures*coutHoraire*100)*12;
 const budgetAnnuel=Math.round(budgetMensuel*100)*12;
 const soldeAnnuel=valeurAnnuelle-budgetAnnuel;
 return {heuresAnnuelles:heures*12,valeurAnnuelle,budgetAnnuel,soldeAnnuel,roi:budgetAnnuel?soldeAnnuel/budgetAnnuel*100:null,premiereAnnee:miseEnService===null?null:soldeAnnuel-Math.round(miseEnService*100)};
}
