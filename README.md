# BROCÉLIANDE V3.5.0 — carnet réaliste et transition directe

Mise à jour ciblée construite sur les **six sources V3.4.0 réellement fournies** (`config.js`, `cover.js`, `i18n.js`, `style.css`, `sw.js`, `app.js`) et sur l’`index.html` actuel.

## Résultat

- le clic sur le grimoire ouvre directement `#parcours` ; l’ancien accueil reste uniquement comme structure technique masquée pour préserver les fonctions historiques ;
- une inscription HTML unique utilise la même police en français, italien et espagnol, avec une taille légèrement augmentée ;
- la couverture mobile est plus petite, centrée et toujours au ratio natif 3:2 ;
- les pages utilisent le visuel réaliste fourni `Reference-Page-vierge.png` ;
- la carte fournie `Reference-Carte-Brocéliande.png` remplace l’ancienne ;
- les cinq pastilles HTML sont placées au-dessus des numéros 1 à 5 de cette carte ;
- sur mobile et tablette étroite, la carte précède désormais la page « Parcours » ;
- deux réglages Google Sheet pilotent le zoom de la couverture sans déformer l’image ni désolidariser l’inscription.

## Réglages Google Sheet — onglet `Parametres`

| Clé | Défaut | Plage appliquée | Effet |
|---|---:|---:|---|
| `couverture_zoom` | `1` | `0,75` à `1,35` | Couverture ordinateur et tablette |
| `couverture_zoom_mobile` | `1` | `0,75` à `1,35` | Couverture smartphone |

`1` conserve le rendu livré. Une valeur inférieure dézoome ; une valeur supérieure zoome. Les virgules et les points décimaux sont acceptés. Les valeurs hors plage sont automatiquement bornées.

Ces clés sont distinctes de `accueil_zoom`, qui ne concernait que l’ancienne photo hero désormais masquée. Exécuter `majStructure()` dans Apps Script ajoute les deux lignes si elles n’existent pas, sans écraser les autres paramètres.

## Contenu

- `A_COPIER_DANS_GITHUB/` : fichiers complets à copier dans le dépôt existant, sans suppression globale ;
- `Apps_Script/Code.gs` : version complète, logique conservée, avec uniquement les deux nouvelles lignes de paramètres et la version mise à jour ;
- `codecomplet_V3.5.0.txt` : regroupement intégral des sources texte pour les prochains échanges ;
- `GUIDE_INSTALLATION.md` : procédure de déploiement ;
- `RAPPORT_QUALITE.md` : contrôles effectués et limites ;
- `DIFF_RESUME.md` : périmètre exact des changements.

## Important

Conserver impérativement `cles.js`, `icons/`, `assets/coach/coach.webp`, `assets/coach/coach.js`, les logos, photos et médias privés déjà présents dans le dépôt.