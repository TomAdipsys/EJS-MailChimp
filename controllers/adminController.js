const adminService = require('../services/adminService');
const bcrypt = require('bcryptjs');

exports.list = async (req, res) => {
  const admins = await adminService.findAll();
  res.render('admins/admins', { admins, activePage: 'admins' });
};
// activePage : utilisé dans navbar pour mettre en surbrillance la page active
// sans cette indication. BUG
// à voir sans utiliser cela.

exports.newForm = (req, res) => {
  res.render('admins/new', { activePage: 'admins' });
};

exports.create = async (req, res) => {
  try {
    const existing = await adminService.findByEmail(req.body.email);
    if (existing) return res.status(400).send('Cet email est déjà utilisé.');
    const hash = await bcrypt.hash(req.body.password, 12);
    await adminService.create({
      email: req.body.email,
      nom: req.body.nom,
      prenom: req.body.prenom,
      passwordHash: hash,
      password: req.body.password, // ⚠️ À SUPPRIMER PLUS TARD : stocke le mot de passe en clair (DANGEREUX)
      role: req.body.role || 'ADMIN',
    });
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur création admin: ' + err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    await adminService.delete(req.params.id);
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur suppression admin: ' + err.message);
  }
};

exports.editForm = async (req, res) => {
  const admin = await adminService.findById(req.params.id);
  if (!admin) return res.status(404).send('Admin non trouvé');
  res.render('admins/edit', { 
    admin, 
    activePage: 'admins', 
  });
};



exports.update = async (req, res) => {
  try {
    const updateData = {
      email: req.body.email,
      nom: req.body.nom,
      prenom: req.body.prenom,
      role: req.body.role,
    };

    if (req.body.password) {
      updateData.password = req.body.password; // ⚠️ À SUPPRIMER PLUS TARD
      updateData.passwordHash = await bcrypt.hash(req.body.password, 12);
    }

    await adminService.update(req.params.id, updateData);
    res.redirect('/admins');
  } catch (err) {
    res.status(500).send('Erreur mise à jour admin: ' + err.message);
  }
};