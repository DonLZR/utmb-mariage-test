# Rapport qualité — V3.2.1 BROCÉLIANDE

## Conclusion
La V3.2.1 conserve le socle fonctionnel V3.2.0 et remplace uniquement l’habillage de l’accueil et de la bannière supérieure. Les formulaires, traductions existantes, PWA, Coach, carte, boucle pilotée par le Sheet, accès et mécanismes V2.4.2 restent en place.

## Contrôles de la couverture
- Couverture responsive en cuir vert sapin, cadre et angles celtiques dorés, sceau central or ancien.
- Asset `assets/brand/seal-broceliande-or.webp` dérivé du logo maître joint : les éléments demandés sont conservés et l’ancienne signature est absente.
- Une seule inscription visible sous le sceau ; clés FR/IT/ES vérifiées avec les libellés exacts validés.
- Toute la couverture est un bouton clavier/souris/tactile ; réduction des animations respectée.
- Les anciens nœuds dynamiques de l’accueil sont conservés hors affichage pour ne pas rompre le chrono, l’altimètre ou le dossard.
- Bannière supérieure sans « UTMB WEDDING SERIES », mais navigation, langues et bouton PWA conservés.

## Contrôles de conception
- Source maître archivée à l’identique : SHA-256 `6ca9ed9b1cbcf1695f448dc60b7b889cdc0635e7b1119aac08ab8f6de20473c7`.
- Sceau dérivé : SHA-256 `3c6418db63c6739372e448718a974f344a3d9456907fabf5148a00a313b9f829` ; cadrage arrêté avant l’ancienne signature, sans étirement de la composition restante.
- Accroche, sous-phrase, prénoms, date, chrono, altimètre et dossard ne sont pas rendus sur la couverture ; leurs identifiants et leur logique restent présents pour compatibilité.
- La traduction repose sur le même `data-i18n` et le même changement de langue/rechargement que le reste du site.
- La police celtique dispose d’un repli local ; la couverture reste lisible si Google Fonts est indisponible.
- Titres des grandes cartes d’étape : `--map-surround-blue: #0f2b46`.

## Carte et parcours
- La vue d’ouverture de la première visite utilise un cadrage Bretagne large (`[-2.65, 48.10]`, zoom 6,35, inclinaison 18°), puis rejoint exactement `VIEW.center`, `VIEW.zoom`, `VIEW.pitch` et `VIEW.bearing`.
- Le zoom final n’est jamais supérieur au réglage `carte_zoom` du Sheet.
- L’animation démarre seulement lorsque la carte est réellement visible, est mémorisée dans `localStorage` et est désactivée avec `prefers-reduced-motion`.
- Le bouton Vue d’ensemble, les clics sur étapes, les pastilles 3D/2D, la boucle et le relief DEM ne sont pas modifiés.

## Contrôles techniques réalisés
- Syntaxe validée pour `app.js`, `config.js`, `i18n.js`, `sw.js`, `assets/coach/coach.js` et `Apps_Script/Code.gs`.
- HTML analysé : aucun identifiant dupliqué et tous les identifiants attendus par le moteur V3.2.0 sont présents.
- CSS analysé sans erreur de syntaxe ; clés FR/IT/ES et libellés exacts vérifiés automatiquement.
- `Apps_Script/Code.gs` est bit à bit identique au fichier V3.2.0 fourni.
- Cohérence de la version web/cache 3.2.1 vérifiée dans `index.html`, `config.js` et `sw.js` ; le backend reste volontairement en 3.2.0.
- Rendus statiques contrôlés aux formats 1440×900, 768×1024 et 390×844 : couverture contenue, sceau et phrase visibles, aucun débordement de la couverture.

## Réserves après publication
1. Valider le rendu final de la texture cuir, du filtre WebP et de l’ouverture 3D dans Chrome, Safari et Safari iOS sur de vrais appareils.
2. Tester la vraie animation MapLibre, les tuiles Esri, le DEM et le hillshade sur le dépôt de test : ces fonctions n’ont pas été modifiées, mais nécessitent le réseau et WebGL.
3. Tester un envoi réel Apps Script avec le `cles.js` privé, volontairement absent de la livraison.
4. Conserver impérativement `cles.js`, le dossier `icons/` et `assets/coach/coach.webp` lors de la copie dans le dépôt.
