# BROCÉLIANDE V3.11.0 — Studio du site

Cette version ajoute un onglet **Studio du site** dans Google Sheets, sans intégrer le prologue Merlin.

## Ce que le Studio pilote

- réglages généraux, couverture, carte et Coach Merlin ;
- Programme, étapes, hébergements et formulaires ;
- contenus FR avec surcharges facultatives IT/ES ;
- tailles de tous les textes par appareil, famille et section ;
- position, échelle et texte du compte à rebours de couverture ;
- zoom et cadrage horizontal/vertical indépendants de l’image de couverture sur PC/tablette et mobile.

## Typographie sans régression

Tous les réglages typographiques sont initialisés à **100 %**. À 100 %, aucune taille V3.10.0 n’est remplacée : le navigateur conserve les règles CSS historiques, y compris les `clamp()` responsives. Les valeurs sont bornées et le facteur final est limité pour éviter les débordements.

Familles disponibles : global, couverture, chronomètre, titres de chapitres, titres, sous-titres, paragraphes, Programme, Parcours, étapes, formulaires, boutons, navigation, badges et Coach. Chaque famille dispose de valeurs PC, tablette et mobile.

## Couverture

- inscription FR/IT/ES : taille et position toujours réglables ;
- correctif PC : zone de rendu élargie et ajustement de sécurité pour que `ENTREZ DANS LA LÉGENDE`, `ENTRATE NELLA LEGGENDA` et `ENTRAD EN LA LEYENDA` restent entièrement visibles et centrés ;
- image : zoom + cadrage horizontal/vertical distincts PC/tablette et mobile, avec proportions verrouillées (`object-fit: cover`) ;
- chronomètre : position horizontale, distance au bas et échelle distinctes PC/tablette et mobile.

## Installation

1. Sauvegarder le dépôt et le Google Sheet.
2. Copier `A_COPIER_DANS_GITHUB/` à la racine sans supprimer les fichiers privés.
3. Remplacer `Apps_Script/Code.gs`.
4. Exécuter `majStructure()` : les nouveaux paramètres sont ajoutés sans écraser l’existant et le Studio est construit.
5. Redéployer l’application Web Apps Script.
6. Publier le site puis forcer l’actualisation du cache PWA.

## Utilisation

Dans Google Sheets : menu **🌲 BROCÉLIANDE → 🎛️ Ouvrir le Studio du site**. Modifier uniquement la colonne **Valeur**, puis utiliser **Publier mes modifications maintenant**.
