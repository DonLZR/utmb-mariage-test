# CHANGELOG

## V3.5.0 — transition directe, carnet réaliste et zoom de couverture

### Couverture
- L’ouverture mène directement à la section Parcours.
- L’ancien hero devient invisible tout en restant présent pour la compatibilité des fonctions historiques.
- L’inscription FR utilise désormais la même police HTML que les versions IT et ES.
- La taille des trois inscriptions est légèrement augmentée.
- Le mobile affiche une couverture plus petite, centrée et au ratio 3:2.
- Ajout des paramètres Sheet `couverture_zoom` et `couverture_zoom_mobile` (0,75 à 1,35 ; défaut 1).

### Pages intérieures
- Utilisation du référentiel de page vierge fourni comme texture réelle.
- Variante miroir pour le folio gauche.
- Habillage cohérent des étapes et de la galerie.
- Sur mobile, pages séparées plus lisibles et carte affichée avant Parcours.

### Carte
- Remplacement par la carte Brocéliande fournie.
- Suppression des toponymes HTML redondants.
- Recalage des cinq pastilles sur les numéros imprimés.
- Conservation des surcharges facultatives `carte_x` / `carte_y`.

### Continuité
- Sources V3.4.0 fournies utilisées comme base directe.
- `i18n.js` fonctionnellement inchangé.
- Formulaires, déblocages, dossard, galerie et Coach non réécrits.
- Cache PWA porté à V3.5.0.
- `Code.gs` conserve sa logique ; seules deux lignes de paramètres et la version sont ajoutées.