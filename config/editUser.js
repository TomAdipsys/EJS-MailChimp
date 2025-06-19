const readline = require('readline');
const sequelize = require('./db');
const Admin = require('../models/adminModel');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  await sequelize.sync();

    console.log('Bienvenue dans l\'outil de modification des utilisateurs !');
    console.log('Assurez-vous d\'avoir les droits nécessaires pour modifier les utilisateurs.');
    console.log('Si vous souhaitez quitter, tapez "exit", "quit" ou "stop" à tout moment.\n');
  // Affiche la liste des utilisateurs
  const admins = await Admin.findAll();
  console.log('\nUtilisateurs existants :');
  admins.forEach(a => {
    console.log(`- ID: ${a.id} | Email: ${a.email} | Prénom: ${a.prenom} | Nom: ${a.nom} | Rôle: ${a.role} | Password: ${a.password}`);
  });

  const id = await askOrExit('\nID de l\'utilisateur à éditer : ');
  const admin = await Admin.findByPk(id);

  if (!admin) {
    console.log('Utilisateur non trouvé.');
    rl.close();
    process.exit();
  }

  console.log(`Modification de ${admin.email} (${admin.prenom} ${admin.nom})`);

  while (true) {
    console.log('\nChamps modifiables :');
    console.log('1. Prénom');
    console.log('2. Nom');
    console.log('3. Email');
    console.log('4. Rôle');
    console.log('5. Password');
    console.log('6. Quitter');

    const choix = await askOrExit('Quel champ veux-tu modifier ? (1-6) : ');

    if (choix === '1') {
      const newPrenom = await askOrExit(`Nouveau prénom [${admin.prenom}] : `);
      if (newPrenom.trim()) 
        admin.prenom = newPrenom.trim();
        console.log('nouveau prénom :', admin.prenom);
        console.log('Nous vous invitons à vérifier que l\'email est toujours valide après modification du prénom.');
    } else if (choix === '2') {
        const newNom = await askOrExit(`Nouveau nom [${admin.nom}] : `);
        if (newNom.trim()) admin.nom = newNom.trim();
            console.log('nouveau nom :', admin.nom);
            console.log('Nous vous invitons à vérifier l\'email');
    } else if (choix === '3') {
        const newEmail = await askOrExit(`Nouvel email [${admin.email}] : `);
        if (newEmail.trim()) admin.email = newEmail.trim();
            console.log('nouvel email :', admin.email);
    } else if (choix === '4') {
        const newRole = await askOrExit(`Nouveau rôle (SUPERADMIN/ADMIN) (Rôle actuel : [${admin.role}]) : `);
        if (['SUPERADMIN', 'ADMIN'].includes(newRole.trim().toUpperCase())) {
            admin.role = newRole.trim().toUpperCase();
            console.log('nouveau rôle :', admin.role);
      } else {
        console.log('Rôle invalide.');
      }
    } else if (choix === '5') {
      const newPassword = await askOrExit(`Nouveau mot de passe : `);
      if (newPassword.trim()) {
        admin.password = newPassword.trim();
      }
    } else if (choix === '6') {
      break;
    } else {
      console.log('Choix invalide.');
    }

    await admin.save();
    console.log('Modification enregistrée.');
  }

  console.log('Fin de la modification.');
  rl.close();
  process.exit();
}

main();