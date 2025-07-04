const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdminModel = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // ⚠️ À SUPPRIMER PLUS TARD : stocke le mot de passe en clair (DANGEREUX)
  },
  role: {
    type: DataTypes.ENUM('SUPERADMIN', 'ADMIN'),
    allowNull: false,
  },
});

module.exports = AdminModel;



