const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

const { isAuthenticated, isSuperAdmin } = require('./middlewares/authMiddleware');

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

// Routes admins (séparées)
const adminRouter = require('./routes/admin');
app.use('/', adminRouter);

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.get('/login', (req, res) => {
  res.render('login');
});

// Routes principales
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { activePage: 'dashboard' });
});

// (Ajoute ici d'autres routers si besoin, ex: app.use('/profile', profileRouter))

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});