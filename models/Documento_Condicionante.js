const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Documento = require('./Documentos');
const Tipo_documento = require("./Tipo_Documento");

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
            model: Documento,
            key: 'd_id'
        }
    },

    status: {
        type: DataTypes.STRING(50)
    },

    dc_condicoes: {
        type: DataTypes.JSONB,
        allowNull: false
    },

    dc_status_doc_ref: {
        type: DataTypes.STRING
    },

    dc_criado_em: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'documento_condicionante',
    timestamps: false
});

// Corrigir alias para serem consistentes
Documento.hasMany(DocumentoCondicionante, { foreignKey: 'dc_documento_id', as: 'condicionantes' });
DocumentoCondicionante.belongsTo(Documento, { foreignKey: 'dc_documento_id', as: 'documento' });

// Modelo Documento
Documento.belongsTo(Tipo_documento, {
    foreignKey: 'd_tipo_doc_id',
    as: 'tipo_documento'
});

// Modelo TipoDocumento
Tipo_documento.hasMany(Documento, {
    foreignKey: 'd_tipo_doc_id',
    as: 'documento'
});



module.exports = DocumentoCondicionante;
