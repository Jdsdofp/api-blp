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
        allowNull: false
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
    timestamps: false
})


module.exports = Usuario;