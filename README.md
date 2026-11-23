# BROCÉLIANDE V3.10.0

Évolution ciblée de la V3.9.0. Le socle GitHub Pages / Google Apps Script, les formulaires, les traductions FR/IT/ES, les déblocages, la carte interactive et Coach Merlin sont conservés.

## Évolutions principales

- entrée dans le grimoire plus rapide et plus ample, conclue par un écran noir ;
- inscription FR/IT/ES en bronze avec scintillement discret ;
- taille de l'inscription réglable séparément sur ordinateur/tablette et mobile via Google Sheets ;
- compte à rebours forestier ajouté au bas de la couverture ;
- pastilles de navigation mobiles en or ;
- Coach Merlin actif par défaut ;
- bloc « Date limite de réponse » harmonisé en vert sapin et or ;
- textes longs en Alegreya Sans, plus ronde et toujours très lisible ;
- accueil mobile remplacé par `Accueil_Mobile_Reference_V2.0.jpg` ;
- badges « Nouveau » mobiles placés en haut à droite, sans étirement ni recouvrement.

## Déploiement

1. Sauvegarder le dépôt actuel ou créer une branche de test.
2. Copier le contenu de `A_COPIER_DANS_GITHUB/` à la racine, sans suppression globale.
3. Conserver `cles.js`, les icônes, les cartes et les médias privés existants.
4. Remplacer `Apps_Script/Code.gs`, exécuter `majStructure()`, puis redéployer l'application Web Apps Script.
5. Publier le site puis forcer l'actualisation du cache PWA.

`majStructure()` ajoute les deux nouvelles lignes de taille sans écraser les valeurs déjà présentes.

## Nouveaux paramètres Google Sheet

| Clé | Valeur initiale | Plage |
|---|---:|---:|
| `couverture_texte_taille` | 22 | 10 à 48 px |
| `couverture_texte_taille_mobile` | 16 | 10 à 36 px |

## Contrôles prioritaires après publication

- couverture et transition sur ordinateur, tablette et téléphone ;
- inscription dans les trois langues et réglages de taille ;
- compte à rebours ;
- badges « Nouveau » ;
- apparition de Merlin ;
- carte, formulaires et déblocages ;
- Safari iOS et Chrome Android.
