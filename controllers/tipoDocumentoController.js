const Tipo_documento = require("../models/Tipo_Documento");


module.exports.registrarTipoDocumento = async (req, res)=>{
    try {
        const {td_desc} = req.body;

        if(typeof(td_desc) == typeof(Number())) return res.status(404).json({message: 'Tipo de dado invalido, a descrição da liçenca/alvara não pode ser descrita somente com numeros'})

        const tipo_documento = await Tipo_documento.create({td_desc: td_desc})

        res.status(200).json({tipo_documento})
    } catch (error) {
        res.status(404).json({message: error["errors"][0].message})
    }
}


module.exports.listarTipoDocumentos = async (req, res)=>{
    try {
        const tipoDocumento = await Tipo_documento.findAll();

        res.status(200).json(tipoDocumento)
    } catch (error) {
        res.status(400).json(error)
    }
}