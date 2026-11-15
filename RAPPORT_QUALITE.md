# Rapport qualité — V3.1.0 BROCÉLIANDE

## Conclusion
La V3.1.0 est prête pour un dépôt de test GitHub Pages et un redéploiement Apps Script. Les évolutions sont ciblées : identité officielle, présentation simple des deux accroches, palette, boucle calculée depuis le Sheet, pastilles superposées et relief. Les formulaires, traductions, PWA, Coach et mécanismes V3.0.0 restent en place.

## Identité officielle
- Asset actif : `assets/brand/logo-broceliande-nature.webp`, 1536×1024, ratio 3:2.
- L’image entière est conservée. Comparaison pixel : toutes les composantes RGB des pixels visibles sont strictement identiques au fichier maître ; seuls les pixels entièrement transparents peuvent être neutralisés par l’encodage WebP.
- Masque : 256 niveaux alpha, centre opaque, alpha nul sur les quatre bords. Aucun recadrage, étirement, élément ajouté ou recomposé.
- Source maître archivée avec hash SHA-256 identique à la pièce fournie : `6ca9ed9b1cbcf1695f448dc60b7b889cdc0635e7b1119aac08ab8f6de20473c7`.
- Variante sans nature livrée séparément et non référencée par l’accueil.
- Palette officielle présente sous forme de variables CSS ; aucune occurrence de l’ancien rose `#d85c7c` ou `#ef8ca6` dans le CSS actif.
- `WORLD SERIES` absent des deux lockups sous `WEDDING SERIES`.
- Accroche et sous-phrase comparées caractère par caractère aux textes V3.0.0 ; aucune modification. Les deux éléments n’ont ni fond, ni pictogramme, ni badge, ni symbole.

## Contrôles responsive
Rendus de contrôle produits dans `QA_Comparaisons/V3.1/` :

| Format | Fichier | Résultat |
|---|---|---|
| PC 1440×900 | `desktop_hero.png` | logo entier, ratio conservé, cœur net, bords fondus, textes lisibles |
| Tablette 768×1024 | `tablet_hero.png` | logo entier, aucune coupure, accroches hiérarchisées |
| Mobile 390×844 | `mobile_hero.png` | logo entier, aucun étirement, accroches sans encart et sans débordement |

Ces rendus HTML/CSS ont été produits avec WeasyPrint 70.0. Ils valident la composition statique et les dimensions, mais ne remplacent pas un contrôle final Safari/Chrome après publication.

## Carte et parcours
- La route n’utilise plus le tracé statique V3.0.0 lorsque des étapes valides existent.
- Test de démonstration : 7 sommets dont 6 points distincts, boucle fermée, aire non nulle ; elle n’est donc ni un cercle ni un ovale parfait.
- Départ et arrivée : mêmes coordonnées de démonstration au Domaine des Hayes (`47.9820, -2.0500`).
- Pastilles 3D/2D : numérotation ronde conservée ; groupes au même point décalés symétriquement avec un seuil d’environ 15 m.
- Relief : source DEM Terrarium, terrain 3D, hillshade 0,62, inclinaison 64°, exagération 1,9.
- `Etapes › ordre / lat / lng` demeure l’unique source éditable du parcours en fonctionnement normal.

## Contrôles techniques
- Syntaxe validée : `app.js`, `config.js`, `i18n.js`, `sw.js`, `assets/coach/coach.js` et `Apps_Script/Code.gs`.
- Références locales HTML validées ; toutes les ressources principales répondent HTTP 200 sur serveur local.
- PWA : cache `utmb-broceliande-v3.1.0`, logo actif ajouté au précache, icônes présentes.
- CSS : accolades équilibrées, variables de marque présentes, trois breakpoints de logo définis.
- Versions cohérentes : web, PWA, configuration et Apps Script en 3.1.0.

## Continuité fonctionnelle
Aucune suppression dans les moteurs de formulaires, conditions, dossard, déblocages, FR/IT/ES, galerie, lightbox, installation PWA ou Coach différé. Le binaire Coach n’était pas présent dans la source V3.0.0 : le guide impose de conserver `assets/coach/coach.webp` depuis le dépôt actif, conformément à la continuité historique.

## Réserves à vérifier après déploiement
1. Le conteneur de contrôle ne fournit pas Chromium et peut bloquer les CDN/tuiles. Tester la vraie carte 3D, le DEM et le hillshade sur le dépôt de test avec Chrome et Safari.
2. Valider les coordonnées exactes du Domaine des Hayes dans le Sheet avant production ; les valeurs livrées restent un preset de démonstration.
3. Tester les envois Apps Script et les photos Drive avec le vrai `cles.js`, volontairement absent de l’archive.
4. Conserver le binaire Coach existant lors de la copie du dossier GitHub.
