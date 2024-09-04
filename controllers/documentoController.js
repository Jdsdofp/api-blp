const { Op } = require("sequelize");
const Documento = require("../models/Documentos");
const Usuario = require("../models/Usuario");
const Filial = require("../models/Filial");
const Tipo_documento = require("../models/Tipo_Documento");



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
            d_num_protocolo,
            d_situacao,
        } = req.body;

        const {id} = req.user;
        const d_criador_id = id;

        const documento = await Documento.create({ 
            d_filial_id: d_filial_id, 
            d_data_pedido: d_data_pedido, 
            d_data_emissao: d_data_emissao, 
            d_data_vencimento: d_data_vencimento, 
            d_tipo_doc_id: d_tipo_doc_id, 
            d_orgao_exp: d_orgao_exp, 
            d_anexo: d_anexo, 
            d_num_protocolo: d_num_protocolo, 
            d_criador_id: d_criador_id,
            d_situacao: d_situacao 
        })

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

//listar documentos de acordo com permissão de filiais para usuarios...
module.exports.listarDocumentosFilial = async (req, res) => {
    try {
        const { id } = req.user;

        const usuario = await Usuario.findOne({
            where: { u_id: id },
            attributes: ['u_filiais_ids']
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { u_filiais_ids } = usuario;

        const documentos = await Documento.findAll({
            where: {
                d_filial_id: {
                    [Op.in]: u_filiais_ids
                }
            },
            include: [
            {      
                model: Filial,
                as: 'filiais',
                attributes: ['f_codigo', 'f_nome', 'f_cidade', 'f_uf', 'f_ativo', 'f_cnpj']
            }]
        });

        res.status(200).json(documentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
}