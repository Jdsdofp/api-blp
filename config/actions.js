const Documento = require('../models/Documentos');
const Empresa = require('../models/Empresa');
const Filial = require('../models/Filial');
const Tipo_documento = require('../models/Tipo_Documento');
const Usuario = require('../models/Usuario');

Empresa.hasMany(Filial, { foreignKey: 'f_empresa_id', as: 'filiais' });
Filial.belongsTo(Empresa, { foreignKey: 'f_empresa_id', as: 'empresa' });

Usuario.hasMany(Filial, { foreignKey: 'f_responsavel_id', as: 'responsavel' });
Filial.belongsTo(Usuario, { foreignKey: 'f_responsavel_id', as: 'responsavel' });


