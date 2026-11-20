# RAPPORT QUALITÉ — BROCÉLIANDE V3.3.0

## Résultat visuel
La couverture n’est plus une imitation CSS : elle dérive directement de la maquette photoréaliste validée. Trois compositions haute définition protègent le cadrage du livre et du sceau selon le format d’écran. Les rendus réels sont archivés dans `APERCUS_QA/`.

## Contrôles réalisés
- Rendu Chromium réel en 1440 × 900, 768 × 1024 et 390 × 844.
- Contrôle visuel du livre, du sceau, des dorures, de la patine, de la navigation et de l’accroche.
- Traductions exactes vérifiées :
  - FR : `ENTREZ DANS LA LÉGENDE` ;
  - IT : `ENTRATE NELLA LEGGENDA` ;
  - ES : `ENTRAD EN LA LEYENDA`.
- Accroche contenue dans la largeur de l’écran aux trois formats.
- Clic sur toute la couverture vérifié : animation puis défilement vers le contenu.
- Aucune erreur JavaScript en console pendant les trois scénarios de rendu.
- Syntaxe validée pour `app.js`, `i18n.js`, `config.js`, `sw.js` et `Code.gs`.
- HTML validé : aucun identifiant dupliqué et tous les identifiants attendus par le moteur sont présents.
- Backend `Code.gs` comparé au fichier V3.2.0 fourni : identique.
- Cache PWA porté à V3.3.0 et nouvelles images ajoutées au pré-cache.

## Éléments préservés
Google Apps Script, Google Sheets, formulaires, déblocages, carte MapLibre 3D/2D, DEM, dossard, galerie, Coach, langues, PWA et structure des sections.

## Réserves
Les appels réels au Google Sheet, l’envoi d’un formulaire, les tuiles MapLibre en production, Safari/iOS physique et la migration depuis un ancien cache PWA devront être vérifiés après publication sur la branche de test. Ils ne peuvent pas être simulés complètement sans le `cles.js` privé et l’environnement de production.
