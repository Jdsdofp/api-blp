const Empresa = require('../models/Empresa');
const Filial = require('../models/Filial');
const Usuario = require('../models/Usuario');

Empresa.hasMany(Filial, { foreignKey: 'f_empresa_id', as: 'filiais' });
Filial.belongsTo(Empresa, { foreignKey: 'f_empresa_id', as: 'empresa' });

Usuario.hasMany(Filial, { foreignKey: 'f_responsavel_id' });
Filial.belongsTo(Usuario, { foreignKey: 'f_responsavel_id' });
