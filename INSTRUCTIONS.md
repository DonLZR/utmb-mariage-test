# INSTRUCTIONS — contrat canonique de maintenance U.T.M.B.

> **À lire avant toute modification.** Ce fichier fait foi pour Microsoft Copilot, GitHub Codespaces et tout autre intervenant. Le projet doit évoluer par chirurgie ciblée, jamais par reconstruction.

## Vision globale du projet — source unique de vérité

U.T.M.B. est un site de mariage dont **l’univers trail sert de langage narratif** : parcours, étapes, ravitaillements, dossard, Coach, chrono et profil altimétrique racontent l’aventure du couple. **La Bretagne et le Domaine des Hayes sont le lieu réel du mariage** : ils doivent porter la carte, les repères pratiques et l’ancrage géographique. L’objectif n’est donc pas de supprimer l’esprit montagne, mais de l’équilibrer avec le lieu réel.

La **V2.4.2 est la base visuelle et fonctionnelle stable**. Toute évolution doit partir de son état réellement livré et procéder par **chirurgie ciblée** : modifier le minimum nécessaire, sans reconstruire, simplifier ni recomprimer ce qui fonctionne. Doivent rester intacts, sauf demande explicite : accueil, qualité des assets, charte, composants, animations, formulaires, responsive, performances, Coach, PWA, traductions et pilotage Google Sheet / Apps Script.

En cas de contradiction avec une ancienne note, un prototype ou une réponse passée, cette vision et les décisions durables du présent fichier prévalent.

## 1. Identité, objectif et état de référence

- **Projet :** U.T.M.B. — Ultra Trail du Mariage Bossi.
- **Objectif :** site de mariage moderne, visuel, engageant et ludique, inspiré du trail mais ancré dans le lieu réel du mariage en Bretagne.
- **Production stable de référence :** `v2.4.2`.
- **Candidat actuel dans le dépôt test :** `v2.4.3-test.1` — Parcours Breton.
- **Dépôt de production :** conserver `main` sur la V2.4.2 tant que la candidate n’est pas validée.
- **Dépôt de test séparé :** publier la candidate sur sa branche `main` afin de disposer d’une URL GitHub Pages indépendante.
- **Tag stable attendu :** `v2.4.2` sur le commit réellement déployé en production. S’il n’existe pas encore, le créer uniquement depuis ce commit vérifié ; ne jamais taguer une reconstruction approximative.

## 2. Architecture essentielle

### Flux d’exécution

```text
Navigateur
  ├─ GitHub Pages : HTML, CSS, JavaScript, PWA, Coach
  ├─ cles.js local au dépôt : URL Apps Script + hash d’accès
  ├─ Google Apps Script : API JSON + réception des formulaires
  └─ Google Sheet : contenus, étapes, traductions, formulaires, photos et carte locale
```

- **GitHub Pages** sert le site statique. Il ne compile pas l’application.
- **`cles.js`** relie le site à l’URL de l’application web Apps Script et contient le hash d’accès.
- **Apps Script** lit le Sheet, traduit/localise les contenus, publie les données et enregistre les réponses.
- **Google Sheet** pilote le contenu sans redéploiement du site après chaque modification.
- **Photos Drive** sont référencées par Apps Script et chargées à la taille utile.
- **MapLibre, relief et tuiles cartographiques** sont chargés uniquement à l’approche de la carte ; une vue légère 2D reste disponible.

### Fichiers du dépôt et responsabilités

| Fichier / dossier | Responsabilité | Règle de maintenance |
|---|---|---|
| `index.html` | Structure accessible, ordre des sections et chargement des scripts | Ne pas reconstruire la page ; modifier seulement le bloc visé |
| `style.css` | Charte, responsive, animations, composants | Préserver les règles existantes ; ajouter des règles ciblées et testées |
| `app.js` | Données, navigation, carte, formulaires, galerie, PWA et chargement différé de Coach | Cœur fonctionnel : changement minimal, syntaxe vérifiée, test mobile obligatoire |
| `i18n.js` | Interface FR / IT / ES | Toute nouvelle chaîne visible doit exister dans les trois langues |
| `config.js` | Valeurs de secours et mode démo | Les réglages du Sheet restent prioritaires |
| `sw.js` | Cache PWA réseau d’abord | Mettre à jour le nom du cache et les versions des assets à chaque livraison |
| `manifest.webmanifest` | Installation PWA | Ne pas changer les chemins d’icônes sans fournir les fichiers correspondants |
| `assets/coach/coach.js` | Animations de Coach chargées à la demande | Conserver l’image maître et le chargement différé |
| `assets/coach/coach.webp` | Image validée de Coach | Ne pas régénérer, recomprimer ou remplacer sans validation explicite |
| `assets/coach/coach_reference.webp` | Référence visuelle maître | Ne jamais dégrader ni écraser |
| `assets/coach/coach_profils_reference.webp` | Référence de morphologie/profils | Ne jamais dégrader ni écraser |
| `assets/coach/REFERENCE_COACH.md` | Contraintes visuelles de Coach | Lire avant toute évolution de la mascotte |
| `outils/hash.html` | Génération locale du hash du code d’accès | Ne transmet aucune donnée à un serveur |
| `CHANGELOG.md` | Journal chronologique des versions | Mise à jour obligatoire à chaque livraison |
| `INSTRUCTIONS.md` | Présent contrat canonique | Mise à jour seulement si une règle durable, une décision validée ou un mécanisme sensible change |

