"""Horloge Python locale à un scénario de test, jamais un réglage production."""
from datetime import date
from unittest.mock import patch


def jour_fixe(plan, jour):
    class JourFige(date):
        @classmethod
        def today(cls):
            return jour

    return patch.object(plan, 'date', JourFige)
