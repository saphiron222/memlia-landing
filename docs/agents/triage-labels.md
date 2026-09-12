# Labels de triage

Les skills emploient cinq rôles canoniques. Ce tableau les associe aux valeurs utilisées dans les lignes `Status:` des tickets locaux.

| Rôle dans mattpocock/skills | Valeur dans ce dépôt | Sens |
|---|---|---|
| `needs-triage` | `needs-triage` | Le mainteneur doit évaluer le ticket. |
| `needs-info` | `needs-info` | Des informations du demandeur sont attendues. |
| `ready-for-agent` | `ready-for-agent` | Le ticket est assez spécifié pour un agent autonome. |
| `ready-for-human` | `ready-for-human` | L'implémentation exige une intervention humaine. |
| `wontfix` | `wontfix` | Le ticket ne sera pas traité. |

Quand un skill désigne un rôle, utiliser la valeur correspondante dans `Status:`. Modifier uniquement la colonne « Valeur dans ce dépôt » si le vocabulaire local évolue.
