const Usuario = require("../models/Usuario");
const { hashSenha, generateToken, compareSenha, verifyToken } = require("../config/auth");
const { msgErrosUnico } = require("../settings_Server");

module.exports.registrarUsuario = async(req, res) =>{
    try {
        const {u_nome, u_email, u_senha } = req.body;
        
        const hashedSenha = await hashSenha(u_senha);
        const newUsuario = await Usuario.create({u_nome, u_email, u_senha: hashedSenha})
        //const usuarioComSenha = await Usuario.scope("withPassword").findAll()
        //const usuario = await Usuario.findAll()
        

        res.status(201).json({message: "Usuario criado com sucesso"})

    } catch (error) {
        res.status(500).json({message: `Erro ao registrar o usuario ${msgErrosUnico(error.errors[0]["type"])}`})
        
    }
}


module.exports.loginUsuario = async (req, res) => {
    try {
        const { u_email, u_senha } = req.body;
        
        const user = await Usuario.scope('withPassword').findOne({ where: { u_email } });

        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        if (!user.u_ativo) {
            return res.status(301).json({ message: 'Usuário desativado' });
        }

        const isMatch = await compareSenha(u_senha, user.u_senha);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Carregar os arrays de IDs das empresas e filiais
        const { u_empresas_ids, u_filiais_ids } = await Usuario.findOne({
            attributes: ['u_empresas_ids', 'u_filiais_ids'],
            where: { u_id: user.u_id }
        });

        // Adicionar as IDs ao objeto usuário
        user.u_empresas_ids = u_empresas_ids || [];
        user.u_filiais_ids = u_filiais_ids || [];

        const token = generateToken(user);

        if (user.u_senhatemporaria) {
            return res.status(200).json({ message: 'Primeiro login detectado. Por favor, redefina sua senha', userId: user.u_id, token });
        }

        res.json({ message: 'Autenticado com sucesso', token });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar usuário', error });
    }
}


module.exports.resetSenhaInicial = async(req, res)=>{
    
    try {
        const { userId, u_senha } = req.body;
        
        // Verifica se o usuário existe
        const user = await Usuario.scope("withPassword").findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        


        // Criptografa a nova senha
        const hashedPassword = await hashSenha(u_senha);

        //Parametro que impede o usuario de usar a senha temporaria fornecida pelo o ADM que o cadastrou....
        const compararSenhas = await compareSenha(u_senha, user.u_senha)
        if(compararSenhas) return res.status(401).json({message: 'Senha ja em utilizacao, por favor defina uma nova senha!'})

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


module.exports.listarUsuario = async(req, res)=>{
    try {
        const { u_id } = req.params;

        const usuario = await Usuario.findOne({where: {u_id}})
        
        const { u_nome, u_email, u_ativo, criado_em} = usuario;
        const modelUsuario = {
           u_id, u_nome, u_email, u_ativo, criado_em
        }

        res.status(200).json(modelUsuario)
    } catch (error) {
        res.status(400).json({message: "Houve um erro ao buscar usuarios"})        
    }
}


module.exports.editarUsuarios = async(req, res)=>{
    try {

        const { u_id } = req.params;
        const {u_nome, u_email, u_ativo } = req.body;
        const usuarioLogado = req.user.id;

        const usuario = await Usuario.findByPk(u_id)
        if(usuario == null) return res.status(404).json({message: "Usuario nao encontrado"})
        
        if(usuarioLogado == usuario.u_id && u_ativo == false) return res.status(400).json({message: 'Voce nao tem permissao para se desativar, veja com adm!'})
            
        
        usuario.update({u_nome: u_nome, u_email: u_email, u_ativo: u_ativo})

        res.status(200).json(usuario)
    } catch (error) {
        res.status(404).json({error: `Erro ao editar o usuario: ${error}`})
    }
}

