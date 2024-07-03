const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tipo_documento = sequelize.define('Tipo_documento', {
      
      td_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        td_desc: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false 
        },

        criado_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

}, {
    tableName: 'tipo_documento',
    timestamps: false
})

module.exports = Tipo_documento;