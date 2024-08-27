const { ValidationError } = require("sequelize");
const Empresa = require("../models/Empresa");
const { msgErrosUnico } = require("../settings_Server");
const Usuario = require("../models/Usuario");



module.exports.listarEmpresas = async (req, res) => {
    try {
        const { id } = req.user;
        const usuario = await Usuario.findOne({ where: { u_id: id } });

        
        if (usuario.u_perfil === 'admin') {
            const todasEmpresas = await Empresa.findAll();
            return res.status(200).json(todasEmpresas);
        }

        if (!usuario.u_empresas_ids || usuario.u_empresas_ids.length === 0) {
            return res.status(404).json({ message: 'Você ainda não tem acesso a nenhuma empresa' });
        }

        const empresas = await Empresa.findAll({ where: { e_id: usuario.u_empresas_ids } });
        return res.status(200).json(empresas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao listar empresas' });
    }
};



module.exports.registrarEmpresa = async (req, res)=>{
    try {
        const {
            e_nome,
            e_razao,
            e_cnpj,
            e_cidade,
            e_uf
          } = req.body;

        
        const cnpj = e_cnpj.replace(/[^\d]/g, "")
        const e_criador_id = req.user.id;
        const empresa = await Empresa.create({e_nome, e_razao, e_cnpj: cnpj, e_cidade, e_uf, e_criador_id})

        res.status(200).json(empresa)
    } catch (error) {
        res.status(400).json({error: error.errors[0].message, field: error.errors[0].path})
    }
}


module.exports.editarEmpresa = async (req, res)=>{
    try {

        const {e_id} =  req.params;
        const {id} = req.user;
        const usuario = await Usuario.findOne({where: {u_id: id}})
        if(!e_id.includes(usuario.u_empresas_ids)) return res.status(404).json({message: 'Voce ainda nao tem acesso a empresa'})

        const {
            e_nome,
            e_razao,
            e_cnpj,
            e_cidade,
            e_uf
        } = req.body;
        
        
        const empresa = await Empresa.findByPk(e_id)
       
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
