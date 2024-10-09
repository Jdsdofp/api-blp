const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Documento = require("./Documentos");
const Usuario = require("./Usuario");


const Comentariosdocumentos = sequelize.define('Comentariosdocumentos', {
    cd_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },

    cd_documento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Documento,
            key: 'd_id'
        }
    },

    cd_autor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'u_id'
        }
    },

    cd_msg: {
        type: DataTypes.TEXT
    },

    cd_resposta: {
        type: DataTypes.JSONB,
        default: []
    },

    criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    cd_situacao_comentario: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'comentarios_documentos',
    timestamps: false
})

Documento.hasMany(Comentariosdocumentos, {foreignKey: 'cd_documento_id'});
Comentariosdocumentos.belongsTo(Documento, {foreignKey: 'cd_documento_id'});

Usuario.hasMany(Comentariosdocumentos, {foreignKey: 'cd_autor_id', as: 'comentarios'});
Comentariosdocumentos.belongsTo(Usuario, {foreignKey: 'cd_autor_id', as: 'usuario'});


module.exports = Comentariosdocumentos;