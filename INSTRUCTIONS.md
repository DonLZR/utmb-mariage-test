# INSTRUCTIONS — BROCÉLIANDE V3.2.1

## Objectif
Maintenir une expérience premium de trail, moderne, visuelle et ludique. La V3.2 est une évolution ciblée de la V3.1.0 et du socle V2.4.2 : ne jamais reconstruire un composant qui fonctionne.

## Identité visuelle officielle — invariant durable
Le fichier **`assets/brand/logo-broceliande-source.webp`** est l’archive à l’identique du logo maître. La demande explicite validée pour la V3.2.1 autorise une seule dérivation active : **`assets/brand/seal-broceliande-or.webp`**, recolorée en or ancien et privée uniquement de « DES LÉGENDES PLEIN LES JAMBES ». Elle doit conserver le cerf, les arbres, les sapins, les menhirs, le chemin, le soleil, BROCÉLIANDE, ULTRA TRAIL DU MARIAGE BOSSI et BY UTMB.

La couverture en cuir vert sapin, ses dorures celtiques, le sceau, son ouverture et l’inscription localisée constituent désormais l’accueil validé. Ne pas réintroduire les anciens blocs visuels de l’accueil.

Assets canoniques :
- actif : `assets/brand/seal-broceliande-or.webp` — sceau de la couverture ;
- source archivée sans modification : `assets/brand/logo-broceliande-source.webp` ;
- assets V3.2.0 historiques : à conserver dans le dépôt existant, même s’ils ne sont plus rendus par l’accueil.

Palette extraite du logo, déclarée dans `style.css` :
- `--brand-forest-deep: #0c1f1b` ;
- `--brand-cream: #f4f0e9` ;
- `--brand-rose-granite: #cc9790` ;
- `--brand-slate: #303930`.

Typographie : Montserrat, proche du style BROCÉLIANDE, pour les titres sportifs et identitaires, dont les prénoms, la date et le message d’introduction. Les variables `--font-hero-details` et `--font-intro-message` permettent une évolution ciblée. Inter et Cormorant Garamond restent utilisés pour les formulaires et textes longs afin de préserver la lisibilité.

## Règles non négociables
1. Lire ce fichier puis `CHANGELOG.md` avant toute modification.
2. Préserver responsive, formulaires pilotés par le Sheet, dossard, déblocages, FR/IT/ES, galerie, PWA, Coach, animations et chargements différés.
3. Ne pas réécrire `app.js`, `style.css` ou `Code.gs` en bloc : faire des changements courts et réversibles.
4. Ne jamais remplacer ou recomprimer les photos et assets Coach validés.
5. Conserver une vraie carte MapLibre satellite 3D avec DEM, hillshade, inclinaison et relief ; jamais d’image statique.
6. Le parcours est construit dans l’ordre de `Etapes › lat / lng`, puis refermé sur le départ. Les coordonnées restent éditables dans le Sheet.
7. Départ et arrivée sont placés au Domaine des Hayes ; leurs marqueurs ronds sont décalés symétriquement s’ils partagent les mêmes coordonnées.
8. Ne jamais modifier ni publier `cles.js`.
9. Ne pas réintroduire l’ancienne accroche ni sa sous-phrase sur l’accueil ; conserver le message d’introduction.
10. `WORLD SERIES` et `UTMB WEDDING SERIES` ne doivent pas réapparaître dans l’accueil ni dans la bannière supérieure. Le sceau conserve en revanche le cartouche « BY UTMB » validé.
11. Le zoom d’arrivée Bretagne → course se joue une seule fois par appareil, respecte la réduction des animations et se termine exactement sur `VIEW`.
12. Les grandes cartes d’étape utilisent le bleu de la zone carte pour leurs titres, jamais le noir.
13. Tester 1440×900, 768×1024 et 390×844, la console, les formulaires, les langues, les cartes 3D/2D et la PWA.
14. Mettre à jour `CHANGELOG.md` à chaque version.

## Architecture
- `Structure_GitHub/` : contenu à placer à la racine du dépôt GitHub Pages.
- `Apps_Script/Code.gs` : backend Google Sheet / formulaires / traductions.
- `GUIDE_INSTALLATION.md` : ordre de déploiement et activation de la variante inactive.
- `RAPPORT_QUALITE.md` : contrôles et réserves de la livraison.

## Paramétrage depuis le Sheet
- Accueil : l’inscription visible est gérée par `i18n.js` (`grimoire_entree`) et doit rester exactement FR « ENTREZ DANS LA LÉGENDE », IT « ENTRATE NELLA LEGGENDA », ES « ENTRAD EN LA LEYENDA ». Les anciennes clés Sheet sont conservées pour compatibilité mais ne sont pas rendues sur la couverture.
- Carte : `carte_*`.
- Parcours et pastilles : `Etapes`, surtout `ordre`, `lat` et `lng`.
- Textes/IT/ES : `Corrections_traduction` et colonnes traduites existantes.
