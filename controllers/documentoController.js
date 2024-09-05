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


module.exports.listarDocumentosStatusFilial = async (req, res) => {
    try {
      const { status, filialId } = req.params; // Pegando o status e o ID da filial dos parâmetros da URL
  
      // Busca os documentos da filial pelo status informado
      const documentos = await Documento.findAll({
        where: {
          d_situacao: status, // Filtrar pelo status (ex: 'Vencido', 'Em processo', etc.)
          d_filial_id: filialId // Filtrar pelo ID da filial
        },
        include: [
          {
            model: Filial, // Incluindo dados da filial relacionada
            as: 'filiais',
            attributes: ['f_nome', 'f_cidade', 'f_uf'] // Exemplo de campos que podem ser incluídos da filial
          },

          {
            model: Tipo_documento,
            as: 'tipo_documentos',
            attributes: ['td_desc']
          }
        ]
      });
  
      if (documentos.length === 0) {
        return res.status(404).json({ message: 'Nenhum documento encontrado para essa filial com o status especificado' });
      }
  
      res.status(200).json(documentos); // Retorna os documentos encontrados
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Erro ao listar documentos por status e filial' });
    }
};
  
//listar documentos de acordo com permissão de filiais para usuarios...
module.exports.listarDocumentosFilial = async (req, res) => {
    try {
        const { id } = req.user;

        // Encontrar o usuário pelo ID
        const usuario = await Usuario.findOne({
            where: { u_id: id },
            attributes: ['u_filiais_ids']
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { u_filiais_ids } = usuario;

        // Encontrar todas as filiais do usuário e incluir seus documentos
        const filiais = await Filial.findAll({
            where: {
                f_id: {
                    [Op.in]: u_filiais_ids
                }
            },
            attributes: ['f_id', 'f_codigo', 'f_nome', 'f_cidade', 'f_uf', 'f_ativo', 'f_cnpj'],
            include: [
                {
                    model: Documento,
                    as: 'documentos', // Usar o alias correto definido no model
                    attributes: ['d_id', 'd_situacao']
                }
            ]
        });

        // Retornar as filiais e seus documentos
        res.status(200).json(filiais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos das filiais' });
    }
}