Le fichier **`Code.gs`** se trouve dans le pack complet, hors racine GitHub. Il doit rester synchronisé avec la version du site et la structure du Sheet.

## 3. Fichiers personnels et données sensibles à préserver

Ne jamais inclure dans un pack générique, remplacer ou réinitialiser :

- `cles.js` ;
- le dossier personnel `icons/` ;
- l’URL Apps Script réelle ;
- le hash du mot de passe ;
- les identifiants Drive ;
- les réponses des invités dans les onglets `Reponses_*` ;
- les contenus personnalisés, photos, corrections et coordonnées déjà saisis dans le Sheet.

Lors d’un déploiement GitHub, copier les nouveaux fichiers **sans supprimer `cles.js` ni `icons/`**. Le pack livré les exclut volontairement.

## 4. Invariants à ne pas casser

### Fonctionnels

- Pilotage du contenu par le Google Sheet.
- Formulaires dynamiques, conditions d’affichage, pastilles à choix unique ou multiple et enregistrement des réponses.
- Déblocage personnel des étapes et conservation du dossard sur un appareil déjà inscrit.
- Corrections de texte globales en FR, IT et ES depuis `Corrections_traduction`.
- Porte d’accès, navigation, galerie, visionneuse, PWA et cache réseau d’abord.
- Coach chargé uniquement lors de sa première apparition, jamais au démarrage.
- Carte chargée à l’approche de la section, avec secours léger sur appareil modeste ou sans WebGL.
- Absence de données locales inventées : ajouter un repère seulement avec des coordonnées vérifiées.

### Visuels et responsive

- Qualité et charte « alpin chic & champêtre » de la V2.4.2.
- Photo d’accueil à pleine qualité, cadrage piloté par le Sheet et aucun remplacement/recompression inutile.
- Chrono à gauche et profil altimétrique à droite sur ordinateur/tablette.
- Empilement compact du chrono et de l’altimètre sur mobile.
- Bouton « Prendre le départ » à cheval entre l’accueil et la section suivante.
- Date limite de réponse lisible et icône calendrier SVG neutre.
- Composants, espacements, ombres, typographies, animations et formulaires de la V2.4.2.
- Aucun débordement horizontal ni chevauchement sur mobile.

### Performance minimale

- Zéro erreur JavaScript au chargement et pendant les interactions principales.
- MapLibre, carte, Coach et photos secondaires restent différés.
- Aucun asset existant ne doit être recompressé « pour gagner du poids » sans mesure avant/après et validation visuelle.
- Le poids des fichiers statiques initiaux hors photos, polices, carte, Coach, `cles.js` et `icons/` ne doit pas augmenter de plus de 15 % sans justification dans le CHANGELOG.

## 5. Décisions validées et éléments abandonnés

### Validé

- V2.4.2 comme socle stable et base de retour arrière.
- Transition courte et premium **« Des sommets aux embruns »**, intégrée au parcours sans ajouter une section éditoriale autonome.
- Remplacement ciblé de la carte Mont-Blanc par une carte locale autour du Domaine des Hayes.
- Nouvel onglet Sheet `Carte_locale` pour gérer les repères utiles exacts : lieu, parking, hébergement, gare, brunch, etc.
- Coordonnées préconfigurées uniquement pour le Domaine des Hayes ; les autres lieux restent à renseigner lorsqu’ils sont vérifiés.
- Conservation intégrale de l’accueil, Coach, formulaires, étapes, animations et responsive V2.4.2.

### Abandonné — ne pas réintroduire

- **V2.5 avec sept poses générées de Coach :** abandonnée car le visage, les proportions, la fourrure et les accessoires perdaient en fidélité.
- **Prototype Bretagne V0.1 reconstruit :** abandonné car la reconstruction avait dégradé typographies, espacements, composants, assets et qualité générale.
- **Section « Escale bretonne » :** explicitement refusée ; la Bretagne doit être intégrée par la transition et la carte.
- **Refonte globale de la charte :** hors périmètre.
- **Reconstruction complète du site :** interdite sauf décision explicite, documentée et validée avant production.

