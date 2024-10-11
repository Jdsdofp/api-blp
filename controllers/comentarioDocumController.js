const Comentariosdocumentos = require("../models/Comentarios_documentos");
const Usuario = require("../models/Usuario");
const {obterDataAtualFormatada} = require("../settings_Server")



module.exports.registarComentarioDocumento = async (req, res)=>{    
    try {

        const {cd_documento_id} = req.params;
        const {id} = req.user;
        const cd_autor_id  = id;
        const { 
            cd_msg,
            cd_situacao_comentario,
         } = req.body;


        const comentarioDocumento = await Comentariosdocumentos.create({
            cd_documento_id: cd_documento_id, 
            cd_autor_id: cd_autor_id, 
            cd_msg: cd_msg,
            cd_situacao_comentario: cd_situacao_comentario
        })
        
        res.status(200).json(comentarioDocumento)

        //console.log(d_id)
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports.listarComentarios = async(req, res)=>{
    try {
        const {cd_documento_id} = req.params;
        const comentarioDocumento = await Comentariosdocumentos.findAll({
            where: {cd_documento_id},
            include: {
                model: Usuario,
                as: 'usuario',
                attributes: ['u_nome']
            },
            order: [['cd_id', 'DESC']]
        })
        
        console.log(comentarioDocumento)

        res.status(200).json(comentarioDocumento)
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports.registrarRespostaComentario = async (req, res) => {
    try {
        const { cd_id } = req.params;
        const { msg } = req.body;
        const { id } = req.user;

        const autor = await Usuario.findOne({ where: { u_id: id } });
        if (!autor) {
            return res.status(404).json({ error: 'Autor não encontrado' });
        }

        const comentarioDocumento = await Comentariosdocumentos.findOne({ where: { cd_id } });
        if (!comentarioDocumento) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        let updatedRespostas = comentarioDocumento.cd_resposta;
        if (!Array.isArray(updatedRespostas)) {
            updatedRespostas = [];
        }

        let model = { autorId: autor.u_id, autor: autor.u_nome, msg, data: obterDataAtualFormatada()}

        updatedRespostas.push(model);

        await Comentariosdocumentos.update(
            { cd_resposta: updatedRespostas },
            { where: { cd_id } }
        );

        const updatedComentarioDocumento = await Comentariosdocumentos.findOne({ where: { cd_id } });

        res.status(200).json(model);
    } catch (error) {
        console.error('Error updating comentarioDocumento:', error);
        res.status(400).json({ error: error.message });
    }
};



