const Tipo_documento = require("../models/Tipo_Documento");


module.exports.registrarTipoDocumento = async (req, res)=>{
    try {
        const {td_desc, td_requer_condicao} = req.body;

        if(typeof(td_desc) == typeof(Number())) return res.status(404).json({message: 'Tipo de dado invalido, a descrição da liçenca/alvara não pode ser descrita somente com numeros'})

        const tipo_documento = await Tipo_documento.create({td_desc: td_desc, td_requer_condicao: td_requer_condicao})

        res.status(200).json({message: `Tipo de Documento ${tipo_documento.td_id} cadastrado com sucesso!`, tipo_documento})
    } catch (error) {
        res.status(404).json({message: error["errors"][0].message})
    }
}


module.exports.listarTipoDocumentos = async (req, res)=>{
    try {
        const tipoDocumento = await Tipo_documento.findAll({order: [['td_id', 'ASC']]});

        res.status(200).json(tipoDocumento)
    } catch (error) {
        res.status(400).json(error)
    }
}


module.exports.editarDescricaoTipoDoc = async (req, res)=>{
    try {
        const {td_id} = req.params;
        const {td_desc} = req.body;
        
        //console.info('ID recebido:\n', td_id)
        //console.info('Desc recebida :\n', td_desc)


        const tp_doc = await Tipo_documento.findByPk(td_id)
        //console.info('Tipo doc encontrado:\n', tp_doc)

        await tp_doc.update({td_desc: td_desc})
        return res.status(200).json({message: 'Tipo Documento atualizado com sucesso!', tp_doc})
        

    } catch (error) {
        return res.status(400).json({message: error?.errors[0]?.message})
    }
}


module.exports.editarReqCondicionanteTipoDoc = async (req, res)=>{
    try {
        const {td_id} = req.params;
        const {state} = req.body;

        //console.info('\nID recebido:', td_id)
        //console.info('State recebido:', state)

        const tp_doc = await Tipo_documento.findByPk(td_id);
        //console.log('Tipo documento encontrado:\n', tp_doc?.dataValues, '\n')

        await tp_doc.update({
            td_requer_condicao: state
        })

        //console.log('Tipo documento alterado:\n', tp_doc?.dataValues)
        return res.status(200).json({message: 'Alterada com suscesso!', tp_doc})

    } catch (error) {
        console.log('Log de erro:\n', error)
    } 
}


module.exports.deletarTipoDocumento = async (req, res)=>{
    try {
        const {td_id} = req.params;
        //console.info('\nID recebido:', td_id)

        const tp_doc = await Tipo_documento.findByPk(td_id)
        //console.log('Tipo documento encontrado:\n', tp_doc?.dataValues, '\n')
        if(tp_doc?.dataValues?.td_em_uso) return res.status(400).json({message: `Não é possível deletar ${tp_doc?.dataValues?.td_desc} porque já existem documentos vinculados a este tipo de documento.`})
    
        await tp_doc.destroy()

        return res.status(200).json({message: `${tp_doc?.dataValues?.td_desc} deletado`})

    } catch (error) {
        console.log('Log de erro:\n', error)
    }
}