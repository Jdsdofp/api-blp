const { Op, literal } = require("sequelize");
const sequelize  = require('../config/db'); 
const Documento = require("../models/Documentos");
const Usuario = require("../models/Usuario");
const Filial = require("../models/Filial");
const Tipo_documento = require("../models/Tipo_Documento");
const DocumentoCondicionante = require("../models/Documento_Condicionante");
const { stringify } = require('flatted');
const Debito_Documentos = require("../models/Debitos_Documentos");


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
                  attributes: ['td_desc', 'td_dia_alert']
                }
              ]})


        res.status(200).json(documento)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}




//rota teste com implantação do MK
module.exports.listarDocumentosFilialTESTE = async (req, res) => {
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
                      attributes: ['td_desc', 'td_dia_alert'],
                      required: false   
                    }
                  ]
              }
          ],
          order: [['f_id', 'ASC']]
      });
      // Retornar as filiais e seus documentos
      // res.status(200).json(filiais);
      const serializedData = JSON.parse(JSON.stringify(filiais))
      return res.status(200).msgpack(serializedData);


  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar documentos das filiais' });
  }
}



module.exports.listarDocumentosStatusFilial = async (req, res) => {
  try {
    const { status, filialId } = req.params;

    // Buscar documentos da filial com o status informado
    const documentos = await Documento.findAll({
      where: { d_situacao: status, d_filial_id: filialId },
      include: [
        { model: Filial, as: 'filiais', attributes: ['f_nome', 'f_cidade', 'f_uf', 'f_codigo'] },
        { model: Tipo_documento, as: 'tipo_documentos', attributes: ['td_desc'] },
        { model: Usuario, as: 'usuario', attributes: ['u_nome'] }
      ]
    });

    if (!documentos.length) {
      return res.status(404).json({ message: 'Nenhum documento encontrado para essa filial com o status especificado' });
    }

    // Buscar IDs dos documentos e condicionantes
    const documentoIds = documentos.map(doc => doc.d_id);
    const condicionanteIds = documentos.map(doc => doc.d_condicionante_id).filter(Boolean); // Remove null/undefined

    // Buscar débitos relacionados
    const debitos = await Debito_Documentos.findAll({
      where: { dd_id_documento: { [Op.in]: documentoIds } }
    });

    // Buscar condicionantes relacionadas
    const condicionantes = await DocumentoCondicionante.findAll({
      where: { dc_id: { [Op.in]: condicionanteIds } }
    });

    // Criar um mapa de condicionantes para acesso rápido
    const condicionanteMap = condicionantes.reduce((acc, cond) => {
      acc[cond.dc_id] = cond.dc_condicoes;
      return acc;
    }, {});

    // Processar documentos com seus débitos e status de condicionantes
    const documentosComDebitos = documentos.map(doc => {
      const condicoes = condicionanteMap[doc.d_condicionante_id] || {};
      const tagStatusConds = Object.values(condicoes).some(cond => cond?.status === false) ? 'Pendente' : (doc?.dataValues?.d_data_emissao == '1970-01-01' && doc?.dataValues?.d_data_vencimento == '1970-01-01') ? 'Em análise' : "";

      return {
        ...doc.toJSON(),
        debitos: debitos
          .filter(debito => debito.dd_id_documento === doc.d_id)
          .reduce((total, debito) => total + parseFloat(debito?.dd_valor || 0), 0), // Soma dos valores de débito
        tagStatusConds
      };
    });

    res.status(200).json(documentosComDebitos);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao listar documentos por status e filial' });
  }
};
  


//model para listar documentos por filial para filtros:
module.exports.listarDocumentosModel = async (req, res) =>{
  try {

    const {filialId} = req.params;

      const documento = await Documento.findAll({
          where: {
            d_filial_id: filialId
          },
          include: [
              {
                model: Tipo_documento,
                as: 'tipo_documentos',
                attributes: ['td_desc', 'td_dia_alert']
              }
            ]})

      //debug
      //console.log('Debug: ', documento.map((k, v)=>k?.dataValues?.d_situacao).filter((v, i, s)=>s.indexOf(v)=== i))


      fillDoc = documento.map((k, v)=>k?.dataValues?.d_situacao).filter((v, i, s)=>s.indexOf(v)=== i)
      res.status(200).json(fillDoc)
  } catch (error) {
      console.log(error)
      res.status(400).json(error)
  }
}




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
                        attributes: ['td_desc', 'td_dia_alert']
                      }
                    ]
                }
            ],
            order: [['f_id', 'ASC']]
        });
       

        // Retornar as filiais com os documentos ordenados
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

//Deletar documento..
module.exports.deletarDocumento = async (req, res) => {
  try {
    const { d_id } = req.params;
    //console.log('ID recebido: ', d_id);

    const doc = await Documento.findByPk(d_id);
    if (!doc) {
      return res.status(404).json({ message: 'Documento não encontrado' });
    }
    console.log('Documento encontrado: ', doc?.dataValues);

    const cond = await DocumentoCondicionante.findByPk(doc.d_condicionante_id);
    if (!cond) {
      return res.status(404).json({ message: 'Condicionante associada não encontrada' });
    }
    console.log('Condicionante encontrada: ', cond?.dataValues);

    // Excluir a condicionante primeiro
    await cond.destroy();
    console.log('Condicionante excluída com sucesso');

    // Excluir o documento
    await doc.destroy();
    console.log('Documento excluído com sucesso');

    return res.status(200).json({ message: 'Documento e condicionante excluídos com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar documento: ', error);
    return res.status(500).json({ message: 'Erro interno ao deletar documento' });
  }
};

//Editar documento..
module.exports.editarDocumento = async (req, res)=>{
  try {
    const {d_id} = req.params;
    const {
      d_data_pedido, 
      d_data_emissao, 
      d_data_vencimento, 
      d_num_protocolo
    } = req.body;

    //console.log('ID recebido: ', d_id)

    const doc = await Documento.findByPk(d_id);
    console.log('Documento encontrado: ', doc?.dataValues);

    const model = {
      d_data_pedido: d_data_pedido === '' ? doc?.dataValues?.d_data_pedido : d_data_pedido,
      d_data_emissao: d_data_emissao === '' ? doc?.dataValues?.d_data_emissao : d_data_emissao,
      d_data_vencimento: d_data_vencimento === '' ? doc?.dataValues?.d_data_vencimento : d_data_vencimento,
      d_num_protocolo: d_num_protocolo === '' ? doc?.dataValues?.d_num_protocolo : d_num_protocolo,
    }

    //conferindo o estado dos dados...
    console.warn('MODEL: ', model)

    await doc.update(model)

    return res.status(200).json({message: 'Documento atualizado com sucessso! ✔'})


  } catch (error) {
    console.error('Erro aqui: ', error)
  }
}