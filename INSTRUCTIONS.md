# INSTRUCTIONS — UTMB WEDDING SERIES / BROCÉLIANDE

## Objectif
Maintenir le site du mariage comme une expérience premium de trail, moderne, visuelle, ludique et engageante. La V3 est une **chirurgie ciblée** de la V2.4.2, jamais une reconstruction.

## Règles non négociables
1. Lire ce fichier et `CHANGELOG.md` avant toute modification.
2. Préserver les mécanismes V2.4.2 : responsive, formulaires pilotés par le Sheet, dossard, déblocages, traductions/corrections, galerie, PWA, Coach, animations et chargement différé.
3. Ne pas réécrire `app.js`, `style.css` ou `Code.gs` en bloc. Faire des diffs courts, localisés et réversibles.
4. Ne jamais remplacer ou recomprimer les photos et assets Coach validés.
5. La carte doit rester une vraie carte MapLibre satellite 3D avec relief DEM ; aucune image statique ne peut la remplacer.
6. Les coordonnées d’étapes restent éditables dans le Sheet (`Etapes`, colonnes `lat` / `lng`).
7. `cles.js` est privé : ne pas le committer, l’écraser ni en recopier les secrets.
8. Après toute évolution : tester au minimum 1440×900, 768×1024 et 390×844, vérifier la console, les formulaires, les langues, la carte 3D/2D et la PWA.
9. Mettre à jour `CHANGELOG.md` à chaque version. Ne modifier ce fichier que si une règle de continuité change.

## Architecture
- `Structure_GitHub/` : contenu à placer à la racine du dépôt GitHub Pages.
- `Apps_Script/Code.gs` : backend Google Sheet / formulaires / traductions.
- `GUIDE_INSTALLATION.md` : ordre de déploiement.
- `RAPPORT_QUALITE.md` : contrôles et réserves de la livraison.

## Identité V3
- Marque parodique : **UTMB WEDDING SERIES** ; `WORLD SERIES` reste discret.
- Course : **BROCÉLIANDE**.
- Sous-titre conservé : **Ultra Trail du Mariage Bossi**.
- Palette : vert sapin `#0b3b2e`, bleu ardoise `#0f2b46`, rose granit `#d85c7c`, crème `#f5efe4`.
- Pas d’affiliation officielle : conserver la mention du pied de page.

## Modifications depuis le Sheet
- Accueil : onglet `Parametres` (`course_nom`, `lieu`, `accroche`, `sous_accroche`, etc.).
- Carte : `carte_*`.
- Points : onglet `Etapes`, surtout `lat` et `lng`.
- Textes/IT/ES : `Corrections_traduction` et les colonnes traduites existantes.

## Passation à une autre IA
Demande recommandée : « Lis `INSTRUCTIONS.md` et `CHANGELOG.md`, pars de la version actuelle, préserve strictement le socle V2.4.2 et propose un diff ciblé avec tests desktop/tablette/mobile. »
