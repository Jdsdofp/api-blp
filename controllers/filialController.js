const Sequelize = require('sequelize');
const { fn, col } = Sequelize;
const Empresa = require("../models/Empresa");
const Filial = require("../models/Filial");
const Usuario = require("../models/Usuario");


module.exports.registrarFilial = async(req, res)=>{
    const {id} = req.user;
    try {
        const {
            f_nome,
            f_cnpj,
            f_cidade,
            f_uf,
            f_empresa_id,
            f_endereco_bairro,
            f_endereco_complemento,
            f_codigo,
            f_latitude,
            f_longitude,
            f_insc_municipal,
            f_insc_estadual
        } = req.body;
        



        
        const cnpj = f_cnpj.replace(/[^\d]/g, "")
        
        if(f_uf.length <=1 ) return res.status(401).json({message: 'Campo (UF) não pode ser menor que 2 caracteres'});
        if(cnpj.length < 14 ) return res.status(401).json({message: 'CNPJ invalido'});
        if(!f_codigo) return res.status(402).json({message: 'Informe o codigo da filial'});
        
            const filial = await Filial.create({
                f_nome: f_nome, 
                f_cnpj: cnpj, 
                f_cidade: f_cidade, 
                f_uf: f_uf, 
                f_responsavel_id: id, 
                f_empresa_id: f_empresa_id, 
                f_endereco: [{
                    f_endereco_bairro,
                    f_endereco_complemento
                }], 
                f_codigo: f_codigo, 
                f_location: {type: 'Point', coordinates: [f_longitude, f_latitude]}, 
                f_insc_municipal: f_insc_municipal, 
                f_insc_estadual: f_insc_estadual
            })


        res.status(200).json({message: `Filial #${filial.f_codigo} criada com sucesso!`})
    } catch (error) {
        console.log('Erro aqui no cadastro Filial:', error)
        res.status(400).json({message: error.errors[0].message})        
    }
}

