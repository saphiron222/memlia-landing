"""Jeu fictif local : aucune API, écriture client, déclaration ni envoi."""
import calendar
import copy
import datetime as dt
import json
from pathlib import Path


def preparer(dossier):
    annotations = copy.deepcopy(dossier['annotations'])
    sortie = {'annotations': annotations, 'envoi': False, 'depot': False, 'ecriture_client': False}
    for condition, motif in [
        (not dossier['siren_confirme'], 'identité à confirmer'),
        (dossier['contradiction'], 'sources contradictoires'),
        (not dossier['sources_completes'], 'lecture incomplète'),
        (dossier['deja_traite'], 'événement déjà traité'),
    ]:
        if condition:
            return dict(sortie, status='ARRET', motif=motif)
    sortie.update(status='PROPOSITION', fiche={'siren': dossier['siren'], 'changements': dossier['changements'], 'sources': dossier['sources']}, alerte_associe={'destinataire': 'associé référent à valider', 'publication': dossier['publication'], 'envoi': False})
    if not dossier['procedure']:
        return dict(sortie, calcul=None)
    # Cas délibérément restreint : antérieure, sans sûreté publiée/contrat publié,
    # juridiction ET créancier métropolitains, aucun point de départ particulier.
    if not dossier['qualification_validee'] or not dossier['cas_general']:
        return dict(sortie, calcul=None, delai_status='EXAMEN_HUMAIN')
    try:
        publication = dt.date.fromisoformat(dossier['publication'])
    except (ValueError, TypeError):
        return dict(sortie, calcul=None, delai_status='PUBLICATION_A_CONFIRMER')
    mois = publication.month - 1 + 2
    annee = publication.year + mois // 12
    mois = mois % 12 + 1
    jour = min(publication.day, calendar.monthrange(annee, mois)[1])
    # Terme calendaire, PAS échéance opposable : prorogation de jour non ouvrable
    # et toute exception juridique doivent être vérifiées par le professionnel.
    return dict(sortie, calcul={'terme_calendaire': dt.date(annee, mois, jour).isoformat(), 'mois': 2, 'point_depart': dossier['publication'], 'source': 'R622-24', 'statut': 'à valider, prorogation à vérifier'})


def main():
    base = {'siren': 'IDENTIFIANT_FICTIF_A', 'siren_confirme': True, 'contradiction': False, 'sources_completes': True, 'deja_traite': False, 'annotations': ['appeler le dirigeant'], 'changements': ['adresse à mettre à jour'], 'sources': ['RNE extrait fictif', 'Sirene extrait fictif', 'BODACC annonce fictive'], 'publication': '2026-09-06', 'procedure': True, 'qualification_validee': True, 'cas_general': True}
    variantes = [
        ('courant', {}, 'PROPOSITION', '2026-11-06'),
        ('fin-mois', {'publication': '2026-12-31'}, 'PROPOSITION', '2027-02-28'),
        ('sans-procedure', {'procedure': False}, 'PROPOSITION', None),
        ('qualification-inconnue', {'qualification_validee': False}, 'PROPOSITION', None),
        ('surete-ou-etranger', {'cas_general': False}, 'PROPOSITION', None),
        ('date-absente', {'publication': None}, 'PROPOSITION', None),
        ('contradiction', {'contradiction': True}, 'ARRET', None),
        ('identite-incertaine', {'siren_confirme': False}, 'ARRET', None),
        ('lecture-incomplete', {'sources_completes': False}, 'ARRET', None),
        ('doublon', {'deja_traite': True}, 'ARRET', None),
    ]
    cas = []
    for identifiant, changements, statut, terme in variantes:
        entree = dict(copy.deepcopy(base), **changements)
        sortie = preparer(entree)
        assert sortie['status'] == statut
        assert (sortie.get('calcul') or {}).get('terme_calendaire') == terme
        assert sortie['annotations'] == entree['annotations']
        assert not any(sortie[k] for k in ['envoi', 'depot', 'ecriture_client'])
        cas.append({'id': identifiant, 'input': entree, 'output': sortie, 'status': 'PASS'})
    preuve = {'status': 'PASS', 'fictitious': True, 'replayedAt': '2026-10-06', 'executedAt': dt.datetime.now(dt.timezone.utc).isoformat(), 'limits': 'Extraits simulés ; aucune connexion ; terme calendaire de deux mois seulement, prorogations et exceptions humaines.', 'cases': cas}
    Path(__file__).with_name('rejeu.json').write_text(json.dumps(preuve, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(cas)} cas PASS ; aucun envoi, dépôt ou écriture client')


if __name__ == '__main__':
    main()
