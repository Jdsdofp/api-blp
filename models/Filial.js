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
        allowNull: false
    },

    f_cnpj: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },

    f_cidade: {
        type: DataTypes.STRING(180),
        allowNull: false
    },

    f_uf: {
        type: DataTypes.STRING(2),
        allowNull: false
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

