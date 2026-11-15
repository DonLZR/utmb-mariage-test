# Rapport qualité — V3.2.0 BROCÉLIANDE

## Conclusion
La V3.2.0 conserve le socle V3.1 et applique uniquement les évolutions demandées sur l’accueil, la première arrivée carte et les titres des grandes cartes d’étape. Les formulaires, traductions, PWA, Coach, boucle pilotée par le Sheet et mécanismes V2.4.2 restent en place.

## Contrôles de conception
- Logo maître et chemins d’assets inchangés ; proportions 1536×1024 préservées.
- Masque CSS organique et asymétrique ajouté au conteneur du logo, avec variantes PC, tablette et mobile ; le centre reste opaque.
- Accroche et sous-phrase retirées du HTML et du rendu JavaScript ; les clés de données historiques ne sont pas supprimées.
- La date `heroDate` est placée dans le DOM immédiatement après `heroPrenoms`, avant les panneaux ; `startChrono()` conserve la source dynamique et `toLocaleDateString()` conserve la locale FR/IT/ES.
- `WEDDING SERIES` reste un élément HTML accessible, mais il est désormais sous `UTMB`, plus petit et déporté à droite sur les deux lockups.
- Variables éditables : `--font-hero-details` et `--font-intro-message`.
- Titres des grandes cartes d’étape : `--map-surround-blue: #0f2b46`.

## Carte et parcours
- La vue d’ouverture de la première visite utilise un cadrage Bretagne large (`[-2.65, 48.10]`, zoom 6,35, inclinaison 18°), puis rejoint exactement `VIEW.center`, `VIEW.zoom`, `VIEW.pitch` et `VIEW.bearing`.
- Le zoom final n’est jamais supérieur au réglage `carte_zoom` du Sheet.
- L’animation démarre seulement lorsque la carte est réellement visible, est mémorisée dans `localStorage` et est désactivée avec `prefers-reduced-motion`.
- Le bouton Vue d’ensemble, les clics sur étapes, les pastilles 3D/2D, la boucle et le relief DEM ne sont pas modifiés.

## Contrôles techniques réalisés
- Syntaxe validée pour `app.js`, `config.js`, `i18n.js`, `sw.js`, `assets/coach/coach.js` et `Apps_Script/Code.gs`.
- HTML analysé, accolades CSS équilibrées et ordre DOM vérifié : prénoms → date → panneaux.
- Absence confirmée des identifiants actifs `heroTagline` et `heroPunchline`.
- Cohérence des versions 3.2.0 vérifiée dans Apps Script, configuration, HTML, PWA et cache.
- Contrôle statique WeasyPrint réussi en 1440×900, 768×1024, 390×844, 390×600 et 844×500 : date après les prénoms, panneaux après la date en mode compact et réserve conservée avant le CTA.

## Réserves après publication
1. Tester la vraie animation MapLibre, les tuiles Esri, le DEM et le hillshade dans Chrome et Safari sur le dépôt de test.
2. Tester le fondu sur la photo d’accueil réellement chargée depuis Drive, notamment sur Safari iOS.
3. Tester les envois Apps Script avec le vrai `cles.js`, volontairement absent du code consolidé.
4. Conserver le binaire Coach existant lors de la copie du dossier GitHub.
