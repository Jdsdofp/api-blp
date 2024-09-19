const Condicionante = require("../models/Condicionante");


module.exports.registrarCondicionante = async (req, res) => {
    try {
      const { c_tipo, c_condicao } = req.body;
  
      
      const condicionante = await Condicionante.create({
        c_tipo,
        c_condicao
      });
  
      
      res.status(200).json({ condicionante, message: `Condição #${condicionante.c_id} cadastrada com sucesso` });
    } catch (error) {
      res.status(400).json({message: error.errors[0].message});
    }
  };
  
  
module.exports.listarCondicionantes = async (req, res)=>{
    try {
        const condicionantes = await Condicionante.findAll({order: [['c_id', 'ASC']]})

        res.status(200).json(condicionantes)
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports.listarCondicionante = async (req, res)=>{
  const {c_id} = req.params;

  try {
      const condicionante = await Condicionante.findAll({where: {c_id: c_id}})

      res.status(200).json(condicionante)
  } catch (error) {
      res.status(400).json(error);
  }
}