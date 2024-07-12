const Documento = require("../models/Documentos");



module.exports.registarDocumento = async (req, res)=>{
    try {
        const {
            d_filial_id,
            d_data_pedido,
            d_data_emissao,
            d_data_vencimento,
            d_tipo_doc_id,
            d_orgao_exp,
            d_anexo,
            d_num_protocolo
        } = req.body;

        const {id} = req.user;
        const d_criador_id = id;

        const documento = await Documento.create({ d_filial_id: d_filial_id, d_data_pedido: d_data_pedido, d_data_emissao: d_data_emissao, d_data_vencimento: d_data_vencimento, d_tipo_doc_id: d_tipo_doc_id, d_orgao_exp: d_orgao_exp, d_anexo: d_anexo, d_num_protocolo: d_num_protocolo, d_criador_id: d_criador_id })

        res.status(200).json(documento)
    } catch (error) {
        res.status(400).json(error)
    }
}


module.exports.listarDocumentos = async (req, res) =>{
    try {
        const documento = await Documento.findAll()


        res.status(200).json(documento)
    } catch (error) {
        res.status(400).json(error)
    }
}