const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Filial = require("./Filial");
const Tipo_documento = require("./Tipo_Documento");
const Usuario = require("./Usuario");

const Documento = sequelize.define('Documento',{
    d_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    d_filial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Filial,
            key: 'f_id'
        }
    },

    d_data_pedido: {
        type: DataTypes.DATE,
        allowNull: false
    },

    d_data_emissao: {
        type: DataTypes.DATE,
        allowNull: false
    },

    d_data_vencimento: {
        type: DataTypes.DATE,
        allowNull: false
    },

    d_tipo_doc_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tipo_documento,
            key: 'td_id'
        }
    },

    d_orgao_exp: {
        type: DataTypes.STRING,
        allowNull: false
    },

    d_anexo: {
        type: DataTypes.JSONB,
    },
    criado_em: {
        type: DataTypes.DATE,
    },
    d_criador_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'u_id'
        }
    },

    d_comentarios: {
        type: DataTypes.JSONB,
        defaultValue: []
    },

    d_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    
    d_num_protocolo: {
        type: DataTypes.STRING
    },

    d_situacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    d_condicionante_id: {
        type: DataTypes.INTEGER
    }
},{
    tableName: 'documentos',
    timestamps: false
})


Tipo_documento.hasMany(Documento, {foreignKey: 'd_tipo_doc_id', as: 'documentos'});
Documento.belongsTo(Tipo_documento, {foreignKey: 'd_tipo_doc_id', as: 'tipo_documentos'});

Usuario.hasMany(Documento, {foreignKey: 'd_criador_id', as: 'documentos'});
Documento.belongsTo(Usuario, {foreignKey: 'd_criador_id', as: 'usuario'});

Filial.hasMany(Documento, {foreignKey: 'd_filial_id', as: 'documentos'})
Documento.belongsTo(Filial, {foreignKey: 'd_filial_id', as: 'filiais'})


module.exports = Documento;
