/** Familles de bases possibles ; la version et sa licence sont choisies par projet. */
export interface ModeleOuvert {
  id: string;
  nom: string;
  logo: string;
  largeur: number;
  hauteur: number;
}
export const MODELES_OUVERTS: readonly ModeleOuvert[] = [
  {id:'llama',nom:'Llama',logo:'/assets/solutions/modeles/llama.webp',largeur:64,hauteur:64},
  {id:'mistral',nom:'Mistral',logo:'/assets/solutions/modeles/mistral.webp',largeur:64,hauteur:64},
  {id:'qwen',nom:'Qwen',logo:'/assets/solutions/modeles/qwen.webp',largeur:64,hauteur:64},
  {id:'deepseek',nom:'DeepSeek',logo:'/assets/solutions/modeles/deepseek.webp',largeur:64,hauteur:64},
  {id:'gemma',nom:'Gemma',logo:'/assets/solutions/modeles/gemma.webp',largeur:64,hauteur:64},
  {id:'gpt-oss',nom:'gpt oss',logo:'/assets/solutions/modeles/gpt-oss.webp',largeur:64,hauteur:64},
  {id:'glm',nom:'GLM',logo:'/assets/solutions/modeles/glm.webp',largeur:64,hauteur:64},
  {id:'kimi',nom:'Kimi',logo:'/assets/solutions/modeles/kimi.webp',largeur:64,hauteur:64},
];
