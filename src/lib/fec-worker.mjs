import { analyzeFec, decodeFec, MAX_BYTES } from './fec-local.mjs';
self.onmessage = async ({data}) => {
  try {
    // Le contrôle précède arrayBuffer : aucun fichier trop grand n'est lu.
    if (data.file.size > MAX_BYTES) throw new Error('Refus : limite de 20 Mo (20 000 000 octets) dépassée.');
    const bytes = new Uint8Array(await data.file.arrayBuffer());
    const report = analyzeFec(decodeFec(bytes,data.encoding),{encoding:data.encoding,profile:data.profile});
    self.postMessage({report});
  } catch(error) { self.postMessage({error:error instanceof Error?error.message:'Lecture impossible. Aucun rapport complet.'}); }
};
