# BROCÉLIANDE V3.8.0

Mise à jour visuelle ciblée de la V3.7.0. Le socle GitHub Pages / Google Apps Script, les formulaires, les traductions et les règles de déblocage sont conservés.

## À copier

Copier le contenu de `A_COPIER_DANS_GITHUB/` à la racine du dépôt **sans suppression globale**. Cette livraison contient le nouveau visuel mobile `assets/cover/Reference-Accueil-Mobile.png`.

## Changements principaux

- palette, polices et fonds harmonisés sur la direction artistique du Parcours ;
- texture de page ancienne discrète sur les cartes de section, jamais sur la carte géographique ;
- arrière-plan intérieur continu, sans coupure de couleur entre les sections ;
- boutons précédent/suivant supprimés au profit de la navigation verticale et de la bannière ;
- progression du Parcours centrée ;
- sous-carte « Étape sélectionnée » supprimée ;
- étape sélectionnée mise en valeur directement dans la liste ;
- cinq étapes visibles sur mobile ;
- accueil mobile remplacé par `Reference-Accueil-Mobile.png`, centré et sans déformation ;
- Programme mobile renforcé : largeur, retours à la ligne, guillemets et hiérarchie typographique fiabilisés.

## À préserver impérativement

- `cles.js` ;
- `icons/` ;
- `assets/coach/` ;
- les photos et médias privés ;
- les autres images déjà présentes dans `assets/book/` et `assets/map/` ;
- les contenus et réponses du Google Sheet.

## Déploiement

Aucune modification du schéma Google Sheet ni du backend n'est nécessaire. `Apps_Script/Code.gs` est fourni à titre de référence et reste identique à la V3.7.0. Aucun redéploiement Apps Script n'est requis.

Après publication, forcer l'actualisation du site ou vider l'ancien cache PWA, puis contrôler la couverture et le Programme sur un téléphone réel.
