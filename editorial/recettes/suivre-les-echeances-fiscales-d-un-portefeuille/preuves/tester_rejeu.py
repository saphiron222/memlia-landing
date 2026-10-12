import unittest
import runpy
from pathlib import Path

replay_module = runpy.run_path(str(Path(__file__).with_name('rejouer.py')))
BASE = replay_module['BASE']
classer = replay_module['classer']
rejouer = replay_module['rejouer']

class ClassementFictifTests(unittest.TestCase):
    def test_sorties_et_totaux(self):
        result = rejouer()
        self.assertEqual(result['lignes'], 12)
        aggregate = result['agrege']
        assert isinstance(aggregate, dict)
        self.assertEqual(list(aggregate.values()), [7, 2, 2, 1])
    def test_qualification_absente_bloque_meme_avec_retour(self):
        self.assertEqual(classer(BASE | dict(qualifie=False, transmis=True, retour='accepte', paiement='confirme')), 'À qualifier')
    def test_date_absente_bloque_meme_avec_retour(self):
        self.assertEqual(classer(BASE | dict(date_confirmee=False, transmis=True, retour='accepte', paiement='confirme')), 'À qualifier')
    def test_paiement_ne_prouve_pas_transmission(self):
        self.assertEqual(classer(BASE | dict(paiement='confirme')), 'Préparation prête')
    def test_retour_sans_transmission_est_incoherent(self):
        self.assertEqual(classer(BASE | dict(retour='accepte')), 'Incohérence à qualifier')
    def test_paiement_inconnu_ne_confirme_pas(self):
        self.assertEqual(classer(BASE | dict(transmis=True, retour='accepte', paiement='inconnu')), 'Dépôt confirmé, paiement à vérifier')
    def test_doublon_fourni_est_isole(self):
        self.assertEqual(classer(BASE | dict(doublon=True, transmis=True, retour='accepte', paiement='confirme')), 'Doublon à qualifier')
    def test_mauvaise_periode_fourni_est_isolee(self):
        self.assertEqual(classer(BASE | dict(periode_retour_ok=False, transmis=True, retour='accepte', paiement='confirme')), 'Période à qualifier')

if __name__ == '__main__':
    unittest.main(verbosity=2)
