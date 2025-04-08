const Debito_Documentos = require("../models/Debitos_Documentos");
const Documento = require("../models/Documentos");
const Usuario = require("../models/Usuario");



module.exports.registrarCusto = async (req, res) =>{
    try {
        const {d_id} = req.params;
        //console.log('ID doc recebido', d_id);

        const {id} = req.user;
        const usuario = await Usuario.findByPk(id)

        //pegando o usuario no banco
        //console.log('Usuario que esta cadastrando o custo', usuario?.dataValues?.u_nome)

        //Dados recebido do body
        const {
            dd_descricao,
            dd_valor,
            dd_data_entrada,
            dd_data_vencimento,
            dd_tipo,
            d_num_ref
        } = req.body;



        //Verifica se o documento citado realmente existe
        const doc = await Documento.findByPk(d_id);
        if(!doc?.dataValues) return res.status(300).json({message: 'Documento não encontrado'})
        //console.log('Doc encontrado', doc?.dataValues);
        
        //Cadastrar o debito e atrelar ao documento citado
        const debitos_documentos = await Debito_Documentos.create({
            dd_id_documento: d_id,
            dd_descricao: dd_descricao,
            dd_valor: dd_valor,
            dd_data_entrada: dd_data_entrada,
            dd_data_vencimento: dd_data_vencimento,
            dd_tipo: dd_tipo,
            dd_usuario: usuario?.dataValues?.u_nome,
            d_num_ref: d_num_ref
        });

        return res.status(200).json({message: `Custo #${debitos_documentos?.dd_id} cadastrado com sucesso`, debitos_documentos})

    } catch (error) {
        console.log('Log de Erro ao registrar Documento', error)
        res.status(404).json({message: 'Erro ao cadastrar custo!'})
    }
}


module.exports.listarCustoDocumento = async (req, res) =>{
    try {
        const {d_id} = req.params;

        //console.info('Id recebido', d_id)
        const doc = await Documento.findOne({where: {d_condicionante_id: d_id}})

        //console.log('Doc encontrato', doc?.dataValues?.d_id)

        const debitos = await Debito_Documentos.findAll({where: {dd_id_documento: doc?.dataValues?.d_id}})
        //console.info(debitos)
        res.status(200).json(debitos)
        
    } catch (error) {
        console.log('Log de erro ao buscar documento', error)
    }
}

module.exports.listarCustos = async (req, res) =>{
    try {
        const custos = await Debito_Documentos.findAll();

        res.status(200).json({custos})
    } catch (error) {
        res.status(400).json({error: error})
    }
}

module.exports.deletarDebito = async (req, res)=>{
    try {
        const {id} = req.params;
        // console.log('Id do debito: ', id)

        const debito = await Debito_Documentos.findByPk(id)
        // console.log('Debito encontrado: ', debito)

        await debito.destroy()

        res.status(200).json({message: 'Registro deletado com sucesso!'})

    } catch (error) {
        console.error('Log de error: ', error)
        res.status(404).json({error: error})
    }
}