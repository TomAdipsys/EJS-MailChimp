const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { isAuthenticated, isSuperAdmin } = require('./middlewares/authMiddleware');

const app = express();

// --- Middlewares globaux ---
// Sécurité
app.use(helmet());

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false
}));

// Parsing des requêtes
app.use(express.urlencoded({ extended: true })); // Pour les formulaires HTML
app.use(express.json()); // Pour les requêtes JSON

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(csurf({ cookie: false }));

// Limiteur de requêtes (anti-bruteforce)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Variables globales pour les vues
const viewLocals = require('./middlewares/viewLocalsMiddleware');
app.use(viewLocals);

// --- Configuration du moteur de vues ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Routers ---
// Auth (toujours en premier)
const authRouter = require('./routes/authRoutes');
app.use('/', authRouter);

// Redirection index (accueil)
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Admin (protégé par isSuperAdmin)
const adminRouter = require('./routes/adminRoutes');
app.use('/admins', isSuperAdmin, adminRouter);

const profileRouter = require('./routes/profile');
app.use('/profile', isAuthenticated, profileRouter);

// --- Routes directes ---
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { activePage: 'dashboard' });
});

// --- Lancement du serveur ---
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});