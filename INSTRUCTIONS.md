# INSTRUCTIONS — UTMB WEDDING SERIES / BROCÉLIANDE V3.1

## Objectif
Maintenir une expérience premium de trail, moderne, visuelle et ludique. La V3.1 est une évolution ciblée de la V3.0.0 et du socle V2.4.2 : ne jamais reconstruire un composant qui fonctionne.

## Identité visuelle officielle — invariant durable
Le fichier source **`Logo_BROCELIANDE - by UTMB.webp` dans son intégralité** est le logo maître et la référence visuelle du site. Il comprend indissociablement le fond forestier flouté, les rochers moussus, les arbres, le cerf, le sentier, les menhirs, le soleil rose, le mot BROCÉLIANDE, le sous-titre ULTRA TRAIL DU MARIAGE BOSSI, le cartouche BY UTMB et la signature DES LÉGENDES PLEIN LES JAMBES.

Sans demande explicite, il est interdit d’en extraire, redessiner, recomposer, recolorer, simplifier, recadrer destructivement, étirer ou remplacer un élément. L’accueil affiche l’image entière avec **un seul traitement autorisé** : un fondu alpha progressif de ses quatre bords. Le cœur, la composition, les couleurs et tous les textes restent nets, intacts, proportionnés et lisibles.

Assets canoniques :
- actif : `assets/brand/logo-broceliande-nature.webp` (`.png` en secours) — image entière, quatre bords fondus ;
- option inactive : `assets/brand/logo-broceliande-transparent.webp` (`.png` en secours) — variante sans nature ;
- source archivée sans modification : `assets/brand/logo-broceliande-source.webp`.

Palette extraite du logo, déclarée dans `style.css` :
- `--brand-forest-deep: #0c1f1b` ;
- `--brand-cream: #f4f0e9` ;
- `--brand-rose-granite: #cc9790` ;
- `--brand-slate: #303930`.

Typographie : Montserrat, proche du style BROCÉLIANDE, pour les titres sportifs et identitaires ; Inter et Cormorant Garamond restent utilisés pour les formulaires, textes longs et touches éditoriales afin de préserver la lisibilité.

## Règles non négociables
1. Lire ce fichier puis `CHANGELOG.md` avant toute modification.
2. Préserver responsive, formulaires pilotés par le Sheet, dossard, déblocages, FR/IT/ES, galerie, PWA, Coach, animations et chargements différés.
3. Ne pas réécrire `app.js`, `style.css` ou `Code.gs` en bloc : faire des changements courts et réversibles.
4. Ne jamais remplacer ou recomprimer les photos et assets Coach validés.
5. Conserver une vraie carte MapLibre satellite 3D avec DEM, hillshade, inclinaison et relief ; jamais d’image statique.
6. Le parcours est construit dans l’ordre de `Etapes › lat / lng`, puis refermé sur le départ. Les coordonnées restent éditables dans le Sheet.
7. Départ et arrivée sont placés au Domaine des Hayes ; leurs marqueurs ronds sont décalés symétriquement s’ils partagent les mêmes coordonnées.
8. Ne jamais modifier ni publier `cles.js`.
9. Sous l’accroche : uniquement les deux textes existants, sans carte de fond, pictogramme, badge ou symbole.
10. `WORLD SERIES` ne doit pas réapparaître sous `WEDDING SERIES`.
11. Tester 1440×900, 768×1024 et 390×844, la console, les formulaires, les langues, les cartes 3D/2D et la PWA.
12. Mettre à jour `CHANGELOG.md` à chaque version.

## Architecture
- `Structure_GitHub/` : contenu à placer à la racine du dépôt GitHub Pages.
- `Apps_Script/Code.gs` : backend Google Sheet / formulaires / traductions.
- `GUIDE_INSTALLATION.md` : ordre de déploiement et activation de la variante inactive.
- `RAPPORT_QUALITE.md` : contrôles et réserves de la livraison.

## Paramétrage depuis le Sheet
- Accueil : `Parametres` (`course_nom`, `lieu`, `accroche`, `sous_accroche`, cadrage photo, etc.).
- Carte : `carte_*`.
- Parcours et pastilles : `Etapes`, surtout `ordre`, `lat` et `lng`.
- Textes/IT/ES : `Corrections_traduction` et colonnes traduites existantes.
