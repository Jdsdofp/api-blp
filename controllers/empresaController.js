const Empresa = require("../models/Empresa");
const { msgErrosUnico } = require("../settings_Server");


module.exports.listarEmpresas = async (req, res)=>{
    try {

        const empresa =  await Empresa.findAll();

        res.status(200).json(empresa)
    } catch (error) {
        console.log(error)
    }
}


module.exports.registrarEmpresa = async (req, res)=>{
    try {
        const {
            e_nome,
            e_razao,
            e_cnpj,
            e_cidade,
            e_uf
          } = req.body;

          const e_criador_id = req.user.id;
        const empresa = await Empresa.create({e_nome, e_razao,e_cnpj,e_cidade,e_uf,  e_criador_id})

        res.status(200).json(empresa)
    } catch (error) {
        res.status(400).json({error: msgErrosUnico(error.errors[0]["type"])})
    }
}