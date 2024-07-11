const Tipo_documento = require("../models/Tipo_Documento");


module.exports.registrarTipoDocumento = async (req, res)=>{
    try {
        const {td_desc} = req.body;

        const tipo_documento = await Tipo_documento.create({td_desc: String(td_desc)})

        res.status(200).json({tipo_documento})
    } catch (error) {
        res.status(404).json({message: error["errors"][0].message})
    }
}