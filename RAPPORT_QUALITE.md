# Rapport qualité — BROCÉLIANDE V3.4.0

## Conclusion
Le prototype **Parcours** est fonctionnel sur ordinateur, tablette et mobile. La carte « Terres de légendes » affiche cinq pastilles numérotées indépendantes de l’image, reliées aux cinq premières étapes issues du Sheet. La couverture, les autres sections et `Code.gs` ne sont pas refondus.

## Contrôles automatisés réalisés
- Chromium aux formats 1440×900, 768×1024 et 390×844 ;
- FR, IT et ES à chaque format, soit neuf scénarios ;
- exactement cinq pastilles et cinq entrées de légende ;
- clic sur une pastille, sélection visuelle, mise à jour de la fiche et bouton d’accès à l’étape ;
- pastilles 1 à 5 toujours numérotées, y compris lorsque l’étape est verrouillée ;
- absence de débordement horizontal dans la section Parcours aux trois formats ;
- chargement du visuel 1536×1024 et positions responsive ;
- syntaxe de `app.js`, `config.js`, `i18n.js`, `cover.js` et `sw.js` ;
- aucune duplication d’identifiant HTML ;
- présence des sept nouvelles clés d’interface dans les trois langues ;
- `Code.gs` comparé au fichier reçu : SHA-256 identique `6fc819951389436a6b91f1b63a8b6ed833c4d0751c3c66f70aaab4ea8485e232`.

## Contrôle visuel
Les aperçus `desktop.png`, `tablet.png` et `mobile.png` confirment :
- la double page sur ordinateur ;
- le passage à deux pages empilées sur tablette et mobile ;
- la lisibilité des titres, de la liste, de la fiche et des pastilles ;
- l’alignement des cinq pastilles sur les cinq emplacements du tracé.

## Réserves de test
- le vrai `cles.js` et les médias privés ne sont volontairement pas inclus ;
- l’envoi réel des formulaires, la PWA installée et Safari iOS restent à vérifier après copie sur la branche de test ;
- le défaut de transition couverture → ancienne page d’accueil est volontairement hors périmètre ;
- les coordonnées `carte_x` / `carte_y` pourront être affinées après validation sur les données réelles du Sheet.
