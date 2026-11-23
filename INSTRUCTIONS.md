# Instructions de maintenance — V3.11.0

- Le prologue Merlin est volontairement reporté.
- Le Studio est la façade d’édition ; les onglets techniques restent les sources réelles.
- Une modification de la colonne Valeur du Studio est immédiatement recopiée dans la cellule technique correspondante.
- `Actualiser le Studio depuis le site` reconstruit la façade à partir des données techniques.
- Les réglages typographiques à 100 % reproduisent le rendu V3.10.0 sans remplacement des tailles CSS.
- Ne pas dépasser les bornes proposées : elles protègent les traductions FR/IT/ES et le responsive.
- Le cadrage de l’image, l’inscription et le chronomètre sont trois groupes de réglages indépendants.
- `couverture_image_position_h/v` pilote l’image PC/tablette ; les clés `_mobile` pilotent le mobile.
- `compte_rebours_position_h/v` et `compte_rebours_echelle` pilotent le chronomètre ; les clés `_mobile` pilotent le mobile.
- Conserver `cles.js`, les icônes, les cartes et les médias privés.
