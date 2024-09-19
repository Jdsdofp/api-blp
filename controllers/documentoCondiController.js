const DocumentoCondicionante = require("../models/Documento_Condicionante");
  
  
module.exports.listarDocumentoCondicionantes = async (req, res)=>{
    try {
        const documentoCondicionante = await DocumentoCondicionante.findAll({order: [['dc_id', 'ASC']]})

        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports.listarDocumentoCondicionante = async (req, res)=>{

    const {dc_id} = req.params;
    try {
        const documentoCondicionante = await DocumentoCondicionante.findOne({where: {dc_id: dc_id}})

        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}