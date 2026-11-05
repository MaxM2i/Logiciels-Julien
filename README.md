# Logiciels Julien — version projets partagés et postes types

## Nouveautés
- Export/import d'un projet au format JSON pour partager avec un collègue.
- Bibliothèque visuelle des projets enregistrés sur cet appareil.
- Import d'un projet reçu dans le logiciel.
- Logo/image d'entreprise dans chaque projet (fichier image jusqu'à 2 Mo).
- Analyse des risques : postes types récurrents avec risques, EPC, EPI, autorisations et formations pré-cochés.
- Possibilité de modifier les cases, puis d'enregistrer un poste modifié comme nouveau prérequis réutilisable.
- Icônes visuelles pour équipements, protections et risques.

## Données et partage
Les projets enregistrés localement sont propres au navigateur/appareil. Pour partager, utiliser **Exporter le projet** puis transmettre le fichier `.json`. Le destinataire ouvre ce fichier depuis l'accueil avec **Ouvrir un projet reçu**. Les images de logo sont intégrées au projet exporté.

## Lancement
Ouvrir le dossier `logiciels_julien_v2` dans VS Code et utiliser Live Server. Garder l'arborescence `log-forage`, `analyse-risques`, `shared`.

## Exportation et partage (version mise à jour)
- Les projets peuvent être exportés en JSON, enregistrés dans un dossier lorsque le navigateur propose le sélecteur de dossier, ou préparés pour un envoi par e-mail.
- Pour l'envoi par e-mail, le fichier JSON est téléchargé puis le logiciel ouvre un brouillon : ajoutez le fichier téléchargé en pièce jointe (les navigateurs ne permettent pas d'attacher automatiquement un fichier à un e-mail).
- Le tableau d'analyse des risques propose l'impression / enregistrement PDF, le CSV et un classeur Excel compatible (.xls). Le PDF et le fichier Excel intègrent le logo et les icônes. Le CSV conserve les icônes sous forme de caractères et les informations du projet, mais le format CSV ne peut pas afficher une image de logo.
- Dans Analyse des risques, une nouvelle tâche est placée en haut de la liste et le logiciel fait défiler jusqu'à elle.
- L'onglet Administration utilise désormais des intitulés français et des listes visuelles par catégorie.
