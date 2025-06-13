// code pour générer un utilisateur admin par défaut

const sequelize = require('./db');
const Admin = require('../models/adminModel'); // Corrige le chemin si besoin
const bcrypt = require('bcryptjs');


// à modifier 
const email = 'admin@admin.com';
const password = 'admin'; // le password sera hashé
const role = 'ADMIN'; // 'SUPERADMIN' ou 'ADMIN' selon tes besoins

async function init() {
  await sequelize.sync({ alter: true });
  console.log('Tables synchronisées');

  // Vérifie si un admin existe déjà
  const existing = await Admin.findOne({ where: { email: email } });
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    await Admin.create({
      email: email,
      passwordHash: hash,
      role: role,
    });
    console.log('Admin créé !');
  } else {
    console.log('Admin déjà existant.');
  }
}

init();