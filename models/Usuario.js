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
        allowNull: false,
        unique: true
    },

    u_senha: {
        type: DataTypes.STRING,
        allowNull: false
    },

    criado_em: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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
    }
})


module.exports = Usuario;