const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacao = sequelize.define('Notificacao', {
    n_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true  
    },
    n_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    n_mensagem: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    n_lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    n_criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'notificacoes',
    timestamps: true,
});


module.exports = Notificacao;
