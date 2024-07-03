const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assumindo que você já configurou a conexão no arquivo db.js

const Condicionate = sequelize.define('Condicionate', {
  c_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  c_tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c_condicao: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'condicionates',
  timestamps: false,
});

module.exports = Condicionate;
