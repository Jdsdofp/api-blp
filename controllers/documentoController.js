const { Op, literal } = require("sequelize");
const sequelize  = require('../config/db'); 
const Documento = require("../models/Documentos");
const Usuario = require("../models/Usuario");
const Filial = require("../models/Filial");
const Tipo_documento = require("../models/Tipo_Documento");
const DocumentoCondicionante = require("../models/Documento_Condicionante");


module.exports.registarDocumento = async (req, res) => {
    const t = await sequelize.transaction(); // Inicia uma transação
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
            d_flag_stts,
            d_condicoes // Recebe o array de condições
        } = req.body;

        //console.info('Flag recebida: ', d_flag_stts)

        //console.log(req.body)

        const { id } = req.user;
        const d_criador_id = id;

        const verifyFilial = await Filial.findOne({ where: { f_id: d_filial_id } });
        if (!verifyFilial.f_ativo) return res.status(404).json({ message: 'Filial desativada não é possível registrar documento!' });

        // Busca o tipo de documento
        const tipoDocumento = await Tipo_documento.findOne({ where: { td_id: d_tipo_doc_id } });

        if (!tipoDocumento) {
            throw new Error('Tipo de documento não encontrado.');
        }

        const dataPadrao = '1970-01-01';
        let documento;

        // Verifica se o documento requer condicionante
        if (tipoDocumento.td_requer_condicao) {
            //console.log('Tipo de documento requer condicionante');

            documento = await Documento.create({
                d_filial_id: d_filial_id,
                d_data_pedido: dataPadrao,
                d_data_emissao: dataPadrao,
                d_data_vencimento: dataPadrao,
                d_tipo_doc_id: d_tipo_doc_id,
                d_orgao_exp: d_orgao_exp,
                d_anexo: '',
                d_num_protocolo: '',
                d_criador_id: d_criador_id,
                d_situacao: d_flag_stts || 'Não iniciado',
            }, { transaction: t });


            // Cria a condicionante
            const condicionante = await DocumentoCondicionante.create({
                dc_documento_id: documento.d_id, // Relaciona com o documento criado
                status: 'Pendente', // Status inicial
                dc_status_doc_ref: documento?.d_situacao,
                dc_condicoes: d_condicoes // Armazena o objeto de condições
            }, { transaction: t });

            // Atualiza o documento com o ID da condicionante
            documento.d_condicionante_id = condicionante.dc_id;
            await documento.save({ transaction: t });

        } else {
            // Cria o documento normalmente se não requer condicionante
            if(!d_data_pedido || !d_data_emissao || !d_data_vencimento) return res.status(400).json({error: 'Não é possivel cadastrar o documento sem condicionante se não informar as datas requeridas'})
            documento = await Documento.create({
                d_filial_id,
                d_data_pedido: d_data_pedido,
                d_data_emissao: d_data_emissao,
                d_data_vencimento: d_data_vencimento,
                d_tipo_doc_id,
                d_orgao_exp,
                d_anexo,
                d_num_protocolo,
                d_criador_id,
                d_situacao: d_situacao
            }, { transaction: t });
        }

        // Confirma a transação
        await t.commit();
        res.status(200).json({ message: 'Documento registrado com sucesso', documento });

    } catch (error) {
        console.error('Erro ao registrar documento:', error);

        // Reverte a transação em caso de erro
        await t.rollback();
        res.status(400).json({ error: 'Erro ao registrar documento', detalhes: error.message });
    }
};