## 6. Procédure obligatoire avant toute modification

1. Lire intégralement `INSTRUCTIONS.md`, puis la dernière entrée de `CHANGELOG.md`.
2. Vérifier que le travail part bien de l’état réellement livré, pas d’un souvenir ni d’un ancien prototype.
3. Identifier le plus petit ensemble de fichiers à modifier.
4. Faire une copie ou créer une branche courte depuis le candidat courant.
5. Ne pas toucher aux fichiers personnels ni aux données du Sheet.
6. Modifier uniquement la zone demandée ; préserver les composants déjà validés.
7. Mettre à jour les numéros de version cohérents dans `config.js`, `index.html`, `sw.js`, `app.js`, `coach.js` si concerné et `Code.gs` si concerné.
8. Mettre à jour `CHANGELOG.md`. Mettre à jour `INSTRUCTIONS.md` seulement si une règle durable, une décision validée ou un mécanisme sensible change.
9. Exécuter les tests minimum ci-dessous avant de créer le ZIP ou la release.
10. Documenter toute limite ou test non réalisé ; ne jamais déclarer « testé » sans l’avoir réellement fait.

## 7. Tests minimum avant livraison

### Contrôles techniques

```bash
node --check app.js
node --check i18n.js
node --check config.js
node --check sw.js
node --check assets/coach/coach.js
python3 -m json.tool manifest.webmanifest > /dev/null
```

Pour `Code.gs`, copier temporairement le fichier avec une extension `.js`, puis lancer `node --check` ; cela vérifie la syntaxe JavaScript, pas les API Google.

Vérifier aussi :

- les versions affichées et les paramètres `?v=` sont cohérents ;
- aucun `cles.js` ni dossier `icons/` n’est ajouté au pack ;
- les chemins locaux correspondent à des fichiers présents, hors exclusions volontaires ;
- la console navigateur reste sans erreur ;
- l’API renvoie `parametres`, `etapes`, `formulaires`, `photos` et `carte_locale`.

### Ordinateur — largeur recommandée 1440 px

- accueil identique à la V2.4.2 ;
- chrono à gauche, altimètre à droite, centre de la photo dégagé ;
- bouton à cheval sans collision ;
- transition lisible, courte et discrète ;
- carte immersive, commandes et panneau de repères utilisables ;
- formulaires, galerie, navigation et Coach fonctionnels.

### Tablette — largeur recommandée 768 px

- panneaux d’accueil lisibles sans chevauchement ;
- transition et carte adaptées ;
- outils de carte accessibles ;
- repères lisibles ;
- rotation portrait/paysage sans débordement.

### Mobile — largeurs recommandées 390 px et 360 px

- aucun défilement horizontal ;
- chrono et altimètre empilés et compacts ;
- CTA visible et sans recouvrement ;
- transition compacte ;
- carte utilisable au doigt et cartes de repères défilables horizontalement ;
- date limite, pastilles de formulaire, clavier, modales et Coach sans collision.

### Langues et parcours métier

- tester FR, IT et ES ;
- envoyer un formulaire Présence en environnement de test ;
- vérifier un choix `pastilles` unique et multiple ;
- vérifier le déblocage personnel et la persistance du dossard ;
- vérifier le mode sans WebGL ou la vue légère 2D ;
- vérifier `prefers-reduced-motion`.

## 8. Versionnage et déploiement simples

- Production stable : tag `v2.4.2`.
- Candidats test : `v2.4.3-test.1`, puis `v2.4.3-test.2` si correction.
- Après validation complète : promouvoir en `v2.4.3`, créer le tag et la release correspondants.
- Un commit = une intention claire. Exemples :
  - `feat(map): ajouter les repères Bretagne pilotés par le Sheet`
  - `fix(mobile): éviter le chevauchement des outils de carte`
  - `docs: mettre à jour le contrat de maintenance`
- Ne pas mélanger une refonte, une migration Sheet et une correction visuelle sans nécessité.

### Apps Script et Sheet pour V2.4.3-test.1

- `Code.gs` passe à la V2.4.3-test.1 : une **nouvelle version du déploiement Apps Script est requise**.
- Lancer ensuite **🏔️ UTMB > Mettre à jour la structure**.
- Cette migration ajoute `Carte_locale` et les paramètres de carte.
- Les anciens réglages Mont-Blanc ne sont remplacés que s’ils correspondent encore aux valeurs standard de la V2.4.2.
- Lancer **🏔️ UTMB > Publier mes modifications maintenant** après contrôle.

## 9. Retour arrière

### Retour rapide du site

1. Dans le dépôt de production, restaurer le tag `v2.4.2` ou remettre les fichiers du ZIP complet V2.4.2.
2. Conserver `cles.js` et `icons/`.
3. Attendre le déploiement GitHub Pages.
4. Forcer un rechargement et vérifier le pied de page `v2.4.2`.

### Apps Script / Sheet

- Le nouvel onglet `Carte_locale` et les nouveaux paramètres sont additifs ; ils peuvent rester sans affecter le site V2.4.2.
- Si un retour Apps Script est souhaité, redéployer la dernière version V2.4.0 de `Code.gs` compatible avec le site V2.4.2.
- Ne jamais supprimer les onglets `Reponses_*`.
- Avant toute migration future, exporter une copie du Sheet.

## 10. Passer la main à Codespaces

Quand les custom instructions du dépôt sont actives, `.github/copilot-instructions.md` impose déjà la lecture de `INSTRUCTIONS.md` et `CHANGELOG.md` : il n’est pas nécessaire de le répéter dans chaque demande.

Au début d’une nouvelle session ou pour une modification sensible, utiliser simplement ce mini-prompt recommandé :

```text
Respecte les instructions du dépôt. Réalise uniquement la modification ciblée suivante, sans régression : [DEMANDE].
```

Pour une passation complète ou un contexte exceptionnel, fournir le dépôt test complet et utiliser ce prompt détaillé :

```text
Tu interviens sur le projet U.T.M.B. dans ce dépôt GitHub Codespaces.

Avant toute action, lis intégralement INSTRUCTIONS.md puis la dernière entrée de CHANGELOG.md. La production stable de référence est la V2.4.2 et l’état courant est celui réellement présent dans le dépôt. Il est interdit de reconstruire le site ou de repartir d’un ancien prototype.

Réalise uniquement la modification demandée par chirurgie ciblée. Préserve strictement l’accueil, la qualité visuelle, les composants, animations, formulaires, responsive, performances, Coach, PWA et pilotage par Google Sheet. Ne modifie pas cles.js, icons/, les réponses du Sheet ni les assets validés. N’invente aucune donnée locale.

Avant livraison : vérifie la syntaxe JS/JSON, teste ordinateur 1440 px, tablette 768 px, mobile 390 px et 360 px, contrôle FR/IT/ES, la console, la vue carte légère et les parcours de formulaire concernés. Mets à jour les versions de façon cohérente et CHANGELOG.md. Mets à jour INSTRUCTIONS.md seulement si une règle durable, une décision validée ou un mécanisme sensible change. Résume précisément les fichiers modifiés, les tests réellement exécutés, les résultats, les limites et la procédure de rollback.

Demande actuelle :
[COLLER ICI LA MODIFICATION DEMANDÉE]
```

## 11. Redonner la main à Microsoft Copilot

Fournir obligatoirement :

- le **ZIP complet réellement livré** ou l’export complet du dépôt ;
- `INSTRUCTIONS.md` ;
- `CHANGELOG.md` ;
- si `Code.gs` a changé, sa version réellement déployée ;
- les résultats de test ou problèmes observés.

Prompt prêt à copier :

```text
Pars de l’état réellement livré dans le ZIP ou le dépôt joint, et non d’une version antérieure ou d’une reconstruction. Lis d’abord INSTRUCTIONS.md puis CHANGELOG.md. Préserve toutes les décisions validées, les invariants visuels et fonctionnels, les fichiers sensibles exclus et les mécanismes Google Sheet / Apps Script.

Effectue une chirurgie ciblée limitée à la demande ci-dessous. Ne reconstruis pas le projet, ne remplace pas les assets validés, n’invente pas de coordonnées et n’introduis aucune régression. Vérifie la syntaxe, les versions, les chemins, la console et les rendus PC/tablette/mobile. Mets à jour CHANGELOG.md. Mets à jour INSTRUCTIONS.md seulement si une règle durable, une décision validée ou un mécanisme sensible change. Indique les tests réellement exécutés, les limites et la procédure de retour arrière.

Demande :
[COLLER ICI LA MODIFICATION DEMANDÉE]
```

## 12. Règle de clôture de chaque livraison

Une livraison n’est complète que si :

- le ZIP, le `codecomplet`, `Code.gs` si nécessaire et le guide correspondent au même état ;
- `CHANGELOG.md` est mis à jour et `INSTRUCTIONS.md` reflète toujours les règles durables ;
- les tests annoncés ont réellement été exécutés ;
- les exclusions `cles.js` et `icons/` sont respectées ;
- un retour arrière vers la V2.4.2 reste possible.
