const Comentariosdocumentos = require("../models/Comentarios_documentos");



module.exports.registarComentarioDocumento = async (req, res)=>{    
    try {

        const {cd_documento_id} = req.params;
        const {id} = req.user;
        const cd_autor_id  = id;
        const { 
            cd_msg
         } = req.body;


        const comentarioDocumento = await Comentariosdocumentos.create({
            cd_documento_id: cd_documento_id, 
            cd_autor_id: cd_autor_id, 
            cd_msg: cd_msg
        })
        
        res.status(200).json(comentarioDocumento)

        //console.log(d_id)
    } catch (error) {
        res.status(400).json(error)
    }
}