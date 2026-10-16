import { readFileSync } from 'node:fs';

/**
 * Les expressions que la charte (§9 bis, v7 du 15/10/2026) interdit d'écrire à propos d'un agent IA.
 * Source unique : config/agents-interdits.json, lue aussi par tests/proof/test_positioning.py. Les deux lecteurs
 * appliquent la même règle de correspondance ; le point faible connu des deux est écrit dans leurs témoins.
 *
 * Règle de correspondance : texte normalisé (Unicode NFC, apostrophes droites, blancs et espaces insécables repliés
 * en une espace, césures optionnelles et caractères de largeur nulle ôtés, minuscules) ; l'expression doit être
 * entière (ni lettre ni chiffre avant ou après) ; chaque mot de plus de trois lettres accepte un « s » final, pour que
 * le pluriel (« agents autonomes ») ne passe pas là où le singulier est refusé.
 */
export const FICHIER_INTERDITS = new URL('../../config/agents-interdits.json', import.meta.url);
const MOT_COURT = 3;

export function lireInterdits(fichier = FICHIER_INTERDITS) {
  const { expressions } = JSON.parse(readFileSync(fichier, 'utf8'));
  return expressions;
}

export function normaliser(texte) {
  return String(texte)
    .normalize('NFC')
    .replace(/[­​-‍⁠﻿]/gu, '')
    .replace(/[‘’ʼ′]/gu, "'")
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();
}

const echapper = (texte) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function motifInterdit(expression) {
  const mots = normaliser(expression)
    .split(' ')
    .map((mot) => (mot.length > MOT_COURT && !/[sx]$/u.test(mot) ? `${echapper(mot)}s?` : echapper(mot)));
  return new RegExp(`(?<![\\p{L}\\p{N}])${mots.join(' ')}(?![\\p{L}\\p{N}])`, 'u');
}

/** Les expressions interdites que `texte` contient, sous leur forme du fichier de configuration. */
export function trouverInterdits(texte, expressions = lireInterdits()) {
  const normalise = normaliser(texte);
  return expressions.filter((expression) => motifInterdit(expression).test(normalise));
}
