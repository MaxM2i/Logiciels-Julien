# Logiciels Julien — Web + application desktop

## Contenu
- `log-forage/` : application web Log de forage
- `analyse-risques/` : application web Analyse des risques
- `electron/` : lanceur desktop Electron
- `shared/` : styles et utilitaires communs

## Web
Depuis un serveur HTTP local, ouvrir :
- `log-forage/index.html`
- `analyse-risques/index.html`

Pour un test rapide avec Node : `npx serve .` depuis ce dossier.

## Desktop
1. Installer Node.js.
2. Dans `electron/`, exécuter `npm install`.
3. Exécuter `npm start`.
4. Le lanceur permet d'ouvrir les deux logiciels.

## Données
La V1 utilise `localStorage` : les données restent dans le navigateur / profil Electron. Chaque logiciel permet un export JSON du projet.

## Périmètre V1
La saisie, l'administration des listes, les tableaux de synthèse, les fiches de poste, l'impression et les exports CSV/JSON sont présents. La représentation graphique avancée de la coupe de forage, la gestion multi-projets persistante côté serveur, les comptes utilisateurs et l'export PDF natif sont à prévoir dans une V2.