module.exports.listarDocumentos = async (req, res) =>{
    try {
        const documento = await Documento.findAll({
            include: [
                {
                  model: Filial, // Incluindo dados da filial relacionada
                  as: 'filiais',
                  attributes: ['f_nome', 'f_cidade', 'f_uf', 'f_codigo'] // Exemplo de campos que podem ser incluídos da filial
                },
      
                {
                  model: Tipo_documento,
                  as: 'tipo_documentos',
                  attributes: ['td_desc']
                }
              ]})


        res.status(200).json(documento)
    } catch (error) {
        console.log(error)
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
            attributes: ['f_nome', 'f_cidade', 'f_uf', 'f_codigo'] // Exemplo de campos que podem ser incluídos da filial
          },

          {
            model: Tipo_documento,
            as: 'tipo_documentos',
            attributes: ['td_desc']
          },

          {
            model: Usuario,
            as: 'usuario',
            attributes: ['u_nome']
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
  


//listar documento individual para tratar no front o modal condition
module.exports.listarDocumentoCondicaoId = async (req, res) => {
  try {
    const { conditionId } = req.params; // Pegando o status e o ID da filial dos parâmetros da URL
    //console.log('ID recebido', conditionId)
    // Busca os documentos da filial pelo status informado
    const documentos = await Documento.findOne({
      where: {
        d_condicionante_id: conditionId // Filtrar pelo ID da filial
      },
      include: [
        {
          model: Filial, // Incluindo dados da filial relacionada
          as: 'filiais',
          attributes: ['f_nome', 'f_cidade', 'f_uf', 'f_codigo'] // Exemplo de campos que podem ser incluídos da filial
        },

        {
          model: Tipo_documento,
          as: 'tipo_documentos',
          attributes: ['td_desc']
        },

        {
          model: Usuario,
          as: 'usuario',
          attributes: ['u_nome']
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
            attributes: ['f_id', 'f_codigo', 'f_nome', 'f_cidade', 'f_uf', 'f_ativo', 'f_cnpj', 'f_location'],
            include: [
                {
                    model: Documento,
                    as: 'documentos', // Usar o alias correto definido no model
                    attributes: ['d_id', 'd_situacao'],
                    include: [
                      {
                        model: Tipo_documento,
                        as: 'tipo_documentos',
                        attributes: ['td_desc']
                      }
                    ]
                }
            ],
            order: [['f_id', 'ASC']]
        });
        // Retornar as filiais e seus documentos
        res.status(200).json(filiais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos das filiais' });
    }
}


//Listar documentos por ID de filial para listagem geral de documentos da filial (Ativos)
module.exports.listarTodosDocumentosFilial = async (req, res) => {
    try {
      const { filialId } = req.params; // Pegando o status e o ID da filial dos parâmetros da URL
  
      // Busca os documentos da filial pelo status informado
      const documentos = await Documento.findAll({
        where: {
          d_ativo: true,
          d_filial_id: filialId // Filtrar pelo ID da filial
        },
        include: [
          {
            model: Filial, // Incluindo dados da filial relacionada
            as: 'filiais',
            attributes: ['f_nome', 'f_cidade', 'f_uf', 'f_codigo'] // Exemplo de campos que podem ser incluídos da filial
          },

          {
            model: Tipo_documento,
            as: 'tipo_documentos',
            attributes: ['td_desc']
          },

          {
            model: Usuario,
            as: 'usuario',
            attributes: ['u_nome']
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


//Listar documentos por ID de filial para listagem geral de documentos da filial (Ativos)
module.exports.listarStatusID = async (req, res) => {
  try {
    const { id } = req.params; // Pegando o status e o ID da filial dos parâmetros da URL


    const cond = await DocumentoCondicionante.findByPk(id)
    const d_id = cond?.dataValues.dc_documento_id;
    // Busca os documentos da filial pelo status informado
    const documentos = await Documento.findOne({
      where: {
        d_ativo: true,
        d_id: d_id // Filtrar pelo ID da filial
      }});

    if (documentos.length === 0) {
      return res.status(404).json({ message: 'Nenhum documento encontrado para essa filial com o status especificado' });
    }

    res.status(200).json(documentos?.d_situacao); // Retorna os documentos encontrados
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao listar documentos por status e filial' });
  }
};



//Mudar status para irregular da filial -> esse status ele torna a filial irregular atraces do status de um documento especifico
module.exports.atualizaStatusIrregular = async (req, res) =>{
  try {
    const {d_id} = req.params;
    const {d_situacao} = req.body;

    //console.log('d_id recebido: ', d_id)
    //console.log('Situacao recebida: ', d_situacao)

    const doc = await Documento.findByPk(d_id)
    //console.log('Doc enconttado: ', doc?.dataValues)

    const cond = await DocumentoCondicionante.findByPk(doc?.dataValues?.d_condicionante_id)
    //console.log('Cond encontrada: ', cond?.dataValues)

    if(doc?.dataValues?.d_situacao == d_situacao){
      doc.update({
        d_situacao: cond?.dataValues?.dc_status_doc_ref
      })
      
      cond.update({
        dc_status_doc_ref: d_situacao
      })

    } else {
      doc.update({
        d_situacao: d_situacao
      })

      cond.update({
        dc_status_doc_ref: d_situacao
      })
      
    }

    const docs = doc?.dataValues;
    const conds = cond?.dataValues;
    //console.info('Doc atualizado: ', docs)

    //console.info('Cond atualizada: ', conds)

    return res.status(200).json({message: "Status documento atualizado para 'Irregular'", docs})

  } catch (error) {

    console.log(error)

  }

}