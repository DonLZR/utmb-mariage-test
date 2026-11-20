# Rapport qualité — BROCÉLIANDE V3.3.1

## Conclusion
La couverture photoréaliste validée est conservée. L’inscription est désormais indépendante du visuel et nette dans les trois langues. Les variantes d’image ont des proportions natives propres à chaque famille d’écran ; aucune mise à l’échelle non proportionnelle n’est utilisée.

## Contrôles automatisés réalisés
- rendus Chromium : 1440×900, 768×1024 et 390×844 ;
- trois langues sur chaque format, soit neuf scénarios ;
- textes exacts FR / IT / ES ;
- inscription contenue dans la couverture sans débordement ;
- ratios rendus strictement égaux aux ratios des sources : desktop 1,5770, tablette 1,2895, mobile 0,7187 ;
- styles calculés de l’inscription : `text-shadow: none`, `filter: none`, `backdrop-filter: none` ;
- ouverture tactile/cliquable : couverture masquée, défilement rétabli et accueil intérieur visible ;
- syntaxe de tous les fichiers JavaScript ;
- absence d’identifiants HTML dupliqués ;
- `Code.gs` comparé par SHA-256 au fichier reçu : strictement identique.

## Contrôle visuel
Les neuf captures sont fournies dans `APERCUS_QA/`. Les variantes mobile utilisent un recadrage portrait dédié : le sceau et la composition restent proportionnés, sans écrasement. La zone d’inscription du visuel a été reconstruite sans texte ni bande floutée avant superposition du texte HTML.

## Réserves de test
Le bac à sable de contrôle bloque certains CDN externes et ne contient pas les médias privés volontairement préservés (`cles.js`, icônes, image Coach, photo de secours). Après copie dans le dépôt actif, restent à tester avec les ressources réelles : Apps Script, tuiles MapLibre/DEM, envoi de formulaire, PWA installée et Safari iOS.
