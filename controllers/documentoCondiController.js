const DocumentoCondicionante = require("../models/Documento_Condicionante");
const Documento = require("../models/Documentos");
const Filial = require("../models/Filial");
const Usuario = require("../models/Usuario");
const fetch = require('node-fetch');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');  
const Notificacao = require("../models/Notifica");
const { Op } = require("sequelize");
const Tipo_documento = require("../models/Tipo_Documento");


module.exports.listarDocumentoCondicionantes = async (req, res)=>{
    try {
        const documentoCondicionante = await DocumentoCondicionante.findAll({order: [['dc_id', 'ASC']]})

        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}

//Listar documento condicionante por filial
module.exports.listarDocumentoCondicionanteFiliais = async (req, res) => {
    try {
        const documentoCondicionante = await DocumentoCondicionante.findAll({
            include: [
                {
                    model: Documento,
                    as: 'documento', // Usar o alias 'documento' definido no belongsTo
                    attributes: ['d_filial_id'], // Inclui o ID da filial relacionado ao documento
                    include: [
                        {
                            model: Filial,
                            as: 'filiais', // Usar o alias 'filiais' definido no belongsTo no Documento
                            attributes: ['f_nome', 'f_cnpj', 'f_cidade', 'f_uf'], // Pegue os dados da filial
                        }
                    ]
                }
            ]
        });

        res.status(200).json(documentoCondicionante);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
};


module.exports.listarDocumentoCondicionante = async (req, res)=>{

    const {dc_id} = req.params;
    try {
        const documentoCondicionante = await DocumentoCondicionante.findOne({where: {dc_id: dc_id}})

        //console.log('Condicionantes do documento: \n', documentoCondicionante?.dataValues)
        res.status(200).json(documentoCondicionante)
    } catch (error) {
        res.status(400).json(error);
    }
}


//rota condicionante por usuario::::
module.exports.listarDocumentoCondicionanteUsuario = async (req, res) => {
    const { dc_id } = req.params;

    try {
        const documentoCondicionante = await DocumentoCondicionante.findOne({ where: { dc_id } });

        if (!documentoCondicionante) {
            return res.status(404).json({ message: "Documento condicionante não encontrado." });
        }

        const condicoes = documentoCondicionante.dataValues.dc_condicoes;

        // Iterar sobre cada condição e buscar os nomes dos usuários
        for (const condicao in condicoes) {
            const userIds = condicoes[condicao].users;

            // Buscar os usuários pelo ID
            const usuarios = await Usuario.findAll({
                where: { u_id: userIds },
                attributes: ['u_id', 'u_nome'], // Ajuste os nomes dos campos conforme seu modelo
            });

            // Adicionar os nomes dos usuários ao retorno
            condicoes[condicao].users = usuarios.map(user => ({
                id: user.u_id,
                nome: user.u_nome,
            }));
        }

        //console.log('Condicionantes do documento com usuários: \n', documentoCondicionante.dataValues);
        res.status(200).json(documentoCondicionante);
    } catch (error) {
        console.error('Erro ao listar documento condicionante:', error);
        res.status(400).json({ error: "Erro ao listar documento condicionante.", details: error.message });
    }
};




module.exports.fecharCondicionante = async (req, res) => {
    try {
        const { dc_id } = req.params;
        const { dc_condicoes } = req.body;
        console.log(dc_condicoes)

        // Obter a primeira chave do objeto dc_condicoes
        const firstKey = Object.keys(dc_condicoes)[0];

        // Buscar o documento com o dc_id
        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });

        if (!doc_cond) {
            return res.status(404).json({ message: 'Documento não encontrado.' });
        }

        // Verifique se a primeira chave existe em dc_condicoes do banco de dados
        const conditionExists = firstKey in doc_cond.dataValues.dc_condicoes;

        if (conditionExists) {
            //console.log(`Condição '${firstKey}' existe no documento.`);

            // Atualizar a condição no objeto dc_condicoes do documento encontrado
            doc_cond.dataValues.dc_condicoes[firstKey] = dc_condicoes[firstKey];

            // Persistir a alteração no banco de dados
            await DocumentoCondicionante.update(
                { dc_condicoes: doc_cond.dataValues.dc_condicoes },
                { where: { dc_id: dc_id } }
            );

            return res.status(200).json({ message: `Condição '${firstKey}' atualizada com sucesso.` });
        } else {
            //console.log(`Condição '${firstKey}' não existe no documento.`);
            return res.status(404).json({ message: `Condição '${firstKey}' não encontrada no documento.` });
        }
    } catch (error) {
        console.error('Houve um erro aqui', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


module.exports.fecharProcessoCondicionante = async (req, res) => {
    try {
        const { dc_id } = req.params;
        const { dc_documento_id, d_num_protocolo, d_data_pedido } = req.body;

        // Buscar a condicionante com o dc_id
        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });
        if (!doc_cond) return res.status(404).json({ message: 'Condicionante não encontrada' });

        console.log('Condicionante Encontrada... \n', doc_cond);

        const d_id = doc_cond.dc_documento_id;
        const doc = await Documento.findOne({ where: { d_id: d_id } });

        if (!doc) return res.status(404).json({ message: 'Documento não encontrado' });

        console.log('Documento Encontrado... \n', doc);

        // Atualizar o model Documento com os valores recebidos no body
        await doc.update({
            d_data_pedido: d_data_pedido || doc.d_data_pedido,
            d_num_protocolo: d_num_protocolo || doc.d_num_protocolo,
            d_situacao: 'Em processo' || doc.d_situacao
        });

        console.log('Documento Atualizado... \n', doc);

        // Atualizar o status do model Condicionante para 'Em processo'
        await doc_cond.update({
            status: 'Em processo',
            dc_status_doc_ref: 'Em processo'
        });

        console.log('Condicionante Atualizada... \n', doc_cond);

        return res.status(200).json({ message: 'Documento e Condicionante atualizados com sucesso' });

    } catch (error) {
        // Log de erro
        console.warn(error);
        return res.status(500).json({ message: 'Erro ao atualizar Documento e Condicionante' });
    }
};


module.exports.atribuirUsuariosCondicao = async (req, res) => {
    
    try {
        const io = req.app.get('io'); // Acesse a instância do io
        const { dc_id } = req.params;
        let { dc_condicoes, userIds } = req.body;

        console.log('Payload recebido:', req.body);

        if (!dc_condicoes || !userIds) {
            return res.status(400).json({ message: 'Dados incompletos. As condições ou IDs de usuários estão ausentes.' });
        }


        const userAtribuetor = await Usuario.findByPk(req.user.id)
        console.log('user log: ', userAtribuetor?.dataValues?.u_nome)

        // Garantir que userIds seja um array
        if (!Array.isArray(userIds)) {
            userIds = [userIds]; // Converte para array se for um único ID
        }

        const firstKey = Object.keys(dc_condicoes)[0];

        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });

        if (!doc_cond) {
            return res.status(404).json({ message: 'Documento não encontrado.' });
        }

        const conditionExists = firstKey in doc_cond.dataValues.dc_condicoes;

        if (conditionExists) {
            console.log(`Condição '${firstKey}' existe no documento.`);

            // Atualizar os usuários atribuídos à condição (mantém todos os IDs, inclusive o do usuário logado)
            doc_cond.dataValues.dc_condicoes[firstKey].users = userIds;

            await DocumentoCondicionante.update(
                { dc_condicoes: doc_cond.dataValues.dc_condicoes },
                { where: { dc_id: dc_id } }
            );

            // Criar notificações para os usuários atribuídos (exclui o ID do usuário logado)
            const userIdsToNotify = userIds.filter(userId => userId !== req.user.id);

            for (const userId of userIdsToNotify) {
                const notification = await Notificacao.create({
                  n_user_id: userId,
                  n_mensagem: `${userAtribuetor?.dataValues?.u_nome} atribuiu à condição '${firstKey}' para você.`,
                });
                
                const notsUser = await Notificacao.findAll({where: {n_user_id: userId}})
                const countNots = Object.entries(notsUser || {}).filter(([key, value]) => value?.n_lida === false).length

                
                // Emitir a notificação via Socket.IO
                io.to(`user_${userId}`).emit('nova_notificacao', {
                  mensagem: `${userAtribuetor?.dataValues?.u_nome} atribuiu à condição '${firstKey}' para você.`,
                  condicao: firstKey,
                  count: countNots
                });
              }

            return res.status(200).json({ message: `Usuários atribuídos à condição '${firstKey}' com sucesso e notificados.` });
        } else {
            console.log(`Condição '${firstKey}' não existe no documento.`);
            return res.status(404).json({ message: `Condição '${firstKey}' não encontrada no documento.` });
        }
    } catch (error) {
        console.error('Houve um erro ao atribuir usuários à condição:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};




module.exports.listarDocumentoCond = async (req, res) => {
    const { id } = req.user; // Obter o ID do usuário a partir do token
    const { dc_id } = req.params; // Obter o dc_id da requisição
    

    try {
        // Busca o documento com o dc_id especificado
        const documentoCondicionante = await DocumentoCondicionante.findOne({
            where: { dc_id }, // Filtra pelo dc_id
        });

        if (!documentoCondicionante) {
            return res.status(404).json({ message: 'Documento não encontrado' });
        }

        // Filtrando as condições com base no ID do usuário
        const { dc_condicoes } = documentoCondicionante; // Acessa as condições
        const condicoesFiltradas = {};


        // Percorre cada condição e verifica se o usuário está na lista
        for (const [key, condicao] of Object.entries(dc_condicoes)) {
            // Se o usuário está na lista de usuários, adiciona a condição ao objeto filtrado
            console.log(`Verificando condição: ${key}`, condicao);
            if (condicao.users.includes(id)) {
                condicoesFiltradas[key] = condicao; // Adiciona a condição ao objeto filtrado
            }
        }


        // Verifica se alguma condição foi encontrada
        if (Object.keys(condicoesFiltradas).length === 0) {
            return res.status(404).json({ message: 'Nenhuma condição encontrada para o usuário' });
        }

        // Adiciona as condições filtradas ao documento
        documentoCondicionante.dc_condicoes = condicoesFiltradas;

        // Retorna o documento com as condições filtradas
        res.status(200).json(documentoCondicionante);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message }); // Retorna apenas a mensagem de erro
    }
}


