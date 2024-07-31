const Usuario = require("../models/Usuario");
const Empresa = require('../models/Empresa');
const Filial = require("../models/Filial")
const { hashSenha, generateToken, compareSenha, verifyToken, generateRefreshToken, verifyRefreshToken } = require("../config/auth");
const { msgErrosUnico } = require("../settings_Server");
const { Sequelize } = require("sequelize");
const { format } = require("date-fns");


module.exports.registrarUsuario = async(req, res) =>{
    try {
        const {u_nome, u_email, u_senha } = req.body;
        
        const hashedSenha = await hashSenha(u_senha);
        const newUsuario = await Usuario.create({u_nome, u_email, u_senha: hashedSenha});
        //const usuarioComSenha = await Usuario.scope("withPassword").findAll()
        //const usuario = await Usuario.findAll()
        

        res.status(201).json({message: "Usuario criado com sucesso"});

    } catch (error) {
        res.status(500).json({message: `Erro ao registrar o usuario ${msgErrosUnico(error.errors[0]["type"])}`});
        
    }
}


//AUTH... fazendo a checagem do token do usuario, vai que o amostradin que entrar sem permissão
module.exports.checandoToken = async (req, res)=>{
    try {
        res.status(200).json(true)

    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports.loginUsuario = async (req, res) => {
    try {
        const { u_email, u_senha } = req.body;

        if (!u_email || !u_senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        const user = await Usuario.scope('withPassword').findOne({ where: { u_email } });

        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        if (!user.u_ativo) {
            return res.status(403).json({ message: 'Usuário desativado' });
        }

        const isMatch = await compareSenha(u_senha, user.u_senha);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const { u_empresas_ids, u_filiais_ids } = await Usuario.findOne({
            attributes: ['u_empresas_ids', 'u_filiais_ids'],
            where: { u_id: user.u_id }
        });

        user.u_empresas_ids = u_empresas_ids || [];
        user.u_filiais_ids = u_filiais_ids || [];

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Salve o refresh token no banco de dados
        if (user.u_senhatemporaria) {
            await user.update({ u_refreshtoken: refreshToken });    
            return res.status(200).json({ message: 'Primeiro login detectado. Por favor, redefina sua senha', userId: user.u_id, status: user.u_senhatemporaria, token, refreshToken });
        }

        const dataExp = verifyToken(token);
        const sessaoLogin = new Date(dataExp.exp * 1000);
        const dataFinalFmt = format(sessaoLogin, 'dd/MM/yyyy HH:mm:ss');

        const modelUser = {
            id: user.u_id,
            nome: user.u_nome,
            email: user.u_email,
            empresa: user.u_empresas_ids,
            filial: user.u_filiais_ids,
            criado_em: user.criado_em,
            p_acesso: user.u_senhatemporaria,
            sessaoExp: dataFinalFmt
        };

        res.json({ message: 'Autenticado com sucesso', modelUser, token, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    }
};


module.exports.verifyRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.header('x-refresh-token');

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token é obrigatório' });
        }   
        
        const user = await Usuario.findOne({
            where: { u_refreshtoken: refreshToken }
        });

        if (!user || user.u_refreshtoken !== refreshToken) {
            return res.status(401).json({ message: 'Refresh token inválido', href: '/login' });
        }

        res.status(200).json(true);
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        res.status(401).json({ message: 'Refresh token inválido', error: error.message });
    }
};


module.exports.resetSenhaInicial = async (req, res) => {
    try {
        const { u_userId, u_senha } = req.body;
        const refreshToken = req.header('x-refresh-token');
        
        if (!u_userId || !u_senha || !refreshToken) {
            return res.status(400).json({ message: 'ID do usuário, nova senha e refresh token são obrigatórios' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || decoded.id !== u_userId) {
            return res.status(401).json({ message: 'Refresh token inválido' });
        }
        
        const user = await Usuario.scope('withPassword').findByPk(u_userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!user.u_senhatemporaria) {
            return res.status(403).json({ message: 'Não é possível alterar, a senha já foi alterada anteriormente' });
        }

        const hashedPassword = await hashSenha(u_senha);
        const compararSenhas = await compareSenha(u_senha, user.u_senha);

        if (compararSenhas) {
            return res.status(401).json({ message: 'Senha já em utilização, por favor defina uma nova senha!' });
        }

        await user.update({
            u_senha: hashedPassword,
            u_senhatemporaria: false,
            u_refreshtoken: null // Invalide o refresh token atual
        });


        const token = generateToken(user);

        const dataExp = verifyToken(token);
        const sessaoLogin = new Date(dataExp.exp * 1000);
        const dataFinalFmt = format(sessaoLogin, 'dd/MM/yyyy HH:mm:ss');

        const modelUser = {
            id: user.u_id,
            nome: user.u_nome,
            email: user.u_email,
            empresa: user.u_empresas_ids,
            filial: user.u_filiais_ids,
            criado_em: user.criado_em,
            p_acesso: user.u_senhatemporaria,
            sessaoExp: dataFinalFmt
        };

        res.status(200).json({ message: 'Senha redefinida com sucesso', modelUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao redefinir senha', error: error.message });
    }
};


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


module.exports.atribuirEmpresaUsuario = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { u_empresas_ids } = req.body;

        if (!u_empresas_ids || u_empresas_ids.length < 1) {
            return res.status(404).json({ message: 'Informe um valor para atribuir a empresa' });
        }

        const empresas = await Empresa.findAll({ where: { e_id: { [Sequelize.Op.in]: u_empresas_ids } } });
        const e_ids = empresas.map(emp => emp.dataValues.e_id);

        if (e_ids.length < 1) {
            return res.status(403).json({ message: 'Empresa não encontrada' });
        }

        const usuario = await Usuario.findOne({ where: { u_id } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!usuario.u_ativo) {
            return res.status(401).json({ message: 'Usuário desativado' });
        }

        const empresaJaAtribuida = u_empresas_ids.some(id => usuario.u_empresas_ids.includes(id));

        if (empresaJaAtribuida) {
            return res.status(403).json({ message: 'Empresa já atribuída a este usuário' });
        }

        // Atribuir empresas ao usuário
        usuario.u_empresas_ids = [...usuario.u_empresas_ids, ...e_ids];

        // Buscar todas as filiais das empresas atribuídas
        const filiais = await Filial.findAll({ where: { f_empresa_id: { [Sequelize.Op.in]: e_ids } } });
        const f_ids = filiais.map(filial => filial.dataValues.f_id);

        // Atribuir filiais ao usuário
        usuario.u_filiais_ids = [...usuario.u_filiais_ids, ...f_ids];

        await usuario.save();

        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports.retiraEmpresaUsuario = async (req, res) => {
    try {
        const { u_id } = req.params;
        const { u_empresas_ids } = req.body;

        if (!u_empresas_ids || u_empresas_ids.length < 1) {
            return res.status(404).json({ message: 'Informe um valor para retirar a empresa' });
        }

        // Buscar todas as empresas que estão sendo removidas
        const empresas = await Empresa.findAll({ where: { e_id: { [Sequelize.Op.in]: u_empresas_ids } } });
        const e_ids = empresas.map(emp => emp.e_id);

        if (e_ids.length < 1) {
            return res.status(403).json({ message: 'Empresa não encontrada' });
        }

        const usuario = await Usuario.findByPk(u_id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (!usuario.u_ativo) {
            return res.status(401).json({ message: 'Usuário desativado' });
        }

        // Remover empresas atribuídas ao usuário
        usuario.u_empresas_ids = usuario.u_empresas_ids.filter(id => !e_ids.includes(id));

        // Buscar todas as filiais das empresas que estão sendo removidas
        const filiaisRemover = await Filial.findAll({ where: { f_empresa_id: { [Sequelize.Op.in]: e_ids } } });
        const f_idsRemover = filiaisRemover.map(filial => filial.f_id);

        // Remover filiais associadas às empresas removidas do usuário
        usuario.u_filiais_ids = usuario.u_filiais_ids.filter(id => !f_idsRemover.includes(id));

        await usuario.save();

        // Obter o usuário atualizado sem incluir as filiais
        const usuarioAtualizado = await Usuario.findByPk(u_id);

        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports.listarEmpresasEFiliaisUsuario = async (req, res) => {
    try {
        const { u_id } = req.params;

        // Buscar o usuário
        const usuario = await Usuario.findOne({ where: { u_id } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Buscar as empresas atribuídas ao usuário
        const empresas = await Empresa.findAll({
            where: {
                e_id: {
                    [Sequelize.Op.in]: usuario.u_empresas_ids
                }
            }
        });

        // Buscar as filiais atribuídas ao usuário
        const filiais = await Filial.findAll({
            where: {
                f_id: {
                    [Sequelize.Op.in]: usuario.u_filiais_ids
                }
            }
        });

        // Retornar as empresas e filiais
        res.status(200).json({
            empresas,
            filiais
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};