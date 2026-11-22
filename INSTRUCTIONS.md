# INSTRUCTIONS — BROCÉLIANDE V3.5.0

## Référentiel

- Les sources de référence sont les fichiers V3.4.0 fournis par l’utilisateur, pas une version reconstruite plus ancienne.
- La couverture utilise `assets/cover/cover-main-v333.png`.
- Le fond intérieur utilise `assets/book/page-vierge.webp` et sa variante miroir pour la page gauche.
- La carte utilise `assets/map/carte-broceliande.webp`.

## Invariants fonctionnels

- Préserver les formulaires pilotés par l’onglet `Questions`.
- Préserver réponses, dossard, déblocages, galerie, PWA, langues FR/IT/ES et Coach.
- Ne jamais publier ni remplacer `cles.js`.
- Conserver `icons/`, `assets/brand/`, les médias privés et les assets Coach du dépôt actif.
- Les changements ultérieurs doivent partir des fichiers complets V3.5.0 livrés ici.

## Couverture

- Le clic ouvre directement `#parcours` ; ne pas réintroduire l’ancien hero visible.
- L’inscription est du texte HTML localisé dans la même police pour les trois langues.
- Le zoom agit sur `.book-cover-visual`, qui contient l’image et l’inscription : ne pas zoomer seulement l’image.
- Paramètres Sheet : `couverture_zoom` et `couverture_zoom_mobile`, bornés entre `0,75` et `1,35`.
- Les paramètres historiques `accueil_zoom*` ne pilotent pas la couverture.

## Carte

- Les cinq pastilles restent des boutons HTML indépendants.
- Les positions par défaut correspondent aux numéros imprimés sur la carte fournie.
- `Etapes.carte_x` et `Etapes.carte_y` restent des surcharges facultatives.
- Sur écran étroit, la carte doit rester avant la page « Parcours ».

## Contrôle minimum

Avant publication, tester au moins :

- 1440×900, 768×1024 et 390×844 ;
- FR, IT et ES ;
- ouverture de couverture ;
- zoom Sheet par défaut et personnalisé ;
- cinq pastilles et accès aux étapes ;
- formulaires, réponses, dossard et déblocages avec le vrai Apps Script ;
- PWA hors ligne après mise à jour du cache ;
- Coach et sa préférence locale.