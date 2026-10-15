/** Familles de bases possibles ; la version et sa licence sont choisies par projet. */
export interface ModeleOuvert {
  id: string;
  nom: string;
  logo: string;
  largeur: number;
  hauteur: number;
  logotype?: boolean;
}
export const MODELES_OUVERTS: readonly ModeleOuvert[] = [
  {id:'llama',nom:'Llama',logo:'/logos/modeles/llama.webp',largeur:64,hauteur:64},
  {id:'mistral',nom:'Mistral',logo:'/logos/modeles/mistral.webp',largeur:64,hauteur:64},
  {id:'qwen',nom:'Qwen',logo:'/logos/modeles/qwen.webp',largeur:64,hauteur:64},
  {id:'deepseek',nom:'DeepSeek',logo:'/logos/modeles/deepseek.webp',largeur:64,hauteur:64},
  {id:'gemma',nom:'Gemma',logo:'/logos/modeles/gemma.webp',largeur:64,hauteur:64},
  {id:'gpt-oss',nom:'gpt-oss',logo:'/logos/modeles/gpt-oss.webp',largeur:280,hauteur:56,logotype:true},
];
