/** Libellés de compatibilité. Les noms n'impliquent aucun partenariat. */
export const OUTILS_ROBOTS: Record<string, { nom: string; href: string; logo?: string }> = {
  impots: { nom: 'impots.gouv.fr', href: '/integrations#impots-gouv-fr-espace-professionnel' },
  urssaf: { nom: 'Urssaf', href: '/integrations#urssaf' },
  inpi: { nom: 'INPI · RNE', href: '/integrations#registre-national-des-entreprises', logo: '/robots/outils/inpi.png' },
  bodacc: { nom: 'BODACC', href: '/integrations#bodacc' },
  annuaire: { nom: 'Annuaire de la facturation électronique', href: '/integrations#facturation-electronique' },
  jesignexpert: { nom: 'jesignexpert.com · ECMA', href: '/integrations#jesignexpert-com', logo: '/robots/outils/ecma.png' },
  excel: { nom: 'Microsoft Excel', href: '/integrations#microsoft-excel', logo: '/robots/outils/excel.png' },
  word: { nom: 'Microsoft Word', href: '/integrations#microsoft-word', logo: '/robots/outils/microsoft.png' },
  sharepoint: { nom: 'Microsoft SharePoint', href: '/integrations#microsoft-sharepoint', logo: '/robots/outils/microsoft.png' },
  powerbi: { nom: 'Microsoft Power BI', href: '/integrations#microsoft-power-bi', logo: '/robots/outils/powerbi.png' },
  pennylane: { nom: 'Pennylane', href: '/integrations#pennylane', logo: '/robots/outils/pennylane.png' },
  acd: { nom: 'ACD COMPTA', href: '/integrations#acd-compta', logo: '/robots/outils/acd.png' },
  sage: { nom: 'Sage', href: '/integrations#sage-100-comptabilite', logo: '/robots/outils/sage.png' },
  cegid: { nom: 'Cegid', href: '/integrations#cegid-loop', logo: '/robots/outils/cegid.png' },
  fichiers: { nom: 'Vos fichiers PDF, XLSX, DOCX et CSV', href: '/integrations#bureautique-classeurs' },
};
