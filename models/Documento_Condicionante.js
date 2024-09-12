const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Condicionate = require("./Condicionante");
const Documento = require('./Documentos')

const DocumentoCondicionante = sequelize.define('documento_condicionante', {
    dc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    dc_documento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'documentos',
            key: 'd_id'
        }
    },

    status: {
        type: DataTypes.STRING(50)
    },

    dc_condicoes: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'documento_condicionante',
    timestamps: false
})


module.exports = DocumentoCondicionante;