const Condicionate = require("../models/Condicionante");


module.exports.registrarCondicionante = async(req, res)=>{
    try {
        const {  
            c_tipo,
            c_condicao
        } = req.body;
        
        const condicionante = await Condicionate.create({c_tipo: c_tipo, c_condicao: c_condicao})
        res.status(200).json({condicionante})
    } catch (error) {
        res.status(400).json(error)
    }
}