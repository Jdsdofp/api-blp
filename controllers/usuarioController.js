const Usuario = require("../models/Usuario");
const { hashSenha, generateToken, compareSenha, verifyToken } = require("../config/auth");
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
        
        if(user.u_senhatemporaria){
            return res.status(200).json({message: 'Primeiro login detectado. Por favor, redefina sua senha', userId: user.u_id, token});
        }

        res.json({message: 'Autenticado com sucesso', token});

    } catch (error) {
        res.status(500).json({message: 'Erro ao autenticar usuário', error})
    }
}


module.exports.resetSenhaInicial = async (req, res)=>{
    try {
        const { userId, u_senha } = req.body;

        // Verifica se o usuário existe
        const user = await Usuario.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Criptografa a nova senha
        const hashedPassword = await hashSenha(u_senha);

        // Atualiza a senha e define senhaTemporaria como false
        await user.update({
            u_senha: hashedPassword,
            u_senhatemporaria: false
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao redefinir senha', error });
    }
}



module.exports.listarUsuarios = async(req, res)=>{
    try {
        const usuario = await Usuario.findAll()
        res.status(200).json(usuario)
    } catch (error) {
        res.status(400).json({message: "Houve um erro ao buscar usuarios"})        
    }
}