module.exports.listarFiliais = async (req, res) => {
    try {
        const { id } = req.user;
        const usuario = await Usuario.findOne({ where: { u_id: id } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (usuario.u_perfil === 'admin') {
            
            const todasFiliais = await Filial.findAll({
                include: [
                    {
                        model: Empresa, 
                        as: 'empresa',
                        attributes: ['e_id', 'e_nome']
                    },
                    {
                        model: Usuario,
                        as: 'responsavel',
                        attributes: ['u_nome']
                    }
                ],
                order: [['f_id', 'ASC']]
            });
            return res.status(200).json(todasFiliais);
        }

        if (!usuario.u_empresas_ids || usuario.u_empresas_ids.length === 0) {
            
            return res.status(404).json({ message: 'Você ainda não tem acesso a nenhuma empresa' });
        }

        
        const filiais = await Filial.findAll({
            include: [
                {
                    model: Empresa,
                    as: 'empresa',
                    attributes: ['e_id', 'e_nome'],
                    where: {
                        e_id: usuario.u_empresas_ids
                    }
                },
                {
                    model: Usuario, 
                    as: 'responsavel', 
                    attributes: ['u_nome'] 
                }
            ]
        });

        if (filiais.length === 0) {
            return res.status(404).json({ message: 'Nenhuma filial encontrada com os IDs de empresas fornecidos' });
        }

        res.status(200).json(filiais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar filiais' });
    }
};

module.exports.listarFilial = async (req, res) =>{
    try {
        const {e_id} = req.params;
        const filial = await Filial.findAll({where: {f_empresa_id: e_id }})


        res.status(200).json(filial)
    } catch (error) {
        res.status(400).json({error: "Informe uma empresa"})
    }
}

module.exports.listarEmpresaComFiliais = async (req, res) => {
    try {
        const { e_id } = req.params;

        const empresa = await Empresa.findOne({
            where: { e_id },
            include: [{
                model: Filial,
                as: 'filiais' 
            }]
        });

        if (!empresa) {
            return res.status(404).json({ error: "Empresa não encontrada" });
        }

        res.status(200).json(empresa);
    } catch (error) {
        console.error("Erro ao buscar empresa e filiais:", error);
        res.status(400).json({ error: "Ocorreu um erro ao buscar a empresa e suas filiais" });
    }
};

module.exports.deletarFilial = async (req, res) => {
    try {
        const { id } = req.params;

        const filial = await Filial.findByPk(id);
        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada' });
        }

        
        const usuarios = await Usuario.findAll({
            where: {
                u_filiais_ids: {
                    [Sequelize.Op.contains]: [id]
                }
            }
        });

        
        for (const usuario of usuarios) {
            usuario.u_filiais_ids = usuario.u_filiais_ids.filter(filialId => filialId !== parseInt(id));
            await usuario.save();
        }

        
        await Filial.destroy({ where: { f_id: id } });

        return res.status(200).json({ message: 'Filial deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar filial:', error);
        return res.status(500).json({ error: 'Erro ao deletar filial' });
    }
};



module.exports.editarFilial = async (req, res) => {
    try {
        const { f_id } = req.params;
        //console.info('ID recebido: ', f_id);
        //console.log('Dados recebidos: ', req.body);

        
        const filial = await Filial.findByPk(f_id);
        if (!filial) {
            return res.status(404).json({ error: 'Filial não encontrada.' });
        }
        
        

        //console.log('Filial encontrada: ', filial?.dataValues);

        function limparCNPJ(cnpj) {
            return cnpj.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
        }

        const f_cnpj = limparCNPJ(req.body?.f_cnpj || filial?.dataValues?.f_cnpj);

        const newFilial = {
            f_nome: req.body?.f_nome || filial?.f_nome,
            f_cnpj: f_cnpj || filial?.f_cnpj,
            f_cidade: req.body?.f_cidade || filial?.f_cidade,
            f_uf: req.body?.f_uf || filial?.f_uf,
            f_empresa_id: req.body?.f_empresa_id || filial?.f_empresa_id,
            f_endereco: [
                {
                    f_endereco_bairro: req.body?.f_endereco_bairro || filial?.f_endereco[0]?.f_endereco_bairro,
                    f_endereco_complemento: req.body?.f_endereco_complemento || filial?.f_endereco[0]?.f_endereco_complemento,
                },
            ],
            f_codigo: req.body?.f_codigo || filial?.f_codigo,
            f_insc_municipal: req.body?.f_insc_municipal || filial?.f_insc_municipal,
            f_insc_estadual: req.body?.f_insc_estadual || filial?.f_insc_estadual,
        };

        // Adicione o campo de localização se as coordenadas forem fornecidas
        if (req.body?.f_longitude && req.body?.f_latitude) {
            newFilial.f_location = fn('ST_Point', req.body.f_longitude, req.body.f_latitude);
        }

        await filial.update(newFilial);

        //console.log('Filial atualizada: ', newFilial);
        return res.status(200).json({message: 'Dados da filial alterados com sucesso!'});

    } catch (error) {
        console.error('Erro ao editar filial: ', error || error.errors[0].message);
        return res.status(500).json({ message: error.errors[0].message || 'Erro interno do servidor.'});
    }
};

module.exports.statusFilial = async (req, res) =>{
    try {
        const {f_id} = req.params;
        const {state} = req.body;
        console.log('ID recebido: ', f_id)
        console.log('State recebido: ', state)

        const filial = await Filial.findByPk(f_id)
        console.info('Filial encontrada: ', filial?.dataValues)
        if(!filial) return res.status(400).json({message: 'Filial não encontrada'})
        
        filial.update({
            f_ativo: state
        })

        console.log('State of branch: ', filial?.dataValues?.f_ativo)

        res.status(200).json({message: `Status atualizado ${filial?.dataValues?.f_ativo ? 'ATIVADA' : 'BAIXADA'}`})

    } catch (error) {
        
    }
}