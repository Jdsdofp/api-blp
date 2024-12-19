const Notificacao = require("../models/Notifica")



module.exports.notificaoes = async (req, res) =>{
    try {
        const {id} = req.user;
        const not = await Notificacao.findAll({where: {n_user_id: id}, order: [['n_id', 'ASC']]})

        res.status(200).json(not)
                

    } catch (error) {
        console.log('Log de erro: ', error)
    }
}

module.exports.marcarLido = async (req, res) =>{
    try {
        const {n_id} = req.params;
        console.log('ID recebido: ', n_id)
        
        
        const not = await Notificacao.findByPk(n_id);

        await not.update({
            n_lida: true
        })

        res.status(200).json({status: 'ok'})

    } catch (error) {
        res.status(400).json({status: 'erro'})
        console.error('Log de error: ', error)
    }
}