const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Empresa = sequelize.define('Empresa', {
    e_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    e_nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    e_razao: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    e_cnpj: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },

    e_cidade: {
        type: DataTypes.STRING(180),
        allowNull: false
    },

    e_uf: {
        type: DataTypes.STRING(2),
        allowNull: false
    },

    criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    e_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'empresa',
    timestamps: false
});

module.exports = Empresa;