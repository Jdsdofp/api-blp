const { DataTypes } = require('sequelize');
const Documento = require('./Documentos'); // ajuste o caminho para o modelo Documento
const sequelize = require('../config/db');

const Debito_Documentos = sequelize.define('Debito_Documentos', {
    dd_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dd_id_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Documento,
            key: 'd_id'
        },
        onDelete: 'CASCADE'
    },
    dd_descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dd_valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    dd_data_entrada: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    dd_data_vencimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    dd_tipo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dd_usuario: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dd_criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true
    },
    d_num_ref: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'debitos_documentos', // Nome da tabela no banco de dados
    timestamps: false, // desativa `createdAt` e `updatedAt` automáticos do Sequelize
});



  

module.exports = Debito_Documentos;
