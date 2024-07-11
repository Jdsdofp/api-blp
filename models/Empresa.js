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
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Campo (nome empresa) é obrigatorio'
            },

            notEmpty: {
                msg: 'Campo (nome empresa) nao pode ficar vazio'
            }
        }
    },

    e_razao: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Campo (razao social) é obrigatorio'
            },

            notEmpty: {
                msg: 'Campo (razao social) nao pode ficar vazio'
            }
        }
    },

    e_cnpj: {
        type: DataTypes.CHAR(14),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [1, 14],
                msg: 'O (CNPJ) nao pode ser maior ou menor que 14 caracteres'
            },

            min: {
                args: 1,
                msg: 'Valor invalido'
            }
        }
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
    },

    e_criador_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'empresa',
    timestamps: false
});

module.exports = Empresa;