# Rapport qualité — V3.0.0 BROCÉLIANDE

## Conclusion
La V3 conserve le socle premium V2.4.2 et lui superpose une identité BROCÉLIANDE ciblée. Aucun composant validé n’a été reconstruit. Les contrôles automatisés et visuels n’ont détecté ni débordement horizontal, ni collision desktop/tablette, ni erreur JavaScript de page.

## Éléments inchangés
- Structure des composants V2.4.2 : navigation, accueil, CTA à cheval, chrono, altimètre, dossard, étapes, panneaux de carte, galerie, lightbox et modale iOS.
- Moteur de formulaires piloté par le Sheet, conditions, validation, enregistrement, déblocage personnel et attribution du dossard.
- Système FR/IT/ES et `Corrections_traduction`.
- Chargement différé de MapLibre et du Coach.
- Carte : MapLibre 4.7.1, tuiles satellite Esri (maxzoom 17), DEM Terrarium (maxzoom 14), hillshade, terrain 3D et secours 2D.
- Moteur Coach : `assets/coach/coach.js` est strictement identique au fichier V2.4.2 (comparaison binaire).
- Photo source fournie : conservée sans recompression, hash SHA-256 identique à l’original.

## Éléments modifiés
- Couche d’identité : palette, police d’affichage Barlow Condensed, lockup UTMB WEDDING SERIES, motifs angulaires, couleurs des accents et icônes PWA.
- Accueil : nom BROCÉLIANDE, accroche et sous-phrase validées, fallback local de la photo lorsque le Sheet ne fournit aucune photo.
- Carte : centre, vue, route, couleurs et étapes de démonstration en Brocéliande ; les coordonnées restent pilotables dans le Sheet.
- Apps Script : version 3.0.0, paramètres éditables, étapes 6/7, dossiers photos et preset volontaire.
- PWA : manifeste, thème, cache V3 et jeu d’icônes.
- Mention d’absence d’affiliation officielle.

## Comparaisons visuelles V2.4.2 / V3
Les captures sont livrées dans `QA_Comparaisons/`. La même photo source a été utilisée pour comparer la géométrie de l’accueil.

| Format | Résultat | Mesures clés |
|---|---|---|
| Desktop 1440×900 | Conforme | aucun débordement ; CTA chevauche la limite de 26 px dans les deux versions ; espace texte/panneaux V3 = 36,6 px |
| Tablette 768×1024 | Conforme | aucun débordement ; CTA = 26 px ; espace texte/panneaux V3 = 160,7 px |
| Mobile 390×844 | Conforme après correction | aucun débordement ; panneaux empilés ; titre entièrement visible ; CTA conservé |
| Mobile étroit 320×760 | Conforme après correction | aucun débordement ; titre réduit sans coupure ; panneaux et date lisibles |

Correction issue du contrôle : la taille mobile de « BROCÉLIANDE » a été réduite de façon responsive et le contraste du titre de section Carte a été renforcé.

## Tests fonctionnels
- 2 formulaires présents ; questions conditionnelles masquées puis affichées après sélection.
- Soumission en mode démonstration : message attendu affiché, sans envoi.
- FR/IT/ES : 3 commandes disponibles ; passage en italien contrôlé.
- 7 étapes et 7 liens de navigation rendus.
- Bascule vers le mode 2D contrôlée et SVG de secours rendu.
- Coach absent du chemin critique initial, conformément à la V2.4.2.
- Manifeste PWA et couleur de thème V3 présents.
- Validation syntaxique : `app.js`, `config.js`, `i18n.js`, `Code.gs` et `manifest.webmanifest`.
- Aucune erreur JavaScript de page dans les quatre formats.

## Performance
- Ressources transférées dans le scénario comparatif desktop : environ 286,8 ko pour V2.4.2 contre 309,1 ko pour V3 (+22,3 ko, soit +7,8 %).
- Cette hausse provient de la couche d’identité et ne modifie pas le chargement différé de MapLibre ou de Coach.
- Les temps observés dans le conteneur ne sont pas représentatifs : les CDN externes y répondent en 403 et déclenchent des délais de repli.

## Réserves explicites
1. **Carte 3D en ligne** : le conteneur de test bloque `unpkg.com`, les tuiles Esri et le DEM par HTTP 403. La 3D n’a donc pas pu être rendue visuellement ici. Le chemin MapLibre/Esri/DEM d’origine est conservé et le repli 2D a été validé. Un contrôle réel sur le dépôt de test reste indispensable.
2. **Coach binaire** : le fichier joint `codecomplet_v2.4.2.txt` contient le moteur et la référence, mais pas le binaire validé `assets/coach/coach.webp`. Pour ne pas dégrader Coach, aucun substitut n’a été fabriqué. Le déploiement doit préserver/copier le binaire de la V2.4.2 existante.
3. **Arrivée Domaine des Hayes** : `47.9820, -2.0500` est une valeur de démonstration volontairement non définitive. La confirmer puis l’ajuster dans `Etapes › lat / lng`.
4. **Données réelles** : les envois Apps Script, traductions automatiques et photos Drive doivent être validés après déploiement avec le vrai Sheet et le vrai `cles.js`, absents de l’environnement de test pour des raisons de confidentialité.

## Décision de livraison
Aucune régression bloquante détectée. La livraison est prête pour le dépôt de test, sous réserve de conserver les binaires Coach existants et d’effectuer le contrôle en ligne de la carte 3D puis de valider les coordonnées exactes d’arrivée.
