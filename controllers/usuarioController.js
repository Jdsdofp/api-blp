const Usuario = require("../models/Usuario");
const { hashSenha, generateToken, compareSenha } = require("../config/auth");
const { msgErros } = require("../settings_Server");

module.exports.registrarUsuario = async (req, res) =>{
    try {
        const {u_nome, u_email, u_senha } = req.body;
        
        const hashedSenha = await hashSenha(u_senha);
        const newUsuario = await Usuario.create({u_nome, u_email, u_senha: hashedSenha})
        //const usuarioComSenha = await Usuario.scope("withPassword").findAll()
        //const usuario = await Usuario.findAll()


        res.status(201).json({message: "Usuario criado com sucesso"})

    } catch (error) {
        res.status(500).json({message: `Erro ao registrar o usuario ${msgErros(error.errors[0]["type"])}`})
        
    }
}

module.exports.loginUsuario = async(req, res)=>{
    try {
        const { u_email, u_senha } = req.body;
        
        const user = await Usuario.scope('withPassword').findOne({where: {u_email}});
        
        
        if(!user){
            return res.status(401).json({message: 'Email ou senha incorretos'});
        }

        const isMatch = await compareSenha(u_senha, user.u_senha);

        
        if(!isMatch){
            return res.status(401).json({message: 'Email ou senha incorretos'});
        }

        const token = generateToken(user);
        
        res.json({message: 'Autenticado com sucesso', token});

    } catch (error) {
        res.status(500).json({message: 'Erro ao autenticar usuário', error})
    }
}