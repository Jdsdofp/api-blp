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
            allowNull: false,
            unique: {
                name: 'tipo_documento_td_desc_key',
                msg: 'Ja existe um tipo de documento cadastrado com esse mesmo nome'
            },
            validate: {
                notEmpty: {
                    msg: 'Campo (Descricao tipo documento) nao pode ficar vazio'
                },

                notNull: {
                    msg: 'Campo (Descricao tipo documento) é obrigatorio'
                },
            }
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