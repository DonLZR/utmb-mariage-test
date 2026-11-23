# BROCÉLIANDE V3.9.0

Évolution graphique ciblée de la V3.8.0. Le socle GitHub Pages / Google Apps Script, les formulaires, les traductions FR/IT/ES, les déblocages et la carte interactive sont conservés.

## Évolutions principales

- le fond général du site devient vert forêt sombre et se distingue clairement des pages de contenu ;
- chaque page/carte reçoit une texture discrète de vieux parchemin, sans effet appliqué à la carte géographique ;
- la hiérarchie visuelle de toutes les sections est alignée sur **Parcours** ;
- Programme = Chapitre I, Parcours = Chapitre II, puis les étapes commencent au Chapitre III ;
- les anciennes pastilles numérotées noires des sections sont supprimées ;
- le Coach marmotte est remplacé par **Merlin**, avec le moteur d'animation existant conservé ;
- l'ouverture de la couverture devient un zoom avant avec fondu noir, sans rotation de page.

## Déploiement

1. Sauvegarder le dépôt actuel ou créer une branche de test.
2. Copier le contenu de `A_COPIER_DANS_GITHUB/` à la racine du dépôt, sans suppression globale.
3. Conserver `cles.js`, les icônes, les cartes et les médias privés déjà présents.
4. Autoriser le remplacement de `assets/coach/coach.js` et `assets/coach/coach.webp` : ce sont les nouveaux fichiers Merlin.
5. Publier puis forcer l'actualisation du cache PWA.

Aucune modification du Google Sheet ni aucun redéploiement Apps Script n'est requis.

## Contrôles prioritaires après publication

- ouverture de la couverture sur ordinateur et téléphone ;
- enchaînement Chapitres I, II, III et suivants ;
- apparition de Merlin et de ses animations ;
- carte, formulaires et déblocages ;
- rendu Safari iOS et Chrome Android.
