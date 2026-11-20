# INSTRUCTIONS — BROCÉLIANDE V3.4.0

## Périmètre verrouillé
1. La couverture d’accueil est intouchable : conserver ses assets, son inscription graphique et son comportement.
2. La V3.4.0 ne transforme que la section `#parcours`.
3. Le défaut de transition après ouverture de la couverture est hors périmètre et sera traité séparément.

## Carte Parcours
1. Conserver le visuel `assets/map/carte-terres-de-legendes.webp` sans numéro, pin ou slogan incrusté.
2. Conserver le titre exact `Terres de légendes`.
3. Les cinq pastilles restent des boutons HTML indépendants, reliés aux cinq premières étapes du Sheet.
4. Leur position est réglable par `config.js > parchmentMap.positions` ou par `Etapes > carte_x / carte_y`.
5. Les étapes, titres, lieux, statuts, kilomètres et déblocages continuent de venir du Sheet.

## Invariants fonctionnels
- Ne pas modifier `Code.gs` pour ce prototype.
- Préserver formulaires, Google Sheet, déblocages, PWA, Coach, galerie, dossard et accès privé.
- Préserver les traductions FR / IT / ES.
- Ne jamais publier `cles.js`.
- Conserver les médias privés et personnels du dépôt actif.
- Faire des changements ciblés et réversibles.

## Contrôle minimal
Tester 1440×900, 768×1024 et 390×844, au clavier et au toucher, avec les trois langues.
