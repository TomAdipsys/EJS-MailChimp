# EJS-MailChimp

## Arborescence du projet

```
EJS-MailChimp/
├── config/                  # Fichiers de configuration (DB, API, etc.)
│   ├── db.js                # Connexion à la base de données (Sequelize (ORM))
│   └── apiConfig.js         # Configurations pour les appels d'API externes
│
├── controllers/             # Logique métier (traitement des requêtes)
│   └── adminController.js   # Contrôleur pour la gestion des admins
│
├── middlewares/             # Middlewares personnalisés
│   └── authMiddleware.js    # Vérification de l'authentification/admin
│
├── models/                  # Modèles Sequelize (tables de la BDD)
│   ├── adminModel.js        # Modèle Admin (structure et règles)
│   └── index.js             # Initialisation de Sequelize et associations
│
├── public/                  # Fichiers statiques accessibles au client
│   └── css/
│       └── style.css        # Feuilles de style CSS
│
├── routes/                  # Définition des routes Express
│   └── admin.js             # Routes pour la gestion des admins
│
├── utils/                   # Fonctions utilitaires (helpers)
│   └── apiClient.js         # Fonctions pour appeler des APIs externes
│
├── views/                   # Templates EJS pour le rendu HTML
│   ├── admins/              # Vues liées aux admins
│   │   ├── index.ejs        # Liste des admins
│   │   ├── new.ejs          # Formulaire de création d'admin
│   │   └── edit.ejs         # Formulaire d'édition d'admin
│   ├── partials/            # Fragments réutilisables (header, footer, etc.)
│   │   ├── head.ejs
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── login.ejs            # Page de connexion
│   └── dashboard.ejs        # Tableau de bord après connexion
│
├── .env                     # Variables d'environnement (jamais sur GitHub)
├── .gitignore               # Fichiers/dossiers à ignorer par Git
├── app.js                   # Point d'entrée principal de l'application
├── package.json             # Dépendances et scripts du projet
└── README.md                # Ce fichier
```

---

## Fonction de chaque fichier/dossier

- **config/** : Centralise la configuration (DB, API, etc.)
- **controllers/** : Contient la logique métier (ex : création, édition, suppression d’admin)
- **middlewares/** : Middlewares Express personnalisés (auth, logs, etc.)
- **models/** : Modèles Sequelize pour la base de données
- **public/** : Ressources statiques accessibles par le navigateur (CSS, images, JS client)
- **routes/** : Définit les routes Express (URL, méthodes, etc.)
- **utils/** : Fonctions utilitaires réutilisables dans tout le projet
- **views/** : Templates EJS pour générer le HTML côté serveur
  - **admins/** : Vues spécifiques à la gestion des admins
  - **partials/** : Fragments de vues réutilisables (header, footer, etc.)
- **.env** : Variables sensibles (mots de passe, clés API, etc.)
- **.gitignore** : Liste des fichiers/dossiers à ne pas versionner
- **app.js** : Fichier principal qui configure et lance le serveur Express
- **package.json** : Liste des dépendances et scripts de démarrage
- **README.md** : Documentation du projet

---

flow
    A[Client (navigateur)] -->|HTTP Request| B[Express app.js]
    B -->|Route match /admins| C[routes/admin.js]
    C -->|Appel modèle| D[models/adminModel.js]
    D -->|Requête SQL| E[(Base de données MySQL)]
    E -->|Résultat| D
    D -->|Objet JS| C
    C -->|Render| F[views/admins/index.ejs]
    F -->|HTML généré| A

**Cette organisation permet de séparer clairement la logique, la configuration, les routes, les modèles et les vues pour un projet Express/EJS maintenable et évolutif.**

command pour accéder à mysql depuis le terminal
mysqlsh --sql -u root -p

command pour lancer le serveur en auto save
npx nodemon app.js