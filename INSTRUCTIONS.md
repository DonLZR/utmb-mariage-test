# Instructions de maintenance — V3.6.0

## Référentiel

La V3.6.0 complète devient la base des évolutions suivantes. Ne pas repartir d’un fichier V3.4.0 isolé.

## Invariants à préserver

- GitHub Pages, Apps Script, Google Sheets, formulaires, déblocages, dossard, Coach, galerie et PWA.
- Couverture photoréaliste et ratio non déformé.
- FR / IT / ES.
- Cinq pastilles interactives et coordonnées `carte_x` / `carte_y` du Sheet.
- Sur mobile, exactement deux étapes visibles dans la fenêtre du Parcours et la carte en dessous.
- Ne pas supprimer `cles.js`, `icons/`, les assets Coach ni les médias privés.

## Règle de mise en page

Une double page PC/tablette devient une seule page de carnet sur mobile. Le contenu peut être compacté, mais pas scindé en deux fonds de page empilés.

## Déblocage mobile

La clé locale `utmb_mobile_stage_window_v1` mémorise la progression déjà vue. Ne pas la réinitialiser lors d’un simple rendu ou à partir d’un cache de données plus ancien.
