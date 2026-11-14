# Projet Bretagne — conception avant intégration

## Décision de direction

**L’U.T.M.B. reste le concept. La Bretagne devient la destination.**

Le site conserve l’esprit trail comme grammaire narrative — départ, dossard, points de passage, ravito, roadbook, Coach — mais cesse de présenter le Mont-Blanc comme le lieu de l’événement. Le centre de gravité visuel et pratique devient le **Domaine des Hayes à Maxent**, en Bretagne.

Cible d’équilibre éditorial :

- **40 % trail / montagne** : accueil, vocabulaire, progression, dossard, Coach, profil altimétrique ;
- **60 % Bretagne / mariage réel** : transition, carte locale, domaine, accès, horaires, hébergements, programme.

Aucune section « Escale bretonne » n’est ajoutée.

---

## Architecture proposée

### 1. Accueil V2.4.2 — conservé

- Photo montagne, titre U.T.M.B., chrono et altimètre latéraux conservés.
- Bouton « Prendre le départ » toujours à cheval entre l’accueil et la suite.
- La mention `Bretagne — Domaine des Hayes` reste visible dès le premier écran.
- Pas de nouvelle surcharge bretonne dans le hero : il raconte l’origine du concept.

### 2. Transition courte — « Des sommets aux embruns »

Placée juste avant la nouvelle carte, elle explique en une phrase le changement de décor :

> L’esprit vient des sentiers. L’arrivée, elle, se joue en Bretagne.

Principes visuels :

- courbe altimétrique qui devient ligne côtière ;
- bleu ardoise, gris granit et doré existant ;
- rose des vents discrète ;
- grande présence du Domaine des Hayes ;
- une photo réelle du domaine remplacera l’illustration conceptuelle après validation des droits et du cadrage.

### 3. Carte principale — « Le parcours breton »

La carte 3D Mont-Blanc est remplacée, pas doublée.

Objectif : répondre immédiatement à cinq questions invitées :

1. Où arriver et se garer ?
2. Où est l’accueil ?
3. Où se déroule la cérémonie ?
4. Où se passent le dîner et la soirée ?
5. Où dormir / prendre la navette ?

Rendu recommandé :

- plan local stylisé du domaine ou fond cartographique local ;
- tracé doré inspiré d’un parcours ;
- marqueurs utiles, filtrables par `Pratique` et `Temps forts` ;
- panneau contextuel avec horaire, conseil et lien d’itinéraire ;
- rose des vents et lignes topographiques/côtières en arrière-plan ;
- fallback SVG léger si la cartographie distante ne charge pas.

Le plan du prototype est volontairement schématique : les emplacements exacts doivent être validés avec le domaine.

### 4. Étapes existantes — mêmes fonctions, intitulés mieux ancrés

| Fonction existante | Intitulé proposé | Sous-titre |
|---|---|---|
| Présence | Retirer son dossard | Confirmer sa présence |
| Hébergement | Choisir son camp de base | Où poser le sac |
| Programme | Le week-end breton | Le roadbook du mariage |
| Plan du site | La carte du camp de base | Se repérer sur place |

Les `id`, types de formulaire, règles de déblocage et réponses existantes restent inchangés. Les changements portent d’abord sur le libellé et le contexte.

### 5. Coach — identité alpine préservée

- Asset maître inchangé.
- Pas de nouveau costume permanent ni de nouvelle pose générée.
- Un clin d’œil breton ponctuel dans une bulle : boussole, météo, embruns ou trajet.
- Fréquence faible afin de ne pas transformer Coach en guide touristique.

---

## Charte visuelle complémentaire

| Rôle | Couleur | Usage |
|---|---|---|
| Vert forêt existant | `#24382C` | Trail, boutons secondaires, titres |
| Doré existant | `#B08D57` | Mariage, tracé, points clés |
| Bleu ardoise | `#344B5D` | Bretagne, carte, profondeur |
| Bleu océan | `#526E7F` | Eau, filtres, détails |
| Gris granit | `#D8D3C8` | Fonds, carte, séparateurs |
| Crème existant | `#F6F1E7` | Élégance et continuité |

