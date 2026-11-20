# INSTRUCTIONS — BROCÉLIANDE V3.3.1

## Invariants de la couverture
1. Conserver les trois assets `assets/cover/cover-desktop`, `cover-tablet` et `cover-mobile` dans leurs proportions natives.
2. Ne jamais remettre l’inscription dans l’image : elle doit rester dans `.cover-inscription` et provenir de `i18n.js`.
3. Interdiction de `text-shadow`, `filter`, `backdrop-filter`, cache flouté ou halo sur ou derrière l’inscription.
4. Conserver exactement les textes : FR `ENTREZ DANS LA LÉGENDE`, IT `ENTRATE NELLA LEGGENDA`, ES `ENTRAD EN LA LEYENDA`.
5. Toute évolution doit être contrôlée en 1440×900, 768×1024 et 390×844, dans les trois langues.

## Invariants fonctionnels
- Ne pas modifier `Code.gs` pour une évolution visuelle.
- Préserver formulaires, Google Sheet, déblocages, carte MapLibre 3D/2D, relief DEM, PWA, Coach, galerie et accès privé.
- Ne jamais publier `cles.js`.
- Conserver les médias privés et personnels du dépôt actif.
- Faire des changements ciblés et réversibles ; ne pas réécrire le moteur fonctionnel.
