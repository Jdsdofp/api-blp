const Documento = require("../models/Documentos");



module.exports.registrarCusto = async (req, res) =>{
    try {
        const {d_id} = req.params;
        console.log('ID doc recebido', d_id);

        const doc = await Documento.findByPk(d_id);
        console.log('Doc encontrado', doc?.dataValues);

        


    } catch (error) {
        console.log('Log de Erro ao registrar Documento', error)
    }
}