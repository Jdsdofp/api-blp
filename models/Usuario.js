const { DataTypes } =  require("sequelize");
const sequelize = require("../config/db");


const Usuario = sequelize.define('Usuario', {
    u_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    u_nome: {
        type: DataTypes.STRING(180),
        allowNull: false
    },

    u_email: {
        type: DataTypes.STRING(180),
        allowNull: true,
        unique: true
    },

    u_senha: {
        type: DataTypes.STRING,
        allowNull: false
    },

    criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    u_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    u_senhatemporaria: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    u_empresas_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    },

    u_filiais_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }

},{
    tableName: 'usuario',
    timestamps: false,

    defaultScope: {
        attributes: {exclude: 'u_senha'}
    },
    scopes: {
        withPassword: {
            attributes: { }
        }
    },
    instanceMethods: {
        toJSON: function () {
            let values = Object.assign({}, this.get());
            delete values.u_senha;
            return values;
        }
    },

})


module.exports = Usuario;