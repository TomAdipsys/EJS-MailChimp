const { Sequelize } = require('sequelize');

// Sequelize est un ORM pour Node.js qui facilite la gestion des bases de données relationnelles.
// Ici, nous configurons une connexion à une base de données MySQL nommée 'HMchimp' avec l'utilisateur 'root' et le mot de passe 'root'.


// initiation de la db 

require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