module.exports.adicionarCondicoes = async (req, res) => {
    try {
        const { dc_id } = req.params; // ID do documento condicionante
        const { novaCondicao, detalhesCondicao } = req.body; // novaCondicao é a chave e detalhesCondicao é o valor do novo item
        
        console.log(dc_id)

        // Buscar o documento com o dc_id
        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });

        if (!doc_cond) {
            return res.status(404).json({ message: 'Documento não encontrado.' });
        }

        // Verificar se a condição já existe no objeto dc_condicoes
        if (novaCondicao in doc_cond.dataValues.dc_condicoes) {
            return res.status(409).json({ message: `A condição '${novaCondicao}' já existe no documento.` });
        }

        // Adicionar a nova condição ao objeto dc_condicoes do documento encontrado
        doc_cond.dataValues.dc_condicoes[novaCondicao] = detalhesCondicao;

        // Persistir a alteração no banco de dados
        await DocumentoCondicionante.update(
            { dc_condicoes: doc_cond.dataValues.dc_condicoes },
            { where: { dc_id: dc_id } }
        );

        return res.status(201).json({ message: `Condição '${novaCondicao}' adicionada com sucesso.` });
    } catch (error) {
        console.error('Erro ao adicionar nova condição:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


module.exports.fecharProcesso = async (req, res) => {
    try {
        const { dc_id } = req.params;
        const { d_data_emissao, d_data_vencimento, d_num_protocolo, d_flag_vitalicio } = req.body;
        //console.log(`Valor recebido da FLAG: `, d_flag_vitalicio)

        //console.log('ID do parametro', dc_id);

        const doc_cond = await DocumentoCondicionante.findOne({ where: { dc_id: dc_id } });
        //console.log('Condicionante encontrada: \n', doc_cond?.dataValues);

        const d_id = doc_cond?.dataValues?.dc_documento_id;
        const doc = await Documento.findOne({ where: { d_id: d_id } });

       

        if (doc?.dataValues.d_data_pedido > d_data_emissao) {
            const dataEmissao = new Date(d_data_emissao);
            const dataPedido = new Date(doc?.dataValues.d_data_pedido);

            // Força o ajuste ao fuso horário local
            const dataEmissaoFormatada = new Date(dataEmissao.getTime() + dataEmissao.getTimezoneOffset() * 60000)
                .toLocaleDateString('pt-BR');
            const dataPedidoFormatada = new Date(dataPedido.getTime() + dataPedido.getTimezoneOffset() * 60000)
                .toLocaleDateString('pt-BR');

            return res.status(401).json({
                message: `CONFLITO DE DATA:\ndata de emissão ${dataEmissaoFormatada} não pode ser menor que a de protocolo ${dataPedidoFormatada}`
            });
        }



        if (!doc) return res.status(404).json({ message: 'Documento atrelado na condicionante não encontrado!' });

        // Verifica se todos os campos estão preenchidos
        if (d_num_protocolo && d_data_emissao && d_data_vencimento && d_flag_vitalicio) {
            // Atualiza todos os campos e define situação como "Emitido"
            await doc.update({
                d_data_emissao: d_data_emissao,
                d_data_vencimento: d_data_vencimento,
                d_num_protocolo: d_num_protocolo,
                d_flag_vitalicio: d_flag_vitalicio || false,
                d_situacao: 'Emitido'
            });
            //console.log('Documento atualizado com sucesso: \n', doc?.dataValues);

            await doc_cond.update({
                status: 'Finalizada',
                dc_status_doc_ref: doc?.dataValues?.d_situacao
            });
            //console.log('Condicionante atualizada para status "Finalizada": \n', doc_cond?.dataValues);
        } else if (doc.d_num_protocolo) {
            // Atualiza apenas as datas, mantém d_num_protocolo inalterado, e define situação como "Em processo"
            await doc.update({
                d_data_emissao: d_data_emissao,
                d_data_vencimento: d_data_vencimento,
                d_situacao: 'Emitido'
            });
            //console.log('Documento atualizado com novas datas e situação "Em processo": \n', doc?.dataValues);

            await doc_cond.update({
                status: 'Finalizada',
                dc_status_doc_ref: 'Emitido'
            });
            //console.log('Condicionante atualizada para status "Em processo": \n', doc_cond?.dataValues);
        } else if (!d_data_emissao && !d_data_vencimento) {
            // Caso as datas estejam vazias, insere d_num_protocolo e define situação como "Em processo"
            await doc.update({
                d_num_protocolo: d_num_protocolo,
                d_situacao: 'Em processo'
            });
            //console.log('Documento atualizado com d_num_protocolo e situação "Em processo": \n', doc?.dataValues);
            // res.status(200).json({ message: `Processo finalizado com sucesso 2`, doc})

            await doc_cond.update({
                status: 'Em processo'
            });
            //console.log('Condicionante atualizada para status "Em processo": \n', doc_cond?.dataValues);
        }

        return res.status(200).json({ message: `Processo finalizado com sucesso`, doc });
        
    } catch (error) {
        console.log('Log de erro: ', error);
        res.status(500).json({ message: 'Erro ao finalizar o processo' });
    }
};



module.exports.listarUsuariosPorCondicao = async (req, res) => {
    const { dc_id } = req.params; // Recebe o id e o nome da condição
    const { nome } = req.body;

    try {
        // Procura pela condição específica usando o id
        const condicao = await DocumentoCondicionante.findOne({
            where: { dc_id: dc_id }
        });

        if (!condicao) {
            return res.status(404).json({ message: 'Condição não encontrada' });
        }

        // Extraindo os IDs dos usuários da condição
        const usuariosAtribuidos = condicao.dc_condicoes[nome]?.users || [];

        // Busca todos os usuários
        const allUsers = await Usuario.findAll();

        // Mapeia os usuários para incluir o campo 'u_atribuido'
        const usersResponse = allUsers.map(user => {
            return {
                u_id: user.u_id,
                u_nome: user.u_nome,
                u_atribuido: usuariosAtribuidos.includes(user.u_id)
            };
        });

        res.json(usersResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários por condição' });
    }
};



module.exports.listarTarefasUsuario = async (req, res) => {
    try {
        const { id } = req.user; // ID do usuário logado
        
        // Consulta todos os registros
        const condicoes = await DocumentoCondicionante.findAll({
            where: {
                status: {
                    [Op.ne]: 'Finalizada'
                }
            },
            include: [
                {
                    model: Documento,
                    as: 'documento',
                    attributes: ['d_filial_id'],
                    include: [
                        {
                            model: Tipo_documento,
                            as: 'tipo_documento',
                            attributes: ['td_desc'],
                        },
                        {
                            model: Filial,
                            as: 'filiais',
                            attributes: ['f_nome', 'f_cnpj', 'f_cidade', 'f_uf'],
                        },
                    ],
                },
            ],
            order: [['dc_id', 'DESC']]
         });

        // Filtra registros que contenham condições atribuídas ao usuário logado
        const resultadoFiltrado = condicoes
            .map((condicao) => {
                // Filtra as condições específicas do usuário logado
                const dc_condicoes_filtradas = Object.entries(condicao.dc_condicoes).reduce((acc, [key, value]) => {
                    if (value.users.includes(id)) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});

                // Retorna apenas registros com condições atribuídas ao usuário logado
                if (Object.keys(dc_condicoes_filtradas).length > 0) {
                    return {
                        ...condicao.toJSON(),
                        dc_condicoes: dc_condicoes_filtradas,
                    };
                }
                return null;
            })
            .filter((condicao) => condicao !== null); // Remove registros sem condições atribuídas

        // Retorna o resultado
        res.status(200).json(resultadoFiltrado);
    } catch (error) {
        console.error(`[Log de erro.: \n \n ${error}]`);
        res.status(500).json({ error: "Erro ao listar tarefas do usuário." });
    }
};


