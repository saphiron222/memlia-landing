#!/usr/bin/env node
/**
 * Mesurer la palette d'une image : la part de pixels proche de chaque couleur épinglée.
 *
 *   node scripts/mesurer-palette.mjs <image.png> "#27b657,#1c8a41,#fffefb,#231f20"
 *
 * L'image est réduite avant comptage (la proportion de couleur ne dépend pas de la définition,
 * et une réduction moyenne les grains de matière) ; chaque pixel est attribué à la couleur
 * épinglée la plus proche dans la tolérance, ou à aucune. La somme des parts est donc
 * inférieure à 1 : ce qui n'est proche d'aucune couleur épinglée n'est pas compté, et c'est
 * voulu — l'instrument mesure la présence des couleurs annoncées, pas une décomposition
 * complète de l'image.
 */
import sharp from 'sharp';
import { classerPixel, hexEnRgb } from './lib/palette.mjs';

export const TOLERANCE_PAR_DEFAUT = 60;
export const LARGEUR_MESURE = 320;

export async function mesurerPalette(chemin, hexes, { tolerance = TOLERANCE_PAR_DEFAUT, largeur = LARGEUR_MESURE } = {}) {
  const cibles = hexes.map((hex) => ({ hex: hex.toLowerCase(), rgb: hexEnRgb(hex.toLowerCase()) }));
  const { data, info } = await sharp(chemin).resize(largeur, null, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const comptes = Object.fromEntries(cibles.map((c) => [c.hex, 0]));
  const pixels = info.width * info.height;
  for (let i = 0; i < data.length; i += info.channels) {
    const hex = classerPixel(data[i], data[i + 1], data[i + 2], cibles, tolerance);
    if (hex) comptes[hex] += 1;
  }
  return { chemin, pixels, tolerance, comptes, parts: Object.fromEntries(Object.entries(comptes).map(([hex, n]) => [hex, n / pixels])) };
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const [chemin, liste] = process.argv.slice(2);
  if (!chemin || !liste) { console.error('usage : mesurer-palette.mjs <image> "#aabbcc,#ddeeff"'); process.exit(2); }
  const r = await mesurerPalette(chemin, liste.split(',').map((h) => h.trim()).filter(Boolean));
  console.log(JSON.stringify(r, null, 2));
}
