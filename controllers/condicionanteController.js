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

module.exports.editarDescCondicionante = async (req, res) => {
  try {
    const { c_id } = req.params;
    const {c_tipo} = req.body;
    //console.log('ID recebido:\n', c_id)
    //console.log('Valor recebido do front:\n', c_tipo)

    const cond = await Condicionante.findByPk(c_id)
    //console.info('Condicionante encontrada:\n', cond?.dataValues)

    if(!cond?.dataValues) return res.status(300).json({message: 'Condicionante não encontrada!'})
    
    if(!c_tipo) return res.status(301).json({message: 'O valor enviado não pode ser vazio!'})
    
    await cond.update({
      c_tipo: c_tipo
    })
    
    return res.status(200).json({message: `Condicionante alterada com sucesso`, cond})
  } catch (error) {
    return res.status(400).json({message: error?.errors[0]?.message})

  }
}

module.exports.deletaCondicionante = async (req, res) =>{
  try {
    const {c_id} = req.params;
    //console.log('ID recebido da condicionante:\n', c_id);

    const cond = await Condicionante.findByPk(c_id)
    //console.log('Condicionante encontrada:\n', cond?.dataValues);
    if(!cond?.dataValues) return res.status(400).json({message: 'Condicionante não encontrada!'})

    await cond.destroy()

    return res.status(200).json({message: 'Condidionante deletada com sucesso!'})

  } catch (error) {
    console.log('Log de erro:\n', error?.errors)
  }
}

module.exports.editarCondicao = async (req, res) => {
    try {
      const { c_id } = req.params;
      const {c_condicao_atualizada, c_condicao_atual} = req.body;
      //console.info('Condição atual: ', c_condicao_atual)
      //console.info('Condição atualizada: ', c_condicao_atualizada)

      const cond = await Condicionante.findOne({where: {c_id: c_id}})
      //console.info('Condicionante encontrada: ', cond?.dataValues, '\n')

      const condicoes = cond?.dataValues?.c_condicao;
      //console.info('Condições encontradas: ', condicoes, '\n')

      const index = condicoes.indexOf(c_condicao_atual)
      //console.info('Index da condição atual: ', index, '\n\n')


      //console.info('Condição encontrada via Index: ', condicoes[index])
      condicoes[index] = c_condicao_atualizada;

      //console.log('\nCond', condicoes)

      // Salvar a alteração no banco de dados
    await Condicionante.update(
      { c_condicao: condicoes }, // Atualiza o campo c_condicao
      { where: { c_id: c_id } }  // Condiciona pelo ID
    );

    return res.status(200).json({ message: 'Condição atualizada com sucesso.', condicoes })

    } catch (error) {
      console.log(error)
    }
}

module.exports.deletarCondicao = async (req, res) => {
  try {
    const { c_id } = req.params;
    const { c_condicao } = req.body;

    console.info('Condição a ser deletada: ', c_condicao);

    // Buscar a condicionante no banco de dados
    const cond = await Condicionante.findOne({ where: { c_id: c_id } });

    if (!cond) {
      return res.status(404).json({ message: 'Condicionante não encontrada.' });
    }

    //console.info('Condicionante encontrada: ', cond.dataValues);

    // Obter o array de condições
    const condicoes = cond.dataValues.c_condicao;

    //console.info('Condições encontradas: ', condicoes);

    // Encontrar o índice da condição a ser deletada
    const index = condicoes.indexOf(c_condicao);


    //console.info('Índice da condição a ser deletada: ', index);

    // Remover a condição do array
    condicoes.splice(index, 1);

    //console.log('Condições após remoção: ', condicoes);

    // Atualizar o registro no banco de dados
    await Condicionante.update(
      { c_condicao: condicoes }, // Atualiza o campo c_condicao
      { where: { c_id: c_id } }  // Condiciona pelo ID
    );

    return res.status(200).json({ message: 'Condição deletada com sucesso.', condicoes });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar condição.', error: error.message });
  }
};

module.exports.adicionarCondicoes = async (req, res) =>{
  try {
    const {c_id} = req.params;
    const {c_condicao} = req.body;
    //console.info('Id recebido: ', c_id)
    //console.info('Condição: ', c_condicao)

    const cond = await Condicionante.findByPk(c_id)
    //console.info('Condicionante encontrada: ', cond?.dataValues, '\n')

    const novasCondicoes = [...cond?.dataValues.c_condicao, ...c_condicao]
    //console.info('Novas condições: ', novasCondicoes)

    await cond.update({
      c_condicao: novasCondicoes
    })

    return res.status(200).json({
      message: "Condições adicionadas com sucesso!",
      c_condicao: novasCondicoes,
    });

  } catch (error) {
    console.log('Log de erro: ', error)
  }
}
