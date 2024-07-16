const { ValidationError } = require("sequelize");
const Empresa = require("../models/Empresa");
const { msgErrosUnico } = require("../settings_Server");
const Usuario = require("../models/Usuario");



module.exports.listarEmpresas = async (req, res)=>{
    try {
        const {id} = req.user;
        const usuario = await Usuario.findOne({where: {u_id: id}})
        if(usuario.u_empresas_ids.length == 0) return res.status(404).json({message: 'Voce ainda nao tem acesso a empresa'})
            
        const empresa =  await Empresa.findAll({where: {e_id: usuario.u_empresas_ids}});
        
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
        const empresa = await Empresa.create({e_nome, e_razao, e_cnpj, e_cidade, e_uf, e_criador_id})

        res.status(200).json(empresa)
    } catch (error) {
        res.status(400).json({error: msgErrosUnico(error.errors[0]["type"])})
    }
}


module.exports.editarEmpresa = async (req, res)=>{
    try {


        const {e_id} =  req.params;
        const {
            e_nome,
            e_razao,
            e_cnpj,
            e_cidade,
            e_uf
        } = req.body;
        
        
        const empresa = await Empresa.findByPk(e_id)
        console.log(empresa)
        empresa.update({e_nome: e_nome, e_razao: e_razao, e_cnpj: e_cnpj, e_cidade: e_cidade, e_uf: e_uf})
        .then(()=>{res.status(200).json(empresa)})
        .catch((e)=>{
            //console.log("erro na catch: ", e)
            res.status(404).json({"message": e.errors[0].message})
            })
        
    } catch (erros) {
        res.status(404).json({"Houve um erro interno ao editar a empresa": erros})
        //console.log("erro aqui ..", erros)
    }
}