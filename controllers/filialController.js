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
        if(f_uf.length <=1 ) return res.status(401).json({message: 'Campo (UF) não pode ser menor que 2 caracteres'})
        if(cnpj.length < 14 ) return res.status(401).json({message: 'CNPJ invalido'})
        
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
        console.error("Erro ao buscar empresa e filiais:", error); // Log detalhado
        res.status(400).json({ error: "Ocorreu um erro ao buscar a empresa e suas filiais" });
    }
};


