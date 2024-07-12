const { DataTypes } =  require("sequelize");
const sequelize = require("../config/db");
const Empresa = require("./Empresa");
const Usuario = require("./Usuario");


const Filial = sequelize.define('Usuario',{
    f_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    f_nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            name: 'unique_f_nome',
            msg: 'Ja existe uma filial cadastrada com esse NOME'
        },
        validate: {
            notNull: {
                msg: 'Campo (nome filial) é obrigatorio'
            },
            notEmpty: {
                msg: 'Campo (nome filial) nao pode ficar vazio'
            }
        }
    },

    f_cnpj: {
        type: DataTypes.CHAR(14),
        allowNull: false,
        unique: {
            name: 'unique_f_cnpj',
            msg: 'Ja existe uma filial cadastrada com esse CNPJ'
        },
        validate: {
            len: {
                args: [1, 14],
                msg: 'O (CNPJ) nao pode ser maior que 14 caracteres'
            },

            notNull: {
                msg: 'Campo (CNPJ) é obrigatorio'
            }
        }
    },

    f_cidade: {
        type: DataTypes.STRING(180),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Campo (Cidade) nao pode ficar vazio'
            },

            notNull: {
                msg: 'Campo (Cidade) é obrigatorio'
            }
        }
    },

    f_uf: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
            len: {
                args: [1,2],
                msg: 'A (UF) so pode ser composta por 2 caracteres'
            },
            notEmpty: {
                msg: 'Campo (UF) nao pode ficar vazio'
            }
        }
    },

    f_responsavel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'u_id'
        }
    },

    f_empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Empresa,
            key: 'e_id'
        }
    },

    f_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    f_endereco: {
        type: DataTypes.JSONB,
        defaultValue: []
    }
}, {
    tableName: 'filial',
    timestamps: false
});

Empresa.hasMany(Filial, {foreignKey: 'f_empresa_id'});
Filial.belongsTo(Empresa, {foreignKey: 'f_empresa_id'});

Usuario.hasMany(Filial, { foreignKey: 'f_responsavel_id' });
Filial.belongsTo(Usuario, {foreignKey: 'f_responsavel_id'});


module.exports = Filial;