Motifs autorisés : ligne côtière, rose des vents, granit, éventuelle hermine unique et très discrète.

À éviter : drapeaux répétés, ancres, marinière, galettes, phare décoratif systématique, bleu marine omniprésent.

---

## Stratégie de données Google Sheet

### Recommandation robuste

Ajouter un onglet `Lieux` distinct de `Etapes`. Cela évite de détourner les coordonnées alpines aujourd’hui liées à la progression.

Colonnes proposées :

- `id`
- `ordre`
- `categorie` (`pratique`, `tempsfort`)
- `titre`
- `sous_titre`
- `description`
- `lat`
- `lng`
- `horaire`
- `conseil`
- `lien_itineraire`
- `icone`
- `visible`
- variantes `_it` et `_es` si le modèle actuel le nécessite.

Paramètres complémentaires possibles :

- `transition_titre`
- `transition_texte`
- `photo_domaine`
- `camp_base_nom`
- `camp_base_adresse`
- `camp_base_lat`
- `camp_base_lng`
- `carte_fond` (`plan`, `satellite`, `standard`)
- `identite_bretagne_active`

### Ce qui ne doit pas être cassé

- formulaires Présence et Hébergement ;
- attribution du dossard ;
- règles de déblocage ;
- FR / IT / ES ;
- cache local et mode hors-ligne ;
- installation PWA ;
- galerie et bandeau photos ;
- réglages de cadrage desktop/mobile ;
- responsive 320 px à grand écran.

---

## Performance et responsive

### Performance

- Ne plus charger MapLibre et le terrain 3D du Mont-Blanc pour la carte principale.
- Charger le fond cartographique local seulement à l’approche de la section.
- Afficher immédiatement un SVG local de secours.
- Optimiser la photo du domaine en AVIF/WebP, avec deux tailles desktop/mobile.
- Conserver la stratégie de cache et le service worker, après mise à jour contrôlée de version.

### Mobile

- Transition en une colonne, texte puis visuel.
- Carte recadrée sur le camp de base, panneau d’information sous la carte.
- Filtres simplifiés et points utiles en grille de deux colonnes.
- Cibles tactiles d’au moins 44 px.
- Aucun défilement horizontal.
- Coach réduit et non intrusif.

---

## Plan d’intégration proposé après validation

1. Valider cette direction visuelle et les quatre intitulés.
2. Récupérer une photo HD autorisée du Domaine des Hayes, plus un cadrage mobile.
3. Valider les points réels : accès, parking, accueil, cérémonie, réception, couchages, navettes.
4. Définir l’onglet `Lieux` et étendre la réponse du Google Sheet sans toucher aux données existantes.
5. Intégrer la transition et la carte derrière un drapeau de configuration.
6. Tester FR / IT / ES, desktop, tablette et mobile.
7. Mesurer le poids, le temps de chargement et tester le fallback hors-ligne.
8. Produire ensuite seulement la version de production et son plan de retour arrière vers V2.4.2.

---

## Critères de validation avant production

- La Bretagne et le Domaine des Hayes sont compris en moins de 10 secondes.
- La carte répond à une question pratique, pas seulement décorative.
- Aucun formulaire ni déblocage ne régresse.
- Coach reste immédiatement reconnaissable.
- Les écrans 320, 390, 768, 1024 et 1440 px sont propres.
- Le site reste utilisable sans WebGL et avec une connexion faible.
- Les données et photos diffusées sont validées et strictement nécessaires.

## Sources de cadrage

- Base technique auditée : `codecomplet_v2.4.2.txt`.
- Photo d’accueil et asset Coach : fichiers fournis avec le projet.
- Informations publiques de cadrage du domaine : site officiel du Domaine des Hayes (Maxent, forêt de Brocéliande, salles et hébergements). Les contenus définitifs du mariage restent à confirmer par les mariés.
