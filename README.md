# BROCÉLIANDE V3.6.0

Évolution ciblée de la V3.5.0, sans refonte du socle GitHub Pages / Google Apps Script.

## Nouveautés

- **Programme** ajouté entre la couverture et le Parcours : double page sur ordinateur/tablette, page unique sur mobile.
- Déroulé du week-end fourni intégré, avec traduction automatique FR/IT/ES via l’onglet `Programme`.
- **Deux flèches de navigation** cohérentes en bas de chaque page/section.
- **Bandeau photo défilant** réintégré dans l’univers du carnet ; il utilise le dossier Drive `bandeau` existant et reste masqué s’il est vide.
- Suppression de **BY UTMB** dans la bannière supérieure uniquement.
- Couverture mobile immersive à deux couches : ambiance plein écran et grimoire net, non déformé, presque intégralement visible.
- Position de l’inscription de couverture pilotable depuis Google Sheets, pour les trois langues.
- Parcours mobile : **exactement deux étapes visibles simultanément**, liste avant carte, cinq pastilles interactives conservées.
- Lors d’un nouveau déblocage, la liste mobile roule discrètement vers le haut. L’état est mémorisé pour ne pas rejouer l’effet à chaque actualisation et `prefers-reduced-motion` est respecté.

## Structure

- `index.html`, `style.css`, `app.js`, `config.js`, `i18n.js`, `cover.js`, `sw.js` : fichiers complets à copier dans GitHub.
- `assets/` : visuels validés et dérivés optimisés.
- `Apps_Script/Code.gs` : backend complet V3.6.0.
- `QA/` : contrôles statiques reproductibles.
- `codecomplet_V3.6.0.txt` : sources texte regroupées.

## Important

Ne jamais supprimer globalement le dépôt existant. Conserver impérativement `cles.js`, `icons/`, `assets/coach/coach.webp` et les médias privés déjà présents.
