const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assumindo que você já configurou a conexão no arquivo db.js

const Condicionante = sequelize.define('Condicionante', {
  c_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  c_tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Tipo Obrigatorio'
      }
    },
    unique: {
      name: 'c_tipo',
      msg: 'Já existe uma condição cadastrada com esse tipo'
    }
  },
  c_condicao: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  c_obs: {
    type: DataTypes.STRING
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'condicionantes',
  timestamps: false,
});



module.exports = Condicionante;
