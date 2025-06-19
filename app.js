const express = require('express'); // Framework principal pour créer le serveur web
const session = require('express-session'); // Middleware pour gérer les sessions utilisateur (stockage côté serveur)
const cookieParser = require('cookie-parser'); // Middleware pour lire/écrire les cookies HTTP
const helmet = require('helmet'); // Middleware de sécurité pour ajouter des headers HTTP sécurisés
const csurf = require('csurf'); // Middleware pour la protection CSRF (Cross-Site Request Forgery)
const rateLimit = require('express-rate-limit'); // Middleware pour limiter le nombre de requêtes (anti-bruteforce)
const path = require('path'); // Module natif Node.js pour gérer les chemins de fichiers
require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env

const app = express();

const { isAuthenticated, isSuperAdmin } = require('./middlewares/authMiddleware'); // Import des middlewares d'authentification personnalisés
// Middlewares de sécurité
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));
app.use(csurf({ cookie: true }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour rendre user/csrfToken accessibles partout
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Auth routes EN PREMIER pour éviter les conflits
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// Index routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Admin routes
const adminRouter = require('./routes/admin');
app.use('/', adminRouter);

// Dashboard protégé
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { activePage: 'dashboard' });
});

// (Ajoute ici d'autres routers si besoin, ex: app.use('/profile', profileRouter))

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});