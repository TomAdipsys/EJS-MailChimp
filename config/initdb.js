// à lancer dans le terminal avec la commande : node config/initdb.js
// Toujours lancer les scripts Node.js depuis le dossier racine du projet (là où se trouve .env).


const readline = require('readline');
const sequelize = require('./db');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction utilitaire pour demander une saisie et gérer les commandes d'arrêt
async function askOrExit(question) {
  const answer = await new Promise(resolve => rl.question(question, resolve));
  if (['exit', 'quit', 'stop'].includes(answer.trim().toLowerCase())) {
    console.log('Arrêt du script demandé.');
    rl.close();
    process.exit();
  }
  return answer;
}

async function main() {
  await sequelize.sync({ alter: true });

  while (true) {
    console.log('Tapez "EXIT", "QUIT" ou "STOP" à n\'importe quelle question pour arrêter le script.');

    const prenom = await askOrExit('Prénom de l\'admin : ');
    const nom = await askOrExit('Nom de l\'admin : ');

    // Génération de l'email
    let email = `${prenom.trim().toLowerCase()}.${nom.trim().toLowerCase()}@exemple.com`;
    let existing = await Admin.findOne({ where: { email } });
    let suffix = 1;
    while (existing) {
      email = `${prenom.trim().toLowerCase()}.${nom.trim().toLowerCase()}${suffix}@exemple.com`;
      existing = await Admin.findOne({ where: { email } });
      suffix++;
    }
    if (suffix > 1) {
      console.log(`Email déjà utilisé, nouvel email généré : ${email}`);
    }

    const password = await askOrExit('Mot de passe : ');

    // Boucle pour rôle valide
    let role;
    while (true) {
      role = await askOrExit('Rôle (SUPERADMIN/ADMIN) : ');
      if (role.trim().toUpperCase() === 'SUPERADMIN' || role.trim().toUpperCase() === 'ADMIN') {
        role = role.trim().toUpperCase();
        break;
      }
      console.log('Rôle invalide. Utilisez SUPERADMIN ou ADMIN.');
    }

    // Création de l'admin
    const hash = await bcrypt.hash(password, 12);
    await Admin.create({
      email,
      passwordHash: hash,
      role,
      nom: nom.trim(),
      prenom: prenom.trim()
    });

    console.log(`${role} créé avec succès !`);
    console.log(`Admin créé : ${prenom} ${nom} (${email}) ${role}) avec mot de passe : ${password}`);

    const continueCreation = await askOrExit('Voulez-vous créer un autre admin ? (oui/non) : ');
    if (continueCreation.trim().toLowerCase() !== 'oui') {
      break;
    }
  }

  console.log('Arrêt du script.');
  rl.close();
  process.exit();
}

main();