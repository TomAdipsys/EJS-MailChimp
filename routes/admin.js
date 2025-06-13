const express = require('express');
const router = express.Router();
const AdminModel = require('../models/adminModel');
const { isSuperAdmin } = require('../middlewares/authMiddleware');

// Middleware pour parser le body et method override
router.use(express.urlencoded({ extended: true }));

// Liste des admins
router.get('/', isSuperAdmin, async (req, res) => {
  const admins = await AdminModel.findAll();
  res.render('admins/index', { admins });
});

// Formulaire création admin
router.get('/new', (req, res) => {
  res.render('admins/new');
});

// Création admin
router.post('/', async (req, res) => {
  try {
    await AdminModel.create({
      email: req.body.email,
      passwordHash: req.body.password, // à hasher en prod
      role: req.body.role || 'ADMIN',
    });
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur création admin: ' + err.message);
  }
});

// Formulaire édition admin
router.get('/:id/edit', async (req, res) => {
  const admin = await AdminModel.findByPk(req.params.id);
  if (!admin) return res.status(404).send('Admin non trouvé');
  res.render('admins/edit', { admin });
});

// Mise à jour admin
router.post('/:id', async (req, res) => {
  try {
    const admin = await AdminModel.findByPk(req.params.id);
    if (!admin) return res.status(404).send('Admin non trouvé');
    admin.email = req.body.email;
    admin.role = req.body.role;
    // Ne pas mettre à jour le password ici pour simplifier (à faire plus tard)
    await admin.save();
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur mise à jour: ' + err.message);
  }
});

// Suppression admin
router.post('/:id/delete', async (req, res) => {
  try {
    const admin = await AdminModel.findByPk(req.params.id);
    if (!admin) return res.status(404).send('Admin non trouvé');
    await admin.destroy();
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur suppression: ' + err.message);
  }
});

module.exports = router;
