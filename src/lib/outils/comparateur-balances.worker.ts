import {parseBalance, compareBalances} from './comparateur-balances.mjs';

// Memory-only Worker. Cancellation is owned by the caller via worker.terminate().
// Plain JavaScript syntax intentionally retained for isolated protocol tests.
self.onmessage = ({data}) => {
 const id=data?.id;
 try {
  let result;
  if(data?.type==='parse') result=parseBalance(data.text,data.options);
  else if(data?.type==='compare') result=compareBalances(data.previous,data.current,data.options);
  else throw new Error('Type de requête Worker inconnu : parse ou compare requis.');
  self.postMessage({id,ok:true,result});
 } catch(error) {
  self.postMessage({id,ok:false,error:error instanceof Error?error.message:'Traitement local impossible.'});
 }
};
