const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Condicionate = require("./Condicionante");
const Documento = require('../models/Documentos')

const AlvaraCondicionante = sequelize.define('alvara_condicionantes', {
    ac_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ac_documento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'documentos',
            key: 'd_id'
        }
    },

    ac_condicionante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'condicionates',
            key: 'c_id'
        }
    },

    ac_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Cumprido', 'Pendente', 'Em Progresso', 'Aprovado', 'Rejeitado']]
        }
    },

    ac_data_cumprimento: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'alvara_condicionantes',
    timestamps: false
})


AlvaraCondicionante.belongsTo(Condicionate, {foreignKey: 'ac_condicionante_id'});
AlvaraCondicionante.belongsTo(Documento, {foreignKey: 'ac_documento_id'});

Condicionate.hasMany(AlvaraCondicionante, {foreignKey: 'ac_condicionante_id'});
Documento.hasMany(AlvaraCondicionante, {foreignKey: 'ac_documento_id'});

module.exports = AlvaraCondicionante